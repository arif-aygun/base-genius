#!/usr/bin/env python3
"""
Weekly Quiz Question Generator - Based on working yusuferay.py

Fetches latest posts from Jesse Pollak (FID: 191) on Farcaster
and uses Google Gemini AI to generate 50 quiz questions.
"""

import os
import json
import sys
from datetime import datetime
import requests
import google.generativeai as genai

# Load .env file if it exists (for local testing)
try:
    from pathlib import Path
    env_path = Path(__file__).parent.parent / '.env'
    if env_path.exists():
        with open(env_path) as f:
            for line in f:
                line = line.strip()
                if line and not line.startswith('#') and '=' in line:
                    key, value = line.split('=', 1)
                    os.environ[key.strip()] = value.strip()
        print("✅ Loaded environment variables from .env file")
except Exception as e:
    print(f"Note: Could not load .env file: {e}")

# Get API keys
GEMINI_API_KEY = os.getenv('GEMINI_API_KEY')
NEYNAR_API_KEY = os.getenv('NEYNAR_API_KEY')

if not GEMINI_API_KEY or not NEYNAR_API_KEY:
    print("❌ Error: GEMINI_API_KEY and NEYNAR_API_KEY must be set in .env file")
    sys.exit(1)

# Configure Gemini
genai.configure(api_key=GEMINI_API_KEY)

# Farcaster accounts to fetch from - Base ecosystem
SOURCES = {
    'jesse_pollak': 191,        # Jesse Pollak - Base founder (very active)
    'base_official': 3613,      # Official Base account
    'dan_romero': 3,            # Farcaster co-founder (often discusses Base)
    'brian_armstrong': 8152,    # Coinbase CEO (Base parent company)
    'coinbase': 5,              # Coinbase official account
}
OUTPUT_FILE = 'app/data/quiz-questions.json'

def fetch_base_posts():
    """Fetch posts from multiple Base-related accounts with smart dynamic limits"""
    print(f"📡 Fetching posts from Base ecosystem accounts...\n")
    
    MIN_TOTAL_POSTS = 60  # Minimum posts needed (lowered - 69 worked great!)
    all_posts = []
    source_stats = {}  # Track how many each source provided
    
    # Phase 1: Initial fetch (20 from each)
    print("Phase 1: Initial fetch from all sources...")
    for source_name, fid in SOURCES.items():
        print(f"   → {source_name} (FID: {fid})...", end=" ")
        
        posts = fetch_from_fid(fid, source_name, limit=20)
        all_posts.extend(posts)
        source_stats[source_name] = len(posts)
        
        print(f"✅ {len(posts)} posts")
    
    initial_total = len(all_posts)
    print(f"\n   Initial total: {initial_total} posts")
    
    # Phase 2: If needed, fetch more from active sources
    if initial_total < MIN_TOTAL_POSTS:
        needed = MIN_TOTAL_POSTS - initial_total
        print(f"\n⚠️  Need {needed} more posts to reach {MIN_TOTAL_POSTS} minimum")
        print("Phase 2: Fetching more from most active sources...\n")
        
        # Find sources that gave us the most posts (likely most active)
        active_sources = sorted(source_stats.items(), key=lambda x: x[1], reverse=True)
        
        for source_name, count in active_sources[:2]:  # Top 2 most active
            if len(all_posts) >= MIN_TOTAL_POSTS:
                break
            
            fid = SOURCES[source_name]
            
            print(f"   → {source_name} (fetching 30 total)...", end=" ")
            # Fetch 30 instead of 20 (gets 10 more)
            more_posts = fetch_from_fid(fid, source_name, limit=30)
            # Take only the NEW posts (skip first 20 we already have)
            new_posts = more_posts[count:]  # Skip what we already got
            all_posts.extend(new_posts)
            source_stats[source_name] += len(new_posts)
            
            print(f"✅ {len(new_posts)} more posts")
            needed -= len(new_posts)
    
    # Final summary
    print(f"\n✅ Total: {len(all_posts)} posts from {len(SOURCES)} sources")
    print(f"   Breakdown: {', '.join([f'{k}: {v}' for k, v in source_stats.items()])}")
    
    combined_text = "\n".join(all_posts)
    return combined_text


def fetch_from_fid(fid, source_name, limit=20):
    """Helper to fetch posts from a single FID"""
    url = "https://api.neynar.com/v2/farcaster/feed/user/casts"
    headers = {
        "accept": "application/json",
        "api_key": NEYNAR_API_KEY
    }
    params = {
        "fid": fid,
        "limit": limit,
        "include_replies": "false"
    }
    
    try:
        response = requests.get(url, headers=headers, params=params)
        
        if response.status_code == 200:
            data = response.json()
            casts = data.get('casts', [])
            
            posts = []
            for cast in casts:
                text = cast.get('text', '').replace("\n", " ")
                date = cast.get('timestamp', '')[:10]
                if text:
                    posts.append(f"- {source_name} ({date}): {text}")
            
            return posts
        else:
            return []
            
    except Exception as e:
        return []

def generate_questions_with_gemini(context_text):
    """Generate 50 quiz questions using Gemini"""
    if not context_text:
        return []
    
    model = genai.GenerativeModel('models/gemini-flash-latest')  # Same as yusuferay.py
    
    prompt = f"""Based on these recent posts from the Base blockchain ecosystem (including Jesse Pollak and the official Base account):

{context_text}

Generate exactly 50 multiple-choice quiz questions about Base, Farcaster, and recent developments.

REQUIREMENTS:
1. Each question must have exactly 4 options
2. Return in this EXACT JSON format:
[
  {{
    "question": "Question text?",
    "options": ["Option A", "Option B", "Option C", "Option D"],
    "correctIndex": 0,
    "explanation": "Why this answer is correct",
    "difficulty": "easy",
    "category": "product-update"
  }}
]

3. Mix difficulty: 15 easy, 25 medium, 10 hard
4. Categories: product-update, ecosystem, technology, community
5. Make questions specific to the posts above

Return ONLY the JSON array, no markdown formatting."""

    print("⚡ Gemini generating questions...")
    
    try:
        response = model.generate_content(prompt)
        
        # Check if response was blocked by safety filters
        if not response.candidates:
            print("❌ Gemini blocked the response (safety filters)")
            print("💡 This can happen with certain content. Try running again.")
            if hasattr(response, 'prompt_feedback'):
                print(f"   Feedback: {response.prompt_feedback}")
            return []
        
        # Check if we got valid content
        if not response.text:
            print("❌ Gemini returned empty response")
            return []
        
        text_response = response.text.replace("```json", "").replace("```", "").strip()
        
        # Debug: Show what we got
        if len(text_response) < 100:
            print(f"⚠️  Short response: {text_response}")
        
        questions = json.loads(text_response)
        print(f"✅ Generated {len(questions)} questions")
        return questions
        
    except json.JSONDecodeError as e:
        print(f"❌ Gemini returned invalid JSON: {e}")
        print(f"📄 First 500 chars of response:")
        try:
            print(response.text[:500] if response and hasattr(response, 'text') else "No response text")
        except:
            print("Could not access response text")
        return []
        
    except ValueError as e:
        if "response.text" in str(e):
            print("❌ Gemini safety filters blocked the response")
            print("💡 The prompt may have triggered content filters. Try again.")
        else:
            print(f"❌ Gemini error: {e}")
        return []
        
    except Exception as e:
        print(f"❌ Gemini error: {e}")
        return []

def validate_and_format(questions):
    """Validate and format questions for the app"""
    print("🔍 Validating questions...")
    
    validated = []
    for i, q in enumerate(questions, 1):
        # Validate structure
        if not all(key in q for key in ['question', 'options', 'correctIndex']):
            continue
        if len(q['options']) != 4:
            continue
        if not (0 <= q['correctIndex'] <= 3):
            continue
        
        # Format for app
        validated.append({
            "id": i,
            "question": q['question'],
            "options": q['options'],
            "correctIndex": q['correctIndex'],
            "sourceUrl": "https://warpcast.com/~/channel/base",  # Base channel (multiple sources)
            "sourceCast": "Base ecosystem on Farcaster",
            "explanation": q.get('explanation', 'Based on recent Base ecosystem posts.'),
            "difficulty": q.get('difficulty', 'medium'),
            "category": q.get('category', 'general')
        })
    
    print(f"✅ Validated {len(validated)} questions")
    return validated

def load_current_week():
    """Get current week number"""
    try:
        with open(OUTPUT_FILE, 'r', encoding='utf-8') as f:
            data = json.load(f)
            return data.get('weekNumber', 0)
    except:
        return 0

def save_questions(questions):
    """Save to quiz-questions.json with incremented week"""
    week_number = load_current_week() + 1
    
    output = {
        "lastUpdated": datetime.utcnow().isoformat() + 'Z',
        "weekNumber": week_number,
        "totalQuestions": len(questions),
        "questions": questions
    }
    
    with open(OUTPUT_FILE, 'w', encoding='utf-8') as f:
        json.dump(output, f, indent=2, ensure_ascii=False)
    
    print(f"\n✅ Saved {len(questions)} questions to {OUTPUT_FILE}")
    print(f"📅 Week number: {week_number}")

def main():
    print("🚀 Starting Weekly Quiz Generator\n")
    
    # 1. Fetch posts from Base ecosystem
    context_text = fetch_base_posts()
    
    if not context_text:
        print("❌ Failed to fetch data")
        sys.exit(1)
    
    # 2. Generate questions
    questions = generate_questions_with_gemini(context_text)
    
    if not questions:
        print("❌ Failed to generate questions")
        sys.exit(1)
    
    # 3. Validate and format
    validated = validate_and_format(questions)
    
    if len(validated) < 40:
        print(f"⚠️  Warning: Only {len(validated)} valid questions (expected 50)")
    
    # 4. Save
    save_questions(validated)
    
    print("\n🎉 Success!")
    print(f"📊 Summary:")
    print(f"   Total: {len(validated)} questions")
    print(f"   Easy: {sum(1 for q in validated if q['difficulty'] == 'easy')}")
    print(f"   Medium: {sum(1 for q in validated if q['difficulty'] == 'medium')}")
    print(f"   Hard: {sum(1 for q in validated if q['difficulty'] == 'hard')}")

if __name__ == '__main__':
    main()
