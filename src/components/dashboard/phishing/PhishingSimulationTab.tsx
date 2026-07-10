import { useState, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  Shield, 
  Play, 
  AlertCircle, 
  Loader2,
  Fish
} from 'lucide-react';
import { SimulationState, UserAction, ScenarioResult } from './types';
import { getRandomScenarios } from './scenarioData';
import PhishingScenarioCard from './PhishingScenarioCard';
import FeedbackModal from './FeedbackModal';
import SimulationResults from './SimulationResults';
import { useMutation } from 'convex/react';
import { api } from '../../../../convex/_generated/api';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

const SCENARIO_COUNT = 15;
const TIME_LIMIT = 30;
const POINTS_PER_CORRECT = 10;

const PhishingSimulationTab = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [state, setState] = useState<SimulationState>({
    status: 'idle',
    currentIndex: 0,
    scenarios: [],
    results: [],
    score: 0,
    startTime: null
  });
  const [showFeedback, setShowFeedback] = useState(false);
  const [lastResult, setLastResult] = useState<{ 
    action: UserAction; 
    isCorrect: boolean 
  } | null>(null);

  const saveResultMut = useMutation(api.simulationResults.create);

  const startSimulation = async () => {
    setState(prev => ({ ...prev, status: 'loading' }));

    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const scenarios = getRandomScenarios(SCENARIO_COUNT);
      
      setState({
        status: 'active',
        currentIndex: 0,
        scenarios,
        results: [],
        score: 0,
        startTime: Date.now()
      });

      toast({
        title: "Simulation Started",
        description: `Complete ${SCENARIO_COUNT} scenarios to test your phishing awareness.`,
      });
    } catch (error) {
      setState(prev => ({ ...prev, status: 'error' }));
      toast({
        title: "Error",
        description: "Failed to load simulation. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleAction = useCallback((action: UserAction) => {
    const currentScenario = state.scenarios[state.currentIndex];
    const scenarioStartTime = state.startTime || Date.now();
    const timeTaken = Math.round((Date.now() - scenarioStartTime) / 1000);

    let isCorrect = false;
    if (currentScenario.type === 'phishing') {
      isCorrect = action === 'report';
    } else {
      isCorrect = action === 'not-phishing';
    }

    const result: ScenarioResult = {
      scenarioId: currentScenario.id,
      userAction: action,
      isCorrect,
      timeTaken: Math.min(timeTaken, TIME_LIMIT)
    };

    setState(prev => ({
      ...prev,
      results: [...prev.results, result],
      score: prev.score + (isCorrect ? POINTS_PER_CORRECT : 0),
      startTime: Date.now()
    }));

    setLastResult({ action, isCorrect });
    setShowFeedback(true);
  }, [state.scenarios, state.currentIndex, state.startTime]);

  const handleContinue = useCallback(async () => {
    setShowFeedback(false);
    setLastResult(null);

    if (state.currentIndex + 1 >= state.scenarios.length) {
      const updatedResults = [...state.results];
      const finalScore = state.score;
      const correctCount = updatedResults.filter(r => r.isCorrect).length;
      const totalTime = updatedResults.reduce((acc, r) => acc + r.timeTaken, 0);
      const percentage = Math.round((state.score / (state.scenarios.length * POINTS_PER_CORRECT)) * 100);
      const grade = percentage >= 70 ? 'A' : percentage >= 60 ? 'B' : percentage >= 50 ? 'C' : percentage >= 40 ? 'D' : percentage >= 29 ? 'E' : 'F';

      if (user) {
        try {
          await saveResultMut({
            userId: user.id,
            score: finalScore,
            totalQuestions: state.scenarios.length,
            correctAnswers: correctCount,
            grade,
            completedAt: new Date().toISOString(),
            timeTakenSeconds: totalTime,
          });
        } catch (error) {
          toast({
            title: "Warning",
            description: "Could not save results. Your progress is shown locally.",
            variant: "destructive"
          });
        }
      }

      setState(prev => ({ ...prev, status: 'completed' }));
    } else {
      setState(prev => ({ 
        ...prev, 
        currentIndex: prev.currentIndex + 1,
        startTime: Date.now()
      }));
    }
  }, [state.currentIndex, state.scenarios.length, toast]);

  const handleRestart = () => {
    setState({
      status: 'idle',
      currentIndex: 0,
      scenarios: [],
      results: [],
      score: 0,
      startTime: null
    });
  };

  const handleViewHistory = () => {
    toast({
      title: "Coming Soon",
      description: "Past scores history will be available soon.",
    });
  };

  const currentScenario = state.scenarios[state.currentIndex];
  const progressPercent = state.scenarios.length > 0 
    ? ((state.currentIndex) / state.scenarios.length) * 100 
    : 0;

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center">
            <Fish className="h-6 w-6 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Phishing Simulation Training</h1>
            <p className="text-muted-foreground">
              Test your skills against simulated phishing attacks to improve your awareness.
            </p>
          </div>
        </div>
      </div>

      {state.status === 'idle' && (
        <Card className="bg-card border-border">
          <CardHeader className="text-center pb-2">
            <div className="mx-auto h-20 w-20 rounded-full bg-primary/20 flex items-center justify-center mb-4">
              <Shield className="h-10 w-10 text-primary" />
            </div>
            <CardTitle className="text-2xl">Ready to Test Your Skills?</CardTitle>
            <CardDescription className="text-base max-w-md mx-auto">
              You'll be presented with {SCENARIO_COUNT} email scenarios. Identify which are phishing 
              attempts and which are legitimate. You have {TIME_LIMIT} seconds per scenario.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center space-y-6 pt-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto">
              <div className="p-4 bg-muted/30 rounded-lg">
                <p className="text-2xl font-bold text-primary">{SCENARIO_COUNT}</p>
                <p className="text-xs text-muted-foreground">Scenarios</p>
              </div>
              <div className="p-4 bg-muted/30 rounded-lg">
                <p className="text-2xl font-bold text-primary">{TIME_LIMIT}s</p>
                <p className="text-xs text-muted-foreground">Per Question</p>
              </div>
              <div className="p-4 bg-muted/30 rounded-lg">
                <p className="text-2xl font-bold text-primary">{SCENARIO_COUNT * POINTS_PER_CORRECT}</p>
                <p className="text-xs text-muted-foreground">Max Points</p>
              </div>
              <div className="p-4 bg-muted/30 rounded-lg">
                <p className="text-2xl font-bold text-primary">2</p>
                <p className="text-xs text-muted-foreground">Action Choices</p>
              </div>
            </div>
            <Button 
              size="lg" 
              onClick={startSimulation}
              className="min-w-[200px]"
              aria-label="Start phishing simulation"
            >
              <Play className="h-5 w-5 mr-2" />
              Start Simulation
            </Button>
          </CardContent>
        </Card>
      )}

      {state.status === 'loading' && (
        <Card className="bg-card border-border">
          <CardContent className="py-20 text-center">
            <Loader2 className="h-12 w-12 text-primary animate-spin mx-auto mb-4" />
            <p className="text-lg text-foreground">Loading simulation...</p>
            <p className="text-sm text-muted-foreground">Preparing your phishing scenarios</p>
          </CardContent>
        </Card>
      )}

      {state.status === 'error' && (
        <Card className="bg-card border-red-500/30">
          <CardContent className="py-12 text-center">
            <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <p className="text-lg text-foreground mb-2">Failed to Load Simulation</p>
            <p className="text-sm text-muted-foreground mb-4">
              There was an error loading the simulation. Please try again.
            </p>
            <Button onClick={startSimulation}>
              Try Again
            </Button>
          </CardContent>
        </Card>
      )}

      {state.status === 'active' && currentScenario && (
        <div className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">
                Scenario {state.currentIndex + 1} of {state.scenarios.length}
              </span>
              <span className="text-primary font-medium">
                Score: {state.score}/{(state.currentIndex) * POINTS_PER_CORRECT}
              </span>
            </div>
            <Progress value={progressPercent} className="h-2" />
          </div>

          <PhishingScenarioCard
            scenario={currentScenario}
            onAction={handleAction}
            timeLimit={TIME_LIMIT}
            disabled={showFeedback}
          />

          {showFeedback && lastResult && (
            <FeedbackModal
              isOpen={showFeedback}
              scenario={currentScenario}
              userAction={lastResult.action}
              isCorrect={lastResult.isCorrect}
              onContinue={handleContinue}
            />
          )}
        </div>
      )}

      {state.status === 'completed' && (
        <SimulationResults
          results={state.results}
          scenarios={state.scenarios}
          totalScore={state.score}
          maxScore={state.scenarios.length * POINTS_PER_CORRECT}
          onRestart={handleRestart}
          onViewHistory={handleViewHistory}
        />
      )}
    </div>
  );
};

export default PhishingSimulationTab;
