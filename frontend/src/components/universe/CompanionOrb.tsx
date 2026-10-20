import React, { useState } from 'react';
import { Sparkles, MessageSquare, ArrowRight, Zap, X } from 'lucide-react';
import { PhaseType } from '../../types';

interface CompanionOrbProps {
  phase?: PhaseType;
  userName?: string;
  onOpenCompanion?: () => void;
  className?: string;
}

export const CompanionOrb: React.FC<CompanionOrbProps> = ({
  phase = 'Follicular',
  userName = 'Voyager',
  onOpenCompanion,
  className = '',
}) => {
  const [isHovered, setIsHovered] = useState<boolean>(false);
  const [isDismissed, setIsDismissed] = useState<boolean>(false);

  const getPhaseGreeting = () => {
    switch (phase) {
      case 'Menstrual':
        return 'Restorative frequency active. Ease your lower back and hydrate.';
      case 'Follicular':
        return 'Estradiol ascending. Optimal window for kinetic flow and creative focus.';
      case 'Ovulatory':
        return 'Peak hormonal resonance. Stamina and verbal fluidity are heightened.';
      case 'Luteal':
      default:
        return 'Progesterone cycle active. Prioritize magnesium-rich nourishment.';
    }
  };

  return (
    <div
      className={`fixed bottom-24 right-5 md:bottom-8 md:right-8 z-40 flex items-end gap-3 select-none ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Speech Bubble / Contextual Guidance */}
      {(isHovered || !isDismissed) && (
        <div className="hidden sm:flex flex-col max-w-xs p-3.5 rounded-2xl glass-panel shadow-cosmic-glow border border-nebula-500/20 text-xs text-slate-200 animate-in fade-in slide-in-from-bottom-2 duration-300">
          <div className="flex items-center justify-between gap-2 mb-1">
            <div className="flex items-center gap-1.5 text-nebula-400 font-semibold text-[11px] uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-rose-400 animate-pulse" />
              <span>Aura — Companion</span>
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsDismissed(true);
              }}
              className="text-slate-400 hover:text-white p-0.5 rounded transition-colors"
              title="Minimize companion tip"
            >
              <X className="w-3 h-3" />
            </button>
          </div>
          <p className="text-[12px] leading-relaxed text-slate-300 font-sans">
            {getPhaseGreeting()}
          </p>
          <button
            onClick={onOpenCompanion}
            className="mt-2.5 inline-flex items-center gap-1 text-[11px] font-semibold text-rose-400 hover:text-rose-300 transition-colors group"
          >
            <span>Consult Companion</span>
            <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>
      )}

      {/* Interactive Floating Orb Button */}
      <button
        onClick={onOpenCompanion}
        className="relative group p-1.5 focus:outline-none focus:ring-2 focus:ring-nebula-400 rounded-full"
        title="Summon AI Companion (Aura)"
        aria-label="Summon AI Companion Aura"
      >
        {/* Outer ambient energy ring */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-rose-500/30 via-nebula-500/30 to-sapphire-500/30 blur-md group-hover:blur-lg transition-all duration-500 animate-pulse-subtle" />

        {/* Orbiting particle ring */}
        <div className="w-13 h-13 sm:w-14 sm:h-14 rounded-full relative p-0.5 bg-gradient-to-tr from-rose-500 via-nebula-500 to-sapphire-400 shadow-cosmic-glow group-hover:scale-105 active:scale-95 transition-transform duration-300 flex items-center justify-center">
          <div className="w-full h-full rounded-full bg-cosmic-950/90 backdrop-blur-md flex items-center justify-center relative overflow-hidden">
            {/* Inner glowing core */}
            <div className="absolute inset-1 rounded-full bg-gradient-to-tr from-rose-600/20 via-nebula-600/30 to-sapphire-600/20 animate-spin [animation-duration:12s]" />

            <div className="relative z-10 flex flex-col items-center justify-center text-white">
              <Sparkles className="w-5 h-5 text-rose-300 group-hover:scale-110 transition-transform" />
            </div>

            {/* Live activity indicator */}
            <span className="absolute top-1 right-1 w-2.5 h-2.5 rounded-full bg-emerald-400 ring-2 ring-cosmic-950 animate-pulse" />
          </div>
        </div>
      </button>
    </div>
  );
};
