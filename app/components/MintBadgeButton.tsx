'use client';
import { useState } from 'react';
import { useAccount, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { BaseGeniusBadgeABI } from '../contracts/BaseGeniusBadgeABI';
import { getContractAddress, getChain } from '../lib/nftService';

interface MintBadgeButtonProps {
    weekNumber: number;
    mintSignature?: string;
    canMint: boolean;
    mintError?: string;
    onMintSuccess?: (txHash: string, tokenId?: string) => void;
}

export default function MintBadgeButton({
    weekNumber,
    mintSignature,
    canMint,
    mintError,
    onMintSuccess,
}: MintBadgeButtonProps) {
    const { address, isConnected } = useAccount();
    const [isMinting, setIsMinting] = useState(false);
    const [mintTxHash, setMintTxHash] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    const { writeContract } = useWriteContract();
    const { data: receipt, isLoading: isWaitingForReceipt } = useWaitForTransactionReceipt({
        hash: mintTxHash as `0x${string}`,
    });

    const contractAddress = getContractAddress();
    const chain = getChain();

    const handleMint = async () => {
        if (!isConnected || !address) {
            setError('Please connect your wallet first');
            return;
        }

        if (!contractAddress) {
            setError('Contract address not configured');
            return;
        }

        if (!mintSignature || !canMint) {
            setError('Mint signature not available');
            return;
        }

        setIsMinting(true);
        setError(null);

        try {
            // Call the contract's mintWeeklyBadge function
            writeContract(
                {
                    address: contractAddress,
                    abi: BaseGeniusBadgeABI,
                    functionName: 'mintWeeklyBadge',
                    args: [BigInt(weekNumber), mintSignature as `0x${string}`],
                    chain,
                },
                {
                    onSuccess: (hash) => {
                        console.log('Transaction sent:', hash);
                        setMintTxHash(hash);
                    },
                    onError: (error) => {
                        console.error('Transaction failed:', error);
                        setError(error.message || 'Transaction failed');
                        setIsMinting(false);
                    },
                }
            );
        } catch (err: any) {
            console.error('Minting error:', err);
            setError(err.message || 'Failed to mint NFT');
            setIsMinting(false);
        }
    };

    // Handle successful minting
    if (receipt && mintTxHash) {
        if (onMintSuccess) {
            onMintSuccess(mintTxHash);
        }

        return (
            <div className="space-y-3">
                <div className="bg-green-50 border-2 border-green-400 rounded-xl p-4 text-center">
                    <div className="text-3xl mb-2">✅</div>
                    <h3 className="text-lg font-bold text-green-600 mb-1">
                        NFT Badge Claimed!
                    </h3>
                    <p className="text-sm text-gray-600 mb-3">
                        Your Week {weekNumber} badge has been minted to your wallet
                    </p>
                    <a
                        href={`https://sepolia.basescan.org/tx/${mintTxHash}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-block bg-blue-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors text-sm"
                    >
                        View on BaseScan →
                    </a>
                </div>
            </div>
        );
    }

    // Show error state
    if (error || mintError) {
        return (
            <div className="space-y-3">
                <div className="bg-red-50 border-2 border-red-400 rounded-xl p-4 text-center">
                    <div className="text-3xl mb-2">⚠️</div>
                    <h3 className="text-lg font-bold text-red-600 mb-1">
                        Minting Not Available
                    </h3>
                    <p className="text-sm text-gray-600">
                        {error || mintError}
                    </p>
                </div>
            </div>
        );
    }

    // Show loading state during transaction
    if (isMinting || isWaitingForReceipt) {
        return (
            <div className="bg-blue-50 border-2 border-blue-400 rounded-xl p-6 text-center">
                <div className="animate-spin text-4xl mb-2">⚡</div>
                <h3 className="text-lg font-bold text-blue-600 mb-1">
                    {isWaitingForReceipt ? 'Confirming Transaction...' : 'Preparing to Mint...'}
                </h3>
                <p className="text-sm text-gray-600">
                    Please confirm the transaction in your wallet
                </p>
            </div>
        );
    }

    // Show mint button
    if (!isConnected) {
        return (
            <div className="bg-amber-50 border-2 border-amber-400 rounded-xl p-4 text-center">
                <div className="text-3xl mb-2">🔌</div>
                <h3 className="text-lg font-bold text-gray-900 mb-1">
                    Connect Wallet to Claim
                </h3>
                <p className="text-sm text-gray-600">
                    Connect your wallet at the top of the page to claim your NFT badge
                </p>
            </div>
        );
    }

    return (
        <div className="space-y-3">
            <button
                onClick={handleMint}
                disabled={!canMint || !mintSignature}
                className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold py-4 px-6 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-200 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
                🎖️ Claim Your NFT Badge
            </button>
            <p className="text-xs text-center text-gray-500">
                You'll need to confirm the transaction in your wallet
            </p>
        </div>
    );
}
