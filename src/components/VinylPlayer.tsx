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
          background: `repeating-radial-gradient(circle, hsl(var(--groove-dark)) 0px, hsl(var(--groove-dark)) 1px, hsl(var(--groove-light)) 2px, hsl(var(--groove-dark)) 3px)`,
        }}
      >
        {/* Center label / slipmat */}
        <div className="relative w-[130px] h-[130px] rounded-full overflow-hidden border-4 border-background z-10">
          {slipmatImage ? (
            <img src={slipmatImage} className="w-full h-full object-cover" alt="Slipmat" />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-primary to-primary-dark" />
          )}
          {/* Spindle hole */}
          <div className="absolute inset-0 m-auto w-4 h-4 bg-background rounded-full shadow-inner" />
        </div>

        {/* Sheen overlay */}
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.08]"
          style={{
            background: 'conic-gradient(from 0deg, transparent, white, transparent, white, transparent)',
          }}
        />
      </div>
    </div>
  );
};

export default VinylPlayer;
