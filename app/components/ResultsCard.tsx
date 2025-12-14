'use client';

interface ResultsCardProps {
    score: number;
    totalQuestions: number;
    weekNumber: number;
    results: {
        questionId: number;
        correct: boolean;
        correctIndex: number;
        explanation: string;
        sourceUrl: string;
    }[];
    onRetry: () => void;
}

export default function ResultsCard({
    score,
    totalQuestions,
    weekNumber,
    results,
    onRetry,
}: ResultsCardProps) {
    const isPerfectScore = score === totalQuestions;
    const percentage = Math.round((score / totalQuestions) * 100);

    return (
        <div className="w-full max-w-2xl mx-auto p-6 space-y-6">
            {/* Results Header */}
            <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl shadow-xl p-8 text-white text-center space-y-4">
                {isPerfectScore && (
                    <div className="text-6xl animate-bounce">🏆</div>
                )}
                <h1 className="text-3xl font-bold">
                    {isPerfectScore
                        ? "Perfect Score!"
                        : score >= 3
                            ? "Great Job!"
                            : "Keep Learning!"}
                </h1>
                <div className="text-6xl font-bold">
                    {score}/{totalQuestions}
                </div>
                <p className="text-xl opacity-90">{percentage}% Correct</p>
                <p className="text-sm opacity-75">Week {weekNumber} News Quiz</p>
            </div>

            {/* Perfect Score CTA */}
            {isPerfectScore && (
                <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border-2 border-yellow-400 rounded-xl p-6 text-center space-y-3">
                    <div className="text-4xl">🎖️</div>
                    <h3 className="text-xl font-bold text-gray-900">
                        You've earned an NFT badge!
                    </h3>
                    <p className="text-gray-600">
                        Claim your "Week {weekNumber} News Genius" badge on Base blockchain
                    </p>
                    <button className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 text-white font-bold py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-[1.02]">
                        🎁 Claim Your Badge
                    </button>
                </div>
            )}

            {/* Action Buttons */}
            <div className="space-y-3">
                <button
                    onClick={onRetry}
                    className="w-full bg-blue-600 text-white font-bold py-4 rounded-xl shadow-md hover:bg-blue-700 transition-colors"
                >
                    {isPerfectScore ? "🎯 Try Again with New Questions" : "🔄 Retake Quiz"}
                </button>

                {!isPerfectScore && (
                    <div className="text-center">
                        <p className="text-sm text-gray-500">
                            Get 5/5 correct to claim an NFT badge!
                        </p>
                    </div>
                )}
            </div>

            {/* Answer Review */}
            <div className="space-y-4">
                <h3 className="text-lg font-bold text-gray-900">Review Answers</h3>
                {results.map((result, index) => (
                    <div
                        key={result.questionId}
                        className={`rounded-xl border-2 p-4 ${result.correct
                                ? 'border-green-200 bg-green-50'
                                : 'border-red-200 bg-red-50'
                            }`}
                    >
                        <div className="flex items-start gap-3">
                            <div
                                className={`text-2xl ${result.correct ? 'text-green-600' : 'text-red-600'
                                    }`}
                            >
                                {result.correct ? '✓' : '✗'}
                            </div>
                            <div className="flex-1 space-y-2">
                                <p className="font-medium text-gray-900">Question {index + 1}</p>
                                <p className="text-sm text-gray-700">{result.explanation}</p>
                                {result.sourceUrl && (
                                    <a
                                        href={result.sourceUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-xs text-blue-600 hover:underline inline-flex items-center gap-1"
                                    >
                                        View source →
                                    </a>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Share Section */}
            <div className="text-center pt-4 border-t border-gray-200">
                <p className="text-sm text-gray-500 mb-3">Share your score on Farcaster</p>
                <button className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm font-medium">
                    📢 Share Score
                </button>
            </div>
        </div>
    );
}
