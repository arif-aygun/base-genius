'use client';

import confetti from 'canvas-confetti';
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAccount, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { BaseGeniusBadgeABI } from '../contracts/BaseGeniusBadgeABI';
import { getContractAddress, getChain } from '../lib/nftService';

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
    const [title, setTitle] = useState("");
    const [subTitle, setSubTitle] = useState("");

    // Mint Durumu
    const [mintStatus, setMintStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
    const [showRewardModal, setShowRewardModal] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    // Wagmi Hooks
    const { address, isConnected } = useAccount();
    const { writeContract, data: hash, error: writeError } = useWriteContract();
    const {
        isLoading: isConfirming,
        isSuccess: isConfirmed,
        isError: isReceiptError,
        error: receiptError
    } = useWaitForTransactionReceipt({
        hash,
    });

    const contractAddress = getContractAddress();
    const chain = getChain();

    // --- PUANA GÖRE METİN SEÇİCİ (YENİ) ---
    useEffect(() => {
        // 5/5: MÜKEMMEL
        if (score === 5) {
            const titles = ["ABSOLUTE LEGEND 🔵", "BIG BRAIN ENERGY 🧠", "YOU ARE BASED 🎩", "GOD MODE: ON ⚡"];
            const subs = ["Unstoppable. You own the network.", "Too easy for you? Next week will be harder.", "Vitalik would be proud.", "Mint that badge ASAP!"];
            const rand = Math.floor(Math.random() * titles.length);
            setTitle(titles[rand]);
            setSubTitle(subs[rand]);
        }
        // 4/5: ÇOK YAKIN
        else if (score === 4) {
            setTitle("SO CLOSE! 🤏");
            setSubTitle("Just one mistake! Don't give up.");
        }
        // 3/5: ORTA
        else if (score === 3) {
            setTitle("NOT BAD 👍");
            setSubTitle("You know your stuff, but can do better.");
        }
        // 2/5: ZAYIF
        else if (score === 2) {
            setTitle("STILL EARLY 🌅");
            setSubTitle("You need to spend more time onchain.");
        }
        // 1/5: KÖTÜ
        else if (score === 1) {
            setTitle("NGMI (YET) 📉");
            setSubTitle("Have you been living under a rock?");
        }
        // 0/5: REZALET
        else {
            setTitle("TOTALLY REKT 💀");
            setSubTitle("Ouch. Did you even read the questions?");
        }
    }, [score]);

    // Transaction Status Effects
    useEffect(() => {
        if (isConfirming) {
            setMintStatus('loading');
        } else if (isConfirmed) {
            setMintStatus('success');
            setShowRewardModal(true);
        } else if (isReceiptError) {
            setMintStatus('error');
            setErrorMessage(receiptError?.message || 'Transaction reverted on-chain');
        } else if (writeError) {
            setMintStatus('error');
            setErrorMessage(writeError.message || 'Transaction failed');
        }

        if (hash) {
            console.log("Transaction Hash:", hash);
        }
    }, [isConfirming, isConfirmed, isReceiptError, receiptError, writeError, hash]);

    // İLK KONFETİ (Sadece 5/5 olunca)
    useEffect(() => {
        if (isPerfectScore) {
            const duration = 2000;
            const end = Date.now() + duration;
            (function frame() {
                const colors = ['#0052FF', '#FFD700', '#ffffff'];
                confetti({ particleCount: 3, angle: 60, spread: 55, origin: { x: 0 }, colors: colors });
                confetti({ particleCount: 3, angle: 120, spread: 55, origin: { x: 1 }, colors: colors });
                if (Date.now() < end) requestAnimationFrame(frame);
            }());
        }
    }, [isPerfectScore]);

    // MINT BUTONU FONKSİYONU
    const handleClaim = () => {
        if (mintStatus === 'loading') return;

        if (!isConnected || !address) {
            setErrorMessage('Please connect your wallet first');
            return;
        }

        if (!contractAddress) {
            setErrorMessage('Contract address not configured');
            return;
        }

        if (!mintSignature || !canMint) {
            setErrorMessage(mintError || 'Minting not available yet');
            return;
        }

        setMintStatus('loading');
        setErrorMessage(null);

        writeContract({
            address: contractAddress,
            abi: BaseGeniusBadgeABI,
            functionName: 'mintWeeklyBadge',
            args: [BigInt(weekNumber), mintSignature as `0x${string}`],
            chain,
        }, {
            onError: (err) => {
                console.error("Mint error:", err);
                setMintStatus('error');

                // Friendly error message
                if (err.message.includes("User denied") || err.message.includes("rejected")) {
                    setErrorMessage("Transaction rejected by user");
                } else if (err.message.includes("Already claimed") || err.message.includes("already claimed")) {
                    setErrorMessage("You already claimed this week's badge! 🏅");
                } else {
                    // Truncate very long error messages
                    setErrorMessage(err.message.length > 50 ? "Transaction failed: " + err.message.slice(0, 50) + "..." : err.message);
                }
            }
        });
    };

    return (
        <div className="w-full max-w-2xl mx-auto p-6 space-y-6 animate-in fade-in slide-in-from-bottom-8 duration-700 relative">

            {/* --- SKOR KARTI --- */}
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

            {/* --- MINT KARTI (Heartbeat Animasyonlu) --- */}
            {isPerfectScore && (
                <motion.div
                    animate={{ scale: [1, 1.02, 1] }} // Kalp atışı
                    transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                    className="bg-gradient-to-r from-yellow-50 to-amber-50 border-2 border-yellow-400 rounded-2xl p-1 shadow-lg"
                >
                    <div className="bg-white/50 backdrop-blur-sm rounded-xl p-6 text-center space-y-4">
                        <h3 className="text-2xl font-black text-yellow-800 uppercase tracking-wide">
                            🎉 Reward Unlocked!
                        </h3>
                        <p className="text-gray-700 font-medium">
                            You proved you are <b>Based</b>. Claim your exclusive NFT badge now.
                        </p>

                        {errorMessage && (
                            <div className="p-3 bg-red-100 text-red-700 rounded-lg text-sm font-bold">
                                {errorMessage}
                            </div>
                        )}

                        <button
                            onClick={handleClaim}
                            disabled={mintStatus === 'loading' || !canMint || mintStatus === 'success'}
                            className={`w-full font-bold py-4 rounded-xl shadow-xl transition-all duration-300 flex items-center justify-center gap-3 text-lg overflow-hidden relative
                                ${mintStatus === 'success'
                                    ? 'bg-green-600 text-white'
                                    : mintStatus === 'loading'
                                        ? 'bg-gray-800 text-gray-300 cursor-wait'
                                        : !canMint
                                            ? 'bg-gray-400 cursor-not-allowed'
                                            : 'bg-black text-white hover:scale-[1.02] hover:bg-gray-900'
                                }
                            `}
                        >
                            {mintStatus === 'loading' && (
                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                            )}
                            <span>
                                {mintStatus === 'idle' && "MINT BADGE 💎"}
                                {mintStatus === 'loading' && "CONFIRMING..."}
                                {mintStatus === 'success' && "MINTED! ✨"}
                                {mintStatus === 'error' && "TRY AGAIN ⚠️"}
                            </span>
                        </button>
                        {!isConnected && (
                            <p className="text-xs text-red-500 font-bold">Please connect wallet first ⬆️</p>
                        )}
                    </div>
                </motion.div>
            )}

            {/* --- BUTONLAR --- */}
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

            {/* --- CEVAP LİSTESİ --- */}
            <div className="space-y-4 pt-2">
                <h3 className="text-lg font-black text-gray-800 uppercase tracking-wider ml-2">Review</h3>
                {results.map((result, index) => (
                    <div key={result.questionId} className={`rounded-2xl border-l-8 p-5 shadow-sm transition-all ${result.correct ? 'border-green-500 bg-white' : 'border-red-500 bg-white'}`}>
                        <div className="flex justify-between items-center mb-1">
                            <p className="font-bold text-gray-400 text-xs uppercase">Question {index + 1}</p>
                            <span className={`text-xs font-bold px-2 py-1 rounded ${result.correct ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                {result.correct ? 'CORRECT' : 'WRONG'}
                            </span>
                        </div>
                        <p className="text-gray-800 font-medium leading-relaxed">{result.explanation}</p>
                    </div>
                ))}
            </div>

            {/* --- MODAL (POP-UP) --- */}
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
                                className="w-40 h-40 mx-auto mb-6 bg-gradient-to-br from-blue-500 to-blue-700 rounded-full flex items-center justify-center shadow-lg ring-8 ring-blue-100"
                            >
                                {/* UNICORN YERİNE BASE MAVİSİ GELDİ */}
                                <span className="text-7xl">🔵</span>
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
                                <a
                                    href={`https://sepolia.basescan.org/tx/${hash}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-xs text-blue-500 font-bold hover:underline"
                                >
                                    VIEW ON EXPLORER ↗
                                </a>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}