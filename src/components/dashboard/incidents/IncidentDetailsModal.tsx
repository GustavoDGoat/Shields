import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { motion } from 'framer-motion';
import { 
  Fish, Bug, UserX, Shield, AlertTriangle, Clock, CheckCircle, 
  Search, User, Mail, Calendar, FileImage, MessageSquare, KeyRound, ExternalLink
} from 'lucide-react';
import { Incident, IncidentType, IncidentStatus, IncidentUrgency, incidentTypeLabels, statusLabels } from './types';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';

interface IncidentDetailsModalProps {
  incident: Incident | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const incidentIcons: Record<IncidentType, React.ReactNode> = {
  phishing: <Fish className="h-5 w-5" />,
  malware: <Bug className="h-5 w-5" />,
  identity_theft: <UserX className="h-5 w-5" />,
  data_breach: <Shield className="h-5 w-5" />,
  unauthorized_access: <KeyRound className="h-5 w-5" />,
  other: <AlertTriangle className="h-5 w-5" />,
};

const statusIcons: Record<IncidentStatus, React.ReactNode> = {
  pending: <Clock className="h-4 w-4" />,
  investigating: <Search className="h-4 w-4" />,
  resolved: <CheckCircle className="h-4 w-4" />,
};

const statusColors: Record<IncidentStatus, string> = {
  pending: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20',
  investigating: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
  resolved: 'bg-green-500/10 text-green-500 border-green-500/20',
};

const urgencyColors: Record<IncidentUrgency, string> = {
  low: 'bg-green-500/10 text-green-500 border-green-500/20',
  medium: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20',
  high: 'bg-red-500/10 text-red-500 border-red-500/20',
};

const IncidentDetailsModal = ({ incident, open, onOpenChange }: IncidentDetailsModalProps) => {
  if (!incident) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] glass border-border/50">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.2 }}
        >
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3">
              <div className={cn(
                "h-10 w-10 rounded-lg flex items-center justify-center",
                urgencyColors[incident.urgencyLevel]
              )}>
                {incidentIcons[incident.incidentType]}
              </div>
              <div className="flex-1">
                <span className="text-base md:text-lg">{incidentTypeLabels[incident.incidentType]}</span>
                <div className="flex items-center gap-2 mt-1 flex-wrap">
                  <Badge variant="outline" className={cn("text-xs", statusColors[incident.status])}>
                    {statusIcons[incident.status]}
                    <span className="ml-1">{statusLabels[incident.status]}</span>
                  </Badge>
                  <Badge variant="outline" className={cn("text-xs", urgencyColors[incident.urgencyLevel])}>
                    {incident.urgencyLevel.toUpperCase()} URGENCY
                  </Badge>
                </div>
              </div>
            </DialogTitle>
          </DialogHeader>

          <ScrollArea className="max-h-[60vh] pr-4">
            <div className="space-y-6 py-4">
              <div className="space-y-3">
                <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                  Reporter Information
                </h3>
                <div className="grid gap-3 p-4 rounded-xl glass">
                  <div className="flex items-center gap-3">
                    <User className="h-4 w-4 text-primary" />
                    <span className="text-sm font-medium">{incident.studentName || 'Unknown User'}</span>
                  </div>
                  {incident.studentEmail && (
                    <div className="flex items-center gap-3">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">{incident.studentEmail}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-3">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="text-xs md:text-sm text-muted-foreground font-mono">
                      {format(new Date(incident._creationTime), 'MMMM d, yyyy \'at\' h:mm a')}
                    </span>
                  </div>
                </div>
              </div>

              <Separator className="bg-border/30" />

              <div className="space-y-3">
                <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                  Incident Description
                </h3>
                <div className="p-4 rounded-xl glass">
                  <p className="text-sm leading-relaxed whitespace-pre-wrap">{incident.description}</p>
                </div>
              </div>

              {incident.evidenceUrl && (
                <>
                  <Separator className="bg-border/30" />
                  <div className="space-y-3">
                    <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide flex items-center gap-2">
                      <FileImage className="h-4 w-4" />
                      Evidence Attached
                    </h3>
                    <div className="p-4 rounded-xl glass space-y-3">
                      <div className="relative overflow-hidden rounded-lg border border-border bg-muted/30">
                        <img 
                          src={incident.evidenceUrl} 
                          alt="Evidence" 
                          className="w-full max-h-[300px] object-contain"
                          onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                        />
                      </div>
                      <Button variant="outline" size="sm" asChild className="gap-2">
                        <a href={incident.evidenceUrl} target="_blank" rel="noreferrer">
                          <ExternalLink className="h-4 w-4" />
                          Open Full Image
                        </a>
                      </Button>
                    </div>
                  </div>
                </>
              )}

              {incident.adminNote && (
                <>
                  <Separator className="bg-border/30" />
                  <div className="space-y-3">
                    <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide flex items-center gap-2">
                      <MessageSquare className="h-4 w-4" />
                      Admin Response
                    </h3>
                    <div className="p-4 rounded-xl bg-primary/5 border border-primary/10">
                      <p className="text-sm leading-relaxed whitespace-pre-wrap">{incident.adminNote}</p>
                    </div>
                  </div>
                </>
              )}

              <Separator className="bg-border/30" />
              <div className="space-y-3">
                <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                  Additional Details
                </h3>
                <div className="grid grid-cols-2 gap-3 p-4 rounded-xl glass">
                  <div>
                    <p className="text-xs text-muted-foreground">Incident ID</p>
                    <p className="text-sm font-mono">{incident._id.toString().slice(0, 8)}...</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Last Updated</p>
                    <p className="text-xs md:text-sm font-mono">
                      {format(new Date(incident.updatedAt ?? incident._creationTime), 'MMM d, yyyy h:mm a')}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </ScrollArea>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
};

export default IncidentDetailsModal;
