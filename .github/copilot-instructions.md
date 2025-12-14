# Base Weekly News Quiz - AI Coding Guidelines

## Architecture Overview
This is a Next.js 16 app with App Router, TypeScript, and Tailwind CSS, designed as a Farcaster Mini App for Base blockchain. It features a dynamic quiz system where users answer 5 randomized questions about weekly Farcaster/Base news to earn NFT badges.

**Key Components:**
- `app/page.tsx`: Main game state management (welcome → quiz → results)
- `app/api/questions/route.ts`: Serves 5 random questions from JSON pool (anti-cheat: no correct answers sent)
- `app/api/submit-answers/route.ts`: Validates answers against JSON data, returns detailed results
- `app/data/quiz-questions.json`: 50-question pool with metadata (source URLs, explanations)
- Components: `QuizCard.tsx`, `ResultsCard.tsx` for UI states

**Data Flow:**
- Frontend fetches questions via GET `/api/questions` (randomized, no answers)
- User selects answers, POST to `/api/submit-answers` with `{answers: [{questionId, selectedIndex}]}`
- Backend validates against `quiz-questions.json`, returns score + explanations

## Critical Patterns
- **State Management**: Use `useState` for game states (`'welcome' | 'loading' | 'quiz' | 'results'`), avoid complex libraries
- **API Integration**: Always use `fetch()` for API calls, handle errors with try/catch and user alerts
- **Mini App Setup**: Call `useMiniKit()` and `setFrameReady()` in useEffect for Farcaster frame compatibility
- **Question Randomization**: Use Fisher-Yates shuffle in API routes, exclude seen questions via query params
- **Web3 Integration**: Use OnchainKit components (`<Wallet>`, transaction buttons) for NFT minting, never raw wagmi/viem unless necessary

## Development Workflow
- **Local Dev**: `npm run dev` (auto-reloads), test in browser at `http://localhost:3000`
- **Question Generation**: Run `npx tsx app/lib/generate-questions.ts` after setting GEMINI_API_KEY and NEYNAR_API_KEY
- **Build Check**: `npm run build` before commits, fix TypeScript/ESLint errors immediately
- **Environment**: Copy `.env.example` to `.env`, add API keys for full functionality

## Project-Specific Conventions
- **File Structure**: Keep API routes in `app/api/`, components in `app/components/`, types in `app/types/`
- **Styling**: Use Tailwind classes with gradients (`bg-gradient-to-r from-blue-600 to-purple-600`), responsive design for mobile frames
- **Error Handling**: Console.error for logs, alert() for user-facing errors, graceful fallbacks to welcome state
- **NFT Minting**: Only show claim button for perfect scores (5/5), use OnchainKit's transaction components
- **Data Updates**: Questions updated weekly via AI script, versioned by `weekNumber` in JSON

## Examples
- **Adding New Component**: Create in `app/components/`, export default function, use Tailwind for styling
- **API Route**: Export async GET/POST functions, return `NextResponse.json()` or error status
- **State Updates**: `setGameState('loading')` before async operations, handle failures by resetting to previous state</content>
<parameter name="filePath">/Users/yusuferay/Documents/GitHub/mini-app-quickstart-template/.github/copilot-instructions.md