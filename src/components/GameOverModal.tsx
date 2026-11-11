import React from 'react';
import { RunStats } from '../types/game';
import { Trophy, Skull, RotateCcw, Award } from 'lucide-react';
import { sounds } from '../services/soundService';

interface GameOverModalProps {
  isVictory: boolean;
  stats: RunStats;
  floor: number;
  onRestart: () => void;
}

export const GameOverModal: React.FC<GameOverModalProps> = ({
  isVictory,
  stats,
  floor,
  onRestart,
}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-lg select-none animate-fadeIn">
      <div
        className={`relative w-full max-w-lg rounded-2xl p-6 sm:p-8 border-2 shadow-2xl text-center flex flex-col items-center justify-between
          ${isVictory
            ? 'bg-gradient-to-b from-slate-900 via-slate-900 to-amber-950/60 border-amber-500 shadow-[0_0_50px_rgba(245,158,11,0.3)]'
            : 'bg-gradient-to-b from-slate-900 via-slate-900 to-red-950/60 border-red-600 shadow-[0_0_50px_rgba(220,38,38,0.3)]'
          }
        `}
      >
        {/* Header Icon */}
        <div
          className={`w-16 h-16 rounded-2xl border-2 flex items-center justify-center mb-4 shadow-xl
            ${isVictory
              ? 'bg-amber-950/80 border-amber-400 text-amber-300'
              : 'bg-red-950/80 border-red-500 text-red-400'
            }
          `}
        >
          {isVictory ? (
            <Trophy className="w-9 h-9 animate-bounce" />
          ) : (
            <Skull className="w-9 h-9 animate-pulse" />
          )}
        </div>

        {/* Title */}
        <h2
          className={`text-2xl sm:text-3xl font-black font-mono tracking-widest uppercase mb-1
            ${isVictory ? 'text-amber-300' : 'text-red-400'}
          `}
        >
          {isVictory ? '차원 정복 완료 (VICTORY)' : '차원 붕괴 (DEFEAT)'}
        </h2>
        <p className="text-xs font-mono text-slate-400 mb-6">
          {isVictory
            ? '축하합니다! 시공간의 모든 균열을 제압하고 에이펙스 코어를 탈환했습니다.'
            : `${floor}층에서 생체 신호가 소멸되었습니다. 다시 차원에 도전하십시오.`}
        </p>

        {/* Run Stats Grid */}
        <div className="w-full grid grid-cols-2 gap-3 mb-6 font-mono text-left">
          <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800">
            <span className="text-[10px] text-slate-400 uppercase block">도달 층수</span>
            <span className="text-base font-bold text-cyan-400">FLOOR {floor}</span>
          </div>
          <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800">
            <span className="text-[10px] text-slate-400 uppercase block">격파한 적 수</span>
            <span className="text-base font-bold text-red-400">{stats.enemiesDefeated} 체</span>
          </div>
          <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800">
            <span className="text-[10px] text-slate-400 uppercase block">사용 카드 수</span>
            <span className="text-base font-bold text-purple-400">{stats.cardsPlayed} 회</span>
          </div>
          <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800">
            <span className="text-[10px] text-slate-400 uppercase block">누적 가한 피해</span>
            <span className="text-base font-bold text-amber-400">{stats.damageDealt} DMG</span>
          </div>
        </div>

        {/* Restart Button */}
        <button
          onClick={() => {
            sounds.playButtonClick();
            onRestart();
          }}
          className={`w-full py-3 px-6 rounded-xl font-mono font-black text-sm flex items-center justify-center gap-2 shadow-2xl transition-all cursor-pointer hover:scale-102
            ${isVictory
              ? 'bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950'
              : 'bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white'
            }
          `}
        >
          <RotateCcw className="w-4 h-4" />
          <span>새로운 차원 탐사 시작</span>
        </button>
      </div>
    </div>
  );
};
