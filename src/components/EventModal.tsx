import React from 'react';
import { GameEvent, GameEventChoice } from '../types/game';
import { Sparkles, HelpCircle, ArrowRight, Loader2 } from 'lucide-react';
import { sounds } from '../services/soundService';

interface EventModalProps {
  event: GameEvent | null;
  loading: boolean;
  onSelectChoice: (choice: GameEventChoice) => void;
}

export const EventModal: React.FC<EventModalProps> = ({
  event,
  loading,
  onSelectChoice,
}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md select-none animate-fadeIn">
      <div className="relative w-full max-w-2xl bg-gradient-to-b from-slate-900 via-slate-900 to-indigo-950/80 border-2 border-purple-500/60 rounded-2xl p-6 sm:p-8 shadow-[0_0_35px_rgba(168,85,247,0.3)] flex flex-col justify-between overflow-hidden">
        {/* Hologram Corner Accents */}
        <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-purple-400" />
        <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-purple-400" />
        <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-purple-400" />
        <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-purple-400" />

        {/* Header */}
        <div className="flex items-center gap-3 border-b border-purple-500/30 pb-4 mb-4">
          <div className="w-10 h-10 rounded-xl bg-purple-950/90 border border-purple-500/60 flex items-center justify-center text-purple-400 shadow-inner">
            <HelpCircle className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono tracking-widest text-purple-400 uppercase font-bold">
                AI DYNAMIC EVENT // 차원 조우 사건
              </span>
              <Sparkles className="w-3.5 h-3.5 text-purple-400 animate-spin" />
            </div>
            <h2 className="text-lg sm:text-xl font-bold text-slate-100 font-mono">
              {loading ? '시공간 균열 연산 중...' : event?.event_title}
            </h2>
          </div>
        </div>

        {/* Narrative Content */}
        <div className="min-h-[140px] flex items-center justify-center py-4">
          {loading ? (
            <div className="flex flex-col items-center justify-center gap-3 text-purple-300">
              <Loader2 className="w-8 h-8 animate-spin text-purple-400" />
              <p className="text-xs font-mono tracking-wide text-slate-400">
                Gemini AI 코어가 플레이어의 덱과 상태를 분석하여 고유 사건을 생성하고 있습니다...
              </p>
            </div>
          ) : (
            <div className="w-full p-4 rounded-xl bg-slate-950/70 border border-slate-800 text-slate-200 text-sm sm:text-base leading-relaxed font-sans shadow-inner">
              <p className="whitespace-pre-line">{event?.narrative}</p>
            </div>
          )}
        </div>

        {/* Choices Buttons */}
        {!loading && event && (
          <div className="flex flex-col gap-3 mt-4">
            {event.choices.map((choice) => (
              <button
                key={choice.id}
                onClick={() => {
                  sounds.playButtonClick();
                  onSelectChoice(choice);
                }}
                className="group w-full p-3.5 rounded-xl bg-slate-950/80 hover:bg-purple-950/60 border border-slate-800 hover:border-purple-400 text-left transition-all duration-200 flex items-center justify-between shadow-md cursor-pointer hover:shadow-[0_0_15px_rgba(168,85,247,0.25)]"
              >
                <div className="flex items-center gap-3">
                  <span className="w-6 h-6 rounded-md bg-purple-950/90 border border-purple-700/60 flex items-center justify-center font-mono font-bold text-xs text-purple-300">
                    {choice.id}
                  </span>
                  <span className="text-xs sm:text-sm text-slate-200 group-hover:text-purple-200 font-medium">
                    {choice.text}
                  </span>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-purple-400 group-hover:translate-x-1 transition-all shrink-0" />
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
