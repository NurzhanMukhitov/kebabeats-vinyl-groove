import { useEffect, useState } from "react";

const CREW_URL = "https://pub-ffa331fb4e5045e2a665d7fdeb5fbcda.r2.dev/crew.json";
const CREW_IMAGE_BASE_URL = "https://pub-ffa331fb4e5045e2a665d7fdeb5fbcda.r2.dev/crew";

export interface CrewMember {
  id: string;
  name: string;
  photo: string;
  bio: string;
  instagram?: string;
}

type CrewJson = {
  crew?: Array<{
    id: string;
    name: string;
    photo: string;
    bio: string;
    instagram?: string;
  }>;
};

export function useCrew() {
  const [crew, setCrew] = useState<CrewMember[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    async function loadCrew() {
      setIsLoading(true);
      setError(null);

      try {
        const res = await fetch(CREW_URL, { signal: controller.signal });
        if (!res.ok) {
          throw new Error(`Failed to fetch crew.json (HTTP ${res.status})`);
        }

        const json = (await res.json()) as CrewJson;
        const incoming = Array.isArray(json.crew) ? json.crew : [];
        setCrew(
          incoming.map((m) => ({
            // R2 files use uppercase .jpg names (e.g. MONSIEURX.jpg).
            id: String(m.id),
            name: String(m.name ?? ""),
            photo: `${CREW_IMAGE_BASE_URL}/${String(m.name ?? "")
              .replace(/\s+/g, "")
              .toUpperCase()}.jpg`,
            bio: String(m.bio ?? ""),
            instagram: m.instagram ? String(m.instagram) : undefined,
          })),
        );
      } catch (e) {
        setCrew([]);
        setError(e instanceof Error ? e.message : "Failed to load crew");
      } finally {
        setIsLoading(false);
      }
    }

    loadCrew();
    return () => controller.abort();
  }, []);

  return { crew, isLoading, error };
}

