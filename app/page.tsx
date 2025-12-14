"use client";
import { useEffect, useState } from "react";
import { useMiniKit } from "@coinbase/onchainkit/minikit";
import { useAccount } from "wagmi";
import QuizCard from "./components/QuizCard";
import ResultsCard from "./components/ResultsCard";
import ConnectWallet from "./components/ConnectWallet";
import type { Question } from "./types/quiz";
import SkeletonLoader from "./components/SkeletonLoader";
import Toast from "./components/Toast";

// --- 1. YENİ IMPORTLAR BURADA ---
import { 
  ConnectWallet, 
  Wallet, 
  WalletDropdown, 
  WalletDropdownDisconnect, 
} from '@coinbase/onchainkit/wallet'; 
import { 
  Address, 
  Avatar, 
  Name, 
  Identity, 
  EthBalance 
} from '@coinbase/onchainkit/identity';

type GameState = 'welcome' | 'loading' | 'quiz' | 'results';

interface QuizResults {
  score: number;
  totalQuestions: number;
  isPerfectScore: boolean;
  weekNumber: number;
  canMint?: boolean;
  mintSignature?: string;
  mintError?: string;
  results: {
    questionId: number;
    correct: boolean;
    correctIndex: number;
    explanation: string;
    sourceUrl: string;
  }[];
}

export default function Home() {
  const { isFrameReady, setFrameReady } = useMiniKit();
  const { address } = useAccount(); // Get connected wallet address
  const [gameState, setGameState] = useState<GameState>('welcome');
  const [questions, setQuestions] = useState<Question[]>([]);
  const [weekNumber, setWeekNumber] = useState<number>(0);
  const [quizResults, setQuizResults] = useState<QuizResults | null>(null);

  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    if (!isFrameReady) {
      setFrameReady();
    }
  }, [setFrameReady, isFrameReady]);

  const startQuiz = async () => {
    setGameState('loading');
    try {
      const response = await fetch('/api/questions');
      const data = await response.json();
      setQuestions(data.questions);
      setWeekNumber(data.weekNumber);
      setGameState('quiz');
    } catch (error) {
      console.error('Failed to load questions:', error);
      setErrorMsg('Failed to load quiz. Please check your connection.');
      setGameState('welcome');
    }
  };

  const handleQuizComplete = async (answers: { questionId: number; selectedIndex: number }[]) => {
    setGameState('loading');
    try {
      const response = await fetch('/api/submit-answers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          answers,
          walletAddress: address || undefined, // Send wallet address for NFT minting
        }),
      });
      const results = await response.json();
      setQuizResults(results);
      setGameState('results');
    } catch (error) {
      console.error('Failed to submit answers:', error);
      setErrorMsg('Failed to submit quiz. Please try again.');
      setGameState('quiz');
    }
  };

  const handleRetry = () => {
    setGameState('welcome');
    setQuizResults(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      {/* Header Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* App Branding */}
            <div className="flex items-center gap-3">
              <span className="text-3xl">🧠</span>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                BaseGenius
              </h1>
            </div>

            {/* Wallet Connection */}
            <ConnectWallet />
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="flex flex-col items-center justify-center min-h-screen p-4 pt-20">
        {gameState === 'welcome' && (
          <div className="w-full max-w-2xl mx-auto text-center space-y-8">
            <div className="space-y-4">
              <div className="text-6xl mb-4">🧠</div>
              <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                BaseGenius
              </h1>
              <p className="text-xl text-gray-600 max-w-xl mx-auto">
                Test your knowledge of this week's Farcaster and Base ecosystem news!
              </p>
            </div>

            <div className="bg-white rounded-2xl shadow-xl p-8 space-y-6">
              <div className="grid grid-cols-3 gap-4 text-center">
                <div className="space-y-2">
                  <div className="text-3xl font-bold text-blue-600">5</div>
                  <div className="text-sm text-gray-600">Questions</div>
                </div>
                <div className="space-y-2">
                  <div className="text-3xl font-bold text-purple-600">50</div>
                  <div className="text-sm text-gray-600">Question Pool</div>
                </div>
                <div className="space-y-2">
                  <div className="text-3xl font-bold text-green-600">1</div>
                  <div className="text-sm text-gray-600">NFT Badge</div>
                </div>
              </div>

              <div className="border-t border-gray-200 pt-6 space-y-3">
                <div className="flex items-start gap-3 text-left">
                  <span className="text-2xl">✅</span>
                  <div>
                    <p className="font-semibold text-gray-900">Answer 5 random questions</p>
                    <p className="text-sm text-gray-600">Each quiz is unique!</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 text-left">
                  <span className="text-2xl">🏆</span>
                  <div>
                    <p className="font-semibold text-gray-900">Score 5/5 to win</p>
                    <p className="text-sm text-gray-600">Perfect score earns an NFT badge</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 text-left">
                  <span className="text-2xl">🔄</span>
                  <div>
                    <p className="font-semibold text-gray-900">Retake anytime</p>
                    <p className="text-sm text-gray-600">Get different questions each time</p>
                  </div>
                </div>
              </div>
            </div>

            <button
              onClick={startQuiz}
              className="w-full max-w-md mx-auto bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold py-5 px-8 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-200 hover:scale-[1.02] text-lg"
            >
              🚀 Start Quiz
            </button>
          </div>
        )}

        {gameState === 'loading' && (
          <div className="text-center space-y-4">
            <div className="animate-spin text-6xl">⚡</div>
            <p className="text-xl text-gray-600 font-medium">Loading questions...</p>
          </div>
        )}

        {gameState === 'quiz' && questions.length > 0 && (
          <QuizCard
            questions={questions}
            weekNumber={weekNumber}
            onComplete={handleQuizComplete}
          />
        )}

        {gameState === 'results' && quizResults && (
          <ResultsCard
            score={quizResults.score}
            totalQuestions={quizResults.totalQuestions}
            weekNumber={quizResults.weekNumber}
            canMint={quizResults.canMint}
            mintSignature={quizResults.mintSignature}
            mintError={quizResults.mintError}
            results={quizResults.results}
            onRetry={handleRetry}
          />
        )}
      </div>
    </div>
  );
}