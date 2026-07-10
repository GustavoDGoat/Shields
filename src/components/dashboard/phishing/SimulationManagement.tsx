import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { motion, AnimatePresence } from 'framer-motion';
import { Fish, Plus, Pencil, Trash2, Loader2, ShieldAlert, ShieldCheck, ChevronDown } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { usePhishingSimulations, SimulationFormData, PhishingSimulationRow } from '@/hooks/usePhishingSimulations';
import { useAuth } from '@/hooks/useAuth';
import { useIsMobile } from '@/hooks/use-mobile';

const difficultyColors: Record<string, string> = {
  easy: 'bg-green-500/10 text-green-500 border-green-500/20',
  medium: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20',
  hard: 'bg-red-500/10 text-red-500 border-red-500/20',
};

const emptyForm: SimulationFormData = {
  title: '',
  description: '',
  difficultyLevel: 'medium',
  content: {},
  isPhishing: true,
};

const MobileSimCard = ({ sim, onEdit, onDelete }: { sim: PhishingSimulationRow; onEdit: (s: PhishingSimulationRow) => void; onDelete: (id: string) => void }) => {
  const [open, setOpen] = useState(false);
  return (
    <motion.div layout initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
      <Collapsible open={open} onOpenChange={setOpen}>
        <CollapsibleTrigger asChild>
          <button className="w-full text-left p-3 rounded-xl glass glass-border hover:bg-white/[0.05] transition-all">
            <div className="flex items-center gap-3">
              <div className={cn("h-9 w-9 rounded-lg flex items-center justify-center shrink-0", sim.isPhishing ? 'bg-destructive/10' : 'bg-emerald-500/10')}>
                {sim.isPhishing ? <ShieldAlert className="h-4 w-4 text-destructive" /> : <ShieldCheck className="h-4 w-4 text-emerald-500" />}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{sim.title}</p>
                <div className="flex items-center gap-2 mt-0.5">
                  <Badge variant="outline" className={cn('text-[10px] capitalize', difficultyColors[sim.difficultyLevel] || '')}>
                    {sim.difficultyLevel}
                  </Badge>
                  <span className="text-[10px] text-muted-foreground font-mono">{format(new Date(sim._creationTime), 'MMM d')}</span>
                </div>
              </div>
              <ChevronDown className={cn("h-4 w-4 text-muted-foreground transition-transform", open && "rotate-180")} />
            </div>
          </button>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <div className="px-3 pb-3 pt-2 space-y-2">
            <p className="text-xs text-muted-foreground">{sim.description}</p>
            <div className="flex gap-1">
              <Button variant="ghost" size="sm" className="h-8 text-xs gap-1.5" onClick={() => onEdit(sim)}>
                <Pencil className="h-3.5 w-3.5" /> Edit
              </Button>
              <Button variant="ghost" size="sm" className="h-8 text-xs gap-1.5 text-destructive" onClick={() => onDelete(sim._id.toString())}>
                <Trash2 className="h-3.5 w-3.5" /> Delete
              </Button>
            </div>
          </div>
        </CollapsibleContent>
      </Collapsible>
    </motion.div>
  );
};

const SimulationManagement = () => {
  const isMobile = useIsMobile();
  const { user } = useAuth();
  const { simulations, loading, createSimulation, updateSimulation, deleteSimulation } = usePhishingSimulations();
  const [formOpen, setFormOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [formData, setFormData] = useState<SimulationFormData>(emptyForm);
  const [contentJson, setContentJson] = useState('{}');
  const [jsonError, setJsonError] = useState(false);
  const [saving, setSaving] = useState(false);

  const isEditing = selectedId !== null;

  const openCreate = () => {
    setSelectedId(null); setFormData(emptyForm); setContentJson('{}'); setJsonError(false); setFormOpen(true);
  };

  const openEdit = (sim: PhishingSimulationRow) => {
    setSelectedId(sim._id.toString());
    setFormData({ title: sim.title, description: sim.description, difficultyLevel: sim.difficultyLevel, content: sim.content, isPhishing: sim.isPhishing });
    setContentJson(JSON.stringify(sim.content, null, 2));
    setJsonError(false); setFormOpen(true);
  };

  const openDelete = (id: string) => { setSelectedId(id); setDeleteDialogOpen(true); };

  const handleSave = async () => {
    if (!user) return;
    let parsedContent: Record<string, unknown>;
    try { parsedContent = JSON.parse(contentJson); setJsonError(false); } catch { setJsonError(true); return; }
    const data = { ...formData, content: parsedContent };
    setSaving(true);
    const success = isEditing ? await updateSimulation(selectedId!, data, user.id) : await createSimulation(data, user.id);
    setSaving(false);
    if (success) setFormOpen(false);
  };

  const handleDelete = async () => {
    if (!selectedId || !user) return;
    await deleteSimulation(selectedId, user.id);
    setDeleteDialogOpen(false); setSelectedId(null);
  };

  return (
    <Card className="glass glass-border shadow-xl">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2 text-lg md:text-xl">
              <Fish className="h-5 w-5 text-primary" />
              Phishing Simulations
            </CardTitle>
            <CardDescription className="text-xs md:text-sm">Manage phishing simulation scenarios</CardDescription>
          </div>
          <Button onClick={openCreate} className="gap-2" size={isMobile ? "sm" : "default"}>
            <Plus className="h-4 w-4" />
            <span className="hidden sm:inline">Add Simulation</span>
            <span className="sm:hidden">Add</span>
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex justify-center py-12"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div>
        ) : simulations.length === 0 ? (
          <div className="text-center py-12">
            <Fish className="h-12 w-12 mx-auto text-muted-foreground/50 mb-3" />
            <p className="text-muted-foreground">No simulations yet. Create your first one.</p>
          </div>
        ) : isMobile ? (
          <div className="space-y-2">
            <AnimatePresence mode="popLayout">
              {simulations.map((sim) => (
                <MobileSimCard key={sim._id.toString()} sim={sim} onEdit={openEdit} onDelete={openDelete} />
              ))}
            </AnimatePresence>
          </div>
        ) : (
          <ScrollArea className={simulations.length > 5 ? 'h-[400px]' : ''}>
            <Table>
              <TableHeader>
                <TableRow className="border-border/50 hover:bg-transparent">
                  <TableHead className="text-muted-foreground">Title</TableHead>
                  <TableHead className="text-muted-foreground hidden md:table-cell">Description</TableHead>
                  <TableHead className="text-muted-foreground">Type</TableHead>
                  <TableHead className="text-muted-foreground">Difficulty</TableHead>
                  <TableHead className="text-muted-foreground hidden sm:table-cell">Created</TableHead>
                  <TableHead className="text-muted-foreground text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <AnimatePresence mode="popLayout">
                  {simulations.map((sim) => (
                    <motion.tr
                      key={sim._id.toString()}
                      layout
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="border-border/50 hover:bg-white/[0.03] transition-colors"
                    >
                      <TableCell className="font-medium text-sm">{sim.title}</TableCell>
                      <TableCell className="hidden md:table-cell max-w-[200px]">
                        <p className="text-sm text-muted-foreground truncate">{sim.description}</p>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className={cn('text-xs', sim.isPhishing ? 'bg-destructive/10 text-destructive border-destructive/20' : 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20')}>
                          {sim.isPhishing ? 'Phishing' : 'Legitimate'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className={cn('text-xs capitalize', difficultyColors[sim.difficultyLevel] || '')}>
                          {sim.difficultyLevel}
                        </Badge>
                      </TableCell>
                      <TableCell className="hidden sm:table-cell text-sm text-muted-foreground font-mono">
                        {format(new Date(sim._creationTime), 'MMM d, yyyy')}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openEdit(sim)}>
                            <Pencil className="h-4 w-4 text-muted-foreground" />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive" onClick={() => openDelete(sim._id.toString())}>
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

        <Dialog open={formOpen} onOpenChange={setFormOpen}>
          <DialogContent className="glass border-border/50 sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>{isEditing ? 'Edit Simulation' : 'Create Simulation'}</DialogTitle>
              <DialogDescription>{isEditing ? 'Update the simulation details.' : 'Fill in the details to create a new phishing simulation.'}</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-2">
              <div className="space-y-2">
                <Label htmlFor="sim-title" className="text-sm">Title</Label>
                <Input id="sim-title" placeholder="Simulation title" value={formData.title} onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))} className="bg-background/50" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="sim-desc" className="text-sm">Description</Label>
                <Textarea id="sim-desc" placeholder="Describe the simulation scenario..." value={formData.description} onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))} className="bg-background/50 min-h-[80px] text-sm" />
              </div>
              <div className="space-y-2">
                <Label className="text-sm">Difficulty Level</Label>
                <Select value={formData.difficultyLevel} onValueChange={(v) => setFormData(prev => ({ ...prev, difficultyLevel: v }))}>
                  <SelectTrigger className="bg-background/50"><SelectValue /></SelectTrigger>
                  <SelectContent className="bg-popover border-border">
                    <SelectItem value="easy">Easy</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="hard">Hard</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center justify-between rounded-xl glass p-3">
                <div className="space-y-0.5">
                  <Label htmlFor="sim-is-phishing" className="text-sm font-medium flex items-center gap-2">
                    {formData.isPhishing ? <ShieldAlert className="h-4 w-4 text-destructive" /> : <ShieldCheck className="h-4 w-4 text-green-500" />}
                    {formData.isPhishing ? 'Phishing' : 'Not Phishing (Legitimate)'}
                  </Label>
                  <p className="text-xs text-muted-foreground">Is this scenario a phishing attempt or a legitimate email?</p>
                </div>
                <Switch id="sim-is-phishing" checked={formData.isPhishing} onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isPhishing: checked }))} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="sim-content" className="text-sm">Content (JSON)</Label>
                <Textarea
                  id="sim-content"
                  placeholder='{"sender": "...", "body": "..."}'
                  value={contentJson}
                  onChange={(e) => { setContentJson(e.target.value); setJsonError(false); }}
                  className={cn('bg-background/50 min-h-[100px] font-mono text-xs', jsonError && 'border-destructive')}
                />
                {jsonError && <p className="text-sm text-destructive">Invalid JSON format</p>}
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setFormOpen(false)}>Cancel</Button>
              <Button onClick={handleSave} disabled={saving || !formData.title.trim()}>
                {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isEditing ? 'Update' : 'Create'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <AlertDialogContent className="glass border-border/50">
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              <AlertDialogDescription>This will permanently delete the simulation. This action cannot be undone.</AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">Delete</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </CardContent>
    </Card>
  );
};

export default SimulationManagement;
