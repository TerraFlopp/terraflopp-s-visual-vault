import { Link } from "react-router-dom";
import Hero from "@/components/Hero";
import VideoGrid from "@/components/VideoGrid";
import TrustedClients from "@/components/TrustedClients";
import { useVideos } from "@/hooks/useVideos";
import { Button } from "@/components/ui/button";
import { Lock } from "lucide-react";

const Index = () => {
  const { data: videos = [], isLoading } = useVideos();

  return (
    <div className="min-h-screen bg-background">
      {/* Admin Access Button */}
      <div className="fixed top-4 right-4 z-50">
        <Link to="/auth">
          <Button variant="outline" size="sm" className="gap-2">
            <Lock className="w-4 h-4" />
            Admin
          </Button>
        </Link>
      </div>

      <Hero />
      
      <TrustedClients />
      
      <main className="max-w-7xl mx-auto px-4 pb-20">
        <VideoGrid videos={videos} isLoading={isLoading} />
      </main>
    </div>
  );
};

export default Index;
