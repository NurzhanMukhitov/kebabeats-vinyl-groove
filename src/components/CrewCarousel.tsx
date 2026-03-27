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
          className="hidden md:flex items-center justify-center absolute top-1/2 -translate-y-1/2 z-20 h-12 w-12 rounded-full bg-white/10 border border-white/20 text-white/90 hover:bg-white/20 transition-opacity duration-300 ease-out opacity-0 group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto"
          style={{ left: "8px" }}
        >
          <ChevronLeft size={22} />
        </button>
        <button
          type="button"
          aria-label="Next DJ"
          onClick={() => scrollToCard("next")}
          className="hidden md:flex items-center justify-center absolute top-1/2 -translate-y-1/2 z-20 h-12 w-12 rounded-full bg-white/10 border border-white/20 text-white/90 hover:bg-white/20 transition-opacity duration-300 ease-out opacity-0 group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto"
          style={{ right: "8px" }}
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
            gap: 0,
            paddingLeft: 0,
            paddingRight: 0,
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
                className="flex justify-center"
              >
                <div
                  className="w-full max-w-[340px] md:max-w-[450px] rounded-3xl border border-white/10 bg-white/[0.03] px-5 md:px-8 py-5 md:py-8 text-center flex flex-col"
                  style={{
                    maxHeight: "min(500px, calc(100vh - 180px))",
                  }}
                >
                  <div className="mx-auto mb-6 h-[180px] w-[180px] md:h-[200px] md:w-[200px] rounded-full border-2 border-white/25 bg-white/5 p-1 relative">
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
                    className="mt-4 max-h-[150px] overflow-y-auto custom-scrollbar px-4"
                  >
                    <p className="text-sm md:text-base text-muted-foreground text-left leading-[1.6]">
                      {member.bio}
                    </p>
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

