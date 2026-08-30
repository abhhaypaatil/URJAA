import React from 'react';
import { AnimationType } from '../../types';

interface ExerciseAnimationProps {
  type: AnimationType | string;
  className?: string;
  isPaused?: boolean;
}

export const ExerciseAnimation: React.FC<ExerciseAnimationProps> = ({
  type,
  className = 'w-48 h-48',
  isPaused = false,
}) => {
  const pauseStyle = isPaused ? { animationPlayState: 'paused' } : {};

  // Archetype 1: SQUAT PATTERN
  if (type === 'squat_pattern') {
    return (
      <div className={`relative flex items-center justify-center ${className}`}>
        <svg viewBox="0 0 200 200" className="w-full h-full">
          <defs>
            <linearGradient id="roseGradient" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#f43f5e" />
              <stop offset="100%" stopColor="#e11d48" />
            </linearGradient>
          </defs>
          {/* Floor Line */}
          <line x1="30" y1="175" x2="170" y2="175" stroke="#cbd5e1" strokeWidth="4" strokeLinecap="round" />
          {/* Animated Body Group */}
          <g className="animate-squat" style={pauseStyle}>
            {/* Head */}
            <circle cx="100" cy="50" r="14" fill="url(#roseGradient)" />
            {/* Torso */}
            <line x1="100" y1="64" x2="100" y2="110" stroke="url(#roseGradient)" strokeWidth="8" strokeLinecap="round" />
            {/* Arms */}
            <path d="M 100 75 L 125 90 L 140 85" fill="none" stroke="url(#roseGradient)" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
            {/* Hips & Legs */}
            <path d="M 100 110 L 80 140 L 75 175" fill="none" stroke="url(#roseGradient)" strokeWidth="7" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M 100 110 L 120 140 L 125 175" fill="none" stroke="url(#roseGradient)" strokeWidth="7" strokeLinecap="round" strokeLinejoin="round" />
          </g>
        </svg>
      </div>
    );
  }

  // Archetype 2: PUSH PATTERN (Push-ups / Incline / Dips)
  if (type === 'push_pattern') {
    return (
      <div className={`relative flex items-center justify-center ${className}`}>
        <svg viewBox="0 0 200 200" className="w-full h-full">
          {/* Floor */}
          <line x1="20" y1="160" x2="180" y2="160" stroke="#cbd5e1" strokeWidth="4" strokeLinecap="round" />
          {/* Push Group */}
          <g className="animate-push" style={pauseStyle}>
            {/* Head */}
            <circle cx="145" cy="85" r="13" fill="#e11d48" />
            {/* Torso & Legs line */}
            <line x1="140" y1="95" x2="50" y2="145" stroke="#f43f5e" strokeWidth="8" strokeLinecap="round" />
            {/* Arms pushing */}
            <polyline points="135,100 145,125 155,160" fill="none" stroke="#e11d48" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
            {/* Feet */}
            <circle cx="50" cy="155" r="5" fill="#9f1239" />
          </g>
        </svg>
      </div>
    );
  }

  // Archetype 3: PLANK PATTERN
  if (type === 'plank_pattern') {
    return (
      <div className={`relative flex items-center justify-center ${className}`}>
        <svg viewBox="0 0 200 200" className="w-full h-full">
          <line x1="20" y1="155" x2="180" y2="155" stroke="#cbd5e1" strokeWidth="4" strokeLinecap="round" />
          <g className="animate-plank" style={pauseStyle}>
            <circle cx="150" cy="90" r="13" fill="#467ebc" />
            <line x1="145" y1="100" x2="55" y2="125" stroke="#3363a0" strokeWidth="8" strokeLinecap="round" />
            <polyline points="140,105 150,135 160,155" fill="none" stroke="#467ebc" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
            <line x1="55" y1="125" x2="45" y2="155" stroke="#2b5083" strokeWidth="6" strokeLinecap="round" />
          </g>
        </svg>
      </div>
    );
  }

  // Archetype 4: LUNGE PATTERN
  if (type === 'lunge_pattern') {
    return (
      <div className={`relative flex items-center justify-center ${className}`}>
        <svg viewBox="0 0 200 200" className="w-full h-full">
          <line x1="20" y1="175" x2="180" y2="175" stroke="#cbd5e1" strokeWidth="4" strokeLinecap="round" />
          <g className="animate-lunge" style={pauseStyle}>
            <circle cx="95" cy="55" r="13" fill="#059669" />
            <line x1="95" y1="68" x2="95" y2="115" stroke="#10b981" strokeWidth="8" strokeLinecap="round" />
            {/* Front Leg */}
            <polyline points="95,115 130,135 130,175" fill="none" stroke="#059669" strokeWidth="7" strokeLinecap="round" strokeLinejoin="round" />
            {/* Back Leg */}
            <polyline points="95,115 65,140 50,175" fill="none" stroke="#047857" strokeWidth="7" strokeLinecap="round" strokeLinejoin="round" />
            {/* Hands */}
            <line x1="95" y1="80" x2="115" y2="105" stroke="#10b981" strokeWidth="6" strokeLinecap="round" />
          </g>
        </svg>
      </div>
    );
  }

  // Archetype 5: JUMPING / CARDIO PATTERN
  if (type === 'jumping_pattern') {
    return (
      <div className={`relative flex items-center justify-center ${className}`}>
        <svg viewBox="0 0 200 200" className="w-full h-full">
          <line x1="30" y1="180" x2="170" y2="180" stroke="#cbd5e1" strokeWidth="4" strokeLinecap="round" />
          <g className="animate-jumping" style={pauseStyle}>
            <circle cx="100" cy="45" r="14" fill="#f59e0b" />
            <line x1="100" y1="59" x2="100" y2="105" stroke="#d97706" strokeWidth="8" strokeLinecap="round" />
            {/* Arms jumping */}
            <path d="M 100 70 L 60 45 M 100 70 L 140 45" stroke="#f59e0b" strokeWidth="6" strokeLinecap="round" />
            {/* Legs Jumping Out */}
            <path d="M 100 105 L 65 160 M 100 105 L 135 160" stroke="#d97706" strokeWidth="7" strokeLinecap="round" />
          </g>
        </svg>
      </div>
    );
  }

  // Archetype 6: STATIC HOLD / RECOVERY / GLUTE BRIDGE
  if (type === 'static_hold') {
    return (
      <div className={`relative flex items-center justify-center ${className}`}>
        <svg viewBox="0 0 200 200" className="w-full h-full">
          <line x1="20" y1="165" x2="180" y2="165" stroke="#cbd5e1" strokeWidth="4" strokeLinecap="round" />
          <g className="animate-pulse" style={{ animationDuration: '3s' }}>
            <circle cx="50" cy="150" r="12" fill="#be123c" />
            {/* Shoulders on mat, hips elevated */}
            <path d="M 60 155 Q 100 115 130 135 L 145 165" fill="none" stroke="#e11d48" strokeWidth="8" strokeLinecap="round" />
            {/* Arms relaxed */}
            <line x1="60" y1="160" x2="105" y2="160" stroke="#f43f5e" strokeWidth="6" strokeLinecap="round" />
          </g>
        </svg>
      </div>
    );
  }

  // Default Archetype: STRETCH / MOBILITY (Cat-Cow / Child's Pose / Fold)
  return (
    <div className={`relative flex items-center justify-center ${className}`}>
      <svg viewBox="0 0 200 200" className="w-full h-full">
        <line x1="20" y1="165" x2="180" y2="165" stroke="#cbd5e1" strokeWidth="4" strokeLinecap="round" />
        <g className="animate-stretch" style={pauseStyle}>
          <circle cx="65" cy="140" r="13" fill="#881337" />
          <path d="M 75 145 Q 110 135 145 155" fill="none" stroke="#be123c" strokeWidth="8" strokeLinecap="round" />
          {/* Extended arms forward */}
          <line x1="75" y1="150" x2="35" y2="160" stroke="#fb7185" strokeWidth="6" strokeLinecap="round" />
        </g>
      </svg>
    </div>
  );
};
