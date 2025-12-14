import { createWalletClient, http, toHex, encodePacked, keccak256 } from 'viem';
import { baseSepolia, base } from 'viem/chains';
import { privateKeyToAccount } from 'viem/accounts';

// Signer private key (only used for signing, not for transactions)
const SIGNER_PRIVATE_KEY = process.env.SIGNER_PRIVATE_KEY as `0x${string}`;
const CHAIN_ID = process.env.CHAIN_ID || '84532';

// Select the appropriate chain
const chain = CHAIN_ID === '8453' ? base : baseSepolia;

// Create account from private key for signing
const signerAccount = SIGNER_PRIVATE_KEY
    ? privateKeyToAccount(SIGNER_PRIVATE_KEY)
    : null;

/**
 * Generate a signature proving user earned the right to mint a badge
 * @param userAddress - Address of the user who completed the quiz
 * @param weekNumber - Week number the user earned
 * @returns Signature string that user can use to mint
 */
export async function generateMintSignature(
    userAddress: `0x${string}`,
    weekNumber: number
): Promise<string> {
    if (!signerAccount) {
        throw new Error('SIGNER_PRIVATE_KEY not configured');
    }

    console.log('Generating mint signature for', userAddress, 'week', weekNumber);

    // Create the message hash exactly as the contract does:
    // keccak256(abi.encodePacked(msg.sender, weekNumber))
    const messageHash = keccak256(
        encodePacked(
            ['address', 'uint256'],
            [userAddress, BigInt(weekNumber)]
        )
    );

    // Sign the message hash (viem automatically applies toEthSignedMessageHash)
    const signature = await signerAccount.signMessage({
        message: { raw: messageHash }
    });

    console.log('Signature generated successfully for week', weekNumber);

    return signature;
}

/**
 * Verify if a signature is valid (for testing purposes)
 */
export function getSignerAddress(): string | null {
    return signerAccount?.address || null;
}
