# Base Trivia - Dynamic News Quiz

A **dynamic quiz app** where questions are generated from recent Farcaster and Base ecosystem news. Users answer 5 questions about what's happening this week, and score 5/5 to earn a "News Genius" NFT badge on Base blockchain.

## User Review Required

> [!IMPORTANT]
> **NFT Minting Strategy**: Choose your approach for the reward system:
> 
> 1. **Simple Approach (Recommended for 3 days)**: Use OnchainKit's transaction components with an existing NFT contract
> 2. **Custom Contract**: Deploy your own ERC-1155 or ERC-721 contract specifically for this quiz badge
> 3. **No-Code Option**: Use Zora or Manifold for badge creation
> 
> **Which approach would you prefer?** For the 3-day timeline, I recommend option 1 or 3.

> [!IMPORTANT]
> **Dynamic Question Strategy**: ✅ **CONFIRMED: AI-Assisted Generation**
> 
> - **Weekly Generation**: Generate ~50 questions from Farcaster/Base news using **Google Gemini API** (free)
> - **Random Assignment**: Each user gets a random set of 5 questions from the 50-question pool
> - **Benefits**:
>   - ✅ Prevents answer sharing between users
>   - ✅ High replayability (users can retake with different questions)
>   - ✅ Scalable and automated
>   - ✅ Still curated (AI picks from trending/relevant news only)
> 
> **How it works**:
> 1. Weekly: Fetch 20-30 trending Farcaster casts about Base
> 2. AI (Gemini) analyzes and generates 50 quality questions
> 3. Store in `quiz-questions.json` with metadata
> 4. Frontend/API randomly selects 5 questions per user session
> 5. Optional: Track which questions user has seen to avoid repeats

> [!IMPORTANT]
> **News Sources**: ✅ **CONFIRMED APPROACH**
> 
> **Primary Source:**
> - **Neynar API** - `/base` channel + trending casts with "Base" keyword
> - Free tier: 100 requests/day
> - Fetch 20-30 most relevant/trending posts weekly
> 
> **AI Generation:**
> - **Google Gemini API** (free tier: 60 requests/min)
> - Generate 50 questions from curated news
> - Cost: $0/month
> 
> **Setup needed:**
> - Neynar API key (free): https://neynar.com/
> - Google Gemini API key (free): https://ai.google.dev/

---

## Proposed Changes

### News Fetching & Question Management

#### [NEW] [news-fetcher.ts](file:///c:/Users/arif/Documents/GitHub/mini-app-quickstart-template/app/lib/news-fetcher.ts)

Backend utility to fetch recent news:
- Neynar API integration for Farcaster trending/recent casts
- Optional: Fetch Base ecosystem updates (manual or API)
- Cache news data to reduce API calls
- Format news into digestible summaries

**Functions:**
```typescript
async function fetchFarcasterNews(limit: number): Promise<NewsItem[]>
async function fetchBaseNews(): Promise<NewsItem[]>
```

#### [NEW] [quiz-questions.json](file:///c:/Users/arif/Documents/GitHub/mini-app-quickstart-template/app/data/quiz-questions.json)

**50-question pool storage:**
- JSON file with current week's 50 questions
- Each question includes source reference and metadata
- Timestamp for when questions were last generated
- Week number for tracking

**Structure:**
```json
{
  "lastUpdated": "2025-12-13T12:00:00Z",
  "weekNumber": 50,
  "totalQuestions": 50,
  "questions": [
    {
      "id": 1,
      "question": "What new feature did Base announce this week?",
      "options": ["Flashblocks", "Slow mode", "Bitcoin integration", "Mainnet shutdown"],
      "correctIndex": 0,
      "sourceUrl": "https://warpcast.com/base/...",
      "sourceCast": "Base just launched Flashblocks - 200ms transaction times!",
      "explanation": "Base announced Flashblocks, reducing transaction times from 2s to 200ms.",
      "difficulty": "medium",
      "category": "product-update"
    },
    // ... 49 more questions
  ]
}
```

#### [NEW] [generate-questions.ts](file:///c:/Users/arif/Documents/GitHub/mini-app-quickstart-template/app/lib/generate-questions.ts)

**AI Question Generator (runs weekly):**
- Fetch trending casts from Neynar API
- Send to Google Gemini API with prompt:
  - "Generate 50 quiz questions from these Farcaster posts about Base"
  - Structured JSON output format
  - Include difficulty levels and categories
- Validate and save to `quiz-questions.json`
- Can be triggered manually via admin route or scheduled (Vercel Cron)

**Functions:**
```typescript
async function fetchNewsFromNeynar(): Promise<Cast[]>
async function generateQuestionsWithAI(casts: Cast[]): Promise<Question[]>
async function saveQuestions(questions: Question[]): Promise<void>
```

#### [NEW] [admin page] (file:///c:/Users/arif/Documents/GitHub/mini-app-quickstart-template/app/admin/page.tsx) (Optional)

Simple admin interface to update questions:
- Protected route (basic password or wallet-gated)
- View fetched news from APIs
- Create/edit quiz questions manually
- Preview quiz
- Update quiz-questions.json

---

### Quiz System

#### [NEW] [QuizCard.tsx](file:///c:/Users/arif/Documents/GitHub/mini-app-quickstart-template/app/components/QuizCard.tsx)

Main quiz component (similar to original plan):
- Loads questions from `quiz-questions.json` via API route
- Question display with progress (e.g., "Question 3/5")
- Four answer buttons with hover effects  
- Visual feedback for correct/incorrect selections
- Animated transitions between questions
- Score tracker

#### [NEW] [ResultsCard.tsx](file:///c:/Users/arif/Documents/GitHub/mini-app-quickstart-template/app/components/ResultsCard.tsx)

Results display component:
- Show final score out of 5
- Congratulatory message for perfect score
- Display weekly badge info (e.g., "Week 50 News Genius")
- "Claim Your Badge" button (only visible for 5/5)
- "Share on Farcaster" button
- "Try Again" or "See Answers" option

---

### API Routes

#### [NEW] [get-questions API](file:///c:/Users/arif/Documents/GitHub/mini-app-quickstart-template/app/api/questions/route.ts)

**API endpoint to serve randomized questions:**
- `GET /api/questions` - Returns 5 random questions from the 50-question pool
- Reads from `quiz-questions.json`
- **Randomization logic**: Shuffle algorithm (Fisher-Yates) to pick 5 unique questions
- Optional query params:
  - `?difficulty=easy` - Filter by difficulty
  - `?exclude=1,5,9` - Exclude question IDs (for replay without repeats)
- Returns questions WITHOUT correct answers (only send answer on submission)

**Response format:**
```typescript
{
  weekNumber: 50,
  questions: [ /* 5 random questions */ ],
  totalAvailable: 50
}
```

#### [NEW] [submit-score API](file:///c:/Users/arif/Documents/GitHub/mini-app-quickstart-template/app/api/submit-score/route.ts) (Optional)

Track quiz completions:
- Store user scores (optional for leaderboard)
- Return eligibility for NFT claim
- Could use a simple database or serverless storage

---

### NFT Reward Integration

#### [NEW] [ClaimBadge.tsx](file:///c:/Users/arif/Documents/GitHub/mini-app-quickstart-template/app/components/ClaimBadge.tsx)

Badge claiming component using OnchainKit:
- Connect wallet check (using OnchainKit Wallet components)
- Transaction button to mint NFT
- Weekly badge metadata (e.g., "News Genius - Week 50")
- Success confirmation with transaction hash
- Error handling for failed mints

#### [MODIFY] [page.tsx](file:///c:/Users/arif/Documents/GitHub/mini-app-quickstart-template/app/page.tsx)

Replace template content with trivia game:
- Welcome screen with "Start Quiz" button
- Show "This Week's News Quiz" with date range
- Quiz state management (useState for current question, score, game state)
- Conditional rendering: Welcome → Quiz → Results
- Integration with MiniKit for proper frame handling


---

### Configuration & Styling

#### [MODIFY] [minikit.config.ts](file:///c:/Users/arif/Documents/GitHub/mini-app-quickstart-template/minikit.config.ts)

Update metadata:
- name: "BaseGenius"
- subtitle: "Stay Updated, Earn Rewards"
- description: "Answer 5 questions about this week's Farcaster & Base news and earn an NFT badge!"
- primaryCategory: "games"
- tags: ["games", "education", "news", "nft"]

#### [MODIFY] [globals.css](file:///c:/Users/arif/Documents/GitHub/mini-app-quickstart-template/app/globals.css)

Add custom styles:
- Quiz card animations (fade-in, slide transitions)
- Answer button states (default, hover, correct, incorrect)
- Confetti or celebration effects for correct answers
- News-themed color palette (e.g., blue/purple gradients)
- Responsive design for mobile Farcaster frames

---

### Assets

#### [NEW] Icon/Logo Files

- Create a news/quiz-themed icon (newspaper + brain, or trophy)
- Update `/public/icon.png` and `/public/hero.png`
- Consider generating with the `generate_image` tool
- Weekly badge variations (optional)

---

## Verification Plan

### Automated Tests

```bash
# Build verification
npm run build

# Lint check
npm run lint
```

### Manual Verification

1. **Local Development Testing** (`npm run dev`):
   - View and interact with news fetcher (if implemented)
   - Click through entire quiz flow
   - Verify score tracking accuracy
   - Test all 4 answer options for each question
   - Ensure "Claim Badge" only shows for 5/5 score
   - Verify wallet connection
   
2. **News/Question Management**:
   - Test manual question updates to JSON file
   - Verify API route serves correct questions
   - Check date/week tracking
   - If admin panel: test question creation flow

3. **NFT Minting Test**:
   - Connect wallet on Base testnet
   - Complete quiz with perfect score
   - Click "Claim Badge" and confirm transaction
   - Verify NFT appears in wallet with correct metadata

4. **Deployment Testing**:
   - Deploy to Vercel
   - Test in actual Farcaster Mini App environment
   - Verify manifest on Base Build tools
   - Test on mobile viewport (Warpcast app)

5. **Browser Testing**:
   - Use browser_subagent to validate UI interactions
   - Screenshot quiz states for walkthrough documentation

---

## Timeline (3 Days)

**Day 1**: Core Quiz + Manual Questions
- Set up basic quiz UI and state management
- Create initial 5 questions manually based on current Farcaster/Base news
- Implement quiz flow and scoring
- Basic styling

**Day 2**: Dynamic Infrastructure + NFT Integration
- Build API routes for questions
- Implement news fetcher (Neynar API integration)
- Set up NFT badge claiming with OnchainKit
- Polish UI with animations
- Optional: Start admin panel

**Day 3**: Testing, Polish & Deployment
- Thorough testing of all flows
- Create/update questions based on latest news
- Deploy to Vercel and configure Base Build
- Final UI polish and responsive design
- Documentation and walkthrough

**Future Enhancements** (Post-launch):
- AI-powered question generation
- Leaderboard system
- Multiple difficulty levels
- Social sharing to Farcaster
- Weekly badge variety/themes
