# Weekly Quiz Automation - Quick Start Guide

## ✅ What I Created for You

1. **`scripts/generate_weekly_questions.py`** - Python script that generates 50 questions
2. **`scripts/requirements.txt`** - Python dependencies
3. **`.github/workflows/weekly-quiz.yml`** - GitHub Action for automation

---

## 🚀 Setup Steps (10 minutes)

### Step 1: Get API Keys

**Gemini AI (FREE):**
1. Go to https://ai.google.dev
2. Click "Get API key in Google AI Studio"
3. Create new API key
4. Copy it (starts with `AIza...`)

**Neynar API (FREE):**
1. Go to https://neynar.com
2. Sign up / Log in
3. Dashboard → API Keys
4. Copy your API key

---

### Step 2: Add Secrets to GitHub

1. Go to your GitHub repository
2. Settings → Secrets and variables → Actions
3. Click "New repository secret"

**Add these two secrets:**
- Name: `GEMINI_API_KEY`, Value: `your_gemini_key`
- Name: `NEYNAR_API_KEY`, Value: `your_neynar_key`

---

### Step 3: Test Locally First

```bash
# Install Python dependencies
pip install -r scripts/requirements.txt

# Set environment variables (temporary)
export GEMINI_API_KEY="your_gemini_key"
export NEYNAR_API_KEY="your_neynar_key"

# Run the script
python scripts/generate_weekly_questions.py

# Check output
cat app/data/quiz-questions.json
```

**Expected output:**
```
🚀 Starting Weekly Quiz Question Generator
📡 Fetching latest casts from Jesse Pollak...
✅ Fetched 50 casts
🤖 Generating questions with Gemini AI...
✅ Generated 50 questions
🔍 Validating questions...
✅ Validated 50 questions
✅ Saved 50 questions to app/data/quiz-questions.json
📅 Week number: 51
```

---

### Step 4: Push Files to GitHub

```bash
git add .
git commit -m "feat: add weekly quiz automation"
git push
```

---

### Step 5: Enable GitHub Action

The action is already configured to run:
- **Automatically:** Every Sunday at midnight UTC
- **Manually:** Go to Actions tab → "Weekly Quiz Generation" → Run workflow

**First time setup:**
1. Go to Actions tab
2. Click "Weekly Quiz Generation"
3. Click "Run workflow" → Run workflow
4. Wait ~2 minutes
5. You'll get a PR with new questions!

---

## 📅 Weekly Workflow

**Sunday at Midnight (Automatic):**
- GitHub Action runs
- Generates 50 questions
- Creates Pull Request

**Monday Morning (You):**
1. Check your email for PR notification
2. Review questions in the PR
3. Edit if needed (click "Files changed" → Edit file)
4. Approve and merge
5. Vercel auto-deploys 🚀

**Time:** 15-30 min review vs 2+ hours manual work

---

## 🔧 Customization

**Change schedule:**
Edit `.github/workflows/weekly-quiz.yml`, line 6:
```yaml
- cron: '0 0 * * 0'  # Sunday midnight
# Change to:
- cron: '0 12 * * 1'  # Monday noon
```

**Change question count:**
Edit `scripts/generate_weekly_questions.py`, line 26:
```python
QUESTIONS_TO_GENERATE = 50  # Change to any number
```

**Add more sources:**
Modify `fetch_jesse_casts()` to fetch from multiple FIDs

---

## ❓ Troubleshooting

**"Error: GEMINI_API_KEY must be set"**
→ Add secrets to GitHub (Step 2)

**"Failed to fetch casts"**
→ Check Neynar API key is valid
→ Check you're not over rate limit (100/day)

**"Only generated 40 questions"**
→ This happens sometimes with AI
→ The script continues anyway
→ Review and manually add more if needed

**GitHub Action failed**
→ Go to Actions tab
→ Click the failed run
→ Check logs for error message

---

## 🎯 Success Checklist

- [ ] API keys obtained
- [ ] Secrets added to GitHub
- [ ] Script tested locally
- [ ] Files pushed to GitHub
- [ ] First automation run successful
- [ ] PR created and reviewed
- [ ] Questions merged and deployed

---

## 💰 Cost

- GitHub Actions: **FREE** (2000 min/month)
- Gemini API: **FREE** (60 req/min)
- Neynar API: **FREE** (100 req/day)

**Total: $0/month** ✅

---

## 🎉 You're Done!

The automation is now active. Every Sunday, you'll get fresh questions automatically.

**Questions?** Check the logs or ask for help!
