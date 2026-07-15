import { useEffect, useState } from 'react';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Shield, ShieldCheck, LogIn, LogOut, User } from 'lucide-react';
import { toast } from 'sonner';
import ReportIncidentForm from './ReportIncidentForm';
import MyActiveTickets from './MyActiveTickets';
import AdminConsole from './AdminConsole';
import { IncidentType, IncidentUrgency, IncidentStatus } from './types';
import { useAuth } from '@/hooks/useAuth';
import { useIncidents } from '@/hooks/useIncidents';
import { SkeletonCard, SkeletonTable } from '@/components/ui/skeleton-card';
import AuthModal from '@/components/auth/AuthModal';

const IncidentTrackingTab = () => {
  const { user, loading: authLoading, isAdmin: dbIsAdmin, signOut } = useAuth();
  const [showAdminView, setShowAdminView] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);

  useEffect(() => {
    if (dbIsAdmin) {
      const stored = sessionStorage.getItem('adminView');
      setShowAdminView(stored !== null ? stored === 'true' : true);
    } else {
      setShowAdminView(false);
    }
  }, [dbIsAdmin]);

  useEffect(() => {
    if (dbIsAdmin) {
      sessionStorage.setItem('adminView', String(showAdminView));
    }
  }, [showAdminView, dbIsAdmin]);

  const isAdminView = showAdminView && dbIsAdmin;
  const hasDbAdminAccess = dbIsAdmin;

  const {
    incidents,
    loading: incidentsLoading,
    createIncident,
    updateIncidentStatus,
    addAdminNote,
    deleteIncident,
  } = useIncidents(user?.id, hasDbAdminAccess);

  const userIncidents = incidents.filter((incident) => incident.studentId === user?.id);

  const handleAdminToggle = (checked: boolean) => {
    if (!user) {
      toast.error('Please sign in first', {
        description: 'You need to be logged in to access admin features.',
      });
      return;
    }

    setShowAdminView(checked);
  };

  const handleSubmitReport = async (data: {
    type: IncidentType;
    description: string;
    urgency: IncidentUrgency;
    file?: File;
  }) => {
    if (!user) {
      toast.error('Please sign in', {
        description: 'You need to be logged in to report an incident.',
      });
      setShowAuthModal(true);
      return;
    }
    await createIncident(data);
  };

  const handleUpdateStatus = async (id: string, status: IncidentStatus) => {
    await updateIncidentStatus(id, status);
  };

  const handleDelete = async (id: string) => {
    await deleteIncident(id);
  };

  const handleAddNote = async (id: string, note: string) => {
    await addAdminNote(id, note);
  };

  const handleSignOut = async () => {
    await signOut();
    setShowAdminView(false);
    toast.success('Signed out successfully');
  };

  if (authLoading) {
    return (
      <div className="space-y-6">
        <SkeletonCard rows={4} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <Shield className="h-6 w-6 text-primary" />
            Incident Tracking
          </h1>
          <p className="text-muted-foreground mt-1">
            Report and track security incidents
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          {user ? (
            <div className="flex items-center gap-2 p-2 rounded-lg bg-card/50 backdrop-blur border border-border/50">
              <User className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium max-w-[120px] truncate">
                {user.email}
              </span>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={handleSignOut}
              >
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowAuthModal(true)}
              className="gap-2"
            >
              <LogIn className="h-4 w-4" />
              Sign In
            </Button>
          )}

          <div className="flex items-center gap-3 p-3 rounded-lg bg-card/50 backdrop-blur border border-border/50">
            <Switch
              id="admin-mode"
              checked={isAdminView}
              onCheckedChange={handleAdminToggle}
              disabled={!user}
            />
            <Label htmlFor="admin-mode" className="flex items-center gap-2 cursor-pointer">
              {isAdminView ? (
                <>
                  <ShieldCheck className="h-4 w-4 text-primary" />
                  <span className="font-medium">Admin View</span>
                  <Badge variant="secondary" className="text-xs">Management Mode</Badge>
                </>
              ) : (
                <>
                  <Shield className="h-4 w-4 text-muted-foreground" />
                  <span>Student View</span>
                </>
              )}
            </Label>
          </div>
        </div>
      </div>

      <AuthModal open={showAuthModal} onOpenChange={setShowAuthModal} />

      {!user ? (
        <div className="text-center py-12">
          <Shield className="h-16 w-16 mx-auto text-muted-foreground/50 mb-4" />
          <h2 className="text-xl font-semibold mb-2">Sign in to Continue</h2>
          <p className="text-muted-foreground mb-6">
            Please sign in to report and track security incidents.
          </p>
          <Button onClick={() => setShowAuthModal(true)} className="gap-2">
            <LogIn className="h-4 w-4" />
            Sign In to Get Started
          </Button>
        </div>
      ) : incidentsLoading ? (
        isAdminView ? (
          <SkeletonTable rows={5} />
        ) : (
          <div className="grid lg:grid-cols-2 gap-6">
            <SkeletonCard rows={4} />
            <SkeletonCard rows={3} />
          </div>
        )
      ) : isAdminView ? (
        <AdminConsole
          incidents={incidents}
          onUpdateStatus={handleUpdateStatus}
          onDelete={handleDelete}
          onAddNote={handleAddNote}
        />
      ) : (
        <div className="grid lg:grid-cols-2 gap-6">
          <ReportIncidentForm onSubmit={handleSubmitReport} />
          <MyActiveTickets incidents={userIncidents} />
        </div>
      )}
    </div>
  );
};

export default IncidentTrackingTab;
