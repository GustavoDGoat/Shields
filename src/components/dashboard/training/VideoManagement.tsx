import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useQuery, useMutation } from 'convex/react';
import { api } from '../../../../convex/_generated/api';
import { Id } from '../../../../convex/_generated/dataModel';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';
import { Video, Plus, Pencil, Trash2, Loader2 } from 'lucide-react';

interface TrainingVideo {
  _id: Id<"trainingVideos">;
  _creationTime: number;
  title: string;
  description: string;
  youtubeUrl: string;
  category: string;
}

export const extractYouTubeId = (url: string): string | null => {
  const patterns = [
    /(?:youtube\.com\/watch\?v=)([a-zA-Z0-9_-]{11})/,
    /(?:youtu\.be\/)([a-zA-Z0-9_-]{11})/,
    /(?:youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/,
    /(?:youtube\.com\/v\/)([a-zA-Z0-9_-]{11})/,
  ];
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) return match[1];
  }
  return null;
};

const VideoManagement = () => {
  const { user } = useAuth();
  const videos = useQuery(api.trainingVideos.list);
  const createVideoMut = useMutation(api.trainingVideos.create);
  const updateVideoMut = useMutation(api.trainingVideos.update);
  const deleteVideoMut = useMutation(api.trainingVideos.remove);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingVideo, setEditingVideo] = useState<TrainingVideo | null>(null);
  const [saving, setSaving] = useState(false);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [youtubeUrl, setYoutubeUrl] = useState('');
  const [category, setCategory] = useState('');
  const [customCategory, setCustomCategory] = useState('');

  const videoList = (videos ?? []) as TrainingVideo[];
  const existingCategories = [...new Set(videoList.map(v => v.category))];

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setYoutubeUrl('');
    setCategory('');
    setCustomCategory('');
    setEditingVideo(null);
  };

  const openAdd = () => {
    resetForm();
    setDialogOpen(true);
  };

  const openEdit = (video: TrainingVideo) => {
    setEditingVideo(video);
    setTitle(video.title);
    setDescription(video.description);
    setYoutubeUrl(video.youtubeUrl);
    if (existingCategories.includes(video.category)) {
      setCategory(video.category);
      setCustomCategory('');
    } else {
      setCategory('__custom');
      setCustomCategory(video.category);
    }
    setDialogOpen(true);
  };

  const handleSave = async () => {
    const finalCategory = category === '__custom' ? customCategory.trim() : category;
    if (!title.trim() || !youtubeUrl.trim() || !finalCategory) {
      toast.error('Please fill in all required fields');
      return;
    }
    if (!extractYouTubeId(youtubeUrl)) {
      toast.error('Invalid YouTube URL. Please use a valid youtube.com or youtu.be link.');
      return;
    }
    if (!user) {
      toast.error('You must be signed in to manage videos');
      return;
    }

    setSaving(true);
    try {
      if (editingVideo) {
        await updateVideoMut({
          id: editingVideo._id,
          title: title.trim(),
          description: description.trim(),
          youtubeUrl: youtubeUrl.trim(),
          category: finalCategory,
          userId: user.id,
        });
        toast.success('Video updated');
      } else {
        await createVideoMut({
          title: title.trim(),
          description: description.trim(),
          youtubeUrl: youtubeUrl.trim(),
          category: finalCategory,
          userId: user.id,
        });
        toast.success('Video added');
      }
      setDialogOpen(false);
      resetForm();
    } catch (error) {
      toast.error(editingVideo ? 'Failed to update video' : 'Failed to add video');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: Id<"trainingVideos">) => {
    if (!user) {
      toast.error('You must be signed in to manage videos');
      return;
    }
    try {
      await deleteVideoMut({ id, userId: user.id });
      toast.success('Video deleted');
    } catch (error) {
      toast.error('Failed to delete video');
    }
  };

  if (videos === undefined) {
    return (
      <Card className="glass glass-border">
        <CardContent className="flex items-center justify-center py-12">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card className="glass glass-border shadow-xl">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Video className="h-5 w-5 text-primary" />
            Video Management
          </CardTitle>
          <Button size="sm" onClick={openAdd} className="gap-1.5">
            <Plus className="h-4 w-4" /> Add Video
          </Button>
        </CardHeader>
        <CardContent>
          <ScrollArea className={videoList.length > 8 ? "h-[500px]" : ""}>
            <Table>
              <TableHeader>
                <TableRow className="border-border/50">
                  <TableHead>Title</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {videoList.map((video) => (
                  <TableRow key={video._id.toString()} className="border-border/50">
                    <TableCell>
                      <p className="font-medium text-sm">{video.title}</p>
                      <p className="text-xs text-muted-foreground truncate max-w-[300px]">{video.description}</p>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="text-xs">{video.category}</Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openEdit(video)}>
                          <Pencil className="h-4 w-4 text-muted-foreground" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive" onClick={() => handleDelete(video._id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                {videoList.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={3} className="text-center text-muted-foreground py-8">
                      No videos yet. Click "Add Video" to get started.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </ScrollArea>
        </CardContent>
      </Card>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="glass border-border">
          <DialogHeader>
            <DialogTitle>{editingVideo ? 'Edit Video' : 'Add New Video'}</DialogTitle>
            <DialogDescription>
              {editingVideo ? 'Update the video details below.' : 'Enter the video details. The YouTube ID will be extracted automatically.'}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-1.5 block">Video Title *</label>
              <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Lecture 1: Introduction to Phishing" className="bg-background/50" />
            </div>
            <div>
              <label className="text-sm font-medium mb-1.5 block">YouTube URL *</label>
              <Input value={youtubeUrl} onChange={(e) => setYoutubeUrl(e.target.value)} placeholder="https://www.youtube.com/watch?v=..." className="bg-background/50" />
              {youtubeUrl && !extractYouTubeId(youtubeUrl) && (
                <p className="text-xs text-destructive mt-1">Invalid YouTube URL format</p>
              )}
              {youtubeUrl && extractYouTubeId(youtubeUrl) && (
                <p className="text-xs text-green-500 mt-1">✓ Video ID: {extractYouTubeId(youtubeUrl)}</p>
              )}
            </div>
            <div>
              <label className="text-sm font-medium mb-1.5 block">Category *</label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger className="bg-background/50">
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent className="bg-popover border-border">
                  {existingCategories.map((cat) => (
                    <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                  ))}
                  <SelectItem value="__custom">+ New Category</SelectItem>
                </SelectContent>
              </Select>
              {category === '__custom' && (
                <Input value={customCategory} onChange={(e) => setCustomCategory(e.target.value)} placeholder="Enter new category name" className="mt-2 bg-background/50" />
              )}
            </div>
            <div>
              <label className="text-sm font-medium mb-1.5 block">Description</label>
              <Textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Brief description of the video content" className="bg-background/50 min-h-[80px]" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSave} disabled={saving}>
              {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {editingVideo ? 'Update' : 'Add Video'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default VideoManagement;
