export interface Question {
  id: number;
  question: string;
  options: string[];
  correctIndex: number;
  sourceUrl: string;
  sourceCast: string;
  explanation: string;
  difficulty: 'easy' | 'medium' | 'hard';
  category: string;
}

export interface QuizData {
  lastUpdated: string;
  weekNumber: number;
  totalQuestions: number;
  questions: Question[];
}

export interface QuizState {
  currentQuestion: number;
  score: number;
  answers: (number | null)[];
  selectedQuestions: Question[];
  isComplete: boolean;
}
