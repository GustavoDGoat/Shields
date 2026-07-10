import { useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, XCircle, AlertTriangle, ArrowRight } from 'lucide-react';
import { PhishingScenario, UserAction } from './types';
import { cn } from '@/lib/utils';

interface FeedbackModalProps {
  isOpen: boolean;
  scenario: PhishingScenario;
  userAction: UserAction;
  isCorrect: boolean;
  onContinue: () => void;
}

const getActionLabel = (action: UserAction): string => {
  switch (action) {
    case 'report': return 'Reported as Phishing';
    case 'not-phishing': return 'Reported as Not Phishing';
    default: return action;
  }
};

const FeedbackModal = ({ 
  isOpen, 
  scenario, 
  userAction, 
  isCorrect, 
  onContinue 
}: FeedbackModalProps) => {
  // Auto-continue after 8 seconds
  useEffect(() => {
    if (!isOpen) return;
    const timer = setTimeout(onContinue, 8000);
    return () => clearTimeout(timer);
  }, [isOpen, onContinue]);

  return (
    <Dialog open={isOpen} onOpenChange={() => {}}>
      <DialogContent 
        className={cn(
          "sm:max-w-lg border-2",
          isCorrect ? "border-green-500/50" : "border-red-500/50"
        )}
        onPointerDownOutside={(e) => e.preventDefault()}
        onEscapeKeyDown={(e) => e.preventDefault()}
      >
        <DialogHeader>
          <div className="flex items-center gap-3">
            {isCorrect ? (
              <div className="h-12 w-12 rounded-full bg-green-500/20 flex items-center justify-center">
                <CheckCircle className="h-7 w-7 text-green-500" />
              </div>
            ) : (
              <div className="h-12 w-12 rounded-full bg-red-500/20 flex items-center justify-center">
                <XCircle className="h-7 w-7 text-red-500" />
              </div>
            )}
            <div>
              <DialogTitle className={cn(
                "text-xl",
                isCorrect ? "text-green-400" : "text-red-400"
              )}>
                {isCorrect ? 'Correct!' : 'Incorrect'}
              </DialogTitle>
              <DialogDescription className="text-muted-foreground">
                You chose: {getActionLabel(userAction)}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-4 mt-2">
          {/* Result Badge */}
          <div className="flex items-center gap-2">
            <Badge 
              variant={scenario.type === 'phishing' ? 'destructive' : 'default'}
              className="text-sm"
            >
              {scenario.type === 'phishing' ? '⚠️ This was PHISHING' : '✅ This was LEGITIMATE'}
            </Badge>
          </div>

          {/* Explanation */}
          <div className="bg-muted/30 rounded-lg p-4">
            <p className="text-sm text-foreground/90 leading-relaxed">
              {scenario.explanation}
            </p>
          </div>

          {/* Red Flags (if phishing) */}
          {scenario.type === 'phishing' && scenario.redFlags.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm font-medium text-yellow-400">
                <AlertTriangle className="h-4 w-4" />
                Red Flags to Watch For:
              </div>
              <ul className="space-y-1">
                {scenario.redFlags.map((flag, index) => (
                  <li 
                    key={index}
                    className="text-sm text-muted-foreground flex items-center gap-2"
                  >
                    <span className="h-1.5 w-1.5 rounded-full bg-red-400" />
                    {flag}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Points */}
          <div className={cn(
            "text-center py-3 rounded-lg",
            isCorrect ? "bg-green-500/10" : "bg-red-500/10"
          )}>
            <span className={cn(
              "text-2xl font-bold",
              isCorrect ? "text-green-400" : "text-red-400"
            )}>
              {isCorrect ? '+10 points' : '+0 points'}
            </span>
          </div>

          {/* Continue Button */}
          <Button 
            className="w-full" 
            onClick={onContinue}
            aria-label="Continue to next scenario"
          >
            Continue
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default FeedbackModal;
