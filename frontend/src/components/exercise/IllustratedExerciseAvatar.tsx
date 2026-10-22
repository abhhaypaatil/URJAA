import React, { useState, useEffect } from 'react';

export type ExerciseMovementType =
  | 'squat_pattern'
  | 'push_pattern'
  | 'stretch_pattern'
  | 'child_pose'
  | 'jumping_pattern'
  | 'glute_bridge'
  | 'static_hold';

interface IllustratedExerciseAvatarProps {
  movementType?: string;
  exerciseName?: string;
  isPlaying?: boolean;
  isModified?: boolean;
  size?: 'sm' | 'md' | 'lg' | 'responsive';
  className?: string;
}

export const IllustratedExerciseAvatar: React.FC<IllustratedExerciseAvatarProps> = ({
  movementType = 'squat_pattern',
  exerciseName = 'Movement Exercise',
  isPlaying = true,
  isModified = false,
  size = 'responsive',
  className = '',
}) => {
  // Animation frame state: 0 -> 100 for smooth cycle
  const [cycleProgress, setCycleProgress] = useState<number>(0);

  useEffect(() => {
    if (!isPlaying) return;

    let frameId: number;
    const durationMs = 2800; // 2.8s per complete repetition
    const start = performance.now();

    const loop = (now: number) => {
      const elapsed = (now - start) % durationMs;
      // Calculate normalized 0 -> 1 -> 0 sinusoidal progression
      const progress = 0.5 - 0.5 * Math.cos((elapsed / durationMs) * 2 * Math.PI);
      setCycleProgress(progress);
      frameId = requestAnimationFrame(loop);
    };

    frameId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(frameId);
  }, [isPlaying]);

  const p = cycleProgress; // 0 to 1

  // Height and size styling
  const sizeClasses = {
    sm: 'w-48 h-40',
    md: 'w-72 h-60',
    lg: 'w-96 h-80',
    responsive: 'w-full h-56 sm:h-72',
  }[size];

  // 1. SQUAT PATTERN (Bodyweight / Chair Squats)
  const renderSquat = () => {
    // Standing hip at Y=115, Squat depth Y=145 (or 135 if modified/assisted)
    const maxDrop = isModified ? 20 : 35;
    const hipY = 115 + p * maxDrop;
    const kneeY = 145 + p * 8;
    const torsoAngle = p * (isModified ? 15 : 24); // slight forward lean
    const headY = 55 + p * maxDrop;

    return (
      <g>
        {/* Floor Line */}
        <line x1="30" y1="185" x2="170" y2="185" stroke="#E8AFC1" strokeWidth="2" strokeDasharray="3 3" opacity="0.6" />

        {/* Chair / Support Surface if modified */}
        {isModified && (
          <g opacity="0.7">
            <rect x="52" y="135" width="30" height="4" rx="2" fill="#D9CFF2" />
            <line x1="56" y1="139" x2="56" y2="185" stroke="#D9CFF2" strokeWidth="2.5" />
            <line x1="78" y1="139" x2="78" y2="185" stroke="#D9CFF2" strokeWidth="2.5" />
          </g>
        )}

        {/* Shadow */}
        <ellipse cx="100" cy="184" rx={35 + p * 8} ry="6" fill="#413544" opacity={0.12 - p * 0.04} />

        {/* Lower Leg / Feet */}
        <path d="M 88 184 L 92 155 L 86 184 Z" fill="#D9CFF2" />
        <ellipse cx="88" cy="184" rx="9" ry="3.5" fill="#413544" />
        <ellipse cx="112" cy="184" rx="9" ry="3.5" fill="#413544" />

        {/* Shin / Knees */}
        <line x1="90" y1="184" x2={96 - p * 6} y2={kneeY} stroke="#D9CFF2" strokeWidth="8" strokeLinecap="round" />
        <line x1="110" y1="184" x2={104 + p * 6} y2={kneeY} stroke="#D9CFF2" strokeWidth="8" strokeLinecap="round" />

        {/* Thighs */}
        <line x1={96 - p * 6} y1={kneeY} x2={90 - p * 12} y2={hipY} stroke="#D9CFF2" strokeWidth="9" strokeLinecap="round" />
        <line x1={104 + p * 6} y1={kneeY} x2={110 + p * 12} y2={hipY} stroke="#D9CFF2" strokeWidth="9" strokeLinecap="round" />

        {/* Torso & Athletic Top */}
        <g transform={`rotate(${torsoAngle} 100 ${hipY})`}>
          <rect x="91" y={hipY - 45} width="18" height="38" rx="8" fill="#413544" />
          {/* Rose accent waistline */}
          <rect x="91" y={hipY - 10} width="18" height="6" fill="#E8AFC1" />

          {/* Arms: Extended forward for counterbalance */}
          <path
            d={`M 92 ${hipY - 35} Q 115 ${hipY - 30 - p * 8} ${128 + p * 8} ${hipY - 26 - p * 6}`}
            stroke="#F8E6D3"
            strokeWidth="5"
            strokeLinecap="round"
            fill="none"
          />

          {/* Neck & Head */}
          <rect x="97" y={headY - 50} width="6" height="8" fill="#F8E6D3" />
          <circle cx="100" cy={headY - 56} r="10" fill="#F8E6D3" />
          {/* Hair Bun with Rose Ribbon */}
          <circle cx="94" cy={headY - 60} r="6" fill="#413544" />
          <circle cx="95" cy={headY - 59} r="2.5" fill="#E8AFC1" />
        </g>
      </g>
    );
  };

  // 2. PUSH PATTERN (Wall / Incline / Knee / Standard Push-up)
  const renderPushup = () => {
    // Horizontal or angled pushup: chest drops toward ground
    const chestY = isModified ? 90 + p * 18 : 130 + p * 24;
    const bodyAngle = isModified ? -22 + p * 3 : -8 + p * 2;

    return (
      <g transform={`rotate(${bodyAngle} 60 160)`}>
        {/* Mat */}
        <line x1="30" y1="170" x2="175" y2="170" stroke="#E8AFC1" strokeWidth="3" strokeLinecap="round" opacity="0.6" />

        {/* Feet / Pivot point */}
        <ellipse cx="45" cy="168" rx="7" ry="4" fill="#413544" />

        {/* Legs / Hips */}
        <line x1="45" y1="168" x2="90" y2={chestY + 12} stroke="#D9CFF2" strokeWidth="8" strokeLinecap="round" />

        {/* Torso */}
        <line x1="90" y1={chestY + 12} x2="135" y2={chestY} stroke="#413544" strokeWidth="14" strokeLinecap="round" />

        {/* Arm: Elbow bends as chest approaches mat */}
        <path
          d={`M 130 ${chestY + 2} L ${126 - p * 12} ${150 + p * 4} L 126 168`}
          stroke="#F8E6D3"
          strokeWidth="6"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />

        {/* Head */}
        <circle cx="148" cy={chestY - 3} r="9" fill="#F8E6D3" />
        {/* Hair */}
        <ellipse cx="145" cy={chestY - 6} rx="6" ry="7" fill="#413544" />
      </g>
    );
  };

  // 3. STRETCH PATTERN (Cat-Cow Flow)
  const renderCatCow = () => {
    // Tabletop position: spine arches up (Cat) and dips down (Cow)
    const spineCurve = (p - 0.5) * 28; // -14 to +14

    return (
      <g>
        {/* Mat */}
        <line x1="25" y1="165" x2="175" y2="165" stroke="#D9EBCB" strokeWidth="3" strokeLinecap="round" />

        {/* Knees on ground */}
        <circle cx="65" cy="160" r="5" fill="#D9CFF2" />
        <line x1="65" y1="160" x2="45" y2="163" stroke="#D9CFF2" strokeWidth="6" strokeLinecap="round" />

        {/* Hands on ground under shoulders */}
        <line x1="135" y1="162" x2="135" y2="125" stroke="#F8E6D3" strokeWidth="5.5" strokeLinecap="round" />

        {/* Back Spine Curvature: Arching (Cat) vs Incline (Cow) */}
        <path
          d={`M 65 125 Q 100 ${125 + spineCurve} 135 125`}
          stroke="#413544"
          strokeWidth="15"
          strokeLinecap="round"
          fill="none"
        />

        {/* Head: tilts up with Cow, tucks with Cat */}
        <circle cx="148" cy={118 - spineCurve * 0.4} r="9" fill="#F8E6D3" />
        <circle cx="151" cy={115 - spineCurve * 0.4} r="5" fill="#413544" />
      </g>
    );
  };

  // 4. CHILD'S POSE (Restorative / Pelvic Release)
  const renderChildPose = () => {
    const breathExpansion = p * 4;

    return (
      <g>
        {/* Mat */}
        <line x1="20" y1="165" x2="180" y2="165" stroke="#D9CFF2" strokeWidth="3" strokeLinecap="round" opacity="0.8" />

        {/* Hips on heels */}
        <ellipse cx="55" cy="154" rx="14" ry="10" fill="#D9CFF2" />

        {/* Torso folded forward along thighs */}
        <path
          d={`M 62 150 Q 88 ${142 - breathExpansion} 118 155`}
          stroke="#413544"
          strokeWidth="16"
          strokeLinecap="round"
          fill="none"
        />

        {/* Arms stretched softly forward on mat */}
        <path d="M 112 152 L 158 163" stroke="#F8E6D3" strokeWidth="5" strokeLinecap="round" />

        {/* Head resting on mat */}
        <circle cx="126" cy="158" r="8" fill="#F8E6D3" />
        <circle cx="123" cy="155" r="5" fill="#413544" />
      </g>
    );
  };

  // 5. JUMPING / STEP JACKS (Cardio Prep)
  const renderJacks = () => {
    // Step tap right foot outward with arms swinging overhead
    const legSpread = p * 28;
    const armAngle = p * 110;

    return (
      <g>
        <line x1="30" y1="185" x2="170" y2="185" stroke="#D5EAF8" strokeWidth="2.5" strokeLinecap="round" />
        <ellipse cx="100" cy="184" rx={24 + p * 6} ry="5" fill="#413544" opacity="0.1" />

        {/* Left Leg (Pivoting) */}
        <line x1="94" y1="130" x2={94 - legSpread * 0.3} y2="184" stroke="#D9CFF2" strokeWidth="7" strokeLinecap="round" />

        {/* Right Leg (Stepping outward) */}
        <line x1="106" y1="130" x2={106 + legSpread} y2="184" stroke="#D9CFF2" strokeWidth="7" strokeLinecap="round" />

        {/* Torso */}
        <rect x="91" y="90" width="18" height="42" rx="7" fill="#413544" />

        {/* Left Arm Sweeping Overhead */}
        <g transform={`rotate(${-armAngle} 92 98)`}>
          <line x1="92" y1="98" x2="70" y2="128" stroke="#F8E6D3" strokeWidth="5" strokeLinecap="round" />
        </g>

        {/* Right Arm Sweeping Overhead */}
        <g transform={`rotate(${armAngle} 108 98)`}>
          <line x1="108" y1="98" x2="130" y2="128" stroke="#F8E6D3" strokeWidth="5" strokeLinecap="round" />
        </g>

        {/* Head */}
        <circle cx="100" cy="74" r="10" fill="#F8E6D3" />
        <circle cx="96" cy="69" r="6" fill="#413544" />
      </g>
    );
  };

  const getMovementRender = () => {
    const type = (movementType || '').toLowerCase();
    if (type.includes('push')) return renderPushup();
    if (type.includes('cat') || type.includes('stretch') || type.includes('mobility')) return renderCatCow();
    if (type.includes('child') || type.includes('rest') || type.includes('recovery')) return renderChildPose();
    if (type.includes('jump') || type.includes('jack') || type.includes('cardio')) return renderJacks();
    return renderSquat(); // Default squat & lower body
  };

  return (
    <div
      className={`relative overflow-hidden rounded-3xl bg-gradient-to-b from-urjaa-ivory via-white to-urjaa-blush/30 dark:from-slate-900 dark:via-slate-900 dark:to-slate-800 border border-plum-100/70 dark:border-slate-800 flex items-center justify-center p-2 shadow-subtle ${sizeClasses} ${className}`}
    >
      {/* Background Soft Glow */}
      <div className="absolute inset-0 bg-radial from-urjaa-blush/40 to-transparent pointer-events-none" />

      {/* SVG Canvas */}
      <svg
        viewBox="0 0 200 200"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full max-h-full overflow-visible"
        aria-label={`${exerciseName} demonstrated by illustrated human avatar`}
      >
        {getMovementRender()}
      </svg>

      {/* Illustrated Badge Indicator */}
      <div className="absolute bottom-2 left-3 flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-plum-100/70 text-[10px] font-semibold text-urjaa-plum dark:text-slate-200">
        <span className="w-1.5 h-1.5 rounded-full bg-urjaa-rose animate-pulse" />
        <span>Illustrated Human Avatar</span>
      </div>

      {isModified && (
        <div className="absolute top-2 right-3 px-2 py-0.5 rounded-full bg-urjaa-blush text-urjaa-plum text-[10px] font-bold">
          Gentle Modification Active
        </div>
      )}
    </div>
  );
};
