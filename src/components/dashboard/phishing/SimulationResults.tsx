import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { 
  Trophy, 
  RotateCcw, 
  History, 
  CheckCircle, 
  XCircle,
  Target,
  Clock,
  Lightbulb,
  Shield
} from 'lucide-react';
import { ScenarioResult, PhishingScenario } from './types';
import { cn } from '@/lib/utils';

interface SimulationResultsProps {
  results: ScenarioResult[];
  scenarios: PhishingScenario[];
  totalScore: number;
  maxScore: number;
  onRestart: () => void;
  onViewHistory: () => void;
}

const tips = [
  "Always check the sender's email domain carefully - phishers often use domains that look similar to legitimate ones.",
  "Be suspicious of urgent requests, especially those asking for personal information or payment.",
  "Hover over links before clicking to see the actual URL destination.",
  "Never download unexpected attachments, especially executable files (.exe, .bat).",
  "When in doubt, contact the sender through a known, trusted channel to verify.",
  "Look for spelling and grammar errors - legitimate companies usually proofread their emails.",
  "Be wary of generic greetings like 'Dear Customer' instead of your actual name."
];

const SimulationResults = ({
  results,
  scenarios,
  totalScore,
  maxScore,
  onRestart,
  onViewHistory
}: SimulationResultsProps) => {
  const percentage = Math.round((totalScore / maxScore) * 100);
  const correctCount = results.filter(r => r.isCorrect).length;
  const totalTime = results.reduce((acc, r) => acc + r.timeTaken, 0);
  const avgTime = Math.round(totalTime / results.length);

  const getGrade = () => {
    if (percentage >= 70) return { grade: 'A', label: 'Excellent!', color: 'text-green-400' };
    if (percentage >= 60) return { grade: 'B', label: 'Great Job!', color: 'text-green-400' };
    if (percentage >= 50) return { grade: 'C', label: 'Good Effort', color: 'text-yellow-400' };
    if (percentage >= 40) return { grade: 'D', label: 'Needs Improvement', color: 'text-orange-400' };
    if (percentage >= 29) return { grade: 'E', label: 'Keep Trying', color: 'text-orange-400' };
    return { grade: 'F', label: 'Keep Practicing', color: 'text-red-400' };
  };

  const grade = getGrade();
  const randomTip = tips[Math.floor(Math.random() * tips.length)];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Score Header */}
      <Card className="bg-gradient-to-br from-primary/20 to-accent/20 border-primary/30">
        <CardContent className="pt-6">
          <div className="text-center space-y-4">
            <div className="inline-flex items-center justify-center h-20 w-20 rounded-full bg-primary/20 mx-auto">
              <Trophy className="h-10 w-10 text-primary" />
            </div>
            <div>
              <h2 className="text-3xl font-bold text-foreground">Simulation Complete!</h2>
              <p className={cn("text-xl font-semibold mt-1", grade.color)}>{grade.label}</p>
            </div>
            <div className="flex items-center justify-center gap-2">
              <span className={cn("text-6xl font-bold", grade.color)}>{grade.grade}</span>
              <div className="text-left">
                <p className="text-2xl font-bold text-foreground">{totalScore}/{maxScore}</p>
                <p className="text-sm text-muted-foreground">points earned</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="bg-card border-border">
          <CardContent className="pt-4 text-center">
            <Target className="h-6 w-6 text-primary mx-auto mb-2" />
            <p className="text-2xl font-bold text-foreground">{percentage}%</p>
            <p className="text-xs text-muted-foreground">Accuracy</p>
          </CardContent>
        </Card>
        <Card className="bg-card border-border">
          <CardContent className="pt-4 text-center">
            <CheckCircle className="h-6 w-6 text-green-500 mx-auto mb-2" />
            <p className="text-2xl font-bold text-foreground">{correctCount}</p>
            <p className="text-xs text-muted-foreground">Correct</p>
          </CardContent>
        </Card>
        <Card className="bg-card border-border">
          <CardContent className="pt-4 text-center">
            <XCircle className="h-6 w-6 text-red-500 mx-auto mb-2" />
            <p className="text-2xl font-bold text-foreground">{results.length - correctCount}</p>
            <p className="text-xs text-muted-foreground">Incorrect</p>
          </CardContent>
        </Card>
        <Card className="bg-card border-border">
          <CardContent className="pt-4 text-center">
            <Clock className="h-6 w-6 text-accent mx-auto mb-2" />
            <p className="text-2xl font-bold text-foreground">{avgTime}s</p>
            <p className="text-xs text-muted-foreground">Avg Time</p>
          </CardContent>
        </Card>
      </div>

      {/* Results Breakdown */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Shield className="h-5 w-5 text-primary" />
            Results Breakdown
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {results.map((result, index) => {
            const scenario = scenarios.find(s => s.id === result.scenarioId);
            return (
              <div 
                key={result.scenarioId}
                className="flex items-center justify-between p-3 bg-muted/30 rounded-lg"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <span className="text-sm text-muted-foreground w-6">#{index + 1}</span>
                  {result.isCorrect ? (
                    <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                  ) : (
                    <XCircle className="h-5 w-5 text-red-500 flex-shrink-0" />
                  )}
                  <span className="text-sm text-foreground truncate">
                    {scenario?.subject || 'Unknown'}
                  </span>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <Badge 
                    variant={scenario?.type === 'phishing' ? 'destructive' : 'default'}
                    className="text-xs"
                  >
                    {scenario?.type}
                  </Badge>
                  <span className="text-xs text-muted-foreground">{result.timeTaken}s</span>
                </div>
              </div>
            );
          })}
        </CardContent>
      </Card>

      {/* Tip for Improvement */}
      <Card className="bg-yellow-500/10 border-yellow-500/30">
        <CardContent className="pt-4">
          <div className="flex gap-3">
            <Lightbulb className="h-5 w-5 text-yellow-500 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-yellow-400 mb-1">Tip for Improvement</p>
              <p className="text-sm text-foreground/80">{randomTip}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3">
        <Button 
          className="flex-1" 
          onClick={onRestart}
          aria-label="Restart simulation"
        >
          <RotateCcw className="h-4 w-4 mr-2" />
          Restart Simulation
        </Button>
        <Button 
          variant="outline" 
          className="flex-1"
          onClick={onViewHistory}
          aria-label="View past scores"
        >
          <History className="h-4 w-4 mr-2" />
          View Past Scores
        </Button>
      </div>
    </div>
  );
};

export default SimulationResults;
