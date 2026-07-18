import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import {
  ClipboardList,
  Shield,
  ArrowRight,
  Loader2,
  AlertCircle,
  CheckCircle2,
  XCircle,
  LogOut,
} from 'lucide-react';
import { QuestionnaireState, QuestionnaireAnswer } from './types';
import { getRandomQuestions, POINTS_PER_CORRECT } from './questionnaireData';
import { useMutation } from 'convex/react';
import { api } from '../../../convex/_generated/api';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

const gradeColors: Record<string, string> = {
  A: 'text-green-400 bg-green-500/20 border-green-500/30',
  B: 'text-green-400 bg-green-500/15 border-green-500/25',
  C: 'text-yellow-400 bg-yellow-500/15 border-yellow-500/25',
  D: 'text-orange-400 bg-orange-500/15 border-orange-500/25',
  E: 'text-orange-400 bg-orange-500/10 border-orange-500/20',
  F: 'text-red-400 bg-red-500/15 border-red-500/25',
};

const computeGrade = (percentage: number): string =>
  percentage >= 70 ? 'A' : percentage >= 60 ? 'B' : percentage >= 50 ? 'C' : percentage >= 40 ? 'D' : percentage >= 29 ? 'E' : 'F';

const QuestionnaireFlow = () => {
  const { toast } = useToast();
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const saveResult = useMutation(api.questionnaireResults.create);

  const [state, setState] = useState<QuestionnaireState>({
    status: 'intro',
    currentIndex: 0,
    questions: [],
    answers: [],
    startTime: null,
  });
  const [selected, setSelected] = useState<string>('');
  const [finalGrade, setFinalGrade] = useState<string>('F');
  const [finalScore, setFinalScore] = useState<number>(0);

  const startQuestionnaire = () => {
    const questions = getRandomQuestions();
    setState({
      status: 'active',
      currentIndex: 0,
      questions,
      answers: [],
      startTime: Date.now(),
    });
    setSelected('');
  };

  const handleNext = async () => {
    const currentQuestion = state.questions[state.currentIndex];
    if (!currentQuestion || !selected) return;

    const answer: QuestionnaireAnswer = {
      questionId: currentQuestion.id,
      selectedOption: selected,
      isCorrect: currentQuestion.correctOptions.includes(selected),
    };
    const answers = [...state.answers, answer];
    setSelected('');

    if (state.currentIndex + 1 < state.questions.length) {
      setState((prev) => ({ ...prev, answers, currentIndex: prev.currentIndex + 1 }));
      return;
    }

    // Final question answered — grade and submit
    setState((prev) => ({ ...prev, answers, status: 'submitting' }));
    const correctAnswers = answers.filter((a) => a.isCorrect).length;
    const score = correctAnswers * POINTS_PER_CORRECT;
    const percentage = Math.round((score / (state.questions.length * POINTS_PER_CORRECT)) * 100);
    const grade = computeGrade(percentage);
    const timeTakenSeconds = state.startTime ? Math.round((Date.now() - state.startTime) / 1000) : undefined;

    if (!user) {
      setState((prev) => ({ ...prev, status: 'error' }));
      return;
    }

    try {
      await saveResult({
        userId: user.id,
        score,
        totalQuestions: state.questions.length,
        correctAnswers,
        grade,
        completedAt: new Date().toISOString(),
        timeTakenSeconds,
        answers,
      });
      setFinalGrade(grade);
      setFinalScore(score);
      setState((prev) => ({ ...prev, status: 'completed' }));
    } catch (error) {
      console.error('Failed to save questionnaire result:', error);
      toast({
        title: 'Error',
        description: 'Could not save your assessment. Please try again.',
        variant: 'destructive',
      });
      setState((prev) => ({ ...prev, status: 'error' }));
    }
  };

  const currentQuestion = state.questions[state.currentIndex];
  const progressPercent = state.questions.length > 0
    ? (state.currentIndex / state.questions.length) * 100
    : 0;
  const maxScore = state.questions.length * POINTS_PER_CORRECT;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <div className="container mx-auto px-4 py-8 flex-1 flex flex-col max-w-3xl w-full">
        <div className="flex items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center">
              <ClipboardList className="h-6 w-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground">Baseline Security Assessment</h1>
              <p className="text-muted-foreground">Required before accessing the platform.</p>
            </div>
          </div>
          <Button variant="ghost" size="sm" onClick={() => signOut()} className="text-muted-foreground">
            <LogOut className="h-4 w-4 mr-2" />
            Sign Out
          </Button>
        </div>

        {state.status === 'intro' && (
          <Card className="bg-card border-border">
            <CardHeader className="text-center pb-2">
              <div className="mx-auto h-20 w-20 rounded-full bg-primary/20 flex items-center justify-center mb-4">
                <Shield className="h-10 w-10 text-primary" />
              </div>
              <CardTitle className="text-2xl">Welcome to CyberShield</CardTitle>
              <CardDescription className="text-base max-w-md mx-auto">
                Before you begin, we need to measure your current cybersecurity awareness.
                This short one-time assessment unlocks the platform.
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center space-y-6 pt-4">
              <div className="grid grid-cols-3 gap-4 max-w-md mx-auto">
                <div className="p-4 bg-muted/30 rounded-lg">
                  <p className="text-2xl font-bold text-primary">5</p>
                  <p className="text-xs text-muted-foreground">Questions</p>
                </div>
                <div className="p-4 bg-muted/30 rounded-lg">
                  <p className="text-2xl font-bold text-primary">1</p>
                  <p className="text-xs text-muted-foreground">Attempt Only</p>
                </div>
                <div className="p-4 bg-muted/30 rounded-lg">
                  <p className="text-2xl font-bold text-primary">~2</p>
                  <p className="text-xs text-muted-foreground">Minutes</p>
                </div>
              </div>
              <p className="text-sm text-muted-foreground max-w-md mx-auto">
                Answer honestly — there is no pass or fail. Your score establishes your
                baseline and will appear on your Analytics dashboard.
              </p>
              <Button size="lg" onClick={startQuestionnaire} className="min-w-[200px]">
                Begin Assessment
                <ArrowRight className="h-5 w-5 ml-2" />
              </Button>
            </CardContent>
          </Card>
        )}

        {state.status === 'active' && currentQuestion && (
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">
                  Question {state.currentIndex + 1} of {state.questions.length}
                </span>
                <Badge variant="outline" className="capitalize">{currentQuestion.section}</Badge>
              </div>
              <Progress value={progressPercent} className="h-2" />
            </div>

            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-lg leading-relaxed">{currentQuestion.question}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <RadioGroup value={selected} onValueChange={setSelected} className="space-y-3">
                  {currentQuestion.options.map((option) => (
                    <Label
                      key={option.key}
                      htmlFor={`option-${option.key}`}
                      className={cn(
                        'flex items-start gap-3 p-4 rounded-lg border cursor-pointer transition-colors',
                        selected === option.key
                          ? 'border-primary bg-primary/10'
                          : 'border-border bg-muted/30 hover:bg-muted/50',
                      )}
                    >
                      <RadioGroupItem value={option.key} id={`option-${option.key}`} className="mt-0.5" />
                      <span className="text-sm text-foreground leading-relaxed">
                        <span className="font-semibold mr-1.5">{option.key}.</span>
                        {option.text}
                      </span>
                    </Label>
                  ))}
                </RadioGroup>

                <Button
                  className="w-full"
                  size="lg"
                  disabled={!selected}
                  onClick={handleNext}
                >
                  {state.currentIndex + 1 === state.questions.length ? 'Submit Assessment' : 'Next Question'}
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </CardContent>
            </Card>
          </div>
        )}

        {state.status === 'submitting' && (
          <Card className="bg-card border-border">
            <CardContent className="py-20 text-center">
              <Loader2 className="h-12 w-12 text-primary animate-spin mx-auto mb-4" />
              <p className="text-lg text-foreground">Saving your results...</p>
            </CardContent>
          </Card>
        )}

        {state.status === 'error' && (
          <Card className="bg-card border-red-500/30">
            <CardContent className="py-12 text-center">
              <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
              <p className="text-lg text-foreground mb-2">Failed to Save Assessment</p>
              <p className="text-sm text-muted-foreground mb-4">
                There was an error saving your results. Please try again.
              </p>
              <Button onClick={startQuestionnaire}>Try Again</Button>
            </CardContent>
          </Card>
        )}

        {state.status === 'completed' && (
          <div className="space-y-4">
            <Card className="bg-card border-border">
              <CardHeader className="text-center pb-2">
                <CardTitle className="text-2xl">Assessment Complete</CardTitle>
                <CardDescription>Here is your baseline cybersecurity score.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6 pt-2">
                <div className="flex items-center justify-center gap-8">
                  <div className="text-center">
                    <p className="text-4xl font-bold text-primary">
                      {maxScore > 0 ? Math.round((finalScore / maxScore) * 100) : 0}%
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {state.answers.filter((a) => a.isCorrect).length}/{state.questions.length} correct
                    </p>
                  </div>
                  <Badge className={cn('text-2xl px-4 py-2 border', gradeColors[finalGrade])}>
                    {finalGrade}
                  </Badge>
                </div>

                <div className="space-y-3">
                  {state.questions.map((question, index) => {
                    const answer = state.answers[index];
                    const selectedText = question.options.find((o) => o.key === answer?.selectedOption)?.text ?? '';
                    const correctText = question.options
                      .filter((o) => question.correctOptions.includes(o.key))
                      .map((o) => `${o.key}. ${o.text}`)
                      .join(' / ');
                    return (
                      <div key={question.id} className="p-4 bg-muted/30 rounded-lg space-y-2">
                        <div className="flex items-start gap-2">
                          {answer?.isCorrect ? (
                            <CheckCircle2 className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                          ) : (
                            <XCircle className="h-5 w-5 text-red-500 shrink-0 mt-0.5" />
                          )}
                          <p className="text-sm font-medium text-foreground leading-relaxed">
                            {question.question}
                          </p>
                        </div>
                        <div className="pl-7 space-y-1">
                          <p className="text-xs text-muted-foreground">
                            Your answer: <span className={answer?.isCorrect ? 'text-green-400' : 'text-red-400'}>
                              {answer?.selectedOption}. {selectedText}
                            </span>
                          </p>
                          {!answer?.isCorrect && (
                            <p className="text-xs text-muted-foreground">
                              Correct answer: <span className="text-green-400">{correctText}</span>
                            </p>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>

                <Button size="lg" className="w-full" onClick={() => navigate('/dashboard/training', { replace: true })}>
                  Continue to Dashboard
                  <ArrowRight className="h-5 w-5 ml-2" />
                </Button>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default QuestionnaireFlow;
