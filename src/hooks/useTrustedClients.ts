import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface TrustedClient {
  id: string;
  name: string;
  logo_url: string | null;
  website_url: string | null;
  subscriber_count: string | null;
  display_order: number;
  created_at: string;
  updated_at: string;
}

export const useTrustedClients = () => {
  return useQuery({
    queryKey: ["trusted_clients"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("trusted_clients")
        .select("*")
        .order("display_order", { ascending: true });

      if (error) throw error;
      return data as TrustedClient[];
    },
  });
};
