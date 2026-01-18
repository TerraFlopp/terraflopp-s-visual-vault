import Hero from "@/components/Hero";
import VideoGrid from "@/components/VideoGrid";
import { useVideos } from "@/hooks/useVideos";

const Index = () => {
  const { data: videos = [], isLoading } = useVideos();

  return (
    <div className="min-h-screen bg-background">
      <Hero />
      
      <main className="max-w-7xl mx-auto px-4 pb-20">
        <VideoGrid videos={videos} isLoading={isLoading} />
      </main>
    </div>
  );
};

export default Index;
