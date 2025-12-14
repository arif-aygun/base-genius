# BaseGenius

A dynamic quiz game where users answer 5 questions about recent Farcaster and Base ecosystem news. Score 5/5 to earn an exclusive NFT badge on Base blockchain!

![Quiz Demo](https://img.shields.io/badge/Status-In%20Development-yellow)
![Base](https://img.shields.io/badge/Base-Blockchain-blue)
![Farcaster](https://img.shields.io/badge/Farcaster-Mini%20App-purple)

---

## 🎯 Features

- **Dynamic Questions**: 50-question pool, 5 random questions per quiz
- **AI-Powered**: Questions generated from real Farcaster/Base news
- **NFT Rewards**: Perfect score earns a weekly collectible badge
- **Beautiful UI**: Modern gradient design with smooth animations
- **Anti-Cheat**: Randomized questions prevent answer sharing
- **Weekly Updates**: Fresh questions every week from latest news

---

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm
- Vercel account (for deployment)
- API Keys (see setup below)

### Installation

```bash
# Clone the repository
git clone https://github.com/YOUR_USERNAME/mini-app-quickstart-template.git
cd mini-app-quickstart-template

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env and add your API keys

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the app.

---

## 🔑 Environment Variables

Create a `.env` file in the root directory:

```env
# Required
NEXT_PUBLIC_ONCHAINKIT_API_KEY=your_coinbase_api_key
NEXT_PUBLIC_URL=http://localhost:3000

# For AI Question Generation (Team Member #1)
GEMINI_API_KEY=your_gemini_api_key
NEYNAR_API_KEY=your_neynar_api_key

# For Admin Panel (Optional)
ADMIN_PASSWORD=your_secret_password

# For Production
NFT_CONTRACT_ADDRESS=your_contract_address
```

### Getting API Keys

- **OnchainKit API**: https://portal.cdp.coinbase.com/
- **Gemini API** (free): https://ai.google.dev/
- **Neynar API** (free): https://neynar.com/

---

## 👥 Team Structure

This project is designed for a **4-person team**. See [docs/team-roles.md](docs/team-roles.md) for detailed role assignments.

### Quick Overview:

1. **AI & Question Generation** - Generate 50 questions from news
2. **Backend & Web3** - NFT minting and smart contracts
3. **Frontend & Design** - UI polish and visual assets
4. **DevOps & Integration** - Deployment and testing

**See [docs/workflow.md](docs/workflow.md) for the complete development timeline.**

---

## 📚 Documentation

- **[Team Roles](docs/team-roles.md)** - Detailed role assignments for each team member
- **[AI Setup Guide](docs/ai-setup-guide.md)** - Step-by-step guide for AI question generation
- **[Workflow](docs/workflow.md)** - Day-by-day development timeline and coordination
- **[Implementation Plan](docs/implementation-plan.md)** - Technical architecture and features

---

## 🏗️ Project Structure

```
mini-app-quickstart-template/
├── app/
│   ├── api/
│   │   ├── questions/          # Serves random 5 questions
│   │   └── submit-answers/     # Validates and scores answers
│   ├── components/
│   │   ├── QuizCard.tsx        # Main quiz component
│   │   └── ResultsCard.tsx     # Results display
│   ├── data/
│   │   └── quiz-questions.json # 50-question pool
│   ├── lib/                    # Utility functions (to be added)
│   ├── types/
│   │   └── quiz.ts             # TypeScript interfaces
│   └── page.tsx                # Main app page
├── docs/                       # Team documentation
├── public/                     # Static assets
└── minikit.config.ts           # Farcaster Mini App config
```

---

## 🎮 Current Status

### ✅ Completed (MVP)
- [x] Quiz UI with progress bar and smooth transitions
- [x] Randomized question selection (5 from 50)
- [x] Score tracking and results display
- [x] API routes for questions and answers
- [x] Beautiful gradient design
- [x] 5 sample questions

### ⏳ In Progress (Team Tasks)
- [ ] Expand to 50 questions (AI Team Member)
- [ ] NFT minting implementation (Backend Team Member)
- [ ] Visual assets and animations (Frontend Team Member)
- [ ] Production deployment (DevOps Team Member)

---

## 🛠️ Development Commands

```bash
# Development
npm run dev          # Start dev server

# Build
npm run build        # Build for production
npm run start        # Start production server

# Linting
npm run lint         # Run ESLint

# Question Generation (after setup)
npx tsx app/lib/generate-questions.ts
```

---

## 🚢 Deployment

### Vercel Deployment

1. Push code to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy!

See [docs/deployment.md](docs/deployment.md) for detailed instructions (to be created by DevOps team member).

---

## 🎨 Design Philosophy

- **Modern & Premium**: Vibrant gradients, smooth animations
- **Mobile-First**: Optimized for Farcaster frames
- **Educational**: Questions teach while challenging
- **Rewarding**: NFT badges for achievement

---

## 🤝 Contributing

This is a team project. Please coordinate with your assigned role:

1. Create a feature branch: `git checkout -b feature/your-feature`
2. Make your changes
3. Test locally
4. Create a Pull Request

**See [docs/team-roles.md](docs/team-roles.md) for your specific responsibilities.**

---

## 📝 License

This project is for educational purposes.

---

## 🙏 Acknowledgments

- Built with [OnchainKit](https://onchainkit.xyz)
- Powered by [Base](https://base.org)
- Integrated with [Farcaster](https://farcaster.xyz)
- Questions generated by Google Gemini AI
- News sourced from Neynar API

---

## 📞 Support

**Team Questions?**
- Check [docs/workflow.md](docs/workflow.md) for coordination
- Daily standups at [your scheduled time]

**Technical Issues?**
- Review role documentation in `docs/`
- Ask in team chat
- Check implementation plan

---

**Let's build something amazing! 🚀**
