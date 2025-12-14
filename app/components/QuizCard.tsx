'use client';

import { useState } from 'react';
import type { Question } from '@/app/types/quiz';

interface QuizCardProps {
    questions: Question[];
    weekNumber: number;
    onComplete: (answers: { questionId: number; selectedIndex: number }[]) => void;
}

export default function QuizCard({ questions, weekNumber, onComplete }: QuizCardProps) {
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [selectedAnswers, setSelectedAnswers] = useState<(number | null)[]>(
        Array(questions.length).fill(null)
    );
    const [showFeedback, setShowFeedback] = useState(false);

    const currentQuestion = questions[currentQuestionIndex];
    const progress = ((currentQuestionIndex + 1) / questions.length) * 100;

    const handleAnswerSelect = (optionIndex: number) => {
        const newAnswers = [...selectedAnswers];
        newAnswers[currentQuestionIndex] = optionIndex;
        setSelectedAnswers(newAnswers);
        setShowFeedback(true);
    };

    const handleNext = () => {
        setShowFeedback(false);
        if (currentQuestionIndex < questions.length - 1) {
            setCurrentQuestionIndex(currentQuestionIndex + 1);
        } else {
            // Quiz complete - submit answers
            const answers = questions.map((q, index) => ({
                questionId: q.id,
                selectedIndex: selectedAnswers[index] ?? 0,
            }));
            onComplete(answers);
        }
    };

    const selectedAnswer = selectedAnswers[currentQuestionIndex];

    return (
        <div className="w-full max-w-2xl mx-auto p-6 space-y-6">
            {/* Header */}
            <div className="text-center space-y-2">
                <p className="text-sm text-gray-500">Week {weekNumber} • Base News Quiz</p>
                <div className="flex items-center justify-center gap-2 text-sm font-medium">
                    <span className="text-blue-600">Question {currentQuestionIndex + 1}</span>
                    <span className="text-gray-400">/</span>
                    <span className="text-gray-600">{questions.length}</span>
                </div>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                    className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${progress}%` }}
                />
            </div>

            {/* Question Card */}
            <div className="bg-white rounded-2xl shadow-lg p-8 space-y-6 border border-gray-100">
                <h2 className="text-2xl font-bold text-gray-900 leading-tight">
                    {currentQuestion.question}
                </h2>

                {/* Difficulty Badge */}
                <div className="flex gap-2">
                    <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${currentQuestion.difficulty === 'easy'
                                ? 'bg-green-100 text-green-700'
                                : currentQuestion.difficulty === 'medium'
                                    ? 'bg-yellow-100 text-yellow-700'
                                    : 'bg-red-100 text-red-700'
                            }`}
                    >
                        {currentQuestion.difficulty}
                    </span>
                    <span className="px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
                        {currentQuestion.category}
                    </span>
                </div>

                {/* Answer Options */}
                <div className="space-y-3">
                    {currentQuestion.options.map((option, index) => {
                        const isSelected = selectedAnswer === index;
                        return (
                            <button
                                key={index}
                                onClick={() => !showFeedback && handleAnswerSelect(index)}
                                disabled={showFeedback}
                                className={`w-full text-left p-4 rounded-xl border-2 transition-all duration-200 ${isSelected
                                        ? 'border-blue-500 bg-blue-50'
                                        : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50'
                                    } ${showFeedback ? 'cursor-not-allowed opacity-75' : 'cursor-pointer'}`}
                            >
                                <div className="flex items-center gap-3">
                                    <div
                                        className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${isSelected
                                                ? 'border-blue-500 bg-blue-500'
                                                : 'border-gray-300'
                                            }`}
                                    >
                                        {isSelected && (
                                            <div className="w-2 h-2 rounded-full bg-white" />
                                        )}
                                    </div>
                                    <span className="font-medium text-gray-900">{option}</span>
                                </div>
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Next Button */}
            {showFeedback && (
                <button
                    onClick={handleNext}
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-[1.02]"
                >
                    {currentQuestionIndex < questions.length - 1 ? 'Next Question →' : 'See Results 🎉'}
                </button>
            )}
        </div>
    );
}
