'use client';
import { useAccount } from 'wagmi';
import MintBadgeButton from './MintBadgeButton';


interface ResultsCardProps {
    score: number;
    totalQuestions: number;
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
    onRetry: () => void;
}

export default function ResultsCard({
    score,
    totalQuestions,
    weekNumber,
    canMint,
    mintSignature,
    mintError,
    results,
    onRetry,
}: ResultsCardProps) {
    const isPerfectScore = score === totalQuestions;
    const percentage = Math.round((score / totalQuestions) * 100);
    const { address, isConnected } = useAccount();


    return (
        <div className="w-full max-w-2xl mx-auto p-6 space-y-6 animate-in fade-in slide-in-from-bottom-8 duration-700 relative">
            
            {/* --- BURASI ESKİ SKOR KARTI (AYNEN KALIYOR) --- */}
            <div className={`rounded-3xl shadow-2xl p-8 text-white text-center space-y-4 relative overflow-hidden transition-all duration-500
                ${isPerfectScore 
                    ? 'bg-gradient-to-br from-yellow-500 via-orange-500 to-red-500 ring-4 ring-yellow-300 ring-opacity-50' 
                    : 'bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700'
                }`}>
                
                <div className="absolute top-0 right-0 w-40 h-40 bg-white/20 rounded-full -mr-20 -mt-20 blur-3xl animate-pulse"></div>
                <div className="absolute bottom-0 left-0 w-32 h-32 bg-black/10 rounded-full -ml-16 -mb-16 blur-2xl"></div>
                
                <div className="relative z-10 flex flex-col items-center justify-center min-h-[200px]">
                    <div className="text-7xl mb-2 animate-bounce drop-shadow-lg">
                        {isPerfectScore ? "👑" : score >= 3 ? "😎" : "📚"}
                    </div>
                    <h1 className="text-4xl font-extrabold tracking-black italic drop-shadow-md uppercase leading-tight">
                        {title}
                    </h1>
                    <p className="text-white/90 font-medium text-lg mt-2">{subTitle}</p>
                    <div className="flex items-end justify-center gap-1 mt-6 bg-black/20 backdrop-blur-sm px-8 py-2 rounded-2xl border border-white/10">
                        <span className="text-7xl font-black tracking-tighter drop-shadow-xl leading-none">{score}</span>
                        <span className="text-3xl font-bold opacity-80 mb-2 leading-none">/{totalQuestions}</span>
                    </div>
                </div>
            </div>

            {/* MINT KARTI & BUTONU */}
            {isPerfectScore && (
                <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border-2 border-yellow-400 rounded-xl p-6 text-center space-y-3">
                    <div className="text-4xl">🎖️</div>
                    <h3 className="text-xl font-bold text-gray-900">
                        You've earned an NFT badge!
                    </h3>
                    <p className="text-gray-600">
                        Claim your exclusive "Week {weekNumber} BaseGenius" badge on Base blockchain
                    </p>
                    <MintBadgeButton
                        weekNumber={weekNumber}
                        mintSignature={mintSignature}
                        canMint={canMint || false}
                        mintError={mintError}
                        onMintSuccess={(txHash) => {
                            console.log('NFT minted! Transaction:', txHash);
                        }}
                    />
                </div>
            )}

            {/* --- BUTONLAR VE LİSTE AYNI KALIYOR --- */}
            <div className="space-y-3">
                {!isPerfectScore && (
                    <button onClick={onRetry} className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold py-4 rounded-xl shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all">
                         Try Again & Win NFT 🔄
                    </button>
                )}
                {isPerfectScore && (
                     <button onClick={onRetry} className="w-full text-gray-500 font-semibold hover:text-gray-700 py-2">
                         Play again just for fun
                    </button>
                )}
            </div>
            
            <div className="space-y-4 pt-2">
                <h3 className="text-lg font-black text-gray-800 uppercase tracking-wider ml-2">Review</h3>
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
                        <p className="text-gray-800 font-medium leading-relaxed">{result.explanation}</p>
                    </div>
                ))}
            </div>

            {/* MODAL (AYNI KALIYOR) */}
            <AnimatePresence>
                {showRewardModal && (
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
                    >
                        <motion.div 
                            initial={{ scale: 0.5, y: 50 }}
                            animate={{ scale: 1, y: 0 }}
                            className="bg-white rounded-[2rem] p-8 max-w-sm w-full text-center relative overflow-hidden shadow-2xl border-4 border-yellow-400"
                        >
                            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-yellow-100/50 to-transparent pointer-events-none"></div>

                            <motion.div 
                                initial={{ scale: 0, rotate: -180 }}
                                animate={{ scale: 1, rotate: 0 }}
                                transition={{ type: "spring", bounce: 0.5, delay: 0.2 }}
                                className="w-40 h-40 mx-auto mb-6 bg-gradient-to-br from-yellow-300 to-orange-500 rounded-full flex items-center justify-center shadow-lg ring-8 ring-yellow-100"
                            >
                                <span className="text-7xl">🦄</span>
                            </motion.div>

                            <h2 className="text-3xl font-black text-gray-900 mb-2 uppercase tracking-tighter">
                                Badge Received!
                            </h2>
                            <p className="text-gray-600 mb-8 font-medium">
                                "Week #{weekNumber} Master" badge has been sent to your wallet.
                            </p>

                            <button 
                                onClick={() => setShowRewardModal(false)}
                                className="w-full bg-black text-white font-bold py-4 rounded-xl shadow-xl hover:scale-[1.02] transition-transform"
                            >
                                CLOSE & FLEX 💪
                            </button>
                            
                            <div className="mt-4">
                                <a href="#" className="text-xs text-blue-500 font-bold hover:underline">VIEW ON EXPLORER ↗</a>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

        </div>
    );
}