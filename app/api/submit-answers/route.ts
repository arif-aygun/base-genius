import { NextResponse } from 'next/server';
import quizData from '@/app/data/quiz-questions.json';
import type { Question } from '@/app/types/quiz';
import { generateMintSignature } from '@/app/lib/signatureService';

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

    // === Step 2: Generate Mint Signature for Perfect Scores ===
    let mintSignature = '';
    let canMint = false;
    let mintError = '';

    // Only generate signature if user got perfect score and provided wallet
    if (isPerfectScore && walletAddress) {
      try {
        // Check if signer is configured
        if (!process.env.SIGNER_PRIVATE_KEY) {
          console.warn('SIGNER_PRIVATE_KEY not configured - cannot generate signature');
          mintError = 'Signature service not configured';
        } else {
          // Generate cryptographic signature proving user earned the badge
          console.log(`Generating mint signature for ${walletAddress}, week ${quizData.weekNumber}`);

          mintSignature = await generateMintSignature(
            walletAddress as `0x${string}`,
            quizData.weekNumber
          );

          canMint = true;

          console.log(`Signature generated successfully for week ${quizData.weekNumber}`);
        }
      } catch (error: any) {
        // Don't fail the entire request if signature generation fails
        console.error('Error generating signature:', error);
        mintError = error.message || 'Signature generation failed';
      }
    }

    // === Step 3: Return Results with Signature ===
    return NextResponse.json({
      score: correctCount,
      totalQuestions: answers.length,
      isPerfectScore,
      results,
      weekNumber: quizData.weekNumber,
      // New signature-based response
      canMint,
      mintSignature,
      mintError: mintError || undefined,
    });
  } catch (error) {
    console.error('Error submitting answers:', error);
    return NextResponse.json(
      { error: 'Failed to submit answers' },
      { status: 500 }
    );
  }
}
