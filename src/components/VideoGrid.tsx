import { useState } from "react";
import { motion } from "framer-motion";
import VideoCard from "./VideoCard";
import VideoModal from "./VideoModal";

interface Video {
  id: string;
  title: string | null;
  video_type: string;
  video_url: string | null;
  youtube_url: string | null;
  tiktok_url: string | null;
  thumbnail_url: string | null;
  views_count: string | null;
  display_order: number;
}

interface VideoGridProps {
  videos: Video[];
  isLoading?: boolean;
}

const VideoGrid = ({ videos, isLoading }: VideoGridProps) => {
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={i}
            className="aspect-[9/16] rounded-2xl bg-muted animate-pulse"
          />
        ))}
      </div>
    );
  }

  if (videos.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex flex-col items-center justify-center py-20 text-center"
      >
        <div className="w-24 h-24 rounded-full bg-muted flex items-center justify-center mb-6">
          <span className="text-4xl">🎬</span>
        </div>
        <h3 className="text-xl font-semibold text-foreground mb-2">
          Pas encore de vidéos
        </h3>
        <p className="text-muted-foreground max-w-md">
          Les vidéos apparaîtront ici une fois ajoutées par l'admin.
        </p>
      </motion.div>
    );
  }

  return (
    <>
      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.1 }}
        variants={{
          hidden: { opacity: 0 },
          visible: {
            opacity: 1,
            transition: {
              staggerChildren: 0.08,
              delayChildren: 0.1,
            },
          },
        }}
      >
        {videos
          .sort((a, b) => a.display_order - b.display_order)
          .map((video, index) => (
            <motion.div
              key={video.id}
              variants={{
                hidden: { 
                  opacity: 0, 
                  y: 60,
                  x: -20,
                  scale: 0.95,
                },
                visible: { 
                  opacity: 1, 
                  y: 0,
                  x: 0,
                  scale: 1,
                  transition: {
                    type: "tween",
                    ease: [0.25, 0.1, 0.25, 1],
                    duration: 0.5,
                  },
                },
              }}
              className="max-w-[280px] mx-auto w-full"
            >
              <VideoCard
                id={video.id}
                title={video.title || undefined}
                videoType={video.video_type as "upload" | "youtube" | "tiktok"}
                videoUrl={video.video_url || undefined}
                youtubeUrl={video.youtube_url || undefined}
                tiktokUrl={video.tiktok_url || undefined}
                thumbnailUrl={video.thumbnail_url || undefined}
                viewsCount={video.views_count || undefined}
                onClick={() => setSelectedVideo(video)}
              />
            </motion.div>
          ))}
      </motion.div>

      <VideoModal
        video={selectedVideo}
        isOpen={!!selectedVideo}
        onClose={() => setSelectedVideo(null)}
      />
    </>
  );
};

export default VideoGrid;
