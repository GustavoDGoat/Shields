import { QuestionnaireQuestion, QuestionnaireAnswer } from '@/components/questionnaire/types';

export interface PostTestState {
  status: 'idle' | 'active' | 'submitting' | 'completed';
  currentIndex: number;
  questions: QuestionnaireQuestion[];
  answers: QuestionnaireAnswer[];
  startTime: number | null;
  endTime: number | null;
}

export interface PostTestResult {
  _id: string;
  _creationTime: number;
  userId: string;
  userName?: string;
  userEmail?: string;
  score: number;
  totalQuestions: number;
  correctAnswers: number;
  grade: string;
  completedAt: string;
  timeTakenSeconds?: number;
  answers: QuestionnaireAnswer[];
}
