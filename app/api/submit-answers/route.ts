import { NextResponse } from 'next/server';
import quizData from '@/app/data/quiz-questions.json';
import type { Question } from '@/app/types/quiz';
import { ethers } from 'ethers';
import { NFTStorage } from 'nft.storage';

const NFT_STORAGE_KEY = process.env.NFT_STORAGE_KEY || '';
const CONTRACT_ADDRESS = process.env.NFT_CONTRACT_ADDRESS || '';
const DEPLOYER_PRIVATE_KEY = process.env.DEPLOYER_PRIVATE_KEY || '';
const RPC_URL = process.env.BASE_SEPOLIA_RPC_URL || 'https://sepolia.base.org';

const CONTRACT_ABI = [
  'function adminMint(address to, string quizId, string tokenURI) external',
  'event QuizMinted(address indexed to, uint256 indexed tokenId, string quizId, string tokenURI)',
];

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { answers, walletAddress } = body;

    if (!answers || !Array.isArray(answers)) {
      return NextResponse.json(
        { error: 'Invalid request format' },
        { status: 400 }
      );
    }

    // === Step 1: Validate Quiz Answers (Server-side) ===
    let correctCount = 0;
    const results = answers.map((answer: { questionId: number; selectedIndex: number }) => {
      const question = quizData.questions.find(
        (q) => q.id === answer.questionId
      ) as Question;

      if (!question) {
        return {
          questionId: answer.questionId,
          correct: false,
          explanation: 'Question not found',
          correctIndex: 0,
          sourceUrl: '',
        };
      }

      const isCorrect = answer.selectedIndex === question.correctIndex;
      if (isCorrect) correctCount++;

      return {
        questionId: answer.questionId,
        correct: isCorrect,
        correctIndex: question.correctIndex,
        explanation: question.explanation,
        sourceUrl: question.sourceUrl,
      };
    });

    const isPerfectScore = correctCount === 5;

    // === Step 2: If Perfect Score + Wallet, Mint NFT ===
    let nftMinted = false;
    let nftTxHash = '';
    let nftTokenId = '';

    if (isPerfectScore && walletAddress && NFT_STORAGE_KEY && CONTRACT_ADDRESS && DEPLOYER_PRIVATE_KEY) {
      try {
        console.log('Perfect score detected! Starting NFT mint...');
        
        // Generate unique quiz ID
        const quizId = `week-${quizData.weekNumber}-${Date.now()}`;

        // Upload metadata to IPFS
        const tokenURI = await uploadMetadataToIPFS(
          quizId,
          correctCount,
          quizData.weekNumber,
          walletAddress
        );

        console.log('Metadata uploaded to IPFS:', tokenURI);

        // Mint NFT via adminMint
        const mintResult = await mintNFT(walletAddress, quizId, tokenURI);
        nftMinted = true;
        nftTxHash = mintResult.txHash;
        nftTokenId = mintResult.tokenId;

        console.log('NFT minted successfully!', { txHash: nftTxHash, tokenId: nftTokenId });
      } catch (error) {
        console.error('NFT minting failed:', error);
        // Don't fail the whole request if NFT mint fails
        // User still gets their quiz results
      }
    }

    return NextResponse.json({
      score: correctCount,
      totalQuestions: answers.length,
      isPerfectScore,
      results,
      weekNumber: quizData.weekNumber,
      nftMinted,
      nftTxHash,
      nftTokenId,
    });
  } catch (error) {
    console.error('Error submitting answers:', error);
    return NextResponse.json(
      { error: 'Failed to submit answers' },
      { status: 500 }
    );
  }
}

// === Helper: Upload metadata to IPFS via NFT.Storage ===
async function uploadMetadataToIPFS(
  quizId: string,
  score: number,
  weekNumber: number,
  userAddress: string
) {
  const client = new NFTStorage({ token: NFT_STORAGE_KEY });

  // Fetch the image and convert to Blob
  const imageUrl = 'https://via.placeholder.com/500x500?text=News+Genius+Badge'; // Replace with actual badge image
  const imageResponse = await fetch(imageUrl);
  const imageBlob = await imageResponse.blob();

  const metadata = {
    name: `Week ${weekNumber} News Genius Badge`,
    description: `Perfect score (5/5) on Base Weekly News Quiz - Week ${weekNumber}. You're a true Base news expert!`,
    image: imageBlob, // Now it's a Blob, not a string
    attributes: [
      { trait_type: 'Week', value: weekNumber },
      { trait_type: 'Score', value: score },
      { trait_type: 'Quiz ID', value: quizId },
      { trait_type: 'Achievement', value: 'News Genius' },
      { trait_type: 'Owner', value: userAddress },
    ],
  };

  const stored = await client.store(metadata);
  return `ipfs://${stored.ipnft}`;
}

// === Helper: Mint NFT via adminMint ===
async function mintNFT(toAddress: string, quizId: string, tokenURI: string) {
  const provider = new ethers.JsonRpcProvider(RPC_URL);
  const signer = new ethers.Wallet(DEPLOYER_PRIVATE_KEY, provider);
  const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);

  const tx = await contract.adminMint(toAddress, quizId, tokenURI);
  const receipt = await tx.wait();

  // Extract tokenId from event
  let tokenId = '';
  const iface = new ethers.Interface(CONTRACT_ABI);
  for (const log of receipt?.logs || []) {
    try {
      const parsed = iface.parseLog(log);
      if (parsed && parsed.name === 'QuizMinted') {
        tokenId = parsed.args?.tokenId?.toString() || '';
        break;
      }
    } catch (e) {
      // Ignore parsing errors
    }
  }

  return {
    txHash: receipt?.hash || '',
    tokenId,
  };
}
