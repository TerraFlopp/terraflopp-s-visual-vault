import { Dialog, DialogContent } from "@/components/ui/dialog";
import { X } from "lucide-react";

interface Video {
  id: string;
  title: string | null;
  video_type: string;
  video_url: string | null;
  youtube_url: string | null;
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

const VideoModal = ({ video, isOpen, onClose }: VideoModalProps) => {
  if (!video) return null;

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
          {video.video_type === "upload" && video.video_url ? (
            <video
              src={video.video_url}
              controls
              autoPlay
              className="w-full h-full object-contain"
            />
          ) : video.youtube_url ? (
            <iframe
              src={getYouTubeEmbedUrl(video.youtube_url)}
              className="w-full h-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          ) : null}
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
