# Getting Started - BaseGenius

Welcome to the team! 👋 This guide will get you up and running quickly.

## First Day Setup (Everyone)

### 1. Clone and Install (5 minutes)

```bash
git clone https://github.com/YOUR_USERNAME/mini-app-quickstart-template.git
cd mini-app-quickstart-template
npm install
```

### 2. Environment Setup (10 minutes)

Copy the example environment file:
```bash
cp .env.example .env
```

Get the **OnchainKit API key** (required for everyone):
1. Go to https://portal.cdp.coinbase.com/
2. Create account / sign in
3. Create new project
4. Copy API key
5. Add to `.env`: `NEXT_PUBLIC_ONCHAINKIT_API_KEY=your_key`

### 3. Test Locally (2 minutes)

```bash
npm run dev
```

Open http://localhost:3000 - you should see the quiz welcome screen! ✅

---

## Role-Specific Setup

### If you're Team Member #1 (AI & Questions)
📖 **Read:** [docs/ai-setup-guide.md](ai-setup-guide.md)

**Quick start:**
1. Get Gemini API key: https://ai.google.dev/
2. Get Neynar API key: https://neynar.com/
3. Add both to `.env`
4. Ready to generate questions!

### If you're Team Member #2 (Backend & Web3)
📖 **Read:** [docs/team-roles.md](team-roles.md) - Backend section

**Quick start:**
1. Review OnchainKit docs: https://onchainkit.xyz
2. Decide on NFT strategy (existing vs custom contract)
3. Set up Base testnet wallet
4. Start building ClaimBadge component

### If you're Team Member #3 (Frontend & Design)
📖 **Read:** [docs/team-roles.md](team-roles.md) - Frontend section

**Quick start:**
1. Test the current UI in browser
2. Plan logo/icon designs
3. Research confetti libraries (canvas-confetti)
4. Start creating visual assets

### If you're Team Member #4 (DevOps & Integration)
📖 **Read:** [docs/team-roles.md](team-roles.md) - DevOps section

**Quick start:**
1. Create Vercel account
2. Link GitHub repo to Vercel
3. Set up staging environment
4. Document deployment process

---

## Team Coordination

### Daily Standup (15 min)
**Time:** [Pick your time]

Each person shares:
1. ✅ What I completed yesterday
2. 🎯 What I'm working on today
3. 🚧 Any blockers

### Communication Channels
- **Code:** GitHub Pull Requests
- **Chat:** [Your team chat - Discord/Slack]
- **Docs:** Google Doc for shared notes

### Git Workflow

```bash
# Create feature branch
git checkout -b feature/your-name-feature-description

# Make changes and commit
git add .
git commit -m "feat: descriptive message"

# Push to GitHub
git push origin feature/your-name-feature-description

# Create Pull Request on GitHub
# Tag team for review
```

---

## Key Documents

Must-read for everyone:
- 📋 [team-roles.md](team-roles.md) - Role assignments
- 📅 [workflow.md](workflow.md) - Timeline and coordination
- ✅ [Below] Project status checklist

Role-specific:
- 🤖 [ai-setup-guide.md](ai-setup-guide.md) - AI team member
- 🏗️ [implementation-plan.md](implementation-plan.md) - Technical details

---

## Project Status Checklist

### ✅ Completed (Already Done)
- [x] Quiz UI with progress bar
- [x] Question randomization (5 from pool)
- [x] Score tracking and results
- [x] API routes (/api/questions and /api/submit-answers)
- [x] Beautiful gradient design
- [x] 5 sample questions
- [x] MiniKit integration

### 🎯 Your Team's Tasks

**Week 1 (Days 1-3):**
- [ ] AI: Generate 50 questions
- [ ] Backend: NFT minting implementation
- [ ] Frontend: Create visual assets (icon, hero, splash)
- [ ] DevOps: Set up Vercel staging

**Week 2 (Days 4-6):**
- [ ] AI: Question quality review
- [ ] Backend: Test NFT on Base testnet
- [ ] Frontend: Add animations and confetti
- [ ] DevOps: Integration testing

**Week 3 (Day 7+):**
- [ ] Everyone: Final team testing
- [ ] DevOps: Production deployment
- [ ] DevOps: Submit to Base Build
- [ ] Everyone: 🎉 Launch!

---

## Testing Your Work

### Before Creating a Pull Request:

1. **Test locally:**
   ```bash
   npm run dev
   # Test your feature in browser
   ```

2. **Check builds:**
   ```bash
   npm run build
   # Should complete without errors
   ```

3. **Run linter:**
   ```bash
   npm run lint
   # Fix any warnings
   ```

4. **Test the quiz:**
   - Start a quiz
   - Answer questions
   - Check results page
   - Your feature should work!

---

## Common Issues

**"npm install fails"**
- Try: `npm install --legacy-peer-deps`
- Still failing? Delete `node_modules` and `package-lock.json`, then `npm install`

**"Port 3000 already in use"**
- Kill the process: `npx kill-port 3000`
- Or use different port: `npm run dev -- -p 3001`

**"API key not working"**
- Check `.env` file exists in root
- Verify no extra spaces in API key
- Restart dev server after changing `.env`

**"Changes not showing up"**
- Hard refresh: Ctrl+Shift+R (Windows) or Cmd+Shift+R (Mac)
- Clear browser cache
- Restart dev server

---

## Quick Reference

### Important Files

**You'll work with:**
- AI: `app/lib/generate-questions.ts`, `app/data/quiz-questions.json`
- Backend: `app/components/ClaimBadge.tsx`, `app/lib/nft-config.ts`
- Frontend: `app/globals.css`, `public/*`, component files
- DevOps: `README.md`, Vercel configs, env vars

**Don't modify (unless coordinating):**
- `minikit.config.ts` - Only DevOps for account association
- `package.json` - Coordinate before adding dependencies

### Useful Commands

```bash
npm run dev           # Start development
npm run build         # Build for production
npm run lint          # Check code quality
git status            # Check your changes
git log --oneline     # See recent commits
```

---

## Getting Help

**Stuck on your role?**
1. Check your role documentation in `docs/`
2. Ask in team chat
3. Create draft PR and ask for early feedback

**Merge conflicts?**
1. Don't panic!
2. Ask DevOps team member for help
3. Or: `git pull origin main` before pushing

**Other issues?**
- Check `docs/workflow.md` for coordination
- Daily standup is best time to discuss

---

## Success Metrics

**You know you're on track when:**
- ✅ Local dev server runs without errors
- ✅ Your feature works in the browser
- ✅ Tests pass (when we add them)
- ✅ Team can review your PR
- ✅ No merge conflicts

---

## Let's Ship! 🚀

**Remember:**
- Work in parallel (different files = no conflicts!)
- Commit often, push frequently
- Test before creating PRs
- Communicate in standup
- Ship in 7 days!

**First task:** Read your role in [team-roles.md](team-roles.md) and start setup! 

Good luck team! 💪
