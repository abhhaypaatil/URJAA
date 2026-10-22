import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Home,
  Heart,
  Flame,
  UtensilsCrossed,
  Activity,
  Calendar as CalendarIcon,
  BarChart3,
  MessageCircle,
  User,
  Search,
  X,
} from 'lucide-react';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const [search, setSearch] = useState<string>('');

  const destinations = [
    { label: "Today's Plan", description: "Daily overview, cycle summary, and today's recommendations", route: '/home', icon: Home, key: '1' },
    { label: 'Cycle Intelligence', description: 'Hormonal phases, cycle day, and flow tracking', route: '/cycle', icon: Heart, key: '2' },
    { label: 'Guided Movement', description: '50+ exercises, workout library, and timed sessions', route: '/workout', icon: Flame, key: '3' },
    { label: 'Nutrition & Meals', description: 'Cycle-aware recipes, portion guidance, and clean swaps', route: '/nutrition', icon: UtensilsCrossed, key: '4' },
    { label: 'Daily Check-in', description: '20-second tracking of mood, energy, sleep, and water', route: '/check-in', icon: Activity, key: '5' },
    { label: 'Calendar & History', description: 'Monthly consistency scores and 9 filter lenses', route: '/calendar', icon: CalendarIcon, key: '6' },
    { label: 'Wellness Insights', description: 'Bio-trends, hormonal curves, and activity stats', route: '/insights', icon: BarChart3, key: '7' },
    { label: 'Aura AI Assistant', description: 'Conversational wellness guidance for your cycle', route: '/companion', icon: MessageCircle, key: '8' },
    { label: 'Profile & Settings', description: 'Dietary preferences, PCOS mode, and health export', route: '/profile', icon: User, key: '9' },
  ];

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        onClose();
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const filtered = destinations.filter(
    (d) =>
      d.label.toLowerCase().includes(search.toLowerCase()) ||
      d.description.toLowerCase().includes(search.toLowerCase())
  );

  const handleSelect = (route: string) => {
    onClose();
    navigate(route);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="fixed inset-0" onClick={onClose} />

      <div className="relative w-full max-w-xl bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden z-10 animate-in zoom-in-95 duration-150">
        {/* Search Input Bar */}
        <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center gap-3">
          <Search className="w-5 h-5 text-slate-400" />
          <input
            type="text"
            autoFocus
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Jump to any section... (Type 1-9 or name)"
            className="flex-1 bg-transparent border-none text-slate-900 dark:text-white text-sm placeholder:text-slate-400 focus:outline-none"
          />
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Destination List */}
        <div className="max-h-96 overflow-y-auto p-2 space-y-1">
          {filtered.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.route}
                onClick={() => handleSelect(item.route)}
                className="w-full p-3 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-800/60 text-left transition-colors flex items-center justify-between group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-300 group-hover:text-rose-600 transition-colors">
                    <Icon className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-slate-900 dark:text-white group-hover:text-rose-600 dark:group-hover:text-rose-400 transition-colors">
                      {item.label}
                    </div>
                    <div className="text-xs text-slate-500 dark:text-slate-400">{item.description}</div>
                  </div>
                </div>

                <kbd className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-[10px] font-mono text-slate-500 dark:text-slate-400">
                  {item.key}
                </kbd>
              </button>
            );
          })}

          {filtered.length === 0 && (
            <div className="p-8 text-center text-xs text-slate-400">
              No matching sections found.
            </div>
          )}
        </div>

        {/* Footer shortcuts hint */}
        <div className="p-3 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60 flex items-center justify-between text-[11px] text-slate-400 px-4">
          <span>
            <kbd className="px-1.5 py-0.5 rounded bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-mono text-[10px]">
              ESC
            </kbd>{' '}
            to close
          </span>
          <span>
            <kbd className="px-1.5 py-0.5 rounded bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-mono text-[10px]">
              Ctrl+K
            </kbd>{' '}
            quick switcher
          </span>
        </div>
      </div>
    </div>
  );
};
