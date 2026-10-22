import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  X,
  Send,
  MessageCircle,
  ArrowRight,
  Heart,
  Sparkles,
  Settings2,
} from 'lucide-react';
import { CompanionMessage, PhaseType } from '../../types';
import { AICompanionService, CompanionContext } from '../../services/aiCompanionService';
import { CompanionOrb } from './CompanionOrb';

interface CompanionDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  context?: Partial<CompanionContext>;
  onRenameCompanion?: (newName: string) => Promise<void>;
}

export const CompanionDrawer: React.FC<CompanionDrawerProps> = ({
  isOpen,
  onClose,
  context,
  onRenameCompanion,
}) => {
  const navigate = useNavigate();
  const companionName = context?.companionName || 'Aura';
  const userName = context?.userName || '';

  const [selectedTone, setSelectedTone] = useState<string>(
    context?.personalityTone || 'Gentle & Nurturing'
  );
  const [showSettings, setShowSettings] = useState<boolean>(false);
  const [nameInput, setNameInput] = useState<string>(companionName);

  const [messages, setMessages] = useState<CompanionMessage[]>([
    {
      id: 'init-1',
      sender: 'companion',
      text: `Hello ${userName || 'friend'}! I'm **${companionName}**, your personal cycle-aware wellness companion. Today is **Day ${
        context?.cycleDay || 9
      }** of your **${
        context?.phase || 'Follicular'
      } Phase** (estrogen ascending, cellular stamina rising). How can I support you right now?`,
      timestamp: 'Just now',
      suggestedActions: [
        { label: 'Explain Today’s Phase', actionKey: 'phase' },
        { label: 'Today’s Workout', route: '/workout' },
        { label: 'Phase Meal Ideas', route: '/nutrition' },
      ],
      phaseContext: context?.phase || 'Follicular',
    },
  ]);

  const [inputText, setInputText] = useState<string>('');
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const scrollRef = useRef<HTMLDivElement | null>(null);

  const suggestedPrompts = AICompanionService.getSuggestedPrompts(context?.phase);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  if (!isOpen) return null;

  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || inputText).trim();
    if (!text || isTyping) return;

    const userMsg: CompanionMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText('');
    setIsTyping(true);

    try {
      const response = await AICompanionService.query(text, {
        ...context,
        companionName,
        personalityTone: selectedTone,
      });
      setMessages((prev) => [...prev, response]);
    } catch (e) {
      console.error('Companion response error', e);
    } finally {
      setIsTyping(false);
    }
  };

  const handleActionClick = (action: { label: string; route?: string; actionKey?: string }) => {
    if (action.route) {
      onClose();
      navigate(action.route);
    } else if (action.actionKey === 'phase') {
      handleSendMessage(`What should I know about my ${context?.phase || 'Follicular'} phase?`);
    }
  };

  const handleSaveName = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nameInput.trim() || !onRenameCompanion) return;
    await onRenameCompanion(nameInput.trim());
    setShowSettings(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
      {/* Backdrop */}
      <div className="flex-1" onClick={onClose} />

      {/* Drawer */}
      <div className="w-full max-w-md h-full bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 shadow-2xl flex flex-col justify-between text-slate-800 dark:text-slate-100 animate-in slide-in-from-right duration-200 relative overflow-hidden">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-plum-100/70 dark:border-slate-800 flex items-center justify-between bg-white dark:bg-slate-900">
          <div className="flex items-center gap-3">
            <div className="p-1.5 rounded-2xl bg-urjaa-lavender/30 border border-urjaa-lavender/60">
              <CompanionOrb
                name={companionName}
                state={isTyping ? 'thinking' : 'welcome'}
                size={42}
              />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-serif font-bold text-base text-plum-950 dark:text-white">
                  {companionName}
                </h3>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-urjaa-lavender/50 text-urjaa-plum">
                  AI Companion
                </span>
              </div>
              <p className="text-xs text-plum-600 dark:text-slate-400 flex items-center gap-1.5 mt-0.5">
                <Heart className="w-3 h-3 text-urjaa-rose fill-urjaa-rose" />
                <span>
                  {context?.phase || 'Follicular'} Phase • Day {context?.cycleDay || 9}
                </span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={() => setShowSettings((prev) => !prev)}
              className="p-2 rounded-xl text-plum-500 hover:text-plum-900 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              title="Companion preferences"
            >
              <Settings2 className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-plum-500 hover:text-plum-900 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              title="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Companion Tone / Customization Panel */}
        {showSettings && (
          <div className="p-4 bg-urjaa-ivory dark:bg-slate-800/80 border-b border-plum-100/70 dark:border-slate-700 animate-in slide-in-from-top-2 duration-150 space-y-3">
            {onRenameCompanion && (
              <form onSubmit={handleSaveName} className="flex items-center gap-2">
                <label className="text-[11px] font-semibold text-plum-600 dark:text-slate-300 shrink-0">
                  Name:
                </label>
                <input
                  type="text"
                  value={nameInput}
                  onChange={(e) => setNameInput(e.target.value)}
                  className="flex-1 px-2.5 py-1 text-xs rounded-xl border border-plum-200 dark:border-slate-600 bg-white dark:bg-slate-900"
                />
                <button
                  type="submit"
                  className="px-2.5 py-1 rounded-xl text-xs font-semibold bg-urjaa-rose text-white"
                >
                  Save
                </button>
              </form>
            )}

            <div>
              <label className="block text-[11px] font-semibold text-plum-600 dark:text-slate-300 mb-1.5">
                Supportive Tone:
              </label>
              <div className="flex flex-wrap gap-1.5">
                {['Gentle & Nurturing', 'Mindful & Grounded', 'Direct & Motivating'].map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setSelectedTone(t)}
                    className={`text-[10px] font-semibold px-2.5 py-1 rounded-xl border transition-all ${
                      selectedTone === t
                        ? 'bg-urjaa-lavender text-urjaa-plum border-urjaa-lavender shadow-subtle'
                        : 'bg-white dark:bg-slate-900 text-plum-600 border-plum-200 dark:border-slate-700'
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Messages Stream */}
        <div
          ref={scrollRef}
          className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4 bg-urjaa-ivory/40 dark:bg-slate-950/40"
        >
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex flex-col ${
                msg.sender === 'user' ? 'items-end' : 'items-start'
              }`}
            >
              <div className="flex items-start gap-2.5 max-w-[88%]">
                {msg.sender === 'companion' && (
                  <div className="mt-1 shrink-0">
                    <CompanionOrb name={companionName} state="idle" size={28} />
                  </div>
                )}

                <div>
                  <div
                    className={`p-3.5 sm:p-4 rounded-3xl text-sm leading-relaxed ${
                      msg.sender === 'user'
                        ? 'bg-urjaa-rose text-white rounded-tr-none shadow-subtle'
                        : 'bg-white dark:bg-slate-800 text-plum-950 dark:text-slate-100 border border-plum-100/80 dark:border-slate-700/80 rounded-tl-none shadow-subtle'
                    }`}
                  >
                    <p className="whitespace-pre-line">{msg.text}</p>

                    {/* Action shortcuts */}
                    {msg.suggestedActions && msg.suggestedActions.length > 0 && (
                      <div className="mt-3 pt-3 border-t border-plum-100 dark:border-slate-700/60 flex flex-wrap gap-1.5">
                        {msg.suggestedActions.map((action, i) => (
                          <button
                            key={i}
                            onClick={() => handleActionClick(action)}
                            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-urjaa-ivory dark:bg-slate-700 hover:bg-urjaa-blush dark:hover:bg-rose-950/40 text-xs text-plum-900 dark:text-slate-200 hover:text-urjaa-rose border border-plum-200 dark:border-slate-600 transition-all font-medium"
                          >
                            <span>{action.label}</span>
                            <ArrowRight className="w-3 h-3 text-urjaa-rose" />
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  <span className="text-[10px] text-plum-400 dark:text-slate-400 mt-1 block px-1">
                    {msg.timestamp}
                  </span>
                </div>
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="flex items-center gap-2 text-plum-500 dark:text-slate-400 text-xs pl-9">
              <span className="w-2 h-2 rounded-full bg-urjaa-rose animate-bounce" />
              <span className="w-2 h-2 rounded-full bg-urjaa-rose animate-bounce [animation-delay:0.2s]" />
              <span className="w-2 h-2 rounded-full bg-urjaa-rose animate-bounce [animation-delay:0.4s]" />
              <span className="ml-1 text-[11px]">
                {companionName} is reflecting...
              </span>
            </div>
          )}
        </div>

        {/* Prompt Suggestions */}
        <div className="px-4 py-2 border-t border-plum-100/70 dark:border-slate-800 bg-white dark:bg-slate-900 flex gap-2 overflow-x-auto no-scrollbar">
          {suggestedPrompts.map((prompt, idx) => (
            <button
              key={idx}
              onClick={() => handleSendMessage(prompt)}
              className="text-[11px] whitespace-nowrap px-3 py-1.5 rounded-xl bg-urjaa-blush/40 dark:bg-slate-800 hover:bg-urjaa-blush text-plum-900 dark:text-slate-300 transition-colors shrink-0"
            >
              {prompt}
            </button>
          ))}
        </div>

        {/* Message Composer */}
        <div className="p-3 sm:p-4 border-t border-plum-100/70 dark:border-slate-800 bg-white dark:bg-slate-900">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder={`Ask ${companionName} about rhythm, movement, or meals...`}
              className="flex-1 px-4 py-2.5 rounded-2xl bg-urjaa-ivory dark:bg-slate-800 border border-plum-200 dark:border-slate-700 text-sm text-plum-950 dark:text-white placeholder:text-plum-400 focus:outline-none focus:ring-2 focus:ring-urjaa-rose"
            />
            <button
              type="submit"
              disabled={!inputText.trim() || isTyping}
              className="p-2.5 rounded-2xl bg-urjaa-rose hover:opacity-90 text-white disabled:opacity-40 shadow-soft transition-all active:scale-95 flex items-center justify-center"
              title="Send"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
          <p className="text-[10px] text-plum-400 dark:text-slate-400 text-center mt-2">
            Urjaa provides wellness and educational recommendations and does not replace professional medical care.
          </p>
        </div>
      </div>
    </div>
  );
};
