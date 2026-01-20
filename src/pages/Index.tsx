import { Link } from "react-router-dom";
import Hero from "@/components/Hero";
import VideoGrid from "@/components/VideoGrid";
import TrustedClients from "@/components/TrustedClients";
import { useVideos } from "@/hooks/useVideos";
import { Button } from "@/components/ui/button";
import { Lock, Star } from "lucide-react";

const Index = () => {
  const { data: videos = [], isLoading } = useVideos();

  return (
    <div className="min-h-screen bg-background">
      {/* Header with Logo */}
      <header className="fixed top-0 left-0 right-0 z-50 px-4 py-3 bg-background/80 backdrop-blur-md border-b border-border/50">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Star className="w-6 h-6 text-primary fill-primary" />
            <span className="text-xl font-bold text-foreground">TerraFlopp</span>
          </div>
          
          <Link to="/auth">
            <Button variant="outline" size="sm" className="gap-2">
              <Lock className="w-4 h-4" />
              Admin
            </Button>
          </Link>
        </div>
      </header>

      {/* Add padding top to account for fixed header */}
      <div className="pt-16">
        <Hero />
        
        <TrustedClients />
        
        <main className="max-w-6xl mx-auto px-4 pb-20 mt-16">
          <VideoGrid videos={videos} isLoading={isLoading} />
        </main>
      </div>
    </div>
  );
};

export default Index;
