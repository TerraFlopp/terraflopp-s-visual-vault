import { useTrustedClients, TrustedClient } from "@/hooks/useTrustedClients";
import { Star, Users } from "lucide-react";

const TrustedClients = () => {
  const { data: clients = [], isLoading } = useTrustedClients();

  if (isLoading) {
    return (
      <section className="py-16 px-4 overflow-hidden">
        <div className="max-w-6xl mx-auto">
          <div className="h-8 w-64 bg-muted rounded animate-pulse mx-auto mb-12" />
          <div className="flex gap-8">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="w-48 h-28 bg-muted rounded-2xl animate-pulse flex-shrink-0" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (clients.length === 0) {
    return null;
  }

  // Duplicate clients for seamless loop
  const duplicatedClients = [...clients, ...clients];

  return (
    <section className="py-16 overflow-hidden">
      <div className="max-w-6xl mx-auto px-4 mb-12">
        <div className="text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground flex items-center justify-center gap-3">
            <Star className="w-6 h-6 text-primary fill-primary" />
            Ils m'ont fait confiance
            <Star className="w-6 h-6 text-primary fill-primary" />
          </h2>
        </div>
      </div>

      {/* Infinite Marquee container */}
      <div className="relative overflow-hidden">
        {/* Gradient overlays for smooth edges */}
        <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none" />
        
        <div className="flex animate-infinite-marquee hover:[animation-play-state:paused]">
          {/* First set of clients */}
          {clients.map((client, index) => (
            <div key={`first-${client.id}-${index}`} className="flex-shrink-0 px-4">
              {client.website_url ? (
                <a
                  href={client.website_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block"
                >
                  <ClientCard client={client} />
                </a>
              ) : (
                <ClientCard client={client} />
              )}
            </div>
          ))}
          {/* Duplicate set for seamless loop */}
          {clients.map((client, index) => (
            <div key={`second-${client.id}-${index}`} className="flex-shrink-0 px-4">
              {client.website_url ? (
                <a
                  href={client.website_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block"
                >
                  <ClientCard client={client} />
                </a>
              ) : (
                <ClientCard client={client} />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const ClientCard = ({ client }: { client: TrustedClient }) => {
  return (
    <div className="flex flex-col items-center gap-3 px-8 py-6 rounded-2xl bg-card/80 border border-border/50 hover:border-primary/50 hover:bg-card transition-all duration-300 hover:scale-105 min-w-[220px]">
      {client.logo_url ? (
        <img
          src={client.logo_url}
          alt={client.name}
          className="h-16 md:h-20 w-auto object-contain rounded-full"
        />
      ) : (
        <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-primary/20 flex items-center justify-center">
          <span className="text-2xl md:text-3xl font-bold text-primary">
            {client.name.charAt(0).toUpperCase()}
          </span>
        </div>
      )}
      
      {/* Creator name - bigger */}
      <span className="text-lg md:text-xl font-bold text-foreground text-center">
        {client.name}
      </span>
      
      {/* Subscriber count */}
      {client.subscriber_count && (
        <div className="flex items-center gap-1.5 text-muted-foreground">
          <Users className="w-4 h-4" />
          <span className="text-sm font-medium">{client.subscriber_count} abonnés</span>
        </div>
      )}
    </div>
  );
};

export default TrustedClients;
