import { type TouchEvent, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useIsMobile } from "@/hooks/use-mobile";

const PosterGallery = () => {
  const isMobile = useIsMobile();
  const posters = useMemo(
    () => Array.from({ length: 41 }, (_, i) => `/posters/poster-${String(i + 1).padStart(2, "0")}.webp`),
    [],
  );
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const touchStartXRef = useRef<number | null>(null);
  const touchStartYRef = useRef<number | null>(null);

  const goPrev = useCallback(
    () => setSelectedIndex((prev) => (prev === null ? prev : (prev - 1 + posters.length) % posters.length)),
    [posters.length],
  );
  const goNext = useCallback(
    () => setSelectedIndex((prev) => (prev === null ? prev : (prev + 1) % posters.length)),
    [posters.length],
  );

  useEffect(() => {
    if (selectedIndex === null) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") goPrev();
      if (e.key === "ArrowRight") goNext();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [selectedIndex, goPrev, goNext]);

  const handleTouchStart = (e: TouchEvent) => {
    touchStartXRef.current = e.changedTouches[0]?.clientX ?? null;
    touchStartYRef.current = e.changedTouches[0]?.clientY ?? null;
  };

  const handleTouchEnd = (e: TouchEvent) => {
    const startX = touchStartXRef.current;
    const startY = touchStartYRef.current;
    touchStartXRef.current = null;
    touchStartYRef.current = null;
    if (startX === null || startY === null) return;
    const dx = (e.changedTouches[0]?.clientX ?? startX) - startX;
    const dy = (e.changedTouches[0]?.clientY ?? startY) - startY;
    if (Math.abs(dx) < 45 || Math.abs(dx) < Math.abs(dy)) return;
    if (dx > 0) goPrev();
    else goNext();
  };

  const handleClick = (index: number) => {
    if (isMobile) setSelectedIndex(index);
  };

  return (
    <section className="px-3 overflow-y-auto pb-24">
      <div style={{ columnCount: 2, columnGap: "8px" }}>
        {posters.map((src, index) => (
          <img
            key={src}
            src={src}
            alt={`Poster ${index + 1}`}
            loading="lazy"
            onClick={() => handleClick(index)}
            style={{
              display: "block",
              width: "100%",
              marginBottom: "8px",
              borderRadius: "8px",
              cursor: isMobile ? "pointer" : "default",
            }}
          />
        ))}
      </div>

      <Dialog open={selectedIndex !== null} onOpenChange={(open) => !open && setSelectedIndex(null)}>
        <DialogContent className="!w-auto !max-w-[92vw] bg-black border-zinc-800 p-0 overflow-hidden">
          {selectedIndex !== null && (
            <div onTouchStart={handleTouchStart} onTouchEnd={handleTouchEnd}>
              <img
                src={posters[selectedIndex]}
                alt={`Poster ${selectedIndex + 1}`}
                style={{ display: "block", maxHeight: "92vh", maxWidth: "92vw", width: "auto", height: "auto" }}
              />
            </div>
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
};

export default PosterGallery;
