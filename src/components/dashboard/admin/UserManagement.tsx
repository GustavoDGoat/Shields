import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { motion } from 'framer-motion';
import { Users, Trash2, Search, AlertTriangle, Loader2 } from 'lucide-react';
import { useQuery, useMutation } from 'convex/react';
import { api } from '../../../../convex/_generated/api';
import { Id } from '../../../../convex/_generated/dataModel';
import { useAuth } from '@/hooks/useAuth';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { toast } from 'sonner';

interface UserProfile {
  _id: Id<"profiles">;
  userId: Id<"users">;
  fullName: string | null;
  email: string | null;
  _creationTime: number;
  role?: string;
}

const UserManagement = () => {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [deleteTarget, setDeleteTarget] = useState<UserProfile | null>(null);
  const [deleting, setDeleting] = useState(false);

  const profiles = useQuery(api.profiles.list);
  const deleteUserMut = useMutation(api.userManagement.deleteUser);

  const users = (profiles ?? []) as UserProfile[];

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await deleteUserMut({ userId: deleteTarget.userId });
      toast.success(`User "${deleteTarget.fullName || deleteTarget.email}" has been removed`);
    } catch (err: any) {
      toast.error(err.message || 'Failed to delete user');
    } finally {
      setDeleting(false);
      setDeleteTarget(null);
    }
  };

  const filtered = users.filter(u => {
    const q = searchQuery.toLowerCase();
    return (
      (u.fullName?.toLowerCase().includes(q) || false) ||
      (u.email?.toLowerCase().includes(q) || false) ||
      (u.role?.toLowerCase().includes(q) || false)
    );
  });

  const roleColor = (role: string) => {
    if (role === 'admin') return 'bg-primary/10 text-primary border-primary/20';
    return 'bg-muted text-muted-foreground border-border';
  };

  return (
    <>
      <Card className="glass glass-border shadow-xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg md:text-xl">
            <Users className="h-5 w-5 text-primary" />
            User Management
          </CardTitle>
          <CardDescription className="text-xs md:text-sm">
            View registered users and manage accounts
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            <motion.div whileHover={{ scale: 1.03 }} className="p-4 rounded-xl glass glass-border glow-stat-cyan transition-all">
              <p className="text-2xl md:text-3xl font-bold font-mono">{users.length}</p>
              <p className="text-xs md:text-sm text-muted-foreground">Total Users</p>
            </motion.div>
            <motion.div whileHover={{ scale: 1.03 }} className="p-4 rounded-xl glass glass-border glow-stat-blue transition-all">
              <p className="text-2xl md:text-3xl font-bold text-blue-500 font-mono">
                {users.filter(u => u.role === 'admin').length}
              </p>
              <p className="text-xs md:text-sm text-blue-500/70">Admins</p>
            </motion.div>
            <motion.div whileHover={{ scale: 1.03 }} className="p-4 rounded-xl glass glass-border glow-stat-green transition-all">
              <p className="text-2xl md:text-3xl font-bold text-green-500 font-mono">
                {users.filter(u => u.role === 'student').length}
              </p>
              <p className="text-xs md:text-sm text-green-500/70">Students</p>
            </motion.div>
          </div>

          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by name, email, or role..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-background/50 text-sm"
            />
          </div>

          {profiles === undefined ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          ) : (
            <ScrollArea className={filtered.length > 6 ? 'h-[400px]' : ''}>
              <Table>
                <TableHeader>
                  <TableRow className="border-border/50 hover:bg-transparent">
                    <TableHead className="text-muted-foreground">Name</TableHead>
                    <TableHead className="text-muted-foreground">Email</TableHead>
                    <TableHead className="text-muted-foreground">Role</TableHead>
                    <TableHead className="text-muted-foreground">Joined</TableHead>
                    <TableHead className="text-muted-foreground text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center text-sm text-muted-foreground py-8">
                        No users found
                      </TableCell>
                    </TableRow>
                  ) : (
                    filtered.map((u) => (
                      <TableRow key={u._id.toString()} className="border-border/50 hover:bg-white/[0.03] transition-colors">
                        <TableCell className="font-medium text-sm">{u.fullName || '—'}</TableCell>
                        <TableCell className="text-sm text-muted-foreground">{u.email || '—'}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className={cn('text-xs capitalize', roleColor(u.role || 'student'))}>
                            {u.role || 'student'}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground font-mono">
                          {format(new Date(u._creationTime), 'MMM d, yyyy')}
                        </TableCell>
                        <TableCell className="text-right">
                          {u.userId === user?.id ? (
                            <span className="text-xs text-muted-foreground italic">You</span>
                          ) : (
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10 hover:shadow-[0_0_12px_hsl(var(--destructive)/0.3)]"
                              onClick={() => setDeleteTarget(u)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          )}
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </ScrollArea>
          )}
        </CardContent>
      </Card>

      <AlertDialog open={!!deleteTarget} onOpenChange={(open) => !open && setDeleteTarget(null)}>
        <AlertDialogContent className="glass border-destructive/30 shadow-[0_0_30px_hsl(var(--destructive)/0.15)]">
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2 text-destructive">
              <AlertTriangle className="h-5 w-5" />
              Danger: Delete User
            </AlertDialogTitle>
            <AlertDialogDescription className="space-y-2">
              <p>
                Are you sure you want to permanently delete{' '}
                <span className="font-semibold text-foreground">
                  {deleteTarget?.fullName || deleteTarget?.email}
                </span>
                ?
              </p>
              <p className="text-destructive/80 text-xs">
                This action cannot be undone. All user data, incidents, and simulation results will be permanently removed.
              </p>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={deleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90 shadow-[0_0_12px_hsl(var(--destructive)/0.3)]"
            >
              {deleting ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Trash2 className="h-4 w-4 mr-2" />}
              Delete User
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default UserManagement;
