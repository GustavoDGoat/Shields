import { useState, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Fish, Bug, UserX, Shield, Upload, X, Loader2, AlertTriangle, KeyRound } from 'lucide-react';
import { IncidentType, IncidentUrgency, incidentTypeLabels } from './types';
import { cn } from '@/lib/utils';

interface ReportIncidentFormProps {
  onSubmit: (data: {
    type: IncidentType;
    description: string;
    urgency: IncidentUrgency;
    file?: File;
  }) => Promise<void>;
}

const incidentIcons: Record<IncidentType, React.ReactNode> = {
  phishing: <Fish className="h-4 w-4" />,
  malware: <Bug className="h-4 w-4" />,
  identity_theft: <UserX className="h-4 w-4" />,
  data_breach: <Shield className="h-4 w-4" />,
  unauthorized_access: <KeyRound className="h-4 w-4" />,
  other: <AlertTriangle className="h-4 w-4" />,
};

const ReportIncidentForm = ({ onSubmit }: ReportIncidentFormProps) => {
  const [type, setType] = useState<IncidentType | ''>('');
  const [description, setDescription] = useState('');
  const [urgency, setUrgency] = useState<IncidentUrgency | ''>('');
  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleDragOver = useCallback((e: React.DragEvent) => { e.preventDefault(); setIsDragging(true); }, []);
  const handleDragLeave = useCallback((e: React.DragEvent) => { e.preventDefault(); setIsDragging(false); }, []);
  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile && droppedFile.type.startsWith('image/')) setFile(droppedFile);
  }, []);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) setFile(selectedFile);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!type || !description || !urgency) return;
    setIsSubmitting(true);
    try {
      await onSubmit({ type, description, urgency, file: file || undefined });
      setType(''); setDescription(''); setUrgency(''); setFile(null);
    } finally {
      setIsSubmitting(false);
    }
  };

  const isFormValid = type && description.trim() && urgency;

  return (
    <Card className="glass glass-border shadow-xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg md:text-xl">
          <AlertTriangle className="h-5 w-5 text-destructive" />
          Report New Incident
        </CardTitle>
        <CardDescription className="text-xs md:text-sm">
          Describe the security incident you've encountered. Our team will investigate promptly.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="type" className="text-sm">Incident Type</Label>
            <Select value={type} onValueChange={(value) => setType(value as IncidentType)}>
              <SelectTrigger id="type" className="bg-background/50">
                <SelectValue placeholder="Select incident type..." />
              </SelectTrigger>
              <SelectContent className="bg-popover border-border">
                {(Object.keys(incidentTypeLabels) as IncidentType[]).map((key) => (
                  <SelectItem key={key} value={key}>
                    <span className="flex items-center gap-2">
                      {incidentIcons[key]}
                      {incidentTypeLabels[key]}
                    </span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description" className="text-sm">Description</Label>
            <Textarea
              id="description"
              placeholder="Describe what happened in detail..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="min-h-[120px] bg-background/50 resize-none text-sm"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="urgency" className="text-sm">Urgency Level</Label>
            <Select value={urgency} onValueChange={(value) => setUrgency(value as IncidentUrgency)}>
              <SelectTrigger id="urgency" className="bg-background/50">
                <SelectValue placeholder="Select urgency level..." />
              </SelectTrigger>
              <SelectContent className="bg-popover border-border">
                <SelectItem value="low">
                  <span className="flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-green-500" />Low - No immediate threat</span>
                </SelectItem>
                <SelectItem value="medium">
                  <span className="flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-yellow-500" />Medium - Potential risk</span>
                </SelectItem>
                <SelectItem value="high">
                  <span className="flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-red-500" />High - Immediate attention needed</span>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label className="text-sm">Evidence (Optional)</Label>
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={cn(
                "relative border-2 border-dashed rounded-xl p-6 transition-all duration-200",
                "hover:border-primary/50 hover:bg-primary/5",
                isDragging && "border-primary bg-primary/10",
                file ? "border-green-500/50 bg-green-500/5" : "border-border"
              )}
            >
              {file ? (
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Upload className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">{file.name}</p>
                      <p className="text-xs text-muted-foreground font-mono">{(file.size / 1024).toFixed(1)} KB</p>
                    </div>
                  </div>
                  <Button type="button" variant="ghost" size="icon" onClick={() => setFile(null)} className="h-8 w-8">
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <div className="text-center">
                  <Upload className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                  <p className="text-sm text-muted-foreground">
                    Drag and drop an image, or{' '}
                    <label className="text-primary hover:underline cursor-pointer">
                      browse
                      <input type="file" accept="image/*" onChange={handleFileSelect} className="hidden" />
                    </label>
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">PNG, JPG up to 10MB</p>
                </div>
              )}
            </div>
          </div>

          <Button type="submit" className="w-full" disabled={!isFormValid || isSubmitting}>
            {isSubmitting ? (
              <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Submitting Report...</>
            ) : (
              <><Shield className="mr-2 h-4 w-4" />Submit Incident Report</>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default ReportIncidentForm;
