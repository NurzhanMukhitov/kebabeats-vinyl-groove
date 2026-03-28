interface VinylPlayerProps {
  isPlaying: boolean;
  slipmatImage?: string;
  /** Station / brand logo in the center (e.g. radio); uses dark disc if no slipmatImage */
  centerLogoSrc?: string;
}

const VinylPlayer = ({ isPlaying, slipmatImage, centerLogoSrc }: VinylPlayerProps) => {
  const discBase = slipmatImage ? (
    <img
      src={slipmatImage}
      className="absolute inset-0 w-full h-full object-cover rounded-full"
      alt="Slipmat"
    />
  ) : centerLogoSrc ? (
    <div className="absolute inset-0 w-full h-full bg-gradient-to-br from-zinc-900 via-black to-zinc-950 rounded-full" />
  ) : (
    <div className="absolute inset-0 w-full h-full bg-gradient-to-br from-primary to-primary-dark rounded-full" />
  );

  return (
    <div className="relative flex items-center justify-center py-1 md:py-2">
      <div
        className={`relative w-[170px] h-[170px] md:w-[200px] md:h-[200px] rounded-full shadow-[0_20px_50px_rgba(0,0,0,0.8)] flex items-center justify-center overflow-hidden animate-spin-vinyl`}
        style={{
          animationPlayState: isPlaying ? 'running' : 'paused',
        }}
      >
        {discBase}

        {centerLogoSrc ? (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none px-8 py-8">
            <img
              src={centerLogoSrc}
              alt=""
              className="max-w-[78%] max-h-[78%] w-auto h-auto object-contain opacity-[0.95]"
            />
          </div>
        ) : null}

        {/* Vinyl grooves overlay on top of label / slipmat */}
        <div
          className="absolute inset-0 rounded-full pointer-events-none"
          style={{
            background: `repeating-radial-gradient(circle, transparent 0px, transparent 1px, rgba(0,0,0,0.3) 2px, transparent 3px)`,
          }}
        />

        {/* Spindle hole in center */}
        <div className="absolute inset-0 m-auto w-3 h-3 md:w-4 md:h-4 bg-background rounded-full shadow-inner z-20" />

        {/* Sheen overlay */}
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.08] rounded-full"
          style={{
            background: 'conic-gradient(from 0deg, transparent, white, transparent, white, transparent)',
          }}
        />
      </div>
    </div>
  );
};

export default VinylPlayer;
