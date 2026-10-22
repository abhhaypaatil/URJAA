import React from 'react';

export type CompanionOrbState = 'idle' | 'welcome' | 'thinking' | 'responding' | 'celebrating';

interface CompanionOrbProps {
  state?: CompanionOrbState;
  size?: number;
  className?: string;
  name?: string;
}

export const CompanionOrb: React.FC<CompanionOrbProps> = ({
  state = 'idle',
  size = 48,
  className = '',
  name = 'Aura',
}) => {
  return (
    <div
      style={{ width: size, height: size }}
      className={`relative flex items-center justify-center shrink-0 ${className}`}
      title={`${name} (AI Companion)`}
    >
      <svg
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full overflow-visible"
      >
        <defs>
          {/* Lavender and Rose Celestial Gradients */}
          <radialGradient id="companion-core-glow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#FFF9F6" />
            <stop offset="40%" stopColor="#D9CFF2" />
            <stop offset="75%" stopColor="#E8AFC1" />
            <stop offset="100%" stopColor="#9273cc" stopOpacity="0.8" />
          </radialGradient>

          <radialGradient id="companion-aura" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#D9CFF2" stopOpacity="0.6" />
            <stop offset="60%" stopColor="#E8AFC1" stopOpacity="0.25" />
            <stop offset="100%" stopColor="#D9CFF2" stopOpacity="0" />
          </radialGradient>

          <filter id="companion-blur" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" />
          </filter>
        </defs>

        {/* Outer Aura Halo - Soft Breathing Glow */}
        <circle
          cx="50"
          cy="50"
          r="46"
          fill="url(#companion-aura)"
          className={
            state === 'thinking'
              ? 'animate-pulse'
              : state === 'celebrating'
              ? 'animate-ping opacity-75'
              : 'transition-all duration-1000'
          }
        />

        {/* Concentric Celestial Resonance Ring 1 */}
        <ellipse
          cx="50"
          cy="50"
          rx="38"
          ry="18"
          stroke="#D9CFF2"
          strokeWidth="1.8"
          strokeDasharray={state === 'thinking' ? '4 4' : 'none'}
          opacity="0.75"
          transform="rotate(-25 50 50)"
          className={state === 'thinking' ? 'animate-spin origin-center' : ''}
        />

        {/* Concentric Celestial Resonance Ring 2 */}
        <ellipse
          cx="50"
          cy="50"
          rx="38"
          ry="18"
          stroke="#E8AFC1"
          strokeWidth="1.2"
          opacity="0.65"
          transform="rotate(40 50 50)"
        />

        {/* Central Luminous Spirit Orb */}
        <circle
          cx="50"
          cy="50"
          r="22"
          fill="url(#companion-core-glow)"
          filter="url(#companion-blur)"
          opacity="0.8"
        />
        <circle
          cx="50"
          cy="50"
          r="18"
          fill="url(#companion-core-glow)"
          stroke="#FFF9F6"
          strokeWidth="1.5"
        />

        {/* Inner Starlight Gem */}
        <path
          d="M 50 36 L 52 48 L 64 50 L 52 52 L 50 64 L 48 52 L 36 50 L 48 48 Z"
          fill="#FFF9F6"
          opacity={state === 'responding' ? '1' : '0.85'}
        />

        {/* Orbiting Celestial Particles (Thinking or Celebrating State) */}
        {(state === 'thinking' || state === 'celebrating' || state === 'welcome') && (
          <>
            <circle cx="22" cy="38" r="2.5" fill="#FFF9F6" className="animate-ping" />
            <circle cx="78" cy="62" r="2" fill="#E8AFC1" />
            <circle cx="68" cy="28" r="2.2" fill="#D9CFF2" />
          </>
        )}
      </svg>
    </div>
  );
};
