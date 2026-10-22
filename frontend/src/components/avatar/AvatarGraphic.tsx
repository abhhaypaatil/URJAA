import React from 'react';
import { getAvatarById } from '../../constants/avatars';

interface AvatarGraphicProps {
  avatarId: string;
  size?: number | string;
  className?: string;
}

export const AvatarGraphic: React.FC<AvatarGraphicProps> = ({
  avatarId,
  size = 64,
  className = '',
}) => {
  const meta = getAvatarById(avatarId);

  // Solar Bloom: Radial petals, warm radiant core, floral geometry
  const renderSolarBloom = () => (
    <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      <defs>
        <radialGradient id="solar-bg" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#FFF9F6" />
          <stop offset="60%" stopColor="#F6DCE7" />
          <stop offset="100%" stopColor="#E8AFC1" />
        </radialGradient>
        <linearGradient id="solar-petals" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#E8AFC1" />
          <stop offset="100%" stopColor="#f43f6e" />
        </linearGradient>
      </defs>
      <rect width="100" height="100" rx="50" fill="url(#solar-bg)" />
      {/* 8 Floral Rays */}
      {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => (
        <path
          key={i}
          d="M 50 20 C 47 32 47 40 50 45 C 53 40 53 32 50 20 Z"
          fill="url(#solar-petals)"
          opacity="0.85"
          transform={`rotate(${angle} 50 50)`}
        />
      ))}
      <circle cx="50" cy="50" r="16" fill="#FFF9F6" stroke="#E8AFC1" strokeWidth="2.5" />
      <circle cx="50" cy="50" r="8" fill="#E8AFC1" />
      <circle cx="50" cy="50" r="3.5" fill="#FFF9F6" />
    </svg>
  );

  // Lunar Lotus: Layered aquatic lotus petals in pistachio & sky blue
  const renderLunarLotus = () => (
    <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      <defs>
        <radialGradient id="lotus-bg" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#FFF9F6" />
          <stop offset="60%" stopColor="#D5EAF8" />
          <stop offset="100%" stopColor="#D9EBCB" />
        </radialGradient>
        <linearGradient id="lotus-petal" x1="0%" y1="100%" x2="0%" y2="0%">
          <stop offset="0%" stopColor="#D9EBCB" />
          <stop offset="100%" stopColor="#5c945d" />
        </linearGradient>
      </defs>
      <rect width="100" height="100" rx="50" fill="url(#lotus-bg)" />
      {/* Lotus pad water ripple */}
      <circle cx="50" cy="62" r="28" stroke="#D5EAF8" strokeWidth="2" strokeDasharray="3 3" opacity="0.7" />
      {/* Lotus petals */}
      <path d="M 50 28 C 42 42 42 62 50 68 C 58 62 58 42 50 28 Z" fill="#D9EBCB" opacity="0.95" />
      <path d="M 50 34 C 36 44 38 60 50 68 C 42 60 40 44 50 34 Z" fill="#D5EAF8" opacity="0.85" />
      <path d="M 50 34 C 64 44 62 60 50 68 C 58 60 60 44 50 34 Z" fill="#D5EAF8" opacity="0.85" />
      <path d="M 50 42 C 30 52 35 64 50 68 C 38 64 36 54 50 42 Z" fill="#cde0cd" opacity="0.75" />
      <path d="M 50 42 C 70 52 65 64 50 68 C 62 64 64 54 50 42 Z" fill="#cde0cd" opacity="0.75" />
      {/* Lotus golden stamen seed */}
      <circle cx="50" cy="56" r="4.5" fill="#F8E6D3" stroke="#5c945d" strokeWidth="1.5" />
    </svg>
  );

  // Celestial Sage: Star dust, constellation rings, lavender deep glow
  const renderCelestialSage = () => (
    <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      <defs>
        <radialGradient id="celestial-bg" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#FFF9F6" />
          <stop offset="50%" stopColor="#D9CFF2" />
          <stop offset="100%" stopColor="#9273cc" />
        </radialGradient>
      </defs>
      <rect width="100" height="100" rx="50" fill="url(#celestial-bg)" />
      {/* Orbital ring */}
      <ellipse cx="50" cy="50" rx="34" ry="14" stroke="#FFF9F6" strokeWidth="1.8" transform="rotate(-25 50 50)" opacity="0.8" />
      <ellipse cx="50" cy="50" rx="34" ry="14" stroke="#413544" strokeWidth="1" strokeDasharray="2 3" transform="rotate(35 50 50)" opacity="0.5" />
      {/* Central Star */}
      <circle cx="50" cy="50" r="13" fill="#FFF9F6" />
      <path d="M 50 25 L 53 45 L 75 50 L 53 55 L 50 75 L 47 55 L 25 50 L 47 45 Z" fill="#D9CFF2" opacity="0.9" />
      <circle cx="50" cy="50" r="6" fill="#7a5ab7" />
      {/* Constellation nodes */}
      <circle cx="28" cy="36" r="2.5" fill="#FFF9F6" />
      <circle cx="72" cy="64" r="2.5" fill="#FFF9F6" />
      <circle cx="70" cy="30" r="1.8" fill="#FFF9F6" />
      <circle cx="32" cy="68" r="1.8" fill="#FFF9F6" />
    </svg>
  );

  // Botanical Flora: Branching leaves, blush & pistachio harmonic bloom
  const renderBotanicalFlora = () => (
    <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      <defs>
        <radialGradient id="flora-bg" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#FFF9F6" />
          <stop offset="65%" stopColor="#F6DCE7" />
          <stop offset="100%" stopColor="#D9EBCB" />
        </radialGradient>
      </defs>
      <rect width="100" height="100" rx="50" fill="url(#flora-bg)" />
      {/* Stems & Leaves */}
      <path d="M 50 80 Q 50 50 50 20" stroke="#477748" strokeWidth="2.5" strokeLinecap="round" />
      {/* Left leaves */}
      <path d="M 50 65 Q 36 60 34 50 Q 42 54 50 60" fill="#D9EBCB" stroke="#477748" strokeWidth="1.2" />
      <path d="M 50 45 Q 34 40 32 30 Q 40 34 50 40" fill="#D9EBCB" stroke="#477748" strokeWidth="1.2" />
      {/* Right leaves */}
      <path d="M 50 55 Q 64 50 66 40 Q 58 44 50 50" fill="#D9EBCB" stroke="#477748" strokeWidth="1.2" />
      <path d="M 50 35 Q 66 30 68 20 Q 60 24 50 30" fill="#D9EBCB" stroke="#477748" strokeWidth="1.2" />
      {/* Top budding rose flower */}
      <circle cx="50" cy="20" r="9" fill="#E8AFC1" />
      <circle cx="50" cy="20" r="5" fill="#f43f6e" opacity="0.7" />
      <circle cx="50" cy="20" r="2.5" fill="#FFF9F6" />
    </svg>
  );

  // Aurora Wave: Smooth flowing wave ribbons of energy
  const renderAuroraWave = () => (
    <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      <defs>
        <radialGradient id="wave-bg" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#FFF9F6" />
          <stop offset="55%" stopColor="#D5EAF8" />
          <stop offset="100%" stopColor="#98cbec" />
        </radialGradient>
      </defs>
      <rect width="100" height="100" rx="50" fill="url(#wave-bg)" />
      {/* Wave ribbons */}
      <path
        d="M 15 65 C 30 75 45 45 60 55 C 75 65 85 45 95 50"
        stroke="#E8AFC1"
        strokeWidth="6"
        strokeLinecap="round"
        opacity="0.9"
      />
      <path
        d="M 10 50 C 25 35 45 65 65 40 C 80 20 90 40 95 35"
        stroke="#D9CFF2"
        strokeWidth="4"
        strokeLinecap="round"
        opacity="0.85"
      />
      <path
        d="M 15 35 C 35 25 50 50 70 30 C 85 15 90 25 95 20"
        stroke="#FFF9F6"
        strokeWidth="3"
        strokeLinecap="round"
        opacity="0.95"
      />
      {/* Sparkles */}
      <circle cx="35" cy="30" r="2.5" fill="#FFF9F6" />
      <circle cx="75" cy="70" r="3" fill="#FFF9F6" />
    </svg>
  );

  // Zenith Pulse: Concentric sacred circles in peach and plum
  const renderZenithPulse = () => (
    <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      <defs>
        <radialGradient id="pulse-bg" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#FFF9F6" />
          <stop offset="60%" stopColor="#F8E6D3" />
          <stop offset="100%" stopColor="#e5975b" />
        </radialGradient>
      </defs>
      <rect width="100" height="100" rx="50" fill="url(#pulse-bg)" />
      {/* Concentric harmony rings */}
      <circle cx="50" cy="50" r="38" stroke="#413544" strokeWidth="1.2" strokeDasharray="3 3" opacity="0.4" />
      <circle cx="50" cy="50" r="30" stroke="#FFF9F6" strokeWidth="2.5" opacity="0.8" />
      <circle cx="50" cy="50" r="22" stroke="#E8AFC1" strokeWidth="2" opacity="0.9" />
      <circle cx="50" cy="50" r="14" fill="#F8E6D3" stroke="#413544" strokeWidth="1.5" />
      <circle cx="50" cy="50" r="6" fill="#413544" />
      {/* 4 cardinal points */}
      <circle cx="50" cy="20" r="2" fill="#413544" />
      <circle cx="50" cy="80" r="2" fill="#413544" />
      <circle cx="20" cy="50" r="2" fill="#413544" />
      <circle cx="80" cy="50" r="2" fill="#413544" />
    </svg>
  );

  const getGraphic = () => {
    switch (meta.id) {
      case 'lunar-lotus':
        return renderLunarLotus();
      case 'celestial-sage':
        return renderCelestialSage();
      case 'botanical-flora':
        return renderBotanicalFlora();
      case 'aurora-wave':
        return renderAuroraWave();
      case 'zenith-pulse':
        return renderZenithPulse();
      case 'solar-bloom':
      default:
        return renderSolarBloom();
    }
  };

  return (
    <div
      style={{ width: size, height: size }}
      className={`relative rounded-full overflow-hidden shrink-0 shadow-subtle ${className}`}
    >
      {getGraphic()}
    </div>
  );
};
