import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import { useVideos, Video } from "@/hooks/useVideos";
import {
  LogOut,
  Upload,
  Youtube,
  Trash2,
  GripVertical,
  Loader2,
  Plus,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Admin = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { data: videos = [], isLoading: isLoadingVideos } = useVideos();
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [uploadingVideo, setUploadingVideo] = useState(false);
  const [addingYoutube, setAddingYoutube] = useState(false);
  const [youtubeUrl, setYoutubeUrl] = useState("");
  const [videoTitle, setVideoTitle] = useState("");
  const [draggedVideo, setDraggedVideo] = useState<Video | null>(null);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user ?? null);
        setIsLoading(false);
        if (!session?.user) {
          navigate("/auth");
        }
      }
    );

    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setIsLoading(false);
      if (!session?.user) {
        navigate("/auth");
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("video/")) {
      toast.error("Seuls les fichiers vidéo sont acceptés");
      return;
    }

    setUploadingVideo(true);

    try {
      const fileExt = file.name.split(".").pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const filePath = `uploads/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("videos")
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from("videos")
        .getPublicUrl(filePath);

      const maxOrder = videos.length > 0
        ? Math.max(...videos.map((v) => v.display_order))
        : 0;

      const { error: insertError } = await supabase.from("videos").insert({
        title: videoTitle || file.name.replace(/\.[^/.]+$/, ""),
        video_type: "upload",
        video_url: publicUrl,
        display_order: maxOrder + 1,
      });

      if (insertError) throw insertError;

      toast.success("Vidéo uploadée avec succès !");
      queryClient.invalidateQueries({ queryKey: ["videos"] });
      setIsAddDialogOpen(false);
      setVideoTitle("");
    } catch (error: any) {
      toast.error(error.message || "Erreur lors de l'upload");
    } finally {
      setUploadingVideo(false);
    }
  };

  const handleAddYoutube = async () => {
    if (!youtubeUrl) {
      toast.error("Veuillez entrer une URL YouTube");
      return;
    }

    const youtubeRegex = /(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
    if (!youtubeRegex.test(youtubeUrl)) {
      toast.error("URL YouTube invalide");
      return;
    }

    setAddingYoutube(true);

    try {
      const maxOrder = videos.length > 0
        ? Math.max(...videos.map((v) => v.display_order))
        : 0;

      const { error } = await supabase.from("videos").insert({
        title: videoTitle || "Vidéo YouTube",
        video_type: "youtube",
        youtube_url: youtubeUrl,
        display_order: maxOrder + 1,
      });

      if (error) throw error;

      toast.success("Vidéo YouTube ajoutée !");
      queryClient.invalidateQueries({ queryKey: ["videos"] });
      setIsAddDialogOpen(false);
      setYoutubeUrl("");
      setVideoTitle("");
    } catch (error: any) {
      toast.error(error.message || "Erreur lors de l'ajout");
    } finally {
      setAddingYoutube(false);
    }
  };

  const handleDeleteVideo = async (video: Video) => {
    if (!confirm("Supprimer cette vidéo ?")) return;

    try {
      if (video.video_type === "upload" && video.video_url) {
        const path = video.video_url.split("/videos/")[1];
        if (path) {
          await supabase.storage.from("videos").remove([path]);
        }
      }

      const { error } = await supabase
        .from("videos")
        .delete()
        .eq("id", video.id);

      if (error) throw error;

      toast.success("Vidéo supprimée");
      queryClient.invalidateQueries({ queryKey: ["videos"] });
    } catch (error: any) {
      toast.error(error.message || "Erreur lors de la suppression");
    }
  };

  const handleDragStart = (video: Video) => {
    setDraggedVideo(video);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = async (targetVideo: Video) => {
    if (!draggedVideo || draggedVideo.id === targetVideo.id) return;

    const sortedVideos = [...videos].sort((a, b) => a.display_order - b.display_order);
    const draggedIndex = sortedVideos.findIndex((v) => v.id === draggedVideo.id);
    const targetIndex = sortedVideos.findIndex((v) => v.id === targetVideo.id);

    const newVideos = [...sortedVideos];
    newVideos.splice(draggedIndex, 1);
    newVideos.splice(targetIndex, 0, draggedVideo);

    try {
      const updates = newVideos.map((video, index) => ({
        id: video.id,
        display_order: index,
      }));

      for (const update of updates) {
        await supabase
          .from("videos")
          .update({ display_order: update.display_order })
          .eq("id", update.id);
      }

      queryClient.invalidateQueries({ queryKey: ["videos"] });
    } catch (error) {
      toast.error("Erreur lors du réordonnancement");
    }

    setDraggedVideo(null);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-xl font-bold text-foreground">
            Dashboard Admin
          </h1>
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground hidden sm:block">
              {user?.email}
            </span>
            <Button variant="ghost" size="sm" onClick={handleLogout}>
              <LogOut className="w-4 h-4 mr-2" />
              Déconnexion
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Actions */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-foreground">Mes Vidéos</h2>
            <p className="text-muted-foreground">
              {videos.length} vidéo{videos.length > 1 ? "s" : ""}
            </p>
          </div>

          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-primary hover:bg-primary/90">
                <Plus className="w-4 h-4 mr-2" />
                Ajouter une vidéo
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-card border-border">
              <DialogHeader>
                <DialogTitle>Ajouter une vidéo</DialogTitle>
              </DialogHeader>
              <Tabs defaultValue="upload" className="mt-4">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="upload">
                    <Upload className="w-4 h-4 mr-2" />
                    Upload
                  </TabsTrigger>
                  <TabsTrigger value="youtube">
                    <Youtube className="w-4 h-4 mr-2" />
                    YouTube
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="upload" className="space-y-4 mt-4">
                  <div>
                    <Label htmlFor="title">Titre (optionnel)</Label>
                    <Input
                      id="title"
                      value={videoTitle}
                      onChange={(e) => setVideoTitle(e.target.value)}
                      placeholder="Nom de la vidéo"
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label>Fichier vidéo</Label>
                    <div className="mt-1 border-2 border-dashed border-border rounded-xl p-8 text-center">
                      <input
                        type="file"
                        accept="video/*"
                        onChange={handleFileUpload}
                        className="hidden"
                        id="video-upload"
                        disabled={uploadingVideo}
                      />
                      <label
                        htmlFor="video-upload"
                        className="cursor-pointer flex flex-col items-center gap-2"
                      >
                        {uploadingVideo ? (
                          <Loader2 className="w-8 h-8 animate-spin text-primary" />
                        ) : (
                          <Upload className="w-8 h-8 text-muted-foreground" />
                        )}
                        <span className="text-sm text-muted-foreground">
                          {uploadingVideo
                            ? "Upload en cours..."
                            : "Cliquez ou glissez un fichier vidéo"}
                        </span>
                      </label>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="youtube" className="space-y-4 mt-4">
                  <div>
                    <Label htmlFor="youtube-title">Titre (optionnel)</Label>
                    <Input
                      id="youtube-title"
                      value={videoTitle}
                      onChange={(e) => setVideoTitle(e.target.value)}
                      placeholder="Nom de la vidéo"
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="youtube-url">URL YouTube</Label>
                    <Input
                      id="youtube-url"
                      value={youtubeUrl}
                      onChange={(e) => setYoutubeUrl(e.target.value)}
                      placeholder="https://youtube.com/shorts/..."
                      className="mt-1"
                    />
                  </div>
                  <Button
                    onClick={handleAddYoutube}
                    className="w-full"
                    disabled={addingYoutube}
                  >
                    {addingYoutube ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      "Ajouter"
                    )}
                  </Button>
                </TabsContent>
              </Tabs>
            </DialogContent>
          </Dialog>
        </div>

        {/* Video Grid */}
        {isLoadingVideos ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className="aspect-[9/16] rounded-xl bg-muted animate-pulse"
              />
            ))}
          </div>
        ) : videos.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
              <Upload className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">
              Aucune vidéo
            </h3>
            <p className="text-muted-foreground mb-4">
              Commence par ajouter ta première vidéo
            </p>
            <Button onClick={() => setIsAddDialogOpen(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Ajouter une vidéo
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {[...videos]
              .sort((a, b) => a.display_order - b.display_order)
              .map((video) => (
                <motion.div
                  key={video.id}
                  draggable
                  onDragStart={() => handleDragStart(video)}
                  onDragOver={handleDragOver}
                  onDrop={() => handleDrop(video)}
                  className={`relative aspect-[9/16] rounded-xl overflow-hidden bg-muted group cursor-move ${
                    draggedVideo?.id === video.id ? "opacity-50" : ""
                  }`}
                  whileHover={{ scale: 1.02 }}
                >
                  {/* Thumbnail */}
                  {video.video_type === "youtube" && video.youtube_url ? (
                    <img
                      src={`https://img.youtube.com/vi/${
                        video.youtube_url.match(
                          /(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/
                        )?.[1]
                      }/maxresdefault.jpg`}
                      alt={video.title || "Video"}
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                  ) : video.thumbnail_url ? (
                    <img
                      src={video.thumbnail_url}
                      alt={video.title || "Video"}
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                  ) : (
                    <video
                      src={video.video_url || undefined}
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                  )}

                  {/* Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                  {/* Actions */}
                  <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button
                      size="icon"
                      variant="destructive"
                      className="w-8 h-8"
                      onClick={() => handleDeleteVideo(video)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>

                  {/* Drag handle */}
                  <div className="absolute top-2 left-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="w-8 h-8 rounded-lg bg-background/80 backdrop-blur flex items-center justify-center">
                      <GripVertical className="w-4 h-4 text-foreground" />
                    </div>
                  </div>

                  {/* Title */}
                  <div className="absolute bottom-0 left-0 right-0 p-3 opacity-0 group-hover:opacity-100 transition-opacity">
                    <p className="text-sm font-medium text-foreground truncate">
                      {video.title || "Sans titre"}
                    </p>
                    <p className="text-xs text-muted-foreground capitalize">
                      {video.video_type === "youtube" ? "YouTube" : "Upload"}
                    </p>
                  </div>
                </motion.div>
              ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default Admin;
