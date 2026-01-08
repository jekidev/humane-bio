import { useEffect, useState } from 'react';

interface AnimatedVideoBackgroundProps {
  videoSrc: string;
  overlayOpacity?: number;
  children?: React.ReactNode;
}

export default function AnimatedVideoBackground({
  videoSrc,
  overlayOpacity = 0.5,
  children,
}: AnimatedVideoBackgroundProps) {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  return (
    <div className="relative w-full h-full overflow-hidden">
      {/* Video Background */}
      <video
        autoPlay
        muted
        loop
        playsInline
        className="absolute inset-0 w-full h-full object-cover"
        onLoadedData={() => setIsLoaded(true)}
      >
        <source src={videoSrc} type="video/mp4" />
      </video>

      {/* Overlay Gradient */}
      <div
        className="absolute inset-0 bg-gradient-to-r from-white via-white/95 to-white/80"
        style={{ opacity: overlayOpacity }}
      />

      {/* Animated Particles */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-black/20 rounded-full animate-float-particle"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${i * 0.5}s`,
            }}
          />
        ))}
      </div>

      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>

      <style>{`
        @keyframes float-particle {
          0%, 100% {
            transform: translate(0, 0);
            opacity: 0.2;
          }
          25% {
            transform: translate(10px, -20px);
            opacity: 0.4;
          }
          50% {
            transform: translate(-5px, -40px);
            opacity: 0.3;
          }
          75% {
            transform: translate(15px, -20px);
            opacity: 0.5;
          }
        }
      `}</style>
    </div>
  );
}
