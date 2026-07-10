export interface PhishingScenario {
  id: string;
  type: 'phishing' | 'legitimate';
  sender: {
    name: string;
    email: string;
  };
  subject: string;
  body: string;
  hasLink?: boolean;
  linkText?: string;
  linkUrl?: string;
  hasAttachment?: boolean;
  attachmentName?: string;
  redFlags: string[];
  explanation: string;
}

export type UserAction = 'report' | 'not-phishing';

export interface ScenarioResult {
  scenarioId: string;
  userAction: UserAction;
  isCorrect: boolean;
  timeTaken: number;
}

export interface SimulationState {
  status: 'idle' | 'loading' | 'active' | 'completed' | 'error';
  currentIndex: number;
  scenarios: PhishingScenario[];
  results: ScenarioResult[];
  score: number;
  startTime: number | null;
}
