import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useAvatar } from '../context/AvatarContext';
import {
  Sparkles,
  Send,
  Heart,
  Flame,
  UtensilsCrossed,
  Activity,
  ArrowRight,
  Zap,
} from 'lucide-react';
import { CompanionMessage } from '../types';
import { AICompanionService } from '../services/aiCompanionService';

export const CompanionPage: React.FC = () => {
  const navigate = useNavigate();
  const { profile } = useAuth();
  const { avatar } = useAvatar();

  const [messages, setMessages] = useState<CompanionMessage[]>([
    {
      id: 'cp-init',
      sender: 'companion',
      text: `Hello ${profile?.name || 'there'}! I'm Aura, your wellness assistant. You're currently on **Day 9 of your Follicular Phase**, with rising estrogen and higher energy. How can I support your movement, meals, or rest today?`,
      timestamp: 'Just now',
      suggestedActions: [
        { label: 'Explain Follicular Phase', actionKey: 'phase' },
        { label: 'Today’s Workout', route: '/workout' },
        { label: 'Meal Ideas', route: '/nutrition' },
        { label: 'Daily Check-in', route: '/check-in' },
      ],
      phaseContext: 'Follicular',
    },
  ]);

  const [inputText, setInputText] = useState<string>('');
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const scrollRef = useRef<HTMLDivElement | null>(null);

  const suggestedPrompts = AICompanionService.getSuggestedPrompts('Follicular');

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSendMessage = async (customText?: string) => {
    const text = (customText || inputText).trim();
    if (!text || isTyping) return;

    const userMsg: CompanionMessage = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText('');
    setIsTyping(true);

    try {
      const response = await AICompanionService.query(text, {
        userName: profile?.name || 'there',
        phase: 'Follicular',
        cycleDay: 9,
        energyLevel: 'High',
      });
      setMessages((prev) => [...prev, response]);
    } catch (e) {
      console.error(e);
    } finally {
      setIsTyping(false);
    }
  };

  const handleActionClick = (action: { label: string; route?: string; actionKey?: string }) => {
    if (action.route) {
      navigate(action.route);
    } else if (action.actionKey === 'phase') {
      handleSendMessage('Explain what happens in my Follicular phase');
    }
  };

  return (
    <div className="max-w-3xl mx-auto h-[calc(100vh-10rem)] flex flex-col bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
      {/* Companion Header */}
      <div className="p-4 sm:p-5 border-b border-slate-200 dark:border-slate-800 bg-warm-50/70 dark:bg-slate-900 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-10 h-10 rounded-2xl bg-rose-100 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 flex items-center justify-center">
              <Sparkles className="w-5 h-5" />
            </div>
            <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-slate-900" />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-slate-900 dark:text-white">Aura &bull; Wellness Assistant</h2>
              <span className="px-2 py-0.5 rounded-full bg-rose-100 dark:bg-rose-950/60 text-[10px] font-semibold text-rose-700 dark:text-rose-300">
                Follicular Day 9
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Personalized guidance tuned to your cycle rhythm
            </p>
          </div>
        </div>

        <div className="hidden sm:flex items-center gap-2">
          <div className="px-3 py-1 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-600 dark:text-slate-300 flex items-center gap-1.5 shadow-sm">
            <Zap className="w-3.5 h-3.5 text-amber-500" />
            <span>High Energy</span>
          </div>
        </div>
      </div>

      {/* Message Stream */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
          >
            <div className="flex items-start gap-2.5 max-w-[85%]">
              {msg.sender === 'companion' && (
                <div className="w-7 h-7 rounded-xl bg-rose-100 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 flex items-center justify-center mt-0.5 shrink-0 text-xs font-bold">
                  A
                </div>
              )}

              <div>
                <div
                  className={`p-4 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                    msg.sender === 'user'
                      ? 'bg-slate-900 dark:bg-rose-600 text-white rounded-tr-none shadow-sm'
                      : 'bg-warm-50 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700 text-slate-800 dark:text-slate-200 rounded-tl-none'
                  }`}
                >
                  <p className="whitespace-pre-line">{msg.text}</p>

                  {msg.suggestedActions && (
                    <div className="mt-3 pt-2.5 border-t border-slate-200 dark:border-slate-700 flex flex-wrap gap-1.5">
                      {msg.suggestedActions.map((action, i) => (
                        <button
                          key={i}
                          onClick={() => handleActionClick(action)}
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white dark:bg-slate-700 hover:bg-rose-50 text-[11px] text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-600 hover:border-rose-300 transition-colors font-medium"
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
          <div className="flex items-center gap-2 text-slate-400 text-xs pl-10">
            <span className="w-2 h-2 rounded-full bg-rose-400 animate-bounce" />
            <span className="w-2 h-2 rounded-full bg-rose-400 animate-bounce [animation-delay:0.2s]" />
            <span className="w-2 h-2 rounded-full bg-rose-400 animate-bounce [animation-delay:0.4s]" />
            <span className="ml-1 text-[11px] text-slate-400">
              Aura is thinking...
            </span>
          </div>
        )}
      </div>

      {/* Suggested Prompts */}
      <div className="px-4 py-2 border-t border-slate-100 dark:border-slate-800 bg-warm-50/50 dark:bg-slate-900 flex gap-2 overflow-x-auto no-scrollbar">
        {suggestedPrompts.map((prompt, i) => (
          <button
            key={i}
            onClick={() => handleSendMessage(prompt)}
            className="text-xs whitespace-nowrap px-3 py-1.5 rounded-xl bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 transition-colors shrink-0 shadow-sm"
          >
            {prompt}
          </button>
        ))}
      </div>

      {/* Input Composer */}
      <div className="p-3 sm:p-4 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
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
            placeholder="Ask Aura about your cycle, workouts, recipes, or symptoms..."
            className="flex-1 px-4 py-2.5 rounded-xl bg-warm-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-rose-500"
          />
          <button
            type="submit"
            disabled={!inputText.trim() || isTyping}
            className="p-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white disabled:opacity-40 transition-colors shadow-sm"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
