interface VinylPlayerProps {
  isPlaying: boolean;
  slipmatImage?: string;
}

const VinylPlayer = ({ isPlaying, slipmatImage }: VinylPlayerProps) => {
  return (
    <div className="relative flex items-center justify-center py-8">
      <div
        className={`relative w-[260px] h-[260px] rounded-full shadow-[0_20px_50px_rgba(0,0,0,0.8)] flex items-center justify-center overflow-hidden animate-spin-vinyl`}
        style={{
          animationPlayState: isPlaying ? 'running' : 'paused',
        }}
      >
        {/* Mascot image - full disc background */}
        {slipmatImage ? (
          <img
            src={slipmatImage}
            className="absolute inset-0 w-full h-full object-cover rounded-full"
            alt="Slipmat"
          />
        ) : (
          <div className="absolute inset-0 w-full h-full bg-gradient-to-br from-primary to-primary-dark rounded-full" />
        )}

        {/* Vinyl grooves overlay on top of image */}
        <div
          className="absolute inset-0 rounded-full pointer-events-none"
          style={{
            background: `repeating-radial-gradient(circle, transparent 0px, transparent 1px, rgba(0,0,0,0.3) 2px, transparent 3px)`,
          }}
        />

        {/* Spindle hole in center */}
        <div className="absolute inset-0 m-auto w-4 h-4 bg-background rounded-full shadow-inner z-20" />

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
