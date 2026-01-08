import { ReactNode } from 'react';

interface PageBackgroundProps {
  children: ReactNode;
  backgroundImage: string;
  videoBackground?: string;
}

export default function PageBackground({
  children,
  backgroundImage,
  videoBackground,
}: PageBackgroundProps) {
  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Video Background */}
      {videoBackground && (
        <video
          autoPlay
          muted
          loop
          className="absolute inset-0 w-full h-full object-cover opacity-20"
        >
          <source src={videoBackground} type="video/mp4" />
        </video>
      )}

      {/* Image Background */}
      <div
        className="absolute inset-0 w-full h-full bg-cover bg-center opacity-30"
        style={{
          backgroundImage: `url(${backgroundImage})`,
        }}
      />

      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-white/10" />

      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
}
