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

# Jesse Pollak's correct FID
JESSE_FID = 191  # Not 3!
OUTPUT_FILE = 'app/data/quiz-questions.json'

def fetch_jesse_casts():
    """Fetch Jesse Pollak's latest casts - using WORKING endpoint from yusufe

ray.py"""
    print(f"📡 Fetching Base founder (FID: {JESSE_FID}) posts...")
    
    url = "https://api.neynar.com/v2/farcaster/feed/user/casts"
    headers = {
        "accept": "application/json",
        "api_key": NEYNAR_API_KEY
    }
    params = {
        "fid": JESSE_FID,
        "limit": 50,
        "include_replies": "false"
    }
    
    try:
        response = requests.get(url, headers=headers, params=params)
        
        if response.status_code == 200:
            data = response.json()
            casts = data.get('casts', [])
            
            # Format like yusuferay.py does
            combined_text = ""
            for cast in casts:
                text = cast.get('text', '').replace("\n", " ")
                date = cast.get('timestamp', '')[:10]
                if text:
                    combined_text += f"- Jesse Pollak ({date}): {text}\n"
            
            print(f"✅ Fetched {len(casts)} posts from Jesse Pollak")
            return combined_text, casts
        else:
            print(f"❌ Neynar error: {response.status_code} - {response.text}")
            return None, None
            
    except Exception as e:
        print(f"❌ Connection error: {e}")
        return None, None

def generate_questions_with_gemini(context_text):
    """Generate 50 quiz questions using Gemini"""
    if not context_text:
        return []
    
    model = genai.GenerativeModel('models/gemini-flash-latest')  # Same as yusuferay.py
    
    prompt = f"""Based on these recent posts from Jesse Pollak (founder of Base blockchain):

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
            "sourceUrl": "https://warpcast.com/jessepollak",
            "sourceCast": "Jesse Pollak on Farcaster",
            "explanation": q.get('explanation', 'Based on Jesse Pollak\'s recent posts about Base.'),
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
    
    # 1. Fetch Jesse's posts
    context_text, casts = fetch_jesse_casts()
    
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
