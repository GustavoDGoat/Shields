import { useState } from "react";
import CategoryAccordion from "./CategoryAccordion";
import TrainingVideoCard from "./TrainingVideoCard";
import { GraduationCap, Loader2 } from "lucide-react";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { extractYouTubeId } from "./training/VideoManagement";

export interface TrainingVideo {
  id: string;
  title: string;
  description: string;
  duration?: string;
  thumbnail?: string;
  youtubeId?: string;
}

export interface TrainingCategory {
  id: string;
  name: string;
  videos: TrainingVideo[];
}

const TrainingTab = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const videos = useQuery(api.trainingVideos.list);

  const trainingData: TrainingCategory[] = (() => {
    if (!videos) return [];
    const categoryMap = new Map<string, TrainingVideo[]>();
    videos.forEach((row) => {
      const youtubeId = extractYouTubeId(row.youtubeUrl) || undefined;
      const video: TrainingVideo = {
        id: row._id.toString(),
        title: row.title,
        description: row.description,
        youtubeId,
      };
      if (!categoryMap.has(row.category)) {
        categoryMap.set(row.category, []);
      }
      categoryMap.get(row.category)!.push(video);
    });

    return Array.from(categoryMap.entries()).map(
      ([name, vids]) => ({
        id: name.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
        name,
        videos: vids,
      })
    );
  })();

  if (videos === undefined) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (trainingData.length > 0 && !selectedCategory) {
    setSelectedCategory(trainingData[0].id);
  }

  const currentCategory = trainingData.find((cat) => cat.id === selectedCategory);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="p-3 rounded-xl bg-primary/10 border border-primary/30">
          <GraduationCap className="w-6 h-6 text-primary" />
        </div>
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-foreground">
            Training & Awareness Center
          </h1>
          <p className="text-muted-foreground">
            Explore cybersecurity training materials to protect yourself and your organization
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-3">
          <div className="sticky top-24">
            <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">
              Categories
            </h2>
            <CategoryAccordion
              categories={trainingData}
              selectedCategory={selectedCategory}
              onSelectCategory={setSelectedCategory}
            />
          </div>
        </div>

        <div className="lg:col-span-9">
          {currentCategory && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-foreground">
                  {currentCategory.name}
                </h2>
                <span className="text-sm text-muted-foreground">
                  {currentCategory.videos.length} video{currentCategory.videos.length !== 1 ? "s" : ""}
                </span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {currentCategory.videos.map((video) => (
                  <TrainingVideoCard key={video.id} video={video} />
                ))}
              </div>
            </div>
          )}
          {!currentCategory && trainingData.length === 0 && (
            <p className="text-muted-foreground text-center py-12">No training videos available yet.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default TrainingTab;
