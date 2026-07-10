import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Shield, Trash2, MessageSquare, Fish, Bug, UserX, AlertTriangle,
  Search, Clock, CheckCircle, KeyRound, Eye, ChevronDown
} from 'lucide-react';
import { Incident, IncidentType, IncidentStatus, IncidentUrgency, incidentTypeLabels, statusLabels } from './types';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { useIsMobile } from '@/hooks/use-mobile';
import IncidentDetailsModal from './IncidentDetailsModal';
import SimulationManagement from '../phishing/SimulationManagement';
import VideoManagement from '../training/VideoManagement';
import UserManagement from '../admin/UserManagement';

interface AdminConsoleProps {
  incidents: Incident[];
  onUpdateStatus: (id: string, status: IncidentStatus) => void;
  onDelete: (id: string) => void;
  onAddNote: (id: string, note: string) => void;
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

const MobileIncidentCard = ({
  incident,
  onUpdateStatus,
  onDelete,
  onOpenNote,
  onOpenDetails,
}: {
  incident: Incident;
  onUpdateStatus: (id: string, status: IncidentStatus) => void;
  onDelete: (id: string) => void;
  onOpenNote: (incident: Incident) => void;
  onOpenDetails: (incident: Incident) => void;
}) => {
  const [open, setOpen] = useState(false);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.3 }}
    >
      <Collapsible open={open} onOpenChange={setOpen}>
        <CollapsibleTrigger asChild>
          <button className="w-full text-left p-3 rounded-lg glass glass-border hover:bg-white/[0.05] transition-all">
            <div className="flex items-center gap-3">
              <div className={cn("h-9 w-9 rounded-lg flex items-center justify-center shrink-0", urgencyColors[incident.urgencyLevel])}>
                {incidentIcons[incident.incidentType]}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium truncate">{incident.studentName || 'Unknown'}</span>
                  <Badge variant="outline" className={cn("text-[10px] shrink-0", urgencyColors[incident.urgencyLevel])}>
                    {incident.urgencyLevel.toUpperCase()}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground mt-0.5 font-mono">
                  {format(new Date(incident._creationTime), 'MMM d, yyyy')}
                </p>
              </div>
              <ChevronDown className={cn("h-4 w-4 text-muted-foreground transition-transform", open && "rotate-180")} />
            </div>
          </button>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <div className="px-3 pb-3 pt-2 space-y-3">
            <p className="text-sm text-muted-foreground">{incident.description}</p>
            <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
              <Select
                value={incident.status}
                onValueChange={(value) => onUpdateStatus(incident._id.toString(), value as IncidentStatus)}
              >
                <SelectTrigger className={cn("h-8 text-xs flex-1", statusColors[incident.status])}>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-popover border-border">
                  <SelectItem value="pending" className="text-xs">Pending</SelectItem>
                  <SelectItem value="investigating" className="text-xs">Investigating</SelectItem>
                  <SelectItem value="resolved" className="text-xs">Resolved</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center gap-1">
              <Button variant="ghost" size="sm" className="h-8 text-xs gap-1.5" onClick={() => onOpenDetails(incident)}>
                <Eye className="h-3.5 w-3.5" /> View
              </Button>
              <Button variant="ghost" size="sm" className="h-8 text-xs gap-1.5" onClick={() => onOpenNote(incident)}>
                <MessageSquare className={cn("h-3.5 w-3.5", incident.adminNote ? "text-primary" : "")} /> Note
              </Button>
              <Button variant="ghost" size="sm" className="h-8 text-xs gap-1.5 text-destructive" onClick={() => onDelete(incident._id.toString())}>
                <Trash2 className="h-3.5 w-3.5" /> Delete
              </Button>
            </div>
          </div>
        </CollapsibleContent>
      </Collapsible>
    </motion.div>
  );
};

const AdminConsole = ({ incidents, onUpdateStatus, onDelete, onAddNote }: AdminConsoleProps) => {
  const isMobile = useIsMobile();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<IncidentStatus | 'all'>('all');
  const [noteDialogOpen, setNoteDialogOpen] = useState(false);
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [selectedIncident, setSelectedIncident] = useState<Incident | null>(null);
  const [noteText, setNoteText] = useState('');

  const filteredIncidents = incidents.filter((incident) => {
    const matchesSearch = 
      (incident.studentName?.toLowerCase().includes(searchQuery.toLowerCase()) || false) ||
      incident.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || incident.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const sortedIncidents = [...filteredIncidents].sort(
    (a, b) => b._creationTime - a._creationTime
  );

  const handleAddNote = () => {
    if (selectedIncident && noteText.trim()) {
      onAddNote(selectedIncident._id.toString(), noteText);
      setNoteDialogOpen(false);
      setNoteText('');
      setSelectedIncident(null);
    }
  };

  const openNoteDialog = (incident: Incident, e?: React.MouseEvent) => {
    e?.stopPropagation();
    setSelectedIncident(incident);
    setNoteText(incident.adminNote || '');
    setNoteDialogOpen(true);
  };

  const openDetailsModal = (incident: Incident) => {
    setSelectedIncident(incident);
    setDetailsModalOpen(true);
  };

  const stats = {
    total: incidents.length,
    pending: incidents.filter(i => i.status === 'pending').length,
    investigating: incidents.filter(i => i.status === 'investigating').length,
    resolved: incidents.filter(i => i.status === 'resolved').length,
  };

  const sections: { status: IncidentStatus; label: string; icon: React.ReactNode; color: string; glowClass: string }[] = [
    { status: 'pending', label: 'Pending Review', icon: <Clock className="h-4 w-4 text-yellow-500" />, color: 'border-yellow-500/30', glowClass: 'glow-stat-yellow' },
    { status: 'investigating', label: 'Under Investigation', icon: <Search className="h-4 w-4 text-blue-500" />, color: 'border-blue-500/30', glowClass: 'glow-stat-blue' },
    { status: 'resolved', label: 'Resolved', icon: <CheckCircle className="h-4 w-4 text-green-500" />, color: 'border-green-500/30', glowClass: 'glow-stat-green' },
  ];

  const grouped = sections.map(s => ({
    ...s,
    items: sortedIncidents.filter(i => i.status === s.status),
  }));

  const handleStatusChange = (id: string, value: string) => {
    onUpdateStatus(id, value as IncidentStatus);
  };

  return (
    <>
    <Card className="glass glass-border shadow-xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg md:text-xl">
          <Shield className="h-5 w-5 text-primary" />
          Admin Management Console
        </CardTitle>
        <CardDescription className="text-xs md:text-sm">
          Manage and respond to all reported security incidents
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
          <motion.div whileHover={{ scale: 1.03 }} className="p-4 rounded-xl glass glass-border glow-stat-cyan transition-all">
            <p className="text-2xl md:text-3xl font-bold font-mono">{stats.total}</p>
            <p className="text-xs md:text-sm text-muted-foreground">Total Reports</p>
          </motion.div>
          <motion.div whileHover={{ scale: 1.03 }} className="p-4 rounded-xl glass glass-border glow-stat-yellow transition-all">
            <p className="text-2xl md:text-3xl font-bold text-yellow-500 font-mono">{stats.pending}</p>
            <p className="text-xs md:text-sm text-yellow-500/70">Pending</p>
          </motion.div>
          <motion.div whileHover={{ scale: 1.03 }} className="p-4 rounded-xl glass glass-border glow-stat-blue transition-all">
            <p className="text-2xl md:text-3xl font-bold text-blue-500 font-mono">{stats.investigating}</p>
            <p className="text-xs md:text-sm text-blue-500/70">Investigating</p>
          </motion.div>
          <motion.div whileHover={{ scale: 1.03 }} className="p-4 rounded-xl glass glass-border glow-stat-green transition-all">
            <p className="text-2xl md:text-3xl font-bold text-green-500 font-mono">{stats.resolved}</p>
            <p className="text-xs md:text-sm text-green-500/70">Resolved</p>
          </motion.div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 md:gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by user or description..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-background/50 text-sm"
            />
          </div>
          <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value as IncidentStatus | 'all')}>
            <SelectTrigger className="w-full sm:w-[180px] bg-background/50 text-sm">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent className="bg-popover border-border">
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="investigating">Investigating</SelectItem>
              <SelectItem value="resolved">Resolved</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-6">
          {grouped.map(section => (
            <motion.div
              key={section.status}
              layout
              className={cn("rounded-xl glass glass-border p-4", section.items.length > 0 && section.glowClass)}
            >
              <div className="flex items-center gap-2 mb-4">
                {section.icon}
                <h3 className="font-semibold text-xs md:text-sm">{section.label}</h3>
                <Badge variant="outline" className={cn("text-xs ml-auto", statusColors[section.status])}>
                  {section.items.length}
                </Badge>
              </div>
              {section.items.length === 0 ? (
                <p className="text-xs md:text-sm text-muted-foreground text-center py-4">No {section.label.toLowerCase()} incidents</p>
              ) : isMobile ? (
                <div className="space-y-2">
                  <AnimatePresence mode="popLayout">
                    {section.items.map((incident) => (
                      <MobileIncidentCard
                        key={incident._id.toString()}
                        incident={incident}
                        onUpdateStatus={onUpdateStatus}
                        onDelete={onDelete}
                        onOpenNote={(inc) => openNoteDialog(inc)}
                        onOpenDetails={openDetailsModal}
                      />
                    ))}
                  </AnimatePresence>
                </div>
              ) : (
                <ScrollArea className={section.items.length > 3 ? "h-[300px]" : ""}>
                  <Table>
                    <TableHeader>
                      <TableRow className="border-border/50 hover:bg-transparent">
                        <TableHead className="text-muted-foreground">Type</TableHead>
                        <TableHead className="text-muted-foreground">User</TableHead>
                        <TableHead className="text-muted-foreground">Description</TableHead>
                        <TableHead className="text-muted-foreground">Urgency</TableHead>
                        <TableHead className="text-muted-foreground">Status</TableHead>
                        <TableHead className="text-muted-foreground text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <AnimatePresence mode="popLayout">
                        {section.items.map((incident) => (
                          <motion.tr
                            key={incident._id.toString()}
                            layout
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                            transition={{ duration: 0.3 }}
                            className="border-border/50 cursor-pointer hover:bg-white/[0.03] transition-colors"
                            onClick={() => openDetailsModal(incident)}
                          >
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <span className={cn("p-1.5 rounded", urgencyColors[incident.urgencyLevel])}>
                                  {incidentIcons[incident.incidentType]}
                                </span>
                                <span className="text-sm">
                                  {incidentTypeLabels[incident.incidentType]}
                                </span>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div>
                                <p className="font-medium text-sm">{incident.studentName || 'Unknown'}</p>
                                <p className="text-xs text-muted-foreground font-mono">
                                  {format(new Date(incident._creationTime), 'MMM d')}
                                </p>
                              </div>
                            </TableCell>
                            <TableCell className="max-w-[200px]">
                              <p className="text-sm text-muted-foreground truncate">
                                {incident.description}
                              </p>
                            </TableCell>
                            <TableCell>
                              <Badge variant="outline" className={cn("text-xs", urgencyColors[incident.urgencyLevel])}>
                                {incident.urgencyLevel.toUpperCase()}
                              </Badge>
                            </TableCell>
                            <TableCell onClick={(e) => e.stopPropagation()}>
                              <Select 
                                value={incident.status} 
                                onValueChange={(value) => handleStatusChange(incident._id.toString(), value)}
                              >
                                <SelectTrigger className={cn("w-[140px] h-8 text-xs", statusColors[incident.status])}>
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent className="bg-popover border-border">
                                  <SelectItem value="pending" className="text-xs">
                                    <span className="flex items-center gap-2"><Clock className="h-3 w-3" />Pending</span>
                                  </SelectItem>
                                  <SelectItem value="investigating" className="text-xs">
                                    <span className="flex items-center gap-2"><Search className="h-3 w-3" />Investigating</span>
                                  </SelectItem>
                                  <SelectItem value="resolved" className="text-xs">
                                    <span className="flex items-center gap-2"><CheckCircle className="h-3 w-3" />Resolved</span>
                                  </SelectItem>
                                </SelectContent>
                              </Select>
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex items-center justify-end gap-1">
                                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={(e) => { e.stopPropagation(); openDetailsModal(incident); }}>
                                  <Eye className="h-4 w-4 text-muted-foreground" />
                                </Button>
                                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={(e) => openNoteDialog(incident, e)}>
                                  <MessageSquare className={cn("h-4 w-4", incident.adminNote ? "text-primary" : "text-muted-foreground")} />
                                </Button>
                                <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive" onClick={(e) => { e.stopPropagation(); onDelete(incident._id.toString()); }}>
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </TableCell>
                          </motion.tr>
                        ))}
                      </AnimatePresence>
                    </TableBody>
                  </Table>
                </ScrollArea>
              )}
            </motion.div>
          ))}
        </div>

        <Dialog open={noteDialogOpen} onOpenChange={setNoteDialogOpen}>
          <DialogContent className="glass border-border">
            <DialogHeader>
              <DialogTitle>Add Admin Note</DialogTitle>
              <DialogDescription>
                This note will be visible to the student who reported the incident.
              </DialogDescription>
            </DialogHeader>
            <Textarea
              placeholder="Enter your response or update..."
              value={noteText}
              onChange={(e) => setNoteText(e.target.value)}
              className="min-h-[120px] bg-background/50"
            />
            <DialogFooter>
              <Button variant="outline" onClick={() => setNoteDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddNote} disabled={!noteText.trim()}>
                <MessageSquare className="mr-2 h-4 w-4" />
                Save Note
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        <IncidentDetailsModal 
          incident={selectedIncident}
          open={detailsModalOpen}
          onOpenChange={setDetailsModalOpen}
        />
      </CardContent>
    </Card>

    <SimulationManagement />
    <VideoManagement />
    <UserManagement />
    </>
  );
};

export default AdminConsole;
