# AI & Question Generation - Setup Guide

## Overview
You'll build a pipeline that automatically generates quiz questions from Farcaster news using AI.

**Flow**: Fetch news from Neynar → Feed to Gemini AI → Generate questions → Validate → Save

---

## Part 1: Get API Keys (15 minutes)

### Step 1: Get Google Gemini API Key (FREE)

1. Go to https://ai.google.dev/
2. Click "Get API key in Google AI Studio"
3. Sign in with Google account
4. Click "Create API Key"
5. Copy the key (starts with `AIza...`)

**Free tier includes:**
- 60 requests per minute
- More than enough for weekly question generation

### Step 2: Get Neynar API Key (FREE)

1. Go to https://neynar.com/
2. Sign up for a free account
3. Go to Dashboard → API Keys
4. Copy your API key

**Free tier includes:**
- 100 requests per day
- Perfect for fetching weekly news

---

## Part 2: Add Keys to Environment (5 minutes)

1. Open the project in VS Code
2. Find `.env` file in root directory
3. Add these lines:

```env
GEMINI_API_KEY=your_gemini_key_here
NEYNAR_API_KEY=your_neynar_key_here
```

4. Save the file
5. **NEVER commit this file to Git!** (already in .gitignore)

---

## Part 3: Install Dependencies (5 minutes)

The AI SDK might not be installed yet. Run:

```bash
npm install @google/generative-ai
npm install axios  # for Neynar API calls
```

---

## Part 4: Create News Fetcher (30 minutes)

Create `app/lib/news-fetcher.ts`:

```typescript
import axios from 'axios';

export interface FarcasterCast {
  hash: string;
  text: string;
  author: {
    username: string;
    fid: number;
  };
  timestamp: string;
  reactions: {
    likes_count: number;
    recasts_count: number;
  };
}

export async function fetchBaseNews(limit: number = 25): Promise<FarcasterCast[]> {
  const NEYNAR_API_KEY = process.env.NEYNAR_API_KEY;
  
  if (!NEYNAR_API_KEY) {
    throw new Error('NEYNAR_API_KEY not found in environment');
  }

  try {
    // Fetch from Base channel
    const response = await axios.get(
      'https://api.neynar.com/v2/farcaster/feed/channels',
      {
        params: {
          channel_id: 'base',
          limit: limit,
          with_recasts: false,
        },
        headers: {
          'api_key': NEYNAR_API_KEY,
        },
      }
    );

    return response.data.casts || [];
  } catch (error) {
    console.error('Error fetching Neynar data:', error);
    throw error;
  }
}

// Format casts for AI processing
export function formatNewsForAI(casts: FarcasterCast[]): string {
  return casts
    .slice(0, 20) // Use top 20 most relevant
    .map((cast, index) => {
      return `[News ${index + 1}]
Author: @${cast.author.username}
Content: ${cast.text}
Engagement: ${cast.reactions.likes_count} likes, ${cast.reactions.recasts_count} recasts
---`;
    })
    .join('\n\n');
}
```

**Test it:**
```typescript
// Add to bottom of file temporarily
if (require.main === module) {
  fetchBaseNews(10).then(casts => {
    console.log('Fetched casts:', casts.length);
    console.log(formatNewsForAI(casts));
  });
}
```

Run: `npx tsx app/lib/news-fetcher.ts`

---

## Part 5: Create AI Question Generator (1 hour)

Create `app/lib/generate-questions.ts`:

```typescript
import { GoogleGenerativeAI } from '@google/generative-ai';
import type { Question } from '@/app/types/quiz';
import { fetchBaseNews, formatNewsForAI } from './news-fetcher';
import fs from 'fs';
import path from 'path';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

const QUESTION_GENERATION_PROMPT = `You are an expert quiz creator for the Base blockchain and Farcaster ecosystem.

Given the following recent news and updates from Farcaster (about Base blockchain), generate exactly 10 high-quality multiple-choice quiz questions.

NEWS ITEMS:
{NEWS_CONTENT}

REQUIREMENTS:
1. Each question must have exactly 4 answer options
2. Only ONE option should be correct
3. Questions should test actual knowledge from the news provided
4. Mix difficulty levels: 3 easy, 4 medium, 3 hard
5. Include a clear explanation for the correct answer
6. Add source reference (which news item number)
7. Categorize each question (product-update, ecosystem, technology, basics)

Return ONLY valid JSON array (no markdown, no extra text):
[
  {
    "question": "Question text here?",
    "options": ["Option A", "Option B", "Option C", "Option D"],
    "correctIndex": 0,
    "explanation": "Explanation of correct answer",
    "difficulty": "easy",
    "category": "product-update",
    "sourceReference": "News 3"
  }
]`;

export async function generateQuestions(count: number = 50): Promise<Question[]> {
  console.log('Fetching recent Base news from Neynar...');
  const casts = await fetchBaseNews(25);
  const newsContent = formatNewsForAI(casts);

  console.log(`Fetched ${casts.length} casts. Generating questions with AI...`);

  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

  const allQuestions: Question[] = [];
  const batchCount = Math.ceil(count / 10); // Generate 10 at a time

  for (let i = 0; i < batchCount; i++) {
    console.log(`Generating batch ${i + 1}/${batchCount}...`);

    const prompt = QUESTION_GENERATION_PROMPT.replace('{NEWS_CONTENT}', newsContent);
    const result = await model.generateContent(prompt);
    const response = result.response.text();

    try {
      // Parse AI response
      const questions = JSON.parse(response);
      
      // Validate and add IDs
      questions.forEach((q: any, index: number) => {
        allQuestions.push({
          id: allQuestions.length + 1,
          question: q.question,
          options: q.options,
          correctIndex: q.correctIndex,
          sourceUrl: 'https://warpcast.com/base',
          sourceCast: q.sourceReference || 'Base news',
          explanation: q.explanation,
          difficulty: q.difficulty || 'medium',
          category: q.category || 'general',
        });
      });

      console.log(`✅ Generated ${questions.length} questions`);
    } catch (error) {
      console.error('Failed to parse AI response:', error);
      console.log('Raw response:', response);
    }

    // Rate limiting - wait 1 second between batches
    if (i < batchCount - 1) {
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }

  return allQuestions.slice(0, count);
}

export async function saveQuestions(questions: Question[]) {
  const data = {
    lastUpdated: new Date().toISOString(),
    weekNumber: getWeekNumber(new Date()),
    totalQuestions: questions.length,
    questions: questions,
  };

  const filePath = path.join(process.cwd(), 'app/data/quiz-questions.json');
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
  console.log(`✅ Saved ${questions.length} questions to ${filePath}`);
}

function getWeekNumber(date: Date): number {
  const firstDayOfYear = new Date(date.getFullYear(), 0, 1);
  const pastDaysOfYear = (date.getTime() - firstDayOfYear.getTime()) / 86400000;
  return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
}

// CLI tool for testing
if (require.main === module) {
  generateQuestions(50)
    .then(questions => {
      console.log(`\n✅ Generated ${questions.length} questions`);
      saveQuestions(questions);
    })
    .catch(error => {
      console.error('Error:', error);
      process.exit(1);
    });
}
```

**Test it:**
```bash
npx tsx app/lib/generate-questions.ts
```

This will generate 50 questions and save them!

---

## Part 6: Create Admin API Route (30 minutes)

Create `app/api/generate-questions/route.ts`:

```typescript
import { NextResponse } from 'next/server';
import { generateQuestions, saveQuestions } from '@/app/lib/generate-questions';

export async function POST(request: Request) {
  try {
    // Optional: Add password protection
    const body = await request.json();
    const { password, count = 50 } = body;

    // Simple password check (replace with real auth in production)
    if (password !== process.env.ADMIN_PASSWORD) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    console.log('Starting question generation...');
    const questions = await generateQuestions(count);
    await saveQuestions(questions);

    return NextResponse.json({
      success: true,
      questionsGenerated: questions.length,
      message: 'Questions generated and saved successfully',
    });
  } catch (error) {
    console.error('Error generating questions:', error);
    return NextResponse.json(
      { error: 'Failed to generate questions' },
      { status: 500 }
    );
  }
}
```

Add to `.env`:
```
ADMIN_PASSWORD=your_secret_password_here
```

**Test it with curl:**
```bash
curl -X POST http://localhost:3000/api/generate-questions \
  -H "Content-Type: application/json" \
  -d '{"password": "your_secret_password_here", "count": 10}'
```

---

## Part 7: Review & Refine (Ongoing)

After AI generates questions:

1. **Manual Review**: Read through all 50 questions
2. **Check for:**
   - Factual accuracy
   - Clear question wording
   - 4 distinct options
   - Only one correct answer
   - Good explanation
3. **Edit JSON directly** to fix any issues
4. **Test in quiz app** - take the quiz yourself!

### Quality Checklist:
- [ ] All questions are based on real recent news
- [ ] Mix of difficulty levels
- [ ] No duplicate questions
- [ ] Correct answers are accurate
- [ ] Explanations are clear and educational
- [ ] Source references included

---

## Troubleshooting

**"Failed to fetch from Neynar"**
- Check API key is correct in `.env`
- Verify you're not over rate limit (100/day)
- Try smaller limit: `fetchBaseNews(10)`

**"Gemini API error"**
- Check API key starts with `AIza`
- Verify you're within free tier limits
- Wait 1 minute and retry

**"AI generated invalid JSON"**
- This happens sometimes - retry generation
- Check the raw response in console
- Adjust the prompt to be more explicit

**"Questions are too generic"**
- Fetch more recent casts (increase limit)
- Improve prompt with more specific examples
- Manually edit the best ones

---

## Weekly Workflow

**Every week:**
1. Run `npx tsx app/lib/generate-questions.ts`
2. Review generated questions
3. Edit any that need improvement
4. Commit updated `quiz-questions.json`
5. Deploy to production

**Time estimate:** 30-60 minutes per week

---

## Next Steps

Once you have 50 good questions:
1. Share with team for review
2. Coordinate with Backend person (they'll use your JSON file)
3. Test in production
4. Set up weekly generation schedule

**You're done when:**
- ✅ 50 questions generated
- ✅ All questions reviewed for quality
- ✅ quiz-questions.json updated
- ✅ Questions tested in quiz app
