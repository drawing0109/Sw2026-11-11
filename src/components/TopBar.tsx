import React from 'react';
import { PlayerState, Relic } from '../types/game';
import { Shield, Heart, Coins, Layers, Volume2, VolumeX, Sparkles, Compass } from 'lucide-react';
import { sounds } from '../services/soundService';

interface TopBarProps {
  player: PlayerState;
  floor: number;
  maxFloors: number;
  aiStatus: { hasKey: boolean; model: string };
  soundEnabled: boolean;
  onToggleSound: () => void;
  onOpenDeck: () => void;
  onOpenMap?: () => void;
  showMapButton?: boolean;
}

export const TopBar: React.FC<TopBarProps> = ({
  player,
  floor,
  maxFloors,
  aiStatus,
  soundEnabled,
  onToggleSound,
  onOpenDeck,
  onOpenMap,
  showMapButton = false,
}) => {
  const hpPercent = Math.max(0, Math.min(100, (player.hp / player.maxHp) * 100));

  return (
    <header className="h-16 bg-slate-950/90 border-b border-slate-800/80 px-4 flex items-center justify-between backdrop-blur-md z-30 select-none shadow-lg">
      {/* Left: Brand & Floor */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500 to-indigo-600 flex items-center justify-center font-bold font-mono text-white shadow-[0_0_12px_rgba(6,182,212,0.5)]">
            Ω
          </div>
          <div>
            <h1 className="font-extrabold text-sm tracking-wider uppercase bg-gradient-to-r from-cyan-400 via-indigo-300 to-purple-400 bg-clip-text text-transparent font-mono">
              APEX DIMENSION
            </h1>
            <div className="flex items-center gap-1.5 text-[11px] font-mono text-slate-400">
              <span className="text-cyan-400 font-bold">FLOOR {floor}</span>
              <span>/</span>
              <span>{maxFloors}</span>
            </div>
          </div>
        </div>

        {/* AI Status Badge */}
        <div
          className={`hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-mono border transition-colors
            ${aiStatus.hasKey 
              ? 'bg-purple-950/60 border-purple-500/50 text-purple-300 shadow-[0_0_10px_rgba(168,85,247,0.2)]'
              : 'bg-slate-900 border-slate-700 text-slate-400'
            }
          `}
          title={aiStatus.hasKey ? 'Gemini 3.8 Flash가 플레이어 덱에 맞추어 이벤트를 실시간 연산 중입니다.' : '내장 절차적 연산 코어가 작동 중입니다.'}
        >
          <Sparkles className="w-3.5 h-3.5 text-purple-400 animate-pulse" />
          <span>{aiStatus.hasKey ? 'Gemini 3.8 Flash' : 'Procedural AI Core'}</span>
        </div>
      </div>

      {/* Middle: Player Stats (HP, Shield, Gold) */}
      <div className="flex items-center gap-4 sm:gap-6">
        {/* HP Bar */}
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-md bg-red-950/80 border border-red-700/60 flex items-center justify-center text-red-400">
            <Heart className="w-4 h-4 fill-current" />
          </div>
          <div className="flex flex-col">
            <div className="flex items-center justify-between text-xs font-mono gap-2">
              <span className="text-red-400 font-bold">HP</span>
              <span className="text-slate-200">
                {player.hp} <span className="text-slate-500">/</span> {player.maxHp}
              </span>
            </div>
            <div className="w-24 sm:w-32 h-2 rounded-full bg-slate-800 overflow-hidden border border-slate-700">
              <div
                className="h-full bg-gradient-to-r from-red-600 to-rose-400 transition-all duration-300"
                style={{ width: `${hpPercent}%` }}
              />
            </div>
          </div>
        </div>

        {/* Block */}
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-cyan-950/50 border border-cyan-700/60 text-cyan-300 font-mono text-xs shadow-inner">
          <Shield className="w-4 h-4 text-cyan-400 fill-cyan-400/20" />
          <span className="font-bold text-sm">{player.block}</span>
        </div>

        {/* Gold */}
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-amber-950/40 border border-amber-700/50 text-amber-300 font-mono text-xs shadow-inner">
          <Coins className="w-4 h-4 text-amber-400 fill-amber-400/20" />
          <span className="font-bold text-sm">{player.gold}</span>
          <span className="text-[10px] text-amber-400/70">G</span>
        </div>
      </div>

      {/* Right: Relics + Action Buttons */}
      <div className="flex items-center gap-3">
        {/* Relic Bar (Scrollable on small screens) */}
        <div className="hidden lg:flex items-center gap-1.5 max-w-[200px] xl:max-w-[320px] overflow-x-auto py-1 scrollbar-none">
          {player.relics.map((relic, idx) => (
            <div
              key={`${relic.id}_${idx}`}
              className="relative group w-8 h-8 rounded-lg bg-slate-900 border border-slate-700 hover:border-cyan-400 flex items-center justify-center text-sm cursor-help transition-transform hover:scale-110 shadow-sm shrink-0"
            >
              <span>{relic.icon}</span>

              {/* Tooltip */}
              <div className="absolute top-10 right-0 w-56 p-2 rounded-lg bg-slate-900/95 border border-slate-700 text-xs shadow-2xl pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity z-50 backdrop-blur-md">
                <div className="flex items-center justify-between text-cyan-400 font-bold mb-1">
                  <span>{relic.name}</span>
                  <span className="text-[10px] text-slate-500 uppercase">{relic.rarity}</span>
                </div>
                <p className="text-slate-300 text-[11px] leading-relaxed mb-1">
                  {relic.description}
                </p>
                <p className="text-[10px] text-slate-500 italic">
                  "{relic.flavorText}"
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Map toggle button */}
        {showMapButton && onOpenMap && (
          <button
            onClick={() => {
              sounds.playButtonClick();
              onOpenMap();
            }}
            className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs font-mono font-semibold transition-colors"
            title="차원 지도 열기"
          >
            <Compass className="w-4 h-4 text-cyan-400" />
            <span className="hidden sm:inline">지도</span>
          </button>
        )}

        {/* Deck Inspector Button */}
        <button
          onClick={() => {
            sounds.playButtonClick();
            onOpenDeck();
          }}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs font-mono font-semibold transition-colors shadow-sm"
          title="소지 덱 목록 확인"
        >
          <Layers className="w-4 h-4 text-purple-400" />
          <span>{player.deck.length}</span>
          <span className="hidden sm:inline text-slate-400 text-[10px]">CARDS</span>
        </button>

        {/* Audio Mute Button */}
        <button
          onClick={() => {
            sounds.playButtonClick();
            onToggleSound();
          }}
          className="w-8 h-8 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-400 hover:text-slate-200 transition-colors"
          title={soundEnabled ? '음소거' : '소리 켜기'}
        >
          {soundEnabled ? (
            <Volume2 className="w-4 h-4 text-cyan-400" />
          ) : (
            <VolumeX className="w-4 h-4 text-slate-500" />
          )}
        </button>
      </div>
    </header>
  );
};
