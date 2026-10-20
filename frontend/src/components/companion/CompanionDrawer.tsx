import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  X,
  Send,
  MessageCircle,
  User as UserIcon,
  ArrowRight,
  Heart,
  Sparkles,
} from 'lucide-react';
import { CompanionMessage, PhaseType } from '../../types';
import { AICompanionService, CompanionContext } from '../../services/aiCompanionService';

interface CompanionDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  context?: Partial<CompanionContext>;
}

export const CompanionDrawer: React.FC<CompanionDrawerProps> = ({
  isOpen,
  onClose,
  context,
}) => {
  const navigate = useNavigate();
  const [messages, setMessages] = useState<CompanionMessage[]>([
    {
      id: 'init-1',
      sender: 'companion',
      text: `Hello ${context?.userName || 'Maya'}! I'm **Aura**, your cycle-aware wellness assistant. Today is **Day ${context?.cycleDay || 9}** of your **${context?.phase || 'Follicular'} Phase** (estrogen rising, energy ascending). How can I support your day?`,
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
      const response = await AICompanionService.query(text, context);
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

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
      {/* Backdrop */}
      <div className="flex-1" onClick={onClose} />

      {/* Drawer */}
      <div className="w-full max-w-md h-full bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 shadow-2xl flex flex-col justify-between text-slate-800 dark:text-slate-100 animate-in slide-in-from-right duration-200 relative overflow-hidden">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-white dark:bg-slate-900">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200/80 dark:border-rose-900/60 flex items-center justify-center text-rose-600 dark:text-rose-400">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-serif font-bold text-base text-slate-900 dark:text-white">
                  Aura Wellness Assistant
                </h3>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1.5 mt-0.5">
                <Heart className="w-3 h-3 text-rose-500 fill-rose-500" />
                <span>
                  {context?.phase || 'Follicular'} Phase • Day {context?.cycleDay || 9}
                </span>
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Messages Stream */}
        <div
          ref={scrollRef}
          className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4 bg-slate-50/50 dark:bg-slate-950/40"
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
                  <div className="w-7 h-7 rounded-xl bg-rose-100 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 flex items-center justify-center mt-1 shrink-0 text-xs font-bold">
                    A
                  </div>
                )}

                <div>
                  <div
                    className={`p-3.5 sm:p-4 rounded-3xl text-sm leading-relaxed ${
                      msg.sender === 'user'
                        ? 'bg-rose-600 text-white rounded-tr-none shadow-subtle'
                        : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 border border-slate-200/80 dark:border-slate-700/80 rounded-tl-none shadow-subtle'
                    }`}
                  >
                    <p className="whitespace-pre-line">{msg.text}</p>

                    {/* Action shortcuts */}
                    {msg.suggestedActions && msg.suggestedActions.length > 0 && (
                      <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-700/60 flex flex-wrap gap-1.5">
                        {msg.suggestedActions.map((action, i) => (
                          <button
                            key={i}
                            onClick={() => handleActionClick(action)}
                            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-700 hover:bg-rose-50 dark:hover:bg-rose-950/40 text-xs text-slate-700 dark:text-slate-200 hover:text-rose-700 dark:hover:text-rose-300 border border-slate-200 dark:border-slate-600 transition-all font-medium"
                          >
                            <span>{action.label}</span>
                            <ArrowRight className="w-3 h-3 text-rose-500" />
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  <span className="text-[10px] text-slate-400 mt-1 block px-1">
                    {msg.timestamp}
                  </span>
                </div>
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="flex items-center gap-2 text-slate-400 text-xs pl-9">
              <span className="w-2 h-2 rounded-full bg-rose-400 animate-bounce" />
              <span className="w-2 h-2 rounded-full bg-rose-400 animate-bounce [animation-delay:0.2s]" />
              <span className="w-2 h-2 rounded-full bg-rose-400 animate-bounce [animation-delay:0.4s]" />
              <span className="ml-1 text-[11px] text-slate-400">
                Aura is thinking...
              </span>
            </div>
          )}
        </div>

        {/* Prompt Suggestions */}
        <div className="px-4 py-2 border-t border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 flex gap-2 overflow-x-auto no-scrollbar">
          {suggestedPrompts.slice(0, 3).map((prompt, idx) => (
            <button
              key={idx}
              onClick={() => handleSendMessage(prompt)}
              className="text-[11px] whitespace-nowrap px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition-colors shrink-0"
            >
              {prompt}
            </button>
          ))}
        </div>

        {/* Message Composer */}
        <div className="p-3 sm:p-4 border-t border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900">
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
              placeholder="Ask about your phase, workouts, or meals..."
              className="flex-1 px-4 py-2.5 rounded-2xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-rose-500"
            />
            <button
              type="submit"
              disabled={!inputText.trim() || isTyping}
              className="p-2.5 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white disabled:opacity-40 shadow-soft transition-all active:scale-95 flex items-center justify-center"
              title="Send"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
          <p className="text-[10px] text-slate-400 text-center mt-2">
            Urjaa Assistant provides cycle-aware education and does not replace medical advice.
          </p>
        </div>
      </div>
    </div>
  );
};
