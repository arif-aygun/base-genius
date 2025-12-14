# Team Role Assignment - BaseGenius

## Project Status
✅ **Core MVP Complete**: Quiz flow, randomization, scoring, UI  
⏳ **Remaining Work**: Question expansion, NFT minting, news APIs, assets, deployment

---

## Team Member #1: AI & Question Generation Specialist

**Focus**: AI-powered question creation and news automation

### Responsibilities
- [ ] Set up AI question generator
  - Get Google Gemini API key (free) from https://ai.google.dev
  - Create `app/lib/generate-questions.ts`
  - Write effective prompts to generate 50 questions from news
  - Test and refine output quality
  - Ensure variety in difficulty and categories

- [ ] Integrate Neynar API for news fetching
  - Get free API key from https://neynar.com
  - Create `app/lib/news-fetcher.ts`
  - Fetch trending casts from `/base` channel
  - Filter relevant Base/Farcaster news
  - Format news data for AI processing

- [ ] Build question generation pipeline
  - Fetch news → AI generates questions → Validate → Save to JSON
  - Create admin route to trigger generation (`/api/generate-questions`)
  - Add quality checks (ensure 4 options, correct answer set, etc.)
  - Manual review and editing workflow

- [ ] Initial question curation
  - Generate first batch of 50 questions
  - Review for accuracy and quality
  - Test questions in quiz flow
  - Document best practices for future generations

### Files to Create/Edit
- `app/lib/generate-questions.ts` - AI question generator
- `app/lib/news-fetcher.ts` - Neynar integration
- `app/api/generate-questions/route.ts` - Admin API endpoint
- `app/data/quiz-questions.json` - Generated questions
- `.env` - Add `GEMINI_API_KEY` and `NEYNAR_API_KEY`

### Skills Needed
- Prompt engineering
- API integration (Gemini, Neynar)
- Data validation and quality control
- Some JavaScript/TypeScript

### Example Prompt Structure
```
Given these Farcaster posts about Base:
[news items]

Generate 10 quiz questions in this JSON format:
{
  "question": "...",
  "options": ["A", "B", "C", "D"],
  "correctIndex": 0,
  "explanation": "...",
  "difficulty": "easy|medium|hard"
}
```

---

## Team Member #2: Backend & Web3 Developer

**Focus**: NFT minting and blockchain integration

### Responsibilities
- [ ] Implement NFT badge minting
  - Research OnchainKit NFT minting documentation
  - Choose approach: existing contract vs deploy new contract
  - Set up contract on Base (testnet first, then mainnet)
  - Create weekly badge metadata structure
  
- [ ] Build ClaimBadge component
  - Wallet connection check
  - Transaction handling with OnchainKit
  - Loading states and error handling
  - Success confirmation with tx hash
  - Test on Base testnet

- [ ] Backend API enhancements
  - Optional: Create leaderboard API
  - Optional: Track quiz completions
  - Optimize existing `/api/questions` and `/api/submit-answers`
  - Add rate limiting if needed

- [ ] Smart contract work (if deploying custom)
  - Write ERC-1155 or ERC-721 contract
  - Include week number in token metadata
  - Deploy to Base testnet
  - Verify contract on Basescan

### Files to Create/Edit
- `app/components/ClaimBadge.tsx` - NFT minting UI
- `contracts/` - Smart contracts (if custom)
- `app/lib/nft-config.ts` - Contract addresses and ABIs
- Update `app/components/ResultsCard.tsx` - Integrate ClaimBadge
- `.env` - Add `NFT_CONTRACT_ADDRESS`

### Skills Needed
- Next.js API routes
- OnchainKit/Web3 knowledge
- API integration (Neynar, Gemini)

---

## Team Member #3: Frontend & Design

**Focus**: UI/UX polish and visual assets

### Responsibilities
- [ ] Create visual assets
  - Design quiz logo/icon (brain + news theme)
  - Generate `/public/icon.png` (512x512)
  - Generate `/public/hero.png` (1200x630)
  - Generate `/public/splash.png` (1080x1920)
  - Create badge NFT artwork mockup

- [ ] UI/UX enhancements
  - Add confetti animation for perfect scores
  - Improve answer selection feedback
  - Add smooth transitions between questions
  - Polish loading states
  - Mobile responsive testing
  - Add share to Farcaster functionality

- [ ] Styling polish
  - Refine color gradients
  - Add micro-animations
  - Improve dark mode support (if needed)
  - Optimize for Farcaster frame sizes

### Files to Edit
- `app/globals.css` - Custom animations and styles
- `app/components/QuizCard.tsx` - Add transitions
- `app/components/ResultsCard.tsx` - Add confetti effect
- `public/` - All image assets

### Tools to Use
- Image generation tools (Midjourney, DALL-E, or Figma)
- Confetti libraries (canvas-confetti)

### Skills Needed
- UI/UX design
- CSS animations
- Asset creation

---

## Team Member #4: DevOps & Integration

**Focus**: Deployment, testing, and Base ecosystem integration

### Responsibilities
- [ ] Vercel deployment setup
  - Push code to GitHub repo
  - Configure Vercel environment variables:
    - `NEXT_PUBLIC_ONCHAINKIT_API_KEY`
    - `NEXT_PUBLIC_URL`
    - `NEYNAR_API_KEY`
    - `GEMINI_API_KEY`
  - Test production build
  - Set up automatic deployments

- [ ] Base Build & Farcaster integration
  - Submit app to Base Build (https://www.base.dev)
  - Use Mini App Tools to sign manifest
  - Update `minikit.config.ts` with account association
  - Test in Warpcast mobile app
  - Submit to Base App ecosystem

- [ ] Testing & QA
  - Test NFT minting on Base testnet
  - Verify all API routes work in production
  - Test question randomization multiple times
  - Mobile responsive testing
  - Performance optimization

- [ ] Documentation
  - Update README.md with setup instructions
  - Document environment variables needed
  - Create deployment guide
  - API documentation

### Files to Edit
- `README.md` - Setup and deployment guide
- `minikit.config.ts` - Add account association after signing
- `.env.example` - Document required env vars
- Create `docs/deployment.md`

### Skills Needed
- Vercel deployment
- Git/GitHub
- Testing & QA
- Technical writing

---

## Coordination & Timeline

### Week 1 (Days 1-3) - Current Sprint
- **Everyone**: Review implementation plan and pick up your role
- **Member #1**: Start question research, aim for 25 questions by end of sprint
- **Member #2**: NFT minting research and initial implementation
- **Member #3**: Create icon and hero images
- **Member #4**: Set up Vercel project and environment

### Week 2 (Days 4-6)
- **Member #1**: Complete 50 questions, test with team
- **Member #2**: Finish NFT minting, start news fetcher
- **Member #3**: UI polish, animations, confetti
- **Member #4**: First deployment to staging, testing

### Week 3 (Day 7+) - Launch Week
- **Everyone**: Final testing and bug fixes
- **Member #4**: Production deployment and Base Build submission
- **Member #1 & #3**: Marketing materials and screenshots
- **Member #2**: Monitor production, fix any issues

---

## Communication

**Daily standups**: Quick 15-min sync on progress  
**Shared doc**: Google Doc for question drafts and news links  
**GitHub**: Use branches and PRs for code review  
**Testing**: Everyone tests on localhost before merging

---

## Current Codebase Status

**What's Done** ✅
- Quiz UI (QuizCard, ResultsCard, Welcome screen)
- API routes for questions and answer submission
- Randomization algorithm
- Score tracking and results display
- 5 sample questions

**What's Next** ⏳
- 45 more questions
- NFT minting
- Visual assets
- News API integration
- Deployment

---

## Questions & Support

- **Blocked?** Ask in team chat immediately
- **Need help with Web3?** Member #2 leads
- **Design questions?** Member #3 decides
- **Deployment issues?** Member #4 handles

**Goal**: Ship in 7 days! 🚀
