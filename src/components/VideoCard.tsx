import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { Play, Eye } from "lucide-react";

interface VideoCardProps {
  id: string;
  title?: string;
  videoType: "upload" | "youtube" | "tiktok";
  videoUrl?: string;
  youtubeUrl?: string;
  tiktokUrl?: string;
  thumbnailUrl?: string;
  viewsCount?: string;
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
  tiktokUrl,
  thumbnailUrl,
  viewsCount,
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

  const getThumbnail = () => {
    if (thumbnailUrl) return thumbnailUrl;
    if (youtubeUrl) return getYouTubeThumbnail(youtubeUrl);
    // TikTok doesn't provide easy thumbnail access, use a placeholder
    return undefined;
  };

  const thumbnail = getThumbnail();

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
          {/* First frame preview when not hovered - using video with poster or first frame */}
          <video
            ref={videoRef}
            src={videoUrl}
            muted
            loop
            playsInline
            preload="metadata"
            className="absolute inset-0 w-full h-full object-cover"
            onLoadedMetadata={(e) => {
              // Seek to first frame for preview
              const video = e.currentTarget;
              video.currentTime = 0.1;
            }}
          />
          {/* Thumbnail overlay when not hovered (if available) */}
          {!isHovered && thumbnail && (
            <img
              src={thumbnail}
              alt={title || "Video thumbnail"}
              className="absolute inset-0 w-full h-full object-cover"
            />
          )}
        </>
      ) : videoType === "tiktok" ? (
        /* TikTok placeholder with logo */
        <div className="absolute inset-0 w-full h-full bg-gradient-to-br from-[#ff0050] via-[#00f2ea] to-[#000] flex items-center justify-center">
          {thumbnail ? (
            <img
              src={thumbnail}
              alt={title || "TikTok video"}
              className="absolute inset-0 w-full h-full object-cover"
            />
          ) : (
            <div className="text-center">
              <svg className="w-16 h-16 mx-auto mb-2" viewBox="0 0 48 48" fill="white">
                <path d="M38.4 10.1c-2.5-1.6-4.3-4.2-4.8-7.3-.1-.5-.1-1-.1-1.5h-7.7v26.9c0 3.2-2.4 5.9-5.5 6.2-3.5.4-6.5-2.3-6.5-5.7 0-3.2 2.6-5.8 5.8-5.8.6 0 1.2.1 1.8.3v-7.9c-.6-.1-1.2-.1-1.8-.1-7.5 0-13.6 6.1-13.6 13.6 0 7.5 6.1 13.6 13.6 13.6 7.5 0 13.6-6.1 13.6-13.6V15.4c2.9 2.1 6.5 3.3 10.3 3.3v-7.7c-2-.1-3.9-.5-5.6-1.4-.2.2-.3.3-.5.5z"/>
              </svg>
              <span className="text-white font-semibold">TikTok</span>
            </div>
          )}
        </div>
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

      {/* Title and Views */}
      <div className="absolute bottom-0 left-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        {title && (
          <p className="text-sm font-medium text-foreground truncate">{title}</p>
        )}
        {viewsCount && (
          <div className="flex items-center gap-1 mt-1 text-muted-foreground">
            <Eye className="w-3 h-3" />
            <span className="text-xs">{viewsCount} vues</span>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default VideoCard;
