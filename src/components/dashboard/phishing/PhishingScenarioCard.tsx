import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Mail, 
  Paperclip, 
  Link as LinkIcon, 
  AlertTriangle, 
  Flag, 
  CheckCircle,
  Clock
} from 'lucide-react';
import { PhishingScenario, UserAction } from './types';
import { cn } from '@/lib/utils';

interface PhishingScenarioCardProps {
  scenario: PhishingScenario;
  onAction: (action: UserAction) => void;
  timeLimit: number;
  disabled?: boolean;
}

const PhishingScenarioCard = ({ 
  scenario, 
  onAction, 
  timeLimit,
  disabled = false 
}: PhishingScenarioCardProps) => {
  const [timeRemaining, setTimeRemaining] = useState(timeLimit);
  const [isExpired, setIsExpired] = useState(false);

  useEffect(() => {
    setTimeRemaining(timeLimit);
    setIsExpired(false);
  }, [scenario.id, timeLimit]);

  useEffect(() => {
    if (disabled || isExpired) return;

    const timer = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          setIsExpired(true);
          onAction('not-phishing');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [disabled, isExpired, onAction, scenario.id]);

  const timerColor = timeRemaining > 20 
    ? 'text-green-400' 
    : timeRemaining > 10 
      ? 'text-yellow-400' 
      : 'text-red-400';

  return (
    <Card className="bg-card border-border overflow-hidden">
      {/* Timer Bar */}
      <div className="h-1 bg-muted overflow-hidden">
        <div 
          className={cn(
            "h-full transition-all duration-1000 ease-linear",
            timeRemaining > 20 ? "bg-green-500" : timeRemaining > 10 ? "bg-yellow-500" : "bg-red-500"
          )}
          style={{ width: `${(timeRemaining / timeLimit) * 100}%` }}
        />
      </div>

      {/* Email Header */}
      <CardHeader className="border-b border-border pb-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-3 min-w-0">
            <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
              <Mail className="h-5 w-5 text-primary" />
            </div>
            <div className="min-w-0">
              <p className="font-semibold text-foreground truncate">{scenario.sender.name}</p>
              <p className="text-sm text-muted-foreground truncate">{scenario.sender.email}</p>
            </div>
          </div>
          <div className={cn("flex items-center gap-2 flex-shrink-0", timerColor)}>
            <Clock className="h-4 w-4" />
            <span className="font-mono text-sm font-medium">{timeRemaining}s</span>
          </div>
        </div>
        <div className="mt-3">
          <p className="font-medium text-foreground">{scenario.subject}</p>
        </div>
      </CardHeader>

      {/* Email Body */}
      <CardContent className="pt-4 space-y-4">
        <div className="bg-muted/30 rounded-lg p-4">
          <p className="text-sm text-foreground/90 whitespace-pre-line leading-relaxed">
            {scenario.body}
          </p>
        </div>

        {/* Email Elements */}
        <div className="flex flex-wrap gap-2">
          {scenario.hasLink && (
            <Badge variant="outline" className="flex items-center gap-1.5 text-primary border-primary/30">
              <LinkIcon className="h-3 w-3" />
              <span className="text-xs">{scenario.linkText}</span>
            </Badge>
          )}
          {scenario.hasAttachment && (
            <Badge variant="outline" className="flex items-center gap-1.5 text-accent border-accent/30">
              <Paperclip className="h-3 w-3" />
              <span className="text-xs">{scenario.attachmentName}</span>
            </Badge>
          )}
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-3 pt-2">
          <Button 
            variant="destructive"
            className="flex items-center gap-2"
            onClick={() => onAction('report')}
            disabled={disabled}
            aria-label="Report this email as phishing"
          >
            <Flag className="h-4 w-4" />
            Report as Phishing
          </Button>
          <Button 
            variant="default"
            className="flex items-center gap-2"
            onClick={() => onAction('not-phishing')}
            disabled={disabled}
            aria-label="Report this email as not phishing"
          >
            <CheckCircle className="h-4 w-4" />
            Report as Not Phishing
          </Button>
        </div>

        {/* Warning Notice */}
        <div className="flex items-start gap-2 p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
          <AlertTriangle className="h-4 w-4 text-yellow-500 flex-shrink-0 mt-0.5" />
          <p className="text-xs text-yellow-200/80">
            This is a simulated email for training purposes. No real actions will be taken.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default PhishingScenarioCard;
