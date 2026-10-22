import React, { useState } from 'react';
import { CompanionOrb } from './CompanionOrb';
import { Sparkles, MessageCircle, Edit3, Check, Heart } from 'lucide-react';
import { Button } from '../common/Button';

interface CompanionPresenceCardProps {
  companionName: string;
  userName?: string;
  phaseName?: string;
  cycleDay?: number;
  onOpenChat: () => void;
  onRenameCompanion?: (newName: string) => Promise<void>;
}

export const CompanionPresenceCard: React.FC<CompanionPresenceCardProps> = ({
  companionName = 'Aura',
  userName = 'Friend',
  phaseName = 'Follicular',
  cycleDay = 9,
  onOpenChat,
  onRenameCompanion,
}) => {
  const [isEditingName, setIsEditingName] = useState<boolean>(false);
  const [nameInput, setNameInput] = useState<string>(companionName);
  const [isSaving, setIsSaving] = useState<boolean>(false);

  const handleSaveName = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nameInput.trim() || !onRenameCompanion) return;
    setIsSaving(true);
    try {
      await onRenameCompanion(nameInput.trim());
      setIsEditingName(false);
    } catch (err) {
      console.error('Failed to rename companion', err);
    } finally {
      setIsSaving(false);
    }
  };

  const nameOptions = ['Aura', 'Mira', 'Nova', 'Sol', 'Lyra', 'Zephyr'];

  return (
    <div className="relative overflow-hidden rounded-3xl p-5 sm:p-6 bg-gradient-to-r from-urjaa-lavender/40 via-urjaa-blush/30 to-urjaa-peach/30 dark:from-slate-900 dark:via-purple-950/20 dark:to-slate-900 border border-urjaa-lavender/80 dark:border-slate-800 shadow-soft">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Left: Orb + Affirmation */}
        <div className="flex items-start sm:items-center gap-4">
          <div className="p-2 rounded-2xl bg-white/80 dark:bg-slate-800/80 shadow-subtle border border-urjaa-lavender/60">
            <CompanionOrb name={companionName} state="welcome" size={52} />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-semibold tracking-wider uppercase text-purple-700 dark:text-purple-300 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-urjaa-rose" />
                <span>Your AI Wellness Companion</span>
              </span>

              {/* Inline Rename Toggle */}
              {onRenameCompanion && !isEditingName && (
                <button
                  type="button"
                  onClick={() => {
                    setNameInput(companionName);
                    setIsEditingName(true);
                  }}
                  className="p-1 rounded-md text-plum-400 hover:text-urjaa-plum dark:hover:text-white transition-colors"
                  title="Rename companion"
                >
                  <Edit3 className="w-3 h-3" />
                </button>
              )}
            </div>

            {isEditingName ? (
              <form onSubmit={handleSaveName} className="flex flex-wrap items-center gap-2 mt-1.5">
                <input
                  type="text"
                  value={nameInput}
                  onChange={(e) => setNameInput(e.target.value)}
                  placeholder="e.g. Mira"
                  maxLength={24}
                  className="px-2.5 py-1 rounded-xl text-xs bg-white dark:bg-slate-800 border border-urjaa-lavender text-urjaa-plum dark:text-white focus:outline-none focus:ring-2 focus:ring-urjaa-lavender"
                  autoFocus
                />
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-2 py-1 rounded-xl bg-urjaa-lavender text-urjaa-plum text-xs font-semibold hover:opacity-90 flex items-center gap-1"
                >
                  <Check className="w-3 h-3" />
                  <span>Save</span>
                </button>
                <button
                  type="button"
                  onClick={() => setIsEditingName(false)}
                  className="text-xs text-plum-500 hover:text-plum-900 dark:text-slate-400"
                >
                  Cancel
                </button>

                {/* Quick suggestions */}
                <div className="w-full flex items-center gap-1.5 mt-1">
                  <span className="text-[10px] text-plum-500">Suggestions:</span>
                  {nameOptions.map((opt) => (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => setNameInput(opt)}
                      className="text-[10px] px-1.5 py-0.5 rounded-lg bg-white/60 dark:bg-slate-800 border border-plum-100 text-plum-700 dark:text-slate-300 hover:bg-urjaa-blush"
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </form>
            ) : (
              <h3 className="font-serif font-bold text-lg text-urjaa-plum dark:text-white">
                {companionName} is attuned to your Day {cycleDay} {phaseName} rhythm
              </h3>
            )}

            <p className="text-xs text-plum-700 dark:text-slate-300 mt-1 max-w-xl leading-relaxed">
              &ldquo;Estrogen is gently elevating your stamina today. I’m here to suggest phase-aligned recipes,
              pacing tips, or simply hold space whenever you need a mindful pause.&rdquo;
            </p>
          </div>
        </div>

        {/* Right: Ask Companion Button */}
        <div className="sm:self-center shrink-0">
          <Button
            type="button"
            variant="blush"
            size="sm"
            onClick={onOpenChat}
            leftIcon={<MessageCircle className="w-4 h-4 text-urjaa-rose" />}
            className="shadow-subtle"
          >
            Ask {companionName}
          </Button>
        </div>
      </div>
    </div>
  );
};
