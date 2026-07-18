import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import {
  BarChart3,
  Trophy,
  Target,
  Clock,
  TrendingUp,
  Loader2,
  FileX,
  ShieldCheck,
  Shield,
  Users,
  ClipboardList,
  CheckCircle2,
  XCircle,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { useQuery } from 'convex/react';
import { api } from '../../../../convex/_generated/api';
import { useAuth } from '@/hooks/useAuth';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { questionnairePool } from '@/components/questionnaire/questionnaireData';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, BarChart, Bar,
} from 'recharts';

interface SimulationResult {
  _id: string;
  _creationTime: number;
  userId?: string;
  userName?: string;
  userEmail?: string;
  score: number;
  totalQuestions: number;
  correctAnswers: number;
  grade: string;
  completedAt: string;
  timeTakenSeconds: number | null;
}

interface QuestionnaireResult {
  _id: string;
  userId: string;
  score: number;
  totalQuestions: number;
  correctAnswers: number;
  grade: string;
  completedAt: string;
  timeTakenSeconds?: number;
  answers: { questionId: string; selectedOption: string; isCorrect: boolean }[];
}

const gradeColors: Record<string, string> = {
  A: 'text-green-400 bg-green-500/20 border-green-500/30',
  B: 'text-green-400 bg-green-500/15 border-green-500/25',
  C: 'text-yellow-400 bg-yellow-500/15 border-yellow-500/25',
  D: 'text-orange-400 bg-orange-500/15 border-orange-500/25',
  E: 'text-orange-400 bg-orange-500/10 border-orange-500/20',
  F: 'text-red-400 bg-red-500/15 border-red-500/25',
};

const toPct = (r: SimulationResult) =>
  Math.round((r.score / (r.totalQuestions * 10)) * 100);

const AnalyticsTab = () => {
  const { user, isAdmin } = useAuth();
  const [showAdminView, setShowAdminView] = useState(false);

  const myResults = useQuery(
    api.simulationResults.listByUser,
    user ? { userId: user.id } : 'skip',
  );
  const allResults = useQuery(
    api.simulationResults.listAll,
    user && isAdmin && showAdminView ? { adminUserId: user.id } : 'skip',
  );
  const questionnaireResult = useQuery(
    api.questionnaireResults.getMyResult,
    user ? { userId: user.id } : 'skip',
  );

  const isAdminView = isAdmin && showAdminView;
  const raw = isAdminView ? (allResults ?? []) : (myResults ?? []);
  const sortedResults = raw as SimulationResult[];

  const loading = isAdminView
    ? allResults === undefined
    : myResults === undefined;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <Header />
        {isAdmin && (
          <div className="flex items-center gap-3 p-3 rounded-lg bg-card/50 backdrop-blur border border-border/50">
            <Switch
              id="admin-analytics"
              checked={isAdminView}
              onCheckedChange={setShowAdminView}
            />
            <Label htmlFor="admin-analytics" className="flex items-center gap-2 cursor-pointer">
              {isAdminView ? (
                <>
                  <ShieldCheck className="h-4 w-4 text-primary" />
                  <span className="font-medium">All Users</span>
                </>
              ) : (
                <>
                  <Shield className="h-4 w-4 text-muted-foreground" />
                  <span>My Stats</span>
                </>
              )}
            </Label>
          </div>
        )}
      </div>

      {isAdminView ? (
        <AdminAnalytics results={sortedResults} />
      ) : (
        <UserAnalytics results={sortedResults} questionnaire={questionnaireResult ?? null} />
      )}
    </div>
  );
};

const UserAnalytics = ({ results, questionnaire }: { results: SimulationResult[]; questionnaire: QuestionnaireResult | null }) => {
  if (results.length === 0) {
    return (
      <>
        {questionnaire && <BaselineQuestionnaireCard result={questionnaire} />}
        <Card className="bg-card border-border">
          <CardContent className="py-16 text-center">
            <FileX className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">No Simulation Data Yet</h3>
            <p className="text-muted-foreground max-w-md mx-auto">
              Complete a phishing simulation to see your analytics and track your progress over time.
            </p>
          </CardContent>
        </Card>
      </>
    );
  }

  const latestResult = results[results.length - 1];
  const bestScore = Math.max(...results.map(toPct));
  const avgScore = Math.round(results.reduce((acc, r) => acc + toPct(r), 0) / results.length);
  const totalSimulations = results.length;

  const chartData = results.map((r, i) => ({
    name: `#${i + 1}`,
    score: toPct(r),
    correct: r.correctAnswers,
    date: new Date(r.completedAt).toLocaleDateString(),
  }));

  return (
    <>
      {questionnaire && <BaselineQuestionnaireCard result={questionnaire} />}
      <StatsGrid
        items={[
          { icon: Trophy, label: 'Best Score', value: `${bestScore}%`, iconColor: 'text-yellow-500' },
          { icon: Target, label: 'Avg Score', value: `${avgScore}%`, iconColor: 'text-primary' },
          { icon: BarChart3, label: 'Attempts', value: `${totalSimulations}`, iconColor: 'text-accent' },
          { icon: TrendingUp, label: 'Latest Grade', value: latestResult.grade, iconColor: 'text-green-500' },
        ]}
      />
      <ScoreTrendChart data={chartData} />
      <CorrectAnswersChart data={chartData} />
      <SimulationHistory results={results} />
    </>
  );
};

const BaselineQuestionnaireCard = ({ result }: { result: QuestionnaireResult }) => {
  const [expanded, setExpanded] = useState(false);
  const pct = Math.round((result.score / (result.totalQuestions * 10)) * 100);
  const colorClass = gradeColors[result.grade] || 'text-muted-foreground bg-muted/30 border-border';
  const questionById = new Map(questionnairePool.map((q) => [q.id, q]));

  return (
    <Card className="bg-card border-border">
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <ClipboardList className="h-5 w-5 text-primary" />
          Baseline Security Assessment
        </CardTitle>
        <CardDescription>
          Your one-time onboarding questionnaire score — completed{' '}
          {new Date(result.completedAt).toLocaleDateString('en-NG', {
            day: 'numeric', month: 'short', year: 'numeric',
          })}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-4 bg-muted/30 rounded-lg text-center">
            <p className="text-2xl font-bold text-primary">{pct}%</p>
            <p className="text-xs text-muted-foreground">Baseline Score</p>
          </div>
          <div className="p-4 bg-muted/30 rounded-lg text-center">
            <Badge className={cn('text-lg px-3 py-1 border', colorClass)}>{result.grade}</Badge>
            <p className="text-xs text-muted-foreground mt-1">Grade</p>
          </div>
          <div className="p-4 bg-muted/30 rounded-lg text-center">
            <p className="text-2xl font-bold text-foreground">{result.correctAnswers}/{result.totalQuestions}</p>
            <p className="text-xs text-muted-foreground">Correct Answers</p>
          </div>
          <div className="p-4 bg-muted/30 rounded-lg text-center">
            <p className="text-2xl font-bold text-foreground">
              {result.timeTakenSeconds ? `${Math.floor(result.timeTakenSeconds / 60)}m ${result.timeTakenSeconds % 60}s` : 'N/A'}
            </p>
            <p className="text-xs text-muted-foreground">Time Taken</p>
          </div>
        </div>

        <Button
          variant="ghost"
          size="sm"
          className="w-full text-muted-foreground"
          onClick={() => setExpanded((e) => !e)}
        >
          {expanded ? (
            <>Hide Answer Breakdown <ChevronUp className="h-4 w-4 ml-2" /></>
          ) : (
            <>View Answer Breakdown <ChevronDown className="h-4 w-4 ml-2" /></>
          )}
        </Button>

        {expanded && (
          <div className="space-y-3">
            {result.answers.map((answer, index) => {
              const question = questionById.get(answer.questionId);
              if (!question) return null;
              const selectedText = question.options.find((o) => o.key === answer.selectedOption)?.text ?? '';
              const correctText = question.options
                .filter((o) => question.correctOptions.includes(o.key))
                .map((o) => `${o.key}. ${o.text}`)
                .join(' / ');
              return (
                <div key={answer.questionId} className="p-4 bg-muted/30 rounded-lg space-y-2">
                  <div className="flex items-start gap-2">
                    {answer.isCorrect ? (
                      <CheckCircle2 className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                    ) : (
                      <XCircle className="h-5 w-5 text-red-500 shrink-0 mt-0.5" />
                    )}
                    <p className="text-sm font-medium text-foreground leading-relaxed">
                      <span className="text-muted-foreground mr-1.5">Q{index + 1}.</span>
                      {question.question}
                    </p>
                  </div>
                  <div className="pl-7 space-y-1">
                    <p className="text-xs text-muted-foreground">
                      Your answer: <span className={answer.isCorrect ? 'text-green-400' : 'text-red-400'}>
                        {answer.selectedOption}. {selectedText}
                      </span>
                    </p>
                    {!answer.isCorrect && (
                      <p className="text-xs text-muted-foreground">
                        Correct answer: <span className="text-green-400">{correctText}</span>
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

const AdminAnalytics = ({ results }: { results: SimulationResult[] }) => {
  if (results.length === 0) {
    return (
      <Card className="bg-card border-border">
        <CardContent className="py-16 text-center">
          <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-foreground mb-2">No Site Data Yet</h3>
          <p className="text-muted-foreground max-w-md mx-auto">
            No users have completed any simulations. Site-wide analytics will appear here.
          </p>
        </CardContent>
      </Card>
    );
  }

  const uniqueUsers = [...new Set(results.map((r) => r.userId).filter(Boolean))].length;
  const allPcts = results.map(toPct);
  const avgScore = Math.round(allPcts.reduce((a, b) => a + b, 0) / allPcts.length);
  const bestScore = Math.max(...allPcts);
  const gradeDist = results.reduce<Record<string, number>>((acc, r) => {
    acc[r.grade] = (acc[r.grade] || 0) + 1;
    return acc;
  }, {});

  const dailyMap = new Map<string, number>();
  results.forEach((r) => {
    const day = new Date(r.completedAt).toLocaleDateString();
    dailyMap.set(day, (dailyMap.get(day) || 0) + 1);
  });
  const dailyData = [...dailyMap.entries()].map(([date, count]) => ({ date, count }));

  const userAvgMap = new Map<string, { name: string; scores: number[] }>();
  results.forEach((r) => {
    const key = r.userId || 'unknown';
    if (!userAvgMap.has(key)) {
      userAvgMap.set(key, { name: r.userName || r.userEmail || 'Unknown', scores: [] });
    }
    userAvgMap.get(key)!.scores.push(toPct(r));
  });
  const userRanking = [...userAvgMap.entries()]
    .map(([_, v]) => ({
      name: v.name,
      avg: Math.round(v.scores.reduce((a, b) => a + b, 0) / v.scores.length),
      best: Math.max(...v.scores),
      attempts: v.scores.length,
    }))
    .sort((a, b) => b.avg - a.avg);

  return (
    <>
      <StatsGrid
        items={[
          { icon: Users, label: 'Active Users', value: `${uniqueUsers}`, iconColor: 'text-blue-500' },
          { icon: BarChart3, label: 'Total Simulations', value: `${results.length}`, iconColor: 'text-primary' },
          { icon: Target, label: 'Site Avg Score', value: `${avgScore}%`, iconColor: 'text-accent' },
          { icon: Trophy, label: 'Highest Score', value: `${bestScore}%`, iconColor: 'text-yellow-500' },
        ]}
      />

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              Simulations Per Day
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={dailyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" fontSize={11} />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} allowDecimals={false} />
                  <Tooltip
                    contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '8px' }}
                  />
                  <Bar dataKey="count" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} name="Simulations" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Target className="h-5 w-5 text-primary" />
              Grade Distribution
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {['A', 'B', 'C', 'D', 'E', 'F'].map((g) => {
                const count = gradeDist[g] || 0;
                const pct = Math.round((count / results.length) * 100);
                return (
                  <div key={g} className="flex items-center gap-3">
                    <Badge className={cn('w-8 justify-center text-xs border', gradeColors[g])}>{g}</Badge>
                    <div className="flex-1 h-3 bg-muted rounded-full overflow-hidden">
                      <div
                        className={cn(
                          'h-full rounded-full transition-all',
                          g === 'A' || g === 'B' ? 'bg-green-500' : g === 'C' ? 'bg-yellow-500' : 'bg-red-500',
                        )}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                    <span className="text-xs text-muted-foreground w-12 text-right">{count}</span>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Users className="h-5 w-5 text-primary" />
            User Ranking
          </CardTitle>
          <CardDescription>Average score per user across all attempts</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {userRanking.map((u, i) => (
              <div
                key={u.name}
                className="flex items-center justify-between p-3 bg-muted/30 rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <span className={cn(
                    'text-sm font-bold w-6',
                    i === 0 ? 'text-yellow-500' : i === 1 ? 'text-gray-400' : i === 2 ? 'text-amber-600' : 'text-muted-foreground',
                  )}>
                    #{i + 1}
                  </span>
                  <div>
                    <p className="text-sm font-medium text-foreground">{u.name}</p>
                    <p className="text-xs text-muted-foreground">{u.attempts} simulation{u.attempts !== 1 ? 's' : ''}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-xs text-muted-foreground">Best: {u.best}%</span>
                  <span className="text-sm font-bold text-foreground">{u.avg}%</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </>
  );
};

const StatsGrid = ({
  items,
}: {
  items: { icon: any; label: string; value: string; iconColor: string }[];
}) => (
  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
    {items.map(({ icon: Icon, label, value, iconColor }) => (
      <Card key={label} className="bg-card border-border">
        <CardContent className="pt-4 text-center">
          <Icon className={cn('h-6 w-6 mx-auto mb-2', iconColor)} />
          <p className="text-2xl font-bold text-foreground">{value}</p>
          <p className="text-xs text-muted-foreground">{label}</p>
        </CardContent>
      </Card>
    ))}
  </div>
);

const ScoreTrendChart = ({ data }: { data: { name: string; score: number; date: string }[] }) => (
  <Card className="bg-card border-border">
    <CardHeader>
      <CardTitle className="text-lg flex items-center gap-2">
        <TrendingUp className="h-5 w-5 text-primary" />
        Score Trend
      </CardTitle>
      <CardDescription>Your performance across all simulation attempts</CardDescription>
    </CardHeader>
    <CardContent>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} />
            <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} domain={[0, 100]} />
            <Tooltip
              contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '8px', color: 'hsl(var(--foreground))' }}
              formatter={(value: number) => [`${value}%`, 'Score']}
              labelFormatter={(label: string, payload: any) => payload?.[0]?.payload?.date || label}
            />
            <Line type="monotone" dataKey="score" stroke="hsl(var(--primary))" strokeWidth={2} dot={{ fill: 'hsl(var(--primary))', r: 4 }} activeDot={{ r: 6 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </CardContent>
  </Card>
);

const CorrectAnswersChart = ({ data }: { data: { name: string; correct: number }[] }) => (
  <Card className="bg-card border-border">
    <CardHeader>
      <CardTitle className="text-lg flex items-center gap-2">
        <Target className="h-5 w-5 text-primary" />
        Correct Answers Per Attempt
      </CardTitle>
    </CardHeader>
    <CardContent>
      <div className="h-48">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} />
            <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
            <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '8px' }} />
            <Bar dataKey="correct" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </CardContent>
  </Card>
);

const SimulationHistory = ({ results }: { results: SimulationResult[] }) => (
  <Card className="bg-card border-border">
    <CardHeader>
      <CardTitle className="text-lg flex items-center gap-2">
        <Clock className="h-5 w-5 text-primary" />
        Simulation History
      </CardTitle>
    </CardHeader>
    <CardContent>
      <div className="space-y-3">
        {[...results].reverse().map((result, index) => {
          const pct = toPct(result);
          const colorClass = gradeColors[result.grade] || 'text-muted-foreground bg-muted/30 border-border';
          return (
            <div key={result._id} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
              <div className="flex items-center gap-3">
                <span className="text-sm text-muted-foreground w-6">#{results.length - index}</span>
                <div>
                  <p className="text-sm font-medium text-foreground">
                    {new Date(result.completedAt).toLocaleDateString('en-NG', {
                      day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit',
                    })}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {result.correctAnswers}/{result.totalQuestions} correct • {result.timeTakenSeconds ? `${result.timeTakenSeconds}s` : 'N/A'}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-foreground">{pct}%</span>
                <Badge className={cn('text-xs border', colorClass)}>{result.grade}</Badge>
              </div>
            </div>
          );
        })}
      </div>
    </CardContent>
  </Card>
);

const Header = () => (
  <div className="flex items-center gap-3">
    <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center">
      <BarChart3 className="h-6 w-6 text-primary-foreground" />
    </div>
    <div>
      <h1 className="text-2xl font-bold text-foreground">Analytics Dashboard</h1>
      <p className="text-muted-foreground">Track your baseline assessment and phishing simulation performance.</p>
    </div>
  </div>
);

export default AnalyticsTab;