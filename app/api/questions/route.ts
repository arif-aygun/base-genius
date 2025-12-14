import { NextResponse } from 'next/server';
import quizData from '@/app/data/quiz-questions.json';
import type { Question } from '@/app/types/quiz';

// Fisher-Yates shuffle algorithm
function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const excludeParam = searchParams.get('exclude');
    const difficultyParam = searchParams.get('difficulty');

    let availableQuestions = quizData.questions as Question[];

    // Filter by difficulty if specified
    if (difficultyParam) {
      availableQuestions = availableQuestions.filter(
        (q) => q.difficulty === difficultyParam
      );
    }

    // Exclude specific question IDs if specified
    if (excludeParam) {
      const excludeIds = excludeParam.split(',').map(Number);
      availableQuestions = availableQuestions.filter(
        (q) => !excludeIds.includes(q.id)
      );
    }

    // Shuffle and pick 5 random questions
    const shuffled = shuffleArray(availableQuestions);
    const selectedQuestions = shuffled.slice(0, 5);

    // Remove correct answers from response (anti-cheat)
    const questionsWithoutAnswers = selectedQuestions.map((q) => ({
      id: q.id,
      question: q.question,
      options: q.options,
      difficulty: q.difficulty,
      category: q.category,
      // correctIndex is intentionally omitted
    }));

    return NextResponse.json({
      weekNumber: quizData.weekNumber,
      questions: questionsWithoutAnswers,
      totalAvailable: availableQuestions.length,
    });
  } catch (error) {
    console.error('Error fetching questions:', error);
    return NextResponse.json(
      { error: 'Failed to fetch questions' },
      { status: 500 }
    );
  }
}
