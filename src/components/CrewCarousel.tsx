import { useRef, useState } from "react";
import { ChevronLeft, ChevronRight, Instagram } from "lucide-react";
import type { CrewMember } from "@/hooks/useCrew";

interface CrewCarouselProps {
  crew: CrewMember[];
}

const getInitials = (name: string) => {
  const parts = name
    .trim()
    .split(/\s+/)
    .filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0] ?? ""}${parts[1][0] ?? ""}`.toUpperCase();
};

const CrewCarousel = ({ crew }: CrewCarouselProps) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [brokenImageIds, setBrokenImageIds] = useState<Record<string, boolean>>({});
  const scrollToCard = (direction: "prev" | "next") => {
    const container = containerRef.current;
    if (!container) return;
    const firstCard = container.querySelector<HTMLElement>("[data-crew-card='true']");
    const w = firstCard?.clientWidth ?? 400;
    const delta = direction === "next" ? w : -w;
    container.scrollBy({ left: delta, behavior: "smooth" });
  };

  return (
    <section className="flex-1 flex flex-col justify-center px-4 pb-24" style={{ minHeight: "calc(100svh - 140px)" }}>
      <div className="relative w-full group">
        {/* Desktop arrows */}
        <button
          type="button"
          aria-label="Previous DJ"
          onClick={() => scrollToCard("prev")}
          className="hidden md:flex items-center justify-center fixed left-5 top-1/2 -translate-y-1/2 z-20 h-12 w-12 rounded-full bg-white/10 border border-white/20 text-white/90 hover:bg-white/20 transition-opacity opacity-0 group-hover:opacity-100"
        >
          <ChevronLeft size={22} />
        </button>
        <button
          type="button"
          aria-label="Next DJ"
          onClick={() => scrollToCard("next")}
          className="hidden md:flex items-center justify-center fixed right-5 top-1/2 -translate-y-1/2 z-20 h-12 w-12 rounded-full bg-white/10 border border-white/20 text-white/90 hover:bg-white/20 transition-opacity opacity-0 group-hover:opacity-100"
        >
          <ChevronRight size={22} />
        </button>

        <div
          ref={containerRef}
          style={{
            display: "flex",
            overflowX: "scroll",
            scrollSnapType: "x mandatory",
            WebkitOverflowScrolling: "touch",
            scrollbarWidth: "none",
            msOverflowStyle: "none",
            scrollBehavior: "smooth",
            width: "100%",
            alignItems: "center",
            gap: 16,
            paddingLeft: 16,
            paddingRight: 16,
          }}
          className="hide-scrollbar select-none"
        >
          {crew.map((member) => {
            const instagramHandle = member.instagram
              ? member.instagram.startsWith("@")
                ? member.instagram
                : `@${member.instagram}`
              : null;
            const instagramUrl = instagramHandle ? `https://instagram.com/${instagramHandle.slice(1)}` : null;

            return (
              <div
                key={member.id}
                data-crew-card="true"
                style={{
                  scrollSnapAlign: "center",
                  flexShrink: 0,
                  width: "100%",
                }}
                className="flex justify-center px-2"
              >
                <div
                  className="w-full max-w-[320px] md:max-w-[400px] rounded-3xl border border-white/10 bg-white/[0.03] px-8 py-8 text-center flex flex-col"
                  style={{ maxHeight: "calc(100svh - 240px)" }}
                >
                  <div className="mx-auto mb-6 h-40 w-40 md:h-[180px] md:w-[180px] rounded-full border-2 border-white/25 bg-white/5 p-1 relative">
                    {brokenImageIds[member.id] ? (
                      <div className="h-full w-full rounded-full bg-gradient-to-br from-primary/60 to-primary-dark/60 flex items-center justify-center text-2xl font-bold tracking-wider text-white">
                        {getInitials(member.name)}
                      </div>
                    ) : (
                      <img
                        src={member.photo}
                        alt={member.name}
                        className="h-full w-full rounded-full object-cover"
                        onError={() => setBrokenImageIds((prev) => ({ ...prev, [member.id]: true }))}
                      />
                    )}
                  </div>

                  <p className="text-xl font-bold uppercase tracking-widest text-white">{member.name}</p>

                  <div
                    className="mt-4 max-h-[120px] overflow-y-auto custom-scrollbar text-sm text-muted-foreground text-center px-4 leading-relaxed"
                  >
                    {member.bio}
                  </div>

                  {instagramUrl ? (
                    <a
                      href={instagramUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="mt-5 inline-flex items-center justify-center gap-2 text-[12px] text-muted-foreground hover:text-primary"
                    >
                      <Instagram size={16} />
                      {instagramHandle}
                    </a>
                  ) : null}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default CrewCarousel;

