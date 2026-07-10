import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  BarChart3, 
  Trophy, 
  Target, 
  Clock, 
  TrendingUp,
  Loader2,
  FileX
} from 'lucide-react';
import { useQuery } from 'convex/react';
import { api } from '../../../../convex/_generated/api';
import { cn } from '@/lib/utils';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

interface SimulationResult {
  _id: string;
  _creationTime: number;
  score: number;
  totalQuestions: number;
  correctAnswers: number;
  grade: string;
  completedAt: string;
  timeTakenSeconds: number | null;
}

const gradeColors: Record<string, string> = {
  A: 'text-green-400 bg-green-500/20 border-green-500/30',
  B: 'text-green-400 bg-green-500/15 border-green-500/25',
  C: 'text-yellow-400 bg-yellow-500/15 border-yellow-500/25',
  D: 'text-orange-400 bg-orange-500/15 border-orange-500/25',
  E: 'text-orange-400 bg-orange-500/10 border-orange-500/20',
  F: 'text-red-400 bg-red-500/15 border-red-500/25',
};

const AnalyticsTab = () => {
  const results = useQuery(api.simulationResults.listByUser);

  const sortedResults = (results ?? []) as SimulationResult[];

  if (results === undefined) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (sortedResults.length === 0) {
    return (
      <div className="space-y-6">
        <Header />
        <Card className="bg-card border-border">
          <CardContent className="py-16 text-center">
            <FileX className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">No Simulation Data Yet</h3>
            <p className="text-muted-foreground max-w-md mx-auto">
              Complete a phishing simulation to see your analytics and track your progress over time.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const latestResult = sortedResults[sortedResults.length - 1];
  const bestScore = Math.max(...sortedResults.map(r => Math.round((r.score / (r.totalQuestions * 10)) * 100)));
  const avgScore = Math.round(sortedResults.reduce((acc, r) => acc + (r.score / (r.totalQuestions * 10)) * 100, 0) / sortedResults.length);
  const totalSimulations = sortedResults.length;

  const chartData = sortedResults.map((r, i) => ({
    name: `#${i + 1}`,
    score: Math.round((r.score / (r.totalQuestions * 10)) * 100),
    correct: r.correctAnswers,
    date: new Date(r.completedAt).toLocaleDateString(),
  }));

  return (
    <div className="space-y-6">
      <Header />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard icon={Trophy} label="Best Score" value={`${bestScore}%`} iconColor="text-yellow-500" />
        <StatCard icon={Target} label="Avg Score" value={`${avgScore}%`} iconColor="text-primary" />
        <StatCard icon={BarChart3} label="Total Attempts" value={`${totalSimulations}`} iconColor="text-accent" />
        <StatCard icon={TrendingUp} label="Latest Grade" value={latestResult.grade} iconColor="text-green-500" />
      </div>

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
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} domain={[0, 100]} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                    color: 'hsl(var(--foreground))',
                  }}
                  formatter={(value: number) => [`${value}%`, 'Score']}
                  labelFormatter={(label: string, payload) => payload?.[0]?.payload?.date || label}
                />
                <Line
                  type="monotone"
                  dataKey="score"
                  stroke="hsl(var(--primary))"
                  strokeWidth={2}
                  dot={{ fill: 'hsl(var(--primary))', r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

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
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                    color: 'hsl(var(--foreground))',
                  }}
                />
                <Bar dataKey="correct" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Clock className="h-5 w-5 text-primary" />
            Simulation History
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[...sortedResults].reverse().map((result, index) => {
              const pct = Math.round((result.score / (result.totalQuestions * 10)) * 100);
              const colorClass = gradeColors[result.grade] || 'text-muted-foreground bg-muted/30 border-border';
              return (
                <div
                  key={result._id}
                  className="flex items-center justify-between p-3 bg-muted/30 rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-sm text-muted-foreground w-6">#{sortedResults.length - index}</span>
                    <div>
                      <p className="text-sm font-medium text-foreground">
                        {new Date(result.completedAt).toLocaleDateString('en-NG', {
                          day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit'
                        })}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {result.correctAnswers}/{result.totalQuestions} correct • {result.timeTakenSeconds ? `${result.timeTakenSeconds}s` : 'N/A'}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-foreground">{pct}%</span>
                    <Badge className={cn('text-xs border', colorClass)}>
                      {result.grade}
                    </Badge>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

const Header = () => (
  <div className="flex items-center gap-3">
    <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center">
      <BarChart3 className="h-6 w-6 text-primary-foreground" />
    </div>
    <div>
      <h1 className="text-2xl font-bold text-foreground">Analytics Dashboard</h1>
      <p className="text-muted-foreground">Track your phishing simulation performance over time.</p>
    </div>
  </div>
);

const StatCard = ({ icon: Icon, label, value, iconColor }: { icon: any; label: string; value: string; iconColor: string }) => (
  <Card className="bg-card border-border">
    <CardContent className="pt-4 text-center">
      <Icon className={cn("h-6 w-6 mx-auto mb-2", iconColor)} />
      <p className="text-2xl font-bold text-foreground">{value}</p>
      <p className="text-xs text-muted-foreground">{label}</p>
    </CardContent>
  </Card>
);

export default AnalyticsTab;
