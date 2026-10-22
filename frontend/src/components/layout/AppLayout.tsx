import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { Navbar } from './Navbar';
import { DisclaimerBanner } from './DisclaimerBanner';
import { CompanionDrawer } from '../companion/CompanionDrawer';
import { CommandPalette } from './CommandPalette';
import { useAuth } from '../../context/AuthContext';

export const AppLayout: React.FC = () => {
  const { profile } = useAuth();
  const [isCompanionOpen, setIsCompanionOpen] = useState<boolean>(false);
  const [isPaletteOpen, setIsPaletteOpen] = useState<boolean>(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsPaletteOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className="min-h-screen bg-warm-50/70 dark:bg-slate-950 text-slate-800 dark:text-slate-100 flex flex-col font-sans relative">
      {/* Clean Lifestyle Top Navbar */}
      <Navbar onOpenCompanion={() => setIsCompanionOpen(true)} />

      {/* Main Feature Viewport */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-6 md:py-8 pb-24 md:pb-14 relative z-10">
        <Outlet />
      </main>

      {/* Helpful AI Wellness Assistant Drawer */}
      <CompanionDrawer
        isOpen={isCompanionOpen}
        onClose={() => setIsCompanionOpen(false)}
        context={{
          userName: profile?.name || 'Maya',
          phase: 'Follicular',
          cycleDay: 9,
          energyLevel: 'High',
        }}
      />

      {/* Keyboard Command Palette (Ctrl+K) */}
      <CommandPalette
        isOpen={isPaletteOpen}
        onClose={() => setIsPaletteOpen(false)}
      />

      {/* Clean Lifestyle Footer */}
      <footer className="hidden md:block py-6 border-t border-slate-200/80 dark:border-slate-800/80 bg-white/70 dark:bg-slate-900/60 relative z-10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <DisclaimerBanner />
          <div className="mt-4 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
            <span>© 2026 Urjaa. Cycle-Aware Personal Health & Wellness Platform.</span>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsPaletteOpen(true)}
                className="hover:text-slate-900 dark:hover:text-white flex items-center gap-1 font-mono text-[11px]"
              >
                <span>Quick Jump</span>
                <kbd className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-[10px]">
                  Ctrl+K
                </kbd>
              </button>
              <span>Track less. Understand more. Recommend better.</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};
