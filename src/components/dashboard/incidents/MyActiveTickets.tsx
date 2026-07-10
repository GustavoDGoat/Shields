import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { motion } from 'framer-motion';
import { Fish, Bug, UserX, Shield, AlertTriangle, Clock, CheckCircle, Search, MessageSquare, KeyRound, ExternalLink } from 'lucide-react';
import { Incident, IncidentType, IncidentStatus, IncidentUrgency, incidentTypeLabels } from './types';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';

interface MyActiveTicketsProps {
  incidents: Incident[];
  loading?: boolean;
}

const incidentIcons: Record<IncidentType, React.ReactNode> = {
  phishing: <Fish className="h-4 w-4" />,
  malware: <Bug className="h-4 w-4" />,
  identity_theft: <UserX className="h-4 w-4" />,
  data_breach: <Shield className="h-4 w-4" />,
  unauthorized_access: <KeyRound className="h-4 w-4" />,
  other: <AlertTriangle className="h-4 w-4" />,
};

const statusColors: Record<IncidentStatus, string> = {
  pending: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20',
  investigating: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
  resolved: 'bg-green-500/10 text-green-500 border-green-500/20',
};

const urgencyColors: Record<IncidentUrgency, string> = {
  low: 'bg-green-500/10 text-green-500',
  medium: 'bg-yellow-500/10 text-yellow-500',
  high: 'bg-red-500/10 text-red-500',
};

const statusSections: { status: IncidentStatus; label: string; icon: React.ReactNode; emptyText: string }[] = [
  { status: 'pending', label: 'Pending Review', icon: <Clock className="h-4 w-4 text-yellow-500" />, emptyText: 'No pending incidents' },
  { status: 'investigating', label: 'Under Investigation', icon: <Search className="h-4 w-4 text-blue-500" />, emptyText: 'No incidents under investigation' },
  { status: 'resolved', label: 'Resolved', icon: <CheckCircle className="h-4 w-4 text-green-500" />, emptyText: 'No resolved incidents' },
];

const IncidentCard = ({ incident }: { incident: Incident }) => (
  <motion.div
    layout
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    className="p-4 rounded-xl glass glass-border hover:bg-white/[0.05] transition-all"
  >
    <div className="flex items-start gap-3">
      <div className={cn("h-10 w-10 rounded-lg flex items-center justify-center shrink-0", urgencyColors[incident.urgencyLevel])}>
        {incidentIcons[incident.incidentType]}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <h4 className="font-medium text-sm">{incidentTypeLabels[incident.incidentType]}</h4>
          <Badge variant="outline" className={cn("text-xs", urgencyColors[incident.urgencyLevel])}>
            {incident.urgencyLevel.toUpperCase()}
          </Badge>
        </div>
        <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{incident.description}</p>

        {incident.evidenceUrl && (
          <div className="mt-2">
            <Button variant="link" size="sm" className="h-auto p-0 text-xs" asChild>
              <a href={incident.evidenceUrl} target="_blank" rel="noreferrer">
                <ExternalLink className="h-3.5 w-3.5" />
                View evidence
              </a>
            </Button>
          </div>
        )}

        <span className="text-xs text-muted-foreground mt-2 block font-mono">
          {format(new Date(incident._creationTime), 'MMM d, yyyy')}
        </span>
      </div>
    </div>

    {incident.adminNote && (
      <div className="mt-3 p-3 rounded-lg bg-primary/5 border border-primary/10">
        <div className="flex items-center gap-2 text-xs text-primary mb-1">
          <MessageSquare className="h-3.5 w-3.5" />
          <span className="font-medium">Admin Response</span>
        </div>
        <p className="text-sm text-foreground/80">{incident.adminNote}</p>
      </div>
    )}
  </motion.div>
);

const MyActiveTickets = ({ incidents, loading }: MyActiveTicketsProps) => {
  const sorted = [...incidents].sort(
    (a, b) => b._creationTime - a._creationTime
  );

  const grouped = statusSections.map((section) => ({
    ...section,
    items: sorted.filter((i) => i.status === section.status),
  }));

  return (
    <Card className="glass glass-border shadow-xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg md:text-xl">
          <Clock className="h-5 w-5 text-primary" />
          My Tickets
        </CardTitle>
        <CardDescription className="text-xs md:text-sm">Track the status of your reported incidents</CardDescription>
      </CardHeader>
      <CardContent>
        {sorted.length === 0 ? (
          <div className="text-center py-8">
            <Shield className="h-12 w-12 mx-auto text-muted-foreground/50 mb-3" />
            <p className="text-muted-foreground">No incidents reported yet</p>
            <p className="text-sm text-muted-foreground/70">Your reported incidents will appear here</p>
          </div>
        ) : (
          <ScrollArea className="h-[500px] pr-4">
            <div className="space-y-6">
              {grouped.map((section) => (
                <div key={section.status}>
                  <div className="flex items-center gap-2 mb-3 pb-2 border-b border-border/30">
                    {section.icon}
                    <h3 className="font-semibold text-xs md:text-sm">{section.label}</h3>
                    <Badge variant="outline" className={cn("text-xs ml-auto", statusColors[section.status])}>
                      {section.items.length}
                    </Badge>
                  </div>
                  {section.items.length === 0 ? (
                    <p className="text-xs text-muted-foreground py-2 pl-6">{section.emptyText}</p>
                  ) : (
                    <div className="space-y-3">
                      {section.items.map((incident) => (
                        <IncidentCard key={incident._id.toString()} incident={incident} />
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  );
};

export default MyActiveTickets;
