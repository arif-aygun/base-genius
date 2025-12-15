# Base Genius — Mini App Quiz (Base / Farcaster)

Introduction

Base Genius is a lightweight, mobile-first mini-app built for the Base blockchain and Farcaster ecosystem. It runs a weekly 5-question quiz that tests users on recent Base/Farcaster news and community events. The app is optimized for mini-app frames and social wallet flows — players who score perfectly can mint a collectible on-chain badge NFT as proof of knowledge and engagement. The project is intended for community growth, low-friction educational engagement, and easy weekly updates.

Live demo

https://base-genius.vercel.app/

This repository is a Next.js 16 + TypeScript mini-app that runs a short weekly quiz about Base / Farcaster news. Users answer 5 randomized questions and — on a perfect score — can mint an on-chain badge NFT.

This README summarizes the app architecture, how data flows, local development, question generation, and where to look in the codebase.

## Quick overview

- Framework: Next.js 16 (App Router) + TypeScript + Tailwind CSS
- Purpose: A 5-question weekly quiz (randomized) with NFT badge minting for perfect scores
- Web3: Uses OnchainKit components for wallet / mint flow (no raw wagmi/viem unless needed)
- Data: Questions are stored in JSON and served by API routes; validation happens server-side

## Repository layout (important files/folders)

- `app/` — Next.js app router files
  - `page.tsx` — Main game UI & state (welcome → quiz → results)
  - `layout.tsx`, `globals.css` — layout & global styling
  - `api/` — server API routes
    - `questions/route.ts` — GET returns 5 randomized questions (anti-cheat: doesn't include answers)
    - `submit-answers/route.ts` — POST validates answers and returns detailed result + explanations
    - `auth/route.ts` — auth helper (if enabled)
  - `components/` — React UI components: `QuizCard.tsx`, `ResultsCard.tsx`, `MintBadgeButton.tsx`, `ConnectWallet.tsx`, etc.
  - `data/quiz-questions.json` — canonical pool of questions (50+) with metadata
  - `types/quiz.ts` — TypeScript types for quiz data shapes

- `contracts/` — smart contract sources & ABI
  - `BaseGeniusBadge.sol` — Solidity contract for the badge
  - `BaseGeniusBadgeABI.ts` — ABI wrapper used by the app

- `scripts/` — helper scripts
  - `generate_weekly_questions.py` — AI-assisted question generation (requires API keys)
  - `generate-signer-wallet.ts`, `check-contract-signer.ts` — tooling for signer wallet checks

- `public/metadata/` — example NFT metadata per week (e.g. `week-50.json`)

- Misc: `minikit.config.ts`, `next.config.ts`, `tsconfig.json`, `package.json`

## Data flow & API contract

- GET `/api/questions`
  - Returns 5 randomized questions from `data/quiz-questions.json`.
  - Anti-cheat: correct answers are not included in the response.
  - Query params support excluding recently served question IDs (if implemented).

- POST `/api/submit-answers`
  - Body: `{ answers: Array<{ questionId: string, selectedIndex: number }> }`
  - Server validates answers against `data/quiz-questions.json` and returns a result object with per-question correctness, explanations, and a score.

- On perfect score (5/5) the client shows a mint button that triggers the onchain mint flow via `MintBadgeButton.tsx` and `lib/nftService.ts`.

## Local development

Prerequisites

- Node.js (v18+ recommended)
- npm or pnpm
- (Optional) Ethereum / Base signer for end-to-end mint testing

Install

```bash
npm install
```

Run dev server

```bash
npm run dev
# then open http://localhost:3000
```

Build (production)

```bash
npm run build
npm start
```

Notes:
- The app uses `fetch()` for API calls to the internal API routes; errors are handled with try/catch and user-facing alerts.
- For Farcaster mini-app frame compatibility, `useMiniKit()` and `setFrameReady()` are called in the main UI where applicable.

## Environment & secrets

- Copy `.env.example` -> `.env` and fill required keys (if present). The repository uses AI generation scripts that depend on: `GEMINI_API_KEY` and `NEYNAR_API_KEY` (for `generate_weekly_questions.py`) — see `docs/ai-setup-guide.md`.

## Question generation (weekly)

A helper script exists to generate weekly questions using AI. Example: edit or run:

```bash
# Python env (see scripts/requirements.txt)
python3 -m venv .venv
source .venv/bin/activate
pip install -r scripts/requirements.txt
python3 scripts/generate_weekly_questions.py
```

The script requires API keys defined in environment variables. It writes/updates `data/quiz-questions.json` and produces metadata files under `public/metadata/`.

## Minting & NFT notes

- Only users who score 5/5 see the claim button.
- Minting is performed with OnchainKit components and with the project's `BaseGeniusBadge` contract (see `contracts/BaseGeniusBadge.sol` and `lib/nftService.ts`).
- Example metadata files are under `public/metadata/` (e.g. `week-50.json`).
- See `NFT_SETUP_INSTRUCTIONS.md` for step-by-step minting configuration and contract deployment instructions.

## Tests & quality

- There are no heavy test suites included by default; add lightweight unit tests for `lib/*` and API handlers as needed.
- Run TypeScript checks using your normal toolchain (e.g. `npm run build` will catch type errors in many setups).

## Developer tips & conventions

- State is kept light: `useState` manages game state (welcome → loading → quiz → results).
- UI: Tailwind CSS utility classes in components. Keep mobile-first for Farcaster frames.
- Randomization: API uses Fisher-Yates shuffle to pick 5 questions; avoid sending correct answers to the client to prevent cheating.
- When changing public APIs (e.g., API routes), update `types/quiz.ts` accordingly.

## Useful files to inspect

- `app/page.tsx` — main flow, game state transitions
- `app/api/questions/route.ts` — question selection logic
- `app/api/submit-answers/route.ts` — server-side answer validation
- `data/quiz-questions.json` — question pool format
- `lib/nftService.ts` — minting & web3 helpers
- `contracts/BaseGeniusBadge.sol` — smart contract source

## Troubleshooting

- If questions are not showing: verify `data/quiz-questions.json` is valid JSON and the API route is reachable at `/api/questions`.
- If minting fails: confirm the contract address and signer config in `minikit.config.ts` and environment.

## Next steps / suggestions

- Add unit tests for the API validation flow (`submit-answers`) and question shuffling.
- Add CI to run `npm run build` and TS/ESLint checks on PRs.
- Add automated weekly question generation via a scheduled workflow that commits generated questions and metadata.

---

If you want, I can also:
- Add a short example curl snippet for the submit API, or
- Add a minimal Jest test covering the answer validation logic.
