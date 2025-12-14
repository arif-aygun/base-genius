"use client";
import { useEffect, useState } from "react";
import { useMiniKit } from "@coinbase/onchainkit/minikit";
import { motion } from "framer-motion";
import QuizCard from "./components/QuizCard";
import ResultsCard from "./components/ResultsCard";
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
        body: JSON.stringify({ answers }),
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
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gray-50 overflow-hidden relative">
      
      <Toast 
        message={errorMsg} 
        isVisible={!!errorMsg} 
        onClose={() => setErrorMsg("")} 
      />

      {/* ARKA PLAN EFEKTLERİ */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-blue-400/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-purple-400/20 rounded-full blur-3xl pointer-events-none" />

      {/* HEADER */}
      <div className="absolute top-0 left-0 w-full p-6 flex justify-between items-center z-20">
        {/* Sol: Logo */}
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg">
            B
          </div>
          <span className="font-bold text-gray-900 hidden sm:block">Base Quiz</span>
        </div>

        {/* --- 2. GERÇEK CÜZDAN BAĞLANTISI BURADA --- */}
        <div className="flex justify-end">
          <Wallet>
            <ConnectWallet className="bg-white/80 backdrop-blur-md border border-gray-200 text-gray-900 font-bold hover:bg-gray-100 rounded-full px-4 py-2">
              <Avatar className="h-6 w-6 mr-2" />
              <Name />
            </ConnectWallet>
            <WalletDropdown>
              <Identity className="px-4 pt-3 pb-2" hasCopyAddressOnClick>
                <Avatar />
                <Name />
                <Address />
                <EthBalance />
              </Identity>
              <WalletDropdownDisconnect />
            </WalletDropdown>
          </Wallet>
        </div>
        {/* ------------------------------------------- */}
      </div>

      {/* WELCOME SCREEN */}
      {gameState === 'welcome' && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="w-full max-w-2xl mx-auto text-center space-y-8 relative z-10"
        >
          <div className="space-y-4 pt-8">
            <motion.div 
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 260, damping: 20, delay: 0.1 }}
              className="inline-block bg-white p-4 rounded-3xl shadow-xl shadow-blue-100 mb-2"
            >
              <div className="text-6xl animate-pulse">🧠</div>
            </motion.div>
            
            <h1 className="text-6xl font-black tracking-tighter text-gray-900 leading-tight">
              Base News<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                Weekly Quiz
              </span>
            </h1>
            
            <p className="text-xl text-gray-600 max-w-lg mx-auto font-medium">
              Prove you're <span className="text-blue-600 font-bold">Based</span>. Ace the quiz, mint the badge.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <motion.div 
              whileHover={{ scale: 1.02 }}
              className="bg-white/60 backdrop-blur-md border border-white/50 p-6 rounded-2xl shadow-lg shadow-blue-500/5 text-left"
            >
              <div className="text-3xl mb-2">⚡</div>
              <div className="font-bold text-gray-900 text-lg">5 Questions</div>
              <div className="text-sm text-gray-500">Quick & sharp updates</div>
            </motion.div>

            <motion.div 
              whileHover={{ scale: 1.02 }}
              className="bg-gradient-to-br from-yellow-50 to-orange-50 border border-yellow-200/50 p-6 rounded-2xl shadow-lg shadow-orange-500/5 text-left"
            >
              <div className="text-3xl mb-2">🏆</div>
              <div className="font-bold text-gray-900 text-lg">Win NFT Badge</div>
              <div className="text-sm text-gray-500">Score 5/5 to mint</div>
            </motion.div>
          </div>

          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            transition={{ delay: 0.5 }}
            className="pt-4"
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={startQuiz}
              className="w-full relative group overflow-hidden bg-black text-white font-bold py-6 px-8 rounded-2xl shadow-2xl transition-all duration-200 text-xl"
            >
              <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <span className="relative flex items-center justify-center gap-3">
                🚀 Start Quiz
              </span>
            </motion.button>
            <p className="text-xs text-gray-400 mt-4 font-medium uppercase tracking-widest">
              Week #42 is Live • 1,234 Players Participated
            </p>
          </motion.div>
        </motion.div>
      )}

      {/* LOADING SCREEN */}
      {gameState === 'loading' && (
        <SkeletonLoader />
      )}

      {/* QUIZ SCREEN */}
      {gameState === 'quiz' && questions.length > 0 && (
        <div className="w-full relative z-10">
          <QuizCard
            questions={questions}
            weekNumber={weekNumber}
            onComplete={handleQuizComplete}
          />
        </div>
      )}

      {/* RESULTS SCREEN */}
      {gameState === 'results' && quizResults && (
        <div className="w-full relative z-10">
          <ResultsCard
            score={quizResults.score}
            totalQuestions={quizResults.totalQuestions}
            weekNumber={quizResults.weekNumber}
            results={quizResults.results}
            onRetry={handleRetry}
          />
        </div>
      )}
    </div>
  );
}