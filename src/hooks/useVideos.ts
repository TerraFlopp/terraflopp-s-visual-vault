import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface Video {
  id: string;
  title: string | null;
  video_type: string;
  video_url: string | null;
  youtube_url: string | null;
  tiktok_url: string | null;
  thumbnail_url: string | null;
  display_order: number;
  created_at: string;
  updated_at: string;
}

export const useVideos = () => {
  return useQuery({
    queryKey: ["videos"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("videos")
        .select("*")
        .order("display_order", { ascending: true });

      if (error) {
        throw error;
      }

      return data as Video[];
    },
  });
};
