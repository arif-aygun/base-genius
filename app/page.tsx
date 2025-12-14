"use client";
import { useEffect, useState } from "react";
import { useMiniKit } from "@coinbase/onchainkit/minikit";
import QuizCard from "./components/QuizCard";
import ResultsCard from "./components/ResultsCard";
import type { Question } from "./types/quiz";

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
      alert('Failed to load quiz. Please try again.');
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
      alert('Failed to submit quiz. Please try again.');
      setGameState('quiz');
    }
  };

  const handleRetry = () => {
    setGameState('welcome');
    setQuizResults(null);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      {gameState === 'welcome' && (
        <div className="w-full max-w-2xl mx-auto text-center space-y-8">
          <div className="space-y-4">
            <div className="text-6xl mb-4">🧠</div>
            <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Base Weekly News Quiz
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
          results={quizResults.results}
          onRetry={handleRetry}
        />
      )}
    </div>
  );
}
