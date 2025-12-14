import { NextResponse } from 'next/server';
import quizData from '@/app/data/quiz-questions.json';
import type { Question } from '@/app/types/quiz';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { answers } = body; // Array of { questionId: number, selectedIndex: number }

    if (!answers || !Array.isArray(answers)) {
      return NextResponse.json(
        { error: 'Invalid request format' },
        { status: 400 }
      );
    }

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

    return NextResponse.json({
      score: correctCount,
      totalQuestions: answers.length,
      isPerfectScore,
      results,
      weekNumber: quizData.weekNumber,
    });
  } catch (error) {
    console.error('Error submitting answers:', error);
    return NextResponse.json(
      { error: 'Failed to submit answers' },
      { status: 500 }
    );
  }
}
