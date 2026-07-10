import { Play, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { TrainingVideo } from "./TrainingTab";

interface TrainingVideoCardProps {
  video: TrainingVideo;
}

const TrainingVideoCard = ({ video }: TrainingVideoCardProps) => {
  // If video has a YouTube ID, render embedded player
  if (video.youtubeId) {
    return (
      <div className="bg-card/50 border border-border/50 rounded-xl overflow-hidden hover:border-primary/30 transition-all hover:shadow-lg hover:shadow-primary/5">
        {/* YouTube Embed */}
        <div className="relative aspect-video">
          <iframe
            src={`https://www.youtube.com/embed/${video.youtubeId}`}
            title={video.title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            className="absolute inset-0 w-full h-full"
          />
        </div>

        {/* Content */}
        <div className="p-4 space-y-2">
          <h3 className="font-semibold text-foreground">
            {video.title}
          </h3>
          <p className="text-sm text-muted-foreground">
            {video.description}
          </p>
        </div>
      </div>
    );
  }

  // Fallback for videos without YouTube ID (placeholder)
  return (
    <div className="group bg-card/50 border border-border/50 rounded-xl overflow-hidden hover:border-primary/30 transition-all hover:shadow-lg hover:shadow-primary/5">
      {/* Thumbnail */}
      <div className="relative aspect-video bg-muted/30 flex items-center justify-center overflow-hidden">
        {/* Placeholder pattern */}
        <div className="absolute inset-0 grid-pattern opacity-30" />
        
        {/* Play button overlay */}
        <div className="relative z-10 w-16 h-16 rounded-full bg-primary/20 border border-primary/40 flex items-center justify-center group-hover:scale-110 group-hover:bg-primary/30 transition-all">
          <Play className="w-6 h-6 text-primary fill-primary/30" />
        </div>

        {/* Duration badge */}
        {video.duration && (
          <div className="absolute bottom-2 right-2 flex items-center gap-1 px-2 py-1 rounded-md bg-background/80 backdrop-blur-sm text-xs text-muted-foreground">
            <Clock className="w-3 h-3" />
            {video.duration}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4 space-y-3">
        <h3 className="font-semibold text-foreground line-clamp-2 group-hover:text-primary transition-colors">
          {video.title}
        </h3>
        <p className="text-sm text-muted-foreground line-clamp-2">
          {video.description}
        </p>
        <Button 
          className="w-full bg-primary/10 text-primary border border-primary/30 hover:bg-primary hover:text-primary-foreground transition-all"
        >
          <Play className="w-4 h-4 mr-2" />
          Watch Now
        </Button>
      </div>
    </div>
  );
};

export default TrainingVideoCard;
