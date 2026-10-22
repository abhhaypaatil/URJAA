import React, { useEffect, useRef } from 'react';
import { PhaseType } from '../../types';

interface UniverseCanvasProps {
  phase?: PhaseType;
  density?: 'low' | 'medium' | 'high';
  interactive?: boolean;
}

interface Star {
  x: number;
  y: number;
  size: number;
  alpha: number;
  speed: number;
  driftX: number;
  driftY: number;
}

export const UniverseCanvas: React.FC<UniverseCanvasProps> = ({
  phase = 'Follicular',
  density = 'medium',
  interactive = true,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const mouseRef = useRef<{ x: number; y: number; targetX: number; targetY: number }>({
    x: 0,
    y: 0,
    targetX: 0,
    targetY: 0,
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Check prefers-reduced-motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    const handleMouseMove = (e: MouseEvent) => {
      if (!interactive) return;
      mouseRef.current.targetX = (e.clientX - width / 2) * 0.03;
      mouseRef.current.targetY = (e.clientY - height / 2) * 0.03;
    };
    if (interactive) {
      window.addEventListener('mousemove', handleMouseMove);
    }

    // Number of stars
    const starCount = density === 'low' ? 45 : density === 'high' ? 120 : 75;
    const stars: Star[] = [];

    for (let i = 0; i < starCount; i++) {
      stars.push({
        x: Math.random() * width,
        y: Math.random() * height,
        size: Math.random() * 1.8 + 0.6,
        alpha: Math.random() * 0.7 + 0.3,
        speed: Math.random() * 0.02 + 0.005,
        driftX: (Math.random() - 0.5) * 0.15,
        driftY: (Math.random() - 0.5) * 0.15,
      });
    }

    // Phase color accents for ambient nebula glow
    const getPhaseGlowColors = (p: PhaseType) => {
      switch (p) {
        case 'Menstrual':
          return {
            primary: 'rgba(244, 63, 94, 0.08)',
            secondary: 'rgba(190, 18, 60, 0.05)',
            starGlow: 'rgba(254, 205, 211, 0.9)',
          };
        case 'Follicular':
          return {
            primary: 'rgba(168, 85, 247, 0.09)',
            secondary: 'rgba(56, 189, 248, 0.07)',
            starGlow: 'rgba(224, 231, 255, 0.9)',
          };
        case 'Ovulatory':
          return {
            primary: 'rgba(251, 191, 36, 0.09)',
            secondary: 'rgba(244, 63, 94, 0.06)',
            starGlow: 'rgba(254, 243, 199, 0.9)',
          };
        case 'Luteal':
        default:
          return {
            primary: 'rgba(70, 126, 188, 0.09)',
            secondary: 'rgba(139, 92, 246, 0.06)',
            starGlow: 'rgba(204, 220, 238, 0.9)',
          };
      }
    };

    const colors = getPhaseGlowColors(phase);
    let time = 0;

    const render = () => {
      time += 0.01;

      // Smooth mouse interpolation
      mouseRef.current.x += (mouseRef.current.targetX - mouseRef.current.x) * 0.05;
      mouseRef.current.y += (mouseRef.current.targetY - mouseRef.current.y) * 0.05;

      ctx.clearRect(0, 0, width, height);

      // Deep space atmospheric base
      const bgGradient = ctx.createRadialGradient(
        width / 2 + mouseRef.current.x * 2,
        height / 2 + mouseRef.current.y * 2,
        width * 0.1,
        width / 2,
        height / 2,
        width * 0.7
      );
      bgGradient.addColorStop(0, colors.primary);
      bgGradient.addColorStop(0.5, colors.secondary);
      bgGradient.addColorStop(1, 'rgba(4, 7, 17, 0)');

      ctx.fillStyle = bgGradient;
      ctx.fillRect(0, 0, width, height);

      // Render Stars
      ctx.save();
      for (const s of stars) {
        if (!prefersReducedMotion) {
          s.x += s.driftX;
          s.y += s.driftY;
          if (s.x < 0) s.x = width;
          if (s.x > width) s.x = 0;
          if (s.y < 0) s.y = height;
          if (s.y > height) s.y = 0;
        }

        const parallaxX = s.x - mouseRef.current.x * (s.size * 0.4);
        const parallaxY = s.y - mouseRef.current.y * (s.size * 0.4);
        const shimmer = prefersReducedMotion ? s.alpha : Math.sin(time * 2 + s.x) * 0.25 + s.alpha;

        ctx.beginPath();
        ctx.arc(parallaxX, parallaxY, s.size, 0, Math.PI * 2);
        ctx.fillStyle = colors.starGlow;
        ctx.globalAlpha = Math.max(0.15, Math.min(1, shimmer));
        ctx.fill();
      }
      ctx.restore();

      if (!prefersReducedMotion) {
        animationFrameId = requestAnimationFrame(render);
      }
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      if (interactive) {
        window.removeEventListener('mousemove', handleMouseMove);
      }
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, [phase, density, interactive]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0 opacity-80 transition-opacity duration-1000"
      aria-hidden="true"
    />
  );
};
