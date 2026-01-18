import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { Play } from "lucide-react";

interface VideoCardProps {
  id: string;
  title?: string;
  videoType: "upload" | "youtube";
  videoUrl?: string;
  youtubeUrl?: string;
  thumbnailUrl?: string;
  onClick: () => void;
}

const getYouTubeThumbnail = (url: string): string => {
  const match = url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
  if (match) {
    return `https://img.youtube.com/vi/${match[1]}/maxresdefault.jpg`;
  }
  return "";
};

const VideoCard = ({
  title,
  videoType,
  videoUrl,
  youtubeUrl,
  thumbnailUrl,
  onClick,
}: VideoCardProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const handleMouseEnter = () => {
    setIsHovered(true);
    if (videoType === "upload" && videoRef.current) {
      videoRef.current.play().catch(() => {});
    }
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    if (videoType === "upload" && videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
  };

  const thumbnail = thumbnailUrl || (youtubeUrl ? getYouTubeThumbnail(youtubeUrl) : undefined);

  return (
    <motion.div
      className="video-card bento-item aspect-[9/16] cursor-pointer relative group"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      {videoType === "upload" && videoUrl ? (
        <>
          {/* Thumbnail shown when not hovered */}
          {!isHovered && thumbnail && (
            <img
              src={thumbnail}
              alt={title || "Video thumbnail"}
              className="absolute inset-0 w-full h-full object-cover"
            />
          )}
          {/* Video plays on hover */}
          <video
            ref={videoRef}
            src={videoUrl}
            muted
            loop
            playsInline
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-300 ${
              isHovered ? "opacity-100" : "opacity-0"
            }`}
          />
        </>
      ) : (
        /* YouTube thumbnail */
        <img
          src={thumbnail}
          alt={title || "Video thumbnail"}
          className="absolute inset-0 w-full h-full object-cover"
        />
      )}

      {/* Overlay gradient */}
      <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      {/* Play button */}
      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <div className="w-16 h-16 rounded-full bg-accent flex items-center justify-center shadow-lg">
          <Play className="w-7 h-7 text-accent-foreground fill-current ml-1" />
        </div>
      </div>

      {/* Title */}
      {title && (
        <div className="absolute bottom-0 left-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <p className="text-sm font-medium text-foreground truncate">{title}</p>
        </div>
      )}
    </motion.div>
  );
};

export default VideoCard;
