import React from 'react';
import { Outlet } from 'react-router-dom';
import { Navbar } from './Navbar';
import { DisclaimerBanner } from './DisclaimerBanner';

export const AppLayout: React.FC = () => {
  return (
    <div className="min-h-screen bg-warm-50/60 dark:bg-slate-950 flex flex-col font-sans">
      <Navbar />
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 py-6 md:py-8 pb-24 md:pb-12">
        <Outlet />
      </main>
      <footer className="hidden md:block py-6 border-t border-slate-200/60 dark:border-slate-800/80 bg-white/40 dark:bg-slate-950/40">
        <div className="max-w-6xl mx-auto px-4">
          <DisclaimerBanner />
          <div className="mt-4 flex items-center justify-between text-xs text-slate-400 dark:text-slate-500">
            <span>© 2026 Urjaa. Track less. Understand more. Recommend better.</span>
            <span>Cycle-Aware Wellness Platform</span>
          </div>
        </div>
      </footer>
    </div>
  );
};
