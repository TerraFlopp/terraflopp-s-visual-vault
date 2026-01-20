import { Dialog, DialogContent } from "@/components/ui/dialog";
import { X } from "lucide-react";

interface Video {
  id: string;
  title: string | null;
  video_type: string;
  video_url: string | null;
  youtube_url: string | null;
  tiktok_url: string | null;
  thumbnail_url: string | null;
}

interface VideoModalProps {
  video: Video | null;
  isOpen: boolean;
  onClose: () => void;
}

const getYouTubeEmbedUrl = (url: string): string => {
  const match = url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
  if (match) {
    return `https://www.youtube.com/embed/${match[1]}?autoplay=1&rel=0`;
  }
  return url;
};

const getTikTokVideoId = (url: string): string | null => {
  // Match various TikTok URL formats
  const match = url.match(/tiktok\.com\/@[^\/]+\/video\/(\d+)|tiktok\.com\/t\/([a-zA-Z0-9]+)|vm\.tiktok\.com\/([a-zA-Z0-9]+)/);
  if (match) {
    return match[1] || match[2] || match[3];
  }
  return null;
};

const VideoModal = ({ video, isOpen, onClose }: VideoModalProps) => {
  if (!video) return null;

  const renderContent = () => {
    if (video.video_type === "upload" && video.video_url) {
      return (
        <video
          src={video.video_url}
          controls
          autoPlay
          className="w-full h-full object-contain"
        />
      );
    }

    if (video.video_type === "youtube" && video.youtube_url) {
      return (
        <iframe
          src={getYouTubeEmbedUrl(video.youtube_url)}
          className="w-full h-full"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      );
    }

    if (video.video_type === "tiktok" && video.tiktok_url) {
      const videoId = getTikTokVideoId(video.tiktok_url);
      return (
        <iframe
          src={`https://www.tiktok.com/embed/v2/${videoId}`}
          className="w-full h-full"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      );
    }

    return null;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl w-full p-0 bg-background border-border overflow-hidden">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-50 w-10 h-10 rounded-full bg-background/80 backdrop-blur flex items-center justify-center hover:bg-muted transition-colors"
        >
          <X className="w-5 h-5 text-foreground" />
        </button>

        <div className="aspect-[9/16] max-h-[85vh] w-full bg-black">
          {renderContent()}
        </div>

        {video.title && (
          <div className="p-4 border-t border-border">
            <h3 className="text-lg font-semibold text-foreground">{video.title}</h3>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default VideoModal;
