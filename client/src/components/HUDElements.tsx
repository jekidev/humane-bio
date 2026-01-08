import { useEffect, useState } from 'react';

export default function HUDElements() {
  const [scanlinePosition, setScanlinePosition] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setScanlinePosition((prev) => (prev + 2) % 100);
    }, 30);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-20">
      {/* Animated Scan Lines */}
      <div
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: 'repeating-linear-gradient(0deg, transparent 0px, transparent 1px, rgba(0,0,0,0.1) 1px, rgba(0,0,0,0.1) 2px)',
          animation: 'scan-move 3s linear infinite',
        }}
      />

      {/* Corner Brackets - Top Left */}
      <div className="absolute top-8 left-8 w-12 h-12">
        <div className="absolute top-0 left-0 w-full h-1 border-t-2 border-l-2 border-black/30" />
        <div className="absolute top-0 left-0 w-1 h-full border-l-2 border-black/30" />
      </div>

      {/* Corner Brackets - Top Right */}
      <div className="absolute top-8 right-8 w-12 h-12">
        <div className="absolute top-0 right-0 w-full h-1 border-t-2 border-r-2 border-black/30" />
        <div className="absolute top-0 right-0 w-1 h-full border-r-2 border-black/30" />
      </div>

      {/* Corner Brackets - Bottom Left */}
      <div className="absolute bottom-8 left-8 w-12 h-12">
        <div className="absolute bottom-0 left-0 w-full h-1 border-b-2 border-l-2 border-black/30" />
        <div className="absolute bottom-0 left-0 w-1 h-full border-l-2 border-black/30" />
      </div>

      {/* Corner Brackets - Bottom Right */}
      <div className="absolute bottom-8 right-8 w-12 h-12">
        <div className="absolute bottom-0 right-0 w-full h-1 border-b-2 border-r-2 border-black/30" />
        <div className="absolute bottom-0 right-0 w-1 h-full border-r-2 border-black/30" />
      </div>

      {/* Floating HUD Widgets */}
      <div className="absolute top-1/4 left-12 w-48 p-4 border border-black/20 bg-white/50 backdrop-blur-sm rounded-lg animate-float opacity-60">
        <div className="text-xs font-mono text-black/70 space-y-2">
          <div className="flex justify-between">
            <span>SYSTEM</span>
            <span className="animate-pulse">●</span>
          </div>
          <div className="h-1 bg-black/10 rounded overflow-hidden">
            <div className="h-full bg-black/30 w-3/4 animate-pulse" />
          </div>
          <div className="text-xs text-black/50">STATUS: ACTIVE</div>
        </div>
      </div>

      {/* Floating HUD Widget - Right Side */}
      <div className="absolute top-1/3 right-12 w-48 p-4 border border-black/20 bg-white/50 backdrop-blur-sm rounded-lg animate-float opacity-60" style={{ animationDelay: '1s' }}>
        <div className="text-xs font-mono text-black/70 space-y-2">
          <div className="flex justify-between">
            <span>ANALYSIS</span>
            <span className="animate-pulse">◆</span>
          </div>
          <div className="space-y-1">
            <div className="flex justify-between text-xs">
              <span>LOAD</span>
              <span>87%</span>
            </div>
            <div className="h-1 bg-black/10 rounded overflow-hidden">
              <div className="h-full bg-black/30 w-7/12 animate-pulse" />
            </div>
          </div>
        </div>
      </div>

      {/* Animated Horizontal Scan Line */}
      <div
        className="absolute left-0 right-0 h-px bg-gradient-to-r from-transparent via-black/20 to-transparent"
        style={{
          top: `${scanlinePosition}%`,
          animation: 'scan-horizontal 8s ease-in-out infinite',
        }}
      />

      {/* Molecular Structure Overlay - Top Left */}
      <div className="absolute top-20 left-20 w-32 h-32 opacity-10 pointer-events-none">
        <svg viewBox="0 0 100 100" className="w-full h-full animate-spin" style={{ animationDuration: '20s' }}>
          <circle cx="50" cy="50" r="40" fill="none" stroke="currentColor" strokeWidth="0.5" />
          <circle cx="50" cy="50" r="30" fill="none" stroke="currentColor" strokeWidth="0.5" />
          <circle cx="50" cy="50" r="20" fill="none" stroke="currentColor" strokeWidth="0.5" />
          <circle cx="50" cy="20" r="3" fill="currentColor" />
          <circle cx="80" cy="50" r="3" fill="currentColor" />
          <circle cx="50" cy="80" r="3" fill="currentColor" />
          <circle cx="20" cy="50" r="3" fill="currentColor" />
          <line x1="50" y1="50" x2="50" y2="20" stroke="currentColor" strokeWidth="0.5" />
          <line x1="50" y1="50" x2="80" y2="50" stroke="currentColor" strokeWidth="0.5" />
          <line x1="50" y1="50" x2="50" y2="80" stroke="currentColor" strokeWidth="0.5" />
          <line x1="50" y1="50" x2="20" y2="50" stroke="currentColor" strokeWidth="0.5" />
        </svg>
      </div>

      {/* Molecular Structure Overlay - Bottom Right */}
      <div className="absolute bottom-32 right-20 w-40 h-40 opacity-10 pointer-events-none">
        <svg viewBox="0 0 100 100" className="w-full h-full animate-spin" style={{ animationDuration: '25s', animationDirection: 'reverse' }}>
          <circle cx="50" cy="50" r="40" fill="none" stroke="currentColor" strokeWidth="0.5" />
          <circle cx="50" cy="50" r="30" fill="none" stroke="currentColor" strokeWidth="0.5" />
          <circle cx="50" cy="50" r="20" fill="none" stroke="currentColor" strokeWidth="0.5" />
          <circle cx="50" cy="20" r="3" fill="currentColor" />
          <circle cx="80" cy="50" r="3" fill="currentColor" />
          <circle cx="50" cy="80" r="3" fill="currentColor" />
          <circle cx="20" cy="50" r="3" fill="currentColor" />
          <line x1="50" y1="50" x2="50" y2="20" stroke="currentColor" strokeWidth="0.5" />
          <line x1="50" y1="50" x2="80" y2="50" stroke="currentColor" strokeWidth="0.5" />
          <line x1="50" y1="50" x2="50" y2="80" stroke="currentColor" strokeWidth="0.5" />
          <line x1="50" y1="50" x2="20" y2="50" stroke="currentColor" strokeWidth="0.5" />
        </svg>
      </div>

      {/* Animated Dots - Corners */}
      <div className="absolute top-8 left-8 w-2 h-2 bg-black/40 rounded-full animate-ping" />
      <div className="absolute top-8 right-8 w-2 h-2 bg-black/40 rounded-full animate-ping" style={{ animationDelay: '0.5s' }} />
      <div className="absolute bottom-8 left-8 w-2 h-2 bg-black/40 rounded-full animate-ping" style={{ animationDelay: '1s' }} />
      <div className="absolute bottom-8 right-8 w-2 h-2 bg-black/40 rounded-full animate-ping" style={{ animationDelay: '1.5s' }} />

      <style>{`
        @keyframes scan-move {
          0%, 100% { top: 0; }
          50% { top: 100%; }
        }
        @keyframes scan-horizontal {
          0% { top: 0; opacity: 0; }
          10% { opacity: 0.3; }
          90% { opacity: 0.3; }
          100% { top: 100%; opacity: 0; }
        }
      `}</style>
    </div>
  );
}
