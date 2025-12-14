import { createPublicClient, http } from 'viem';
import { base, baseSepolia } from 'viem/chains';
import { BaseGeniusBadgeABI } from '../contracts/BaseGeniusBadgeABI';

// Environment configuration - support both server and client side
const CONTRACT_ADDRESS = (process.env.NEXT_PUBLIC_NFT_CONTRACT_ADDRESS || process.env.NFT_CONTRACT_ADDRESS) as `0x${string}`;
const CHAIN_ID = process.env.NEXT_PUBLIC_CHAIN_ID || process.env.CHAIN_ID || '84532'; // Default to Base Sepolia

// Select the appropriate chain
const chain = CHAIN_ID === '8453' ? base : baseSepolia;

// Public client for reading contract data (read-only, no private keys needed)
export const publicClient = createPublicClient({
    chain,
    transport: http(),
});

/**
 * Get contract address for frontend use
 */
export function getContractAddress(): `0x${string}` | null {
    return CONTRACT_ADDRESS || null;
}

/**
 * Get the chain configuration
 */
export function getChain() {
    return chain;
}

/**
 * Check if a user has already claimed a badge for a specific week
 * @param userAddress - User's wallet address
 * @param weekNumber - Week number to check
 * @returns True if user has already claimed this week's badge
 */
export async function hasUserClaimedWeek(
    userAddress: `0x${string}`,
    weekNumber: number
): Promise<boolean> {
    if (!CONTRACT_ADDRESS) {
        throw new Error('NFT_CONTRACT_ADDRESS not configured');
    }

    try {
        const hasClaimed = await publicClient.readContract({
            address: CONTRACT_ADDRESS,
            abi: BaseGeniusBadgeABI,
            functionName: 'hasClaimed',
            args: [userAddress, BigInt(weekNumber)],
        }) as boolean;

        return hasClaimed;
    } catch (error) {
        console.error('Error checking claim status:', error);
        throw error;
    }
}

/**
 * Get all token IDs owned by a user
 * @param userAddress - User's wallet address
 * @returns Array of token IDs owned by the user
 */
export async function getUserTokens(
    userAddress: `0x${string}`
): Promise<bigint[]> {
    if (!CONTRACT_ADDRESS) {
        throw new Error('NFT_CONTRACT_ADDRESS not configured');
    }

    try {
        const tokens = await publicClient.readContract({
            address: CONTRACT_ADDRESS,
            abi: BaseGeniusBadgeABI,
            functionName: 'tokensOfOwner',
            args: [userAddress],
        }) as readonly bigint[];

        return [...tokens]; // Spread to create mutable copy
    } catch (error) {
        console.error('Error fetching user tokens:', error);
        return [];
    }
}

/**
 * Get the metadata URI for a token
 * @param tokenId - Token ID to query
 * @returns Token URI string
 */
export async function getTokenURI(tokenId: bigint): Promise<string> {
    if (!CONTRACT_ADDRESS) {
        throw new Error('NFT_CONTRACT_ADDRESS not configured');
    }

    try {
        const uri = await publicClient.readContract({
            address: CONTRACT_ADDRESS,
            abi: BaseGeniusBadgeABI,
            functionName: 'tokenURI',
            args: [tokenId],
        }) as string;

        return uri;
    } catch (error) {
        console.error('Error fetching token URI:', error);
        throw error;
    }
}

/**
 * Get the week number for a specific token
 * @param tokenId - Token ID to query
 * @returns Week number
 */
export async function getTokenWeek(tokenId: bigint): Promise<number> {
    if (!CONTRACT_ADDRESS) {
        throw new Error('NFT_CONTRACT_ADDRESS not configured');
    }

    try {
        const week = await publicClient.readContract({
            address: CONTRACT_ADDRESS,
            abi: BaseGeniusBadgeABI,
            functionName: 'getTokenWeek',
            args: [tokenId],
        }) as bigint;

        return Number(week);
    } catch (error) {
        console.error('Error fetching token week:', error);
        throw error;
    }
}

/**
 * Verify a signature is valid (for testing/debugging)
 * @param userAddress - User's wallet address
 * @param weekNumber - Week number
 * @param signature - Signature to verify
 * @returns True if signature is valid
 */
export async function verifySignature(
    userAddress: `0x${string}`,
    weekNumber: number,
    signature: `0x${string}`
): Promise<boolean> {
    if (!CONTRACT_ADDRESS) {
        throw new Error('NFT_CONTRACT_ADDRESS not configured');
    }

    try {
        const isValid = await publicClient.readContract({
            address: CONTRACT_ADDRESS,
            abi: BaseGeniusBadgeABI,
            functionName: 'verifySignature',
            args: [userAddress, BigInt(weekNumber), signature],
        }) as boolean;

        return isValid;
    } catch (error) {
        console.error('Error verifying signature:', error);
        return false;
    }
}
