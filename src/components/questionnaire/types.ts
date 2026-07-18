export type QuestionnaireSection = 'knowledge' | 'attitude' | 'behavior';

export interface QuestionnaireOption {
  key: string;
  text: string;
}

export interface QuestionnaireQuestion {
  id: string;
  section: QuestionnaireSection;
  question: string;
  options: QuestionnaireOption[];
  correctOptions: string[];
}

export interface QuestionnaireAnswer {
  questionId: string;
  selectedOption: string;
  isCorrect: boolean;
}

export interface QuestionnaireState {
  status: 'intro' | 'active' | 'submitting' | 'completed' | 'error';
  currentIndex: number;
  questions: QuestionnaireQuestion[];
  answers: QuestionnaireAnswer[];
  startTime: number | null;
}
