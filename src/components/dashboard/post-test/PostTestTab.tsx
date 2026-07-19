import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import {
  Brain,
  ArrowRight,
  Loader2,
  AlertCircle,
  CheckCircle2,
  XCircle,
  RotateCcw,
  Clock,
  Trophy,
  TrendingUp,
  BarChart3,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { PostTestState, PostTestResult } from './types';
import { QuestionnaireAnswer } from '@/components/questionnaire/types';
import { getRandomQuestions, POINTS_PER_CORRECT, questionnairePool, QUESTIONNAIRE_QUESTION_COUNT } from '@/components/questionnaire/questionnaireData';
import { useMutation, useQuery } from 'convex/react';
import { api } from '../../../../convex/_generated/api';
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
  percentage >= 70
    ? 'A'
    : percentage >= 60
      ? 'B'
      : percentage >= 50
        ? 'C'
        : percentage >= 40
          ? 'D'
          : percentage >= 29
            ? 'E'
            : 'F';

const PostTestTab = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const saveResult = useMutation(api.postTestResults.create);
  const postTestResults = useQuery(
    api.postTestResults.getMyResults,
    user ? { userId: user.id } : 'skip',
  );
  const seenIds = useQuery(
    api.postTestResults.getMySeenQuestionIds,
    user ? { userId: user.id } : 'skip',
  );

  const [state, setState] = useState<PostTestState>({
    status: 'idle',
    currentIndex: 0,
    questions: [],
    answers: [],
    startTime: null,
    endTime: null,
  });
  const [selected, setSelected] = useState<string>('');
  const [finalGrade, setFinalGrade] = useState<string>('F');
  const [finalScore, setFinalScore] = useState<number>(0);

  const isResultLoading = postTestResults === undefined;
  const attemptCount = postTestResults?.length ?? 0;
  const latestResult = postTestResults?.[0] ?? null;
  const latestPct = latestResult
    ? Math.round((latestResult.score / (latestResult.totalQuestions * POINTS_PER_CORRECT)) * 100)
    : null;

  const selectQuestionsWithOverlapPrevention = (): QuestionnaireQuestion[] => {
    const seen = new Set(seenIds ?? []);
    const unseen = questionnairePool.filter((q) => !seen.has(q.id));
    const seenPool = questionnairePool.filter((q) => seen.has(q.id));

    const shuffled = [...unseen].sort(() => Math.random() - 0.5);
    const result = shuffled.slice(0, QUESTIONNAIRE_QUESTION_COUNT);

    if (result.length < QUESTIONNAIRE_QUESTION_COUNT) {
      const remaining = QUESTIONNAIRE_QUESTION_COUNT - result.length;
      const shuffledSeen = [...seenPool].sort(() => Math.random() - 0.5);
      result.push(...shuffledSeen.slice(0, remaining));
    }

    return result.sort(() => Math.random() - 0.5);
  };

  const startTest = () => {
    const questions = selectQuestionsWithOverlapPrevention();
    setState({
      status: 'active',
      currentIndex: 0,
      questions,
      answers: [],
      startTime: Date.now(),
      endTime: null,
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

    setState((prev) => ({ ...prev, answers, status: 'submitting', endTime: Date.now() }));
    const correctAnswers = answers.filter((a) => a.isCorrect).length;
    const score = correctAnswers * POINTS_PER_CORRECT;
    const percentage = Math.round((score / (state.questions.length * POINTS_PER_CORRECT)) * 100);
    const grade = computeGrade(percentage);
    const timeTakenSeconds = state.startTime
      ? Math.round((Date.now() - state.startTime) / 1000)
      : undefined;

    if (!user) {
      setState((prev) => ({ ...prev, status: 'idle' }));
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
    } catch {
      toast({
        title: 'Error',
        description: 'Could not save your post-test. Please try again.',
        variant: 'destructive',
      });
      setState((prev) => ({ ...prev, status: 'idle' }));
    }
  };

  const resetToIdle = () => {
    setState({
      status: 'idle',
      currentIndex: 0,
      questions: [],
      answers: [],
      startTime: null,
      endTime: null,
    });
    setSelected('');
  };

  const currentQuestion = state.questions[state.currentIndex];
  const progressPercent =
    state.questions.length > 0 ? (state.currentIndex / state.questions.length) * 100 : 0;
  const maxScore = state.questions.length * POINTS_PER_CORRECT;

  if (isResultLoading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center">
          <Brain className="h-6 w-6 text-primary-foreground" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-foreground">Post Test</h1>
          <p className="text-muted-foreground">
            Retake the baseline assessment to track your learning progress.
          </p>
        </div>
      </div>

      {state.status === 'idle' && (
        <>
          <StatsOverview
            attemptCount={attemptCount}
            latestPct={latestPct}
            latestGrade={latestResult?.grade ?? null}
          />

          <Card className="bg-card border-border">
            <CardHeader className="text-center pb-2">
              <div className="mx-auto h-20 w-20 rounded-full bg-primary/20 flex items-center justify-center mb-4">
                <Brain className="h-10 w-10 text-primary" />
              </div>
              <CardTitle className="text-2xl">Post-Test Assessment</CardTitle>
              <CardDescription className="text-base max-w-md mx-auto">
                Test your cybersecurity knowledge and see how much you've improved. Take this as many times as you want.
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center space-y-6 pt-4">
              <div className="grid grid-cols-3 gap-4 max-w-md mx-auto">
                <div className="p-4 bg-muted/30 rounded-lg">
                  <p className="text-2xl font-bold text-primary">5</p>
                  <p className="text-xs text-muted-foreground">Questions</p>
                </div>
                <div className="p-4 bg-muted/30 rounded-lg">
                  <p className="text-2xl font-bold text-primary">
                    {Math.max(0, 10 - (seenIds?.length ?? 0))}
                  </p>
                  <p className="text-xs text-muted-foreground">Unseen Questions</p>
                </div>
                <div className="p-4 bg-muted/30 rounded-lg">
                  <p className="text-2xl font-bold text-primary">~2</p>
                  <p className="text-xs text-muted-foreground">Minutes</p>
                </div>
              </div>
              <p className="text-sm text-muted-foreground max-w-md mx-auto">
                Questions you haven't seen before will be prioritized. This does NOT affect your baseline assessment score.
              </p>
              <Button size="lg" onClick={startTest} className="min-w-[200px]">
                Start Post Test
                <ArrowRight className="h-5 w-5 ml-2" />
              </Button>
            </CardContent>
          </Card>

          {attemptCount > 0 && <PostTestHistory results={postTestResults ?? []} />}
        </>
      )}

      {state.status === 'active' && currentQuestion && (
        <div className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">
                Question {state.currentIndex + 1} of {state.questions.length}
              </span>
              <Badge variant="outline" className="capitalize">
                {currentQuestion.section}
              </Badge>
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
                    htmlFor={`posttest-option-${option.key}`}
                    className={cn(
                      'flex items-start gap-3 p-4 rounded-lg border cursor-pointer transition-colors',
                      selected === option.key
                        ? 'border-primary bg-primary/10'
                        : 'border-border bg-muted/30 hover:bg-muted/50',
                    )}
                  >
                    <RadioGroupItem
                      value={option.key}
                      id={`posttest-option-${option.key}`}
                      className="mt-0.5"
                    />
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
                {state.currentIndex + 1 === state.questions.length
                  ? 'Submit Post Test'
                  : 'Next Question'}
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

      {state.status === 'completed' && (
        <div className="space-y-4">
          <Card className="bg-card border-border">
            <CardHeader className="text-center pb-2">
              <CardTitle className="text-2xl">Post Test Complete</CardTitle>
              <CardDescription>Here is your post-test score. Compare with your baseline!</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6 pt-2">
              <div className="flex items-center justify-center gap-8">
                <div className="text-center">
                  <p className="text-4xl font-bold text-primary">
                    {maxScore > 0 ? Math.round((finalScore / maxScore) * 100) : 0}%
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {state.answers.filter((a) => a.isCorrect).length}/{state.questions.length}{' '}
                    correct
                  </p>
                </div>
                <Badge className={cn('text-2xl px-4 py-2 border', gradeColors[finalGrade])}>
                  {finalGrade}
                </Badge>
              </div>

              <div className="space-y-3">
                {state.questions.map((question, index) => {
                  const answer = state.answers[index];
                  const selectedText =
                    question.options.find((o) => o.key === answer?.selectedOption)?.text ?? '';
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
                          Your answer:{' '}
                          <span className={answer?.isCorrect ? 'text-green-400' : 'text-red-400'}>
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

              <div className="flex gap-3">
                <Button size="lg" className="flex-1" onClick={startTest}>
                  <RotateCcw className="h-5 w-5 mr-2" />
                  Take Another
                </Button>
                <Button size="lg" variant="outline" className="flex-1" onClick={resetToIdle}>
                  View History
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

const StatsOverview = ({
  attemptCount,
  latestPct,
  latestGrade,
}: {
  attemptCount: number;
  latestPct: number | null;
  latestGrade: string | null;
}) => (
  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
    <Card className="bg-card border-border">
      <CardContent className="pt-4 text-center">
        <RotateCcw className="h-6 w-6 mx-auto mb-2 text-primary" />
        <p className="text-2xl font-bold text-foreground">{attemptCount}</p>
        <p className="text-xs text-muted-foreground">Total Attempts</p>
      </CardContent>
    </Card>
    <Card className="bg-card border-border">
      <CardContent className="pt-4 text-center">
        <Trophy className="h-6 w-6 mx-auto mb-2 text-yellow-500" />
        <p className="text-2xl font-bold text-foreground">
          {latestPct !== null ? `${latestPct}%` : '—'}
        </p>
        <p className="text-xs text-muted-foreground">Latest Score</p>
      </CardContent>
    </Card>
    <Card className="bg-card border-border">
      <CardContent className="pt-4 text-center">
        <TrendingUp className="h-6 w-6 mx-auto mb-2 text-green-500" />
        <p className="text-2xl font-bold text-foreground">
          {latestGrade ? (
            <Badge className={cn('text-sm border', gradeColors[latestGrade])}>{latestGrade}</Badge>
          ) : (
            '—'
          )}
        </p>
        <p className="text-xs text-muted-foreground">Latest Grade</p>
      </CardContent>
    </Card>
    <Card className="bg-card border-border">
      <CardContent className="pt-4 text-center">
        <Brain className="h-6 w-6 mx-auto mb-2 text-accent" />
        <p className="text-2xl font-bold text-foreground">
          {10 - (questionnairePool.length - QUESTIONNAIRE_QUESTION_COUNT)} Qs
        </p>
        <p className="text-xs text-muted-foreground">Question Pool</p>
      </CardContent>
    </Card>
  </div>
);

const PostTestHistory = ({ results }: { results: PostTestResult[] }) => {
  const [expandedResult, setExpandedResult] = useState<string | null>(null);
  const questionById = new Map(questionnairePool.map((q) => [q.id, q]));

  return (
    <Card className="bg-card border-border">
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <Clock className="h-5 w-5 text-primary" />
          Post Test History
        </CardTitle>
        <CardDescription>All your previous post-test attempts</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {results.map((result, index) => {
            const pct = Math.round(
              (result.score / (result.totalQuestions * POINTS_PER_CORRECT)) * 100,
            );
            const colorClass =
              gradeColors[result.grade] || 'text-muted-foreground bg-muted/30 border-border';
            const isExpanded = expandedResult === result._id;

            return (
              <div key={result._id}>
                <div
                  className="flex items-center justify-between p-3 bg-muted/30 rounded-lg cursor-pointer hover:bg-muted/50 transition-colors"
                  onClick={() =>
                    setExpandedResult(isExpanded ? null : result._id)
                  }
                >
                  <div className="flex items-center gap-3">
                    <span className="text-sm text-muted-foreground w-6">
                      #{results.length - index}
                    </span>
                    <div>
                      <p className="text-sm font-medium text-foreground">
                        {new Date(result.completedAt).toLocaleDateString('en-NG', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {result.correctAnswers}/{result.totalQuestions} correct{' '}
                        {result.timeTakenSeconds
                          ? `• ${Math.floor(result.timeTakenSeconds / 60)}m ${result.timeTakenSeconds % 60}s`
                          : ''}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-foreground">{pct}%</span>
                    <Badge className={cn('text-xs border', colorClass)}>{result.grade}</Badge>
                    {isExpanded ? (
                      <ChevronUp className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <ChevronDown className="h-4 w-4 text-muted-foreground" />
                    )}
                  </div>
                </div>

                {isExpanded && (
                  <div className="mt-3 space-y-3 pl-6">
                    {result.answers.map((answer, aIndex) => {
                      const question = questionById.get(answer.questionId);
                      if (!question) return null;
                      const selectedText =
                        question.options.find((o) => o.key === answer.selectedOption)?.text ?? '';
                      const correctText = question.options
                        .filter((o) => question.correctOptions.includes(o.key))
                        .map((o) => `${o.key}. ${o.text}`)
                        .join(' / ');
                      return (
                        <div
                          key={answer.questionId}
                          className="p-3 bg-muted/20 rounded-lg space-y-2"
                        >
                          <div className="flex items-start gap-2">
                            {answer.isCorrect ? (
                              <CheckCircle2 className="h-4 w-4 text-green-500 shrink-0 mt-0.5" />
                            ) : (
                              <XCircle className="h-4 w-4 text-red-500 shrink-0 mt-0.5" />
                            )}
                            <p className="text-sm font-medium text-foreground leading-relaxed">
                              <span className="text-muted-foreground mr-1.5">Q{aIndex + 1}.</span>
                              {question.question}
                            </p>
                          </div>
                          <div className="pl-6 space-y-1">
                            <p className="text-xs text-muted-foreground">
                              Your answer:{' '}
                              <span
                                className={answer.isCorrect ? 'text-green-400' : 'text-red-400'}
                              >
                                {answer.selectedOption}. {selectedText}
                              </span>
                            </p>
                            {!answer.isCorrect && (
                              <p className="text-xs text-muted-foreground">
                                Correct answer:{' '}
                                <span className="text-green-400">{correctText}</span>
                              </p>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default PostTestTab;
