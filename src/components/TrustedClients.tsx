import { motion } from "framer-motion";
import { useTrustedClients } from "@/hooks/useTrustedClients";
import { Star } from "lucide-react";

const TrustedClients = () => {
  const { data: clients = [], isLoading } = useTrustedClients();

  if (isLoading) {
    return (
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="h-8 w-64 bg-muted rounded animate-pulse mx-auto mb-12" />
          <div className="flex flex-wrap justify-center gap-8">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="w-32 h-16 bg-muted rounded-lg animate-pulse" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (clients.length === 0) {
    return null;
  }

  return (
    <section className="py-16 px-4">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h2 className="text-2xl md:text-3xl font-bold text-foreground flex items-center justify-center gap-3">
            <Star className="w-6 h-6 text-primary fill-primary" />
            Ils m'ont fait confiance
            <Star className="w-6 h-6 text-primary fill-primary" />
          </h2>
        </motion.div>

        <div className="flex flex-wrap justify-center items-center gap-8 md:gap-12">
          {clients.map((client, index) => (
            <motion.div
              key={client.id}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
            >
              {client.website_url ? (
                <a
                  href={client.website_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block group"
                >
                  <ClientCard client={client} />
                </a>
              ) : (
                <ClientCard client={client} />
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const ClientCard = ({ client }: { client: { name: string; logo_url: string | null } }) => {
  return (
    <div className="flex flex-col items-center gap-2 px-6 py-4 rounded-xl bg-card/50 border border-border/50 hover:border-primary/50 hover:bg-card transition-all duration-300 group-hover:scale-105">
      {client.logo_url ? (
        <img
          src={client.logo_url}
          alt={client.name}
          className="h-12 md:h-16 w-auto object-contain filter grayscale hover:grayscale-0 transition-all duration-300"
        />
      ) : (
        <span className="text-lg font-semibold text-muted-foreground group-hover:text-primary transition-colors">
          {client.name}
        </span>
      )}
      {client.logo_url && (
        <span className="text-xs text-muted-foreground">{client.name}</span>
      )}
    </div>
  );
};

export default TrustedClients;
