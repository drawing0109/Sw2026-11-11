import React, { useState } from 'react';
import { Card, Enemy, PlayerState, CombatFloatingText } from '../types/game';
import { CardComponent } from './CardComponent';
import {
  Sword,
  Shield,
  Zap,
  RotateCcw,
  Skull,
  Activity,
  AlertTriangle,
  Droplets,
  Layers,
  ArrowRight,
  Sparkles
} from 'lucide-react';
import { sounds } from '../services/soundService';

interface CombatViewProps {
  player: PlayerState;
  enemy: Enemy;
  onPlayCard: (card: Card) => void;
  onEndTurn: () => void;
  isPlayerTurn: boolean;
  floatingTexts: CombatFloatingText[];
  onOpenDeckViewer: (mode: 'draw' | 'discard') => void;
  combatLog: string[];
}

export const CombatView: React.FC<CombatViewProps> = ({
  player,
  enemy,
  onPlayCard,
  onEndTurn,
  isPlayerTurn,
  floatingTexts,
  onOpenDeckViewer,
  combatLog,
}) => {
  const [selectedCardId, setSelectedCardId] = useState<string | null>(null);

  const currentIntent = enemy.intents[enemy.currentIntentIndex] || enemy.intents[0];

  const handleCardClick = (card: Card) => {
    if (!isPlayerTurn) return;
    if (player.energy < card.cost) {
      sounds.playButtonClick();
      return;
    }
    sounds.playCardPlay();
    onPlayCard(card);
    setSelectedCardId(null);
  };

  const enemyHpPercent = Math.max(0, Math.min(100, (enemy.currentHp / enemy.maxHp) * 100));

  return (
    <div className="relative flex-1 flex flex-col justify-between overflow-hidden bg-slate-950 p-2 sm:p-4 select-none">
      {/* Background Ambience & Holo Grid */}
      <div className="absolute inset-0 bg-gradient-to-b from-indigo-950/20 via-slate-950 to-slate-950 pointer-events-none" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-20 pointer-events-none" />

      {/* Floating Combat Numbers */}
      <div className="absolute inset-0 pointer-events-none z-50">
        {floatingTexts.map((ft) => (
          <div
            key={ft.id}
            className={`absolute font-mono font-black text-xl sm:text-2xl drop-shadow-[0_2px_10px_rgba(0,0,0,0.9)] animate-bounce
              ${ft.target === 'player' ? 'left-[22%] top-[30%]' : 'right-[22%] top-[30%]'}
              ${ft.color}
            `}
          >
            {ft.text}
          </div>
        ))}
      </div>

      {/* Top Combat Banner: Intent & Boss Mechanic Notice */}
      <div className="relative z-10 w-full flex items-center justify-between gap-2 max-w-4xl mx-auto px-2">
        {/* Turn Phase Pill */}
        <div className="flex items-center gap-2">
          <div
            className={`px-3 py-1 rounded-full text-xs font-mono font-bold tracking-wider uppercase border flex items-center gap-1.5 shadow-md
              ${isPlayerTurn 
                ? 'bg-cyan-950/90 border-cyan-400 text-cyan-300 shadow-cyan-500/20' 
                : 'bg-red-950/90 border-red-500 text-red-300 animate-pulse'
              }
            `}
          >
            <Activity className="w-3.5 h-3.5" />
            <span>{isPlayerTurn ? '플레이어 턴' : '적 행동 진행 중...'}</span>
          </div>

          {enemy.mechanic_name && (
            <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900/90 border border-purple-500/50 text-[11px] font-mono text-purple-300">
              <Sparkles className="w-3 h-3 text-purple-400" />
              <span className="font-bold">{enemy.mechanic_name}:</span>
              <span className="text-slate-300 truncate max-w-xs">{enemy.mechanic_desc}</span>
            </div>
          )}
        </div>

        {/* Combat Log snippet toggle */}
        {combatLog.length > 0 && (
          <div className="text-right text-[11px] font-mono text-slate-400 max-w-xs truncate hidden md:block">
            <span>최근: {combatLog[combatLog.length - 1]}</span>
          </div>
        )}
      </div>

      {/* Central Arena: Player Avatar vs Enemy Avatar */}
      <div className="relative z-10 flex-1 flex items-center justify-around max-w-5xl mx-auto w-full px-4 py-4">
        {/* PLAYER SIDE */}
        <div className="flex flex-col items-center">
          {/* Player Holographic Mech / Avatar */}
          <div className="relative group">
            {/* Shield aura if block > 0 */}
            {player.block > 0 && (
              <div className="absolute -inset-3 rounded-full border-2 border-cyan-400/80 bg-cyan-500/10 animate-pulse blur-xs" />
            )}

            <div className="w-28 h-28 sm:w-36 sm:h-36 rounded-2xl bg-gradient-to-tr from-slate-900 via-indigo-950 to-cyan-900 border-2 border-cyan-500/60 flex flex-col items-center justify-center p-3 shadow-2xl relative overflow-hidden backdrop-blur-md">
              <div className="absolute inset-0 bg-radial from-cyan-500/10 to-transparent" />
              
              {/* Sci-Fi Operator Glyph */}
              <div className="w-16 h-16 rounded-xl bg-slate-950/80 border border-cyan-400/50 flex items-center justify-center shadow-inner relative">
                <span className="text-3xl font-mono font-black text-cyan-400">Ω</span>
              </div>
              
              <div className="mt-2 text-center">
                <span className="text-xs font-mono font-bold text-slate-100">OPERATOR</span>
              </div>
            </div>

            {/* Block Shield Badge */}
            {player.block > 0 && (
              <div className="absolute -bottom-2 -right-2 px-2 py-0.5 rounded-md bg-cyan-900/90 border border-cyan-400 text-cyan-200 font-mono font-bold text-xs flex items-center gap-1 shadow-lg">
                <Shield className="w-3.5 h-3.5 fill-current" />
                <span>{player.block}</span>
              </div>
            )}
          </div>

          {/* Player Status Effects */}
          <div className="flex items-center gap-1.5 mt-3 min-h-[24px]">
            {player.statuses.strength > 0 && (
              <span className="px-1.5 py-0.5 rounded bg-red-950/80 border border-red-700 text-red-300 text-[10px] font-mono" title={`힘: 공격 피해 +${player.statuses.strength}`}>
                ⚔️ +{player.statuses.strength}
              </span>
            )}
            {player.statuses.dexterity > 0 && (
              <span className="px-1.5 py-0.5 rounded bg-cyan-950/80 border border-cyan-700 text-cyan-300 text-[10px] font-mono" title={`민첩: 방어도 획득 +${player.statuses.dexterity}`}>
                🛡️ +{player.statuses.dexterity}
              </span>
            )}
            {player.statuses.vulnerable > 0 && (
              <span className="px-1.5 py-0.5 rounded bg-rose-950/80 border border-rose-700 text-rose-300 text-[10px] font-mono" title={`취약: 받는 피해 50% 증가 (${player.statuses.vulnerable}턴)`}>
                💔 취약 {player.statuses.vulnerable}
              </span>
            )}
            {player.statuses.weak > 0 && (
              <span className="px-1.5 py-0.5 rounded bg-amber-950/80 border border-amber-700 text-amber-300 text-[10px] font-mono" title={`약화: 입히는 피해 25% 감소 (${player.statuses.weak}턴)`}>
                ⚠️ 약화 {player.statuses.weak}
              </span>
            )}
            {player.statuses.thorns > 0 && (
              <span className="px-1.5 py-0.5 rounded bg-emerald-950/80 border border-emerald-700 text-emerald-300 text-[10px] font-mono" title={`가시: 피격 시 반사 피해 ${player.statuses.thorns}`}>
                🌵 가시 {player.statuses.thorns}
              </span>
            )}
            {player.statuses.poison > 0 && (
              <span className="px-1.5 py-0.5 rounded bg-green-950/80 border border-green-700 text-green-300 text-[10px] font-mono" title={`나노 독: 턴 시작 시 피해 ${player.statuses.poison}`}>
                <Droplets className="w-2.5 h-2.5 inline mr-0.5 text-green-400" />
                {player.statuses.poison}
              </span>
            )}
          </div>
        </div>

        {/* VS / Center Energy Beam Accent */}
        <div className="flex flex-col items-center justify-center opacity-60">
          <div className="w-px h-16 bg-gradient-to-b from-transparent via-cyan-500/50 to-transparent" />
          <span className="my-2 font-mono text-xs font-black tracking-widest text-slate-500">VS</span>
          <div className="w-px h-16 bg-gradient-to-b from-transparent via-red-500/50 to-transparent" />
        </div>

        {/* ENEMY SIDE */}
        <div className="flex flex-col items-center">
          {/* Enemy Intent Bubble */}
          <div className="mb-2 px-3 py-1 rounded-xl bg-slate-900/95 border border-slate-700 shadow-xl flex items-center gap-2 text-xs font-mono animate-pulse">
            {currentIntent.type.includes('ATTACK') && (
              <Sword className="w-4 h-4 text-red-400" />
            )}
            {currentIntent.type.includes('DEFEND') && (
              <Shield className="w-4 h-4 text-cyan-400" />
            )}
            {currentIntent.type === 'BUFF' && (
              <Sparkles className="w-4 h-4 text-amber-400" />
            )}
            {currentIntent.type === 'DEBUFF' && (
              <AlertTriangle className="w-4 h-4 text-purple-400" />
            )}
            <span className="font-bold text-slate-100">{currentIntent.desc}</span>
          </div>

          {/* Enemy Entity Box */}
          <div className="relative group">
            {enemy.block > 0 && (
              <div className="absolute -inset-3 rounded-full border-2 border-cyan-400/80 bg-cyan-500/10 animate-pulse blur-xs" />
            )}

            <div
              className={`w-32 h-32 sm:w-44 sm:h-44 rounded-2xl border-2 flex flex-col items-center justify-center p-3 shadow-2xl relative overflow-hidden backdrop-blur-md transition-all
                ${enemy.isBoss 
                  ? 'bg-gradient-to-tr from-purple-950 via-slate-900 to-amber-950 border-amber-500/80 shadow-amber-500/20' 
                  : enemy.isElite 
                  ? 'bg-gradient-to-tr from-amber-950 via-slate-900 to-red-950 border-amber-500/60 shadow-amber-500/10'
                  : 'bg-gradient-to-tr from-slate-900 via-red-950 to-slate-900 border-red-500/60'
                }
              `}
            >
              {/* Monster Visual Silhouette / Particle Core */}
              <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-slate-950/80 border border-slate-700/80 flex items-center justify-center shadow-inner overflow-hidden">
                <div
                  className={`absolute inset-0 opacity-40 animate-spin [animation-duration:8s]
                    ${enemy.colorTheme === 'purple' ? 'bg-gradient-to-tr from-purple-600 to-pink-600' :
                      enemy.colorTheme === 'amber' ? 'bg-gradient-to-tr from-amber-500 to-red-600' :
                      'bg-gradient-to-tr from-cyan-500 to-blue-600'}
                  `}
                />
                <Skull
                  className={`w-12 h-12 relative z-10 drop-shadow-[0_0_12px_rgba(255,255,255,0.4)]
                    ${enemy.isBoss ? 'text-amber-400' : enemy.isElite ? 'text-amber-300' : 'text-red-400'}
                  `}
                />
              </div>

              {/* Enemy Name & Title */}
              <div className="mt-2 text-center max-w-[150px]">
                <h3 className="text-xs sm:text-sm font-bold text-slate-100 truncate">
                  {enemy.name}
                </h3>
                <p className="text-[10px] text-slate-400 truncate">
                  {enemy.title || '차원 침입자'}
                </p>
              </div>

              {/* Block Badge */}
              {enemy.block > 0 && (
                <div className="absolute -bottom-2 -left-2 px-2 py-0.5 rounded-md bg-cyan-900/90 border border-cyan-400 text-cyan-200 font-mono font-bold text-xs flex items-center gap-1 shadow-lg">
                  <Shield className="w-3.5 h-3.5 fill-current" />
                  <span>{enemy.block}</span>
                </div>
              )}
            </div>
          </div>

          {/* Enemy HP Bar */}
          <div className="w-36 sm:w-48 mt-3 flex flex-col items-center">
            <div className="w-full flex items-center justify-between text-xs font-mono text-slate-300 mb-1">
              <span className="font-bold text-red-400">HP</span>
              <span>
                {enemy.currentHp} / {enemy.maxHp}
              </span>
            </div>
            <div className="w-full h-2.5 rounded-full bg-slate-900 overflow-hidden border border-slate-700">
              <div
                className="h-full bg-gradient-to-r from-red-600 via-rose-500 to-orange-400 transition-all duration-300"
                style={{ width: `${enemyHpPercent}%` }}
              />
            </div>
          </div>

          {/* Enemy Status Effects */}
          <div className="flex items-center gap-1.5 mt-2 min-h-[24px]">
            {enemy.statuses.vulnerable > 0 && (
              <span className="px-1.5 py-0.5 rounded bg-rose-950/80 border border-rose-700 text-rose-300 text-[10px] font-mono" title={`취약: 받는 피해 50% 증가 (${enemy.statuses.vulnerable}턴)`}>
                💔 취약 {enemy.statuses.vulnerable}
              </span>
            )}
            {enemy.statuses.weak > 0 && (
              <span className="px-1.5 py-0.5 rounded bg-amber-950/80 border border-amber-700 text-amber-300 text-[10px] font-mono" title={`약화: 공격력 25% 감소 (${enemy.statuses.weak}턴)`}>
                ⚠️ 약화 {enemy.statuses.weak}
              </span>
            )}
            {enemy.statuses.poison > 0 && (
              <span className="px-1.5 py-0.5 rounded bg-emerald-950/80 border border-emerald-700 text-emerald-300 text-[10px] font-mono" title={`나노 독: 턴 시작 시 피해 ${enemy.statuses.poison}`}>
                <Droplets className="w-2.5 h-2.5 inline mr-0.5 text-emerald-400" />
                {enemy.statuses.poison}
              </span>
            )}
            {enemy.statuses.strength > 0 && (
              <span className="px-1.5 py-0.5 rounded bg-red-950/80 border border-red-700 text-red-300 text-[10px] font-mono" title={`힘: 공격력 +${enemy.statuses.strength}`}>
                ⚔️ +{enemy.statuses.strength}
              </span>
            )}
            {enemy.statuses.thorns > 0 && (
              <span className="px-1.5 py-0.5 rounded bg-cyan-950/80 border border-cyan-700 text-cyan-300 text-[10px] font-mono" title={`가시: 반사 피해 ${enemy.statuses.thorns}`}>
                🌵 가시 {enemy.statuses.thorns}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Bottom Area: Draw Pile, Hand, Discard Pile & End Turn Controls */}
      <div className="relative z-20 w-full max-w-6xl mx-auto flex flex-col items-center gap-2">
        {/* Hand Cards Fan Area */}
        <div className="w-full flex items-end justify-center min-h-[270px] overflow-x-auto px-4 py-2 scrollbar-none">
          <div className="flex items-end justify-center -space-x-8 sm:-space-x-12 hover:space-x-1 transition-all duration-300 py-4">
            {player.hand.map((card, idx) => {
              const canAfford = player.energy >= card.cost;
              return (
                <div
                  key={`${card.id}_${idx}`}
                  className="transition-transform duration-200"
                  style={{
                    zIndex: 10 + idx,
                  }}
                >
                  <CardComponent
                    card={card}
                    isPlayable={isPlayerTurn && canAfford}
                    selected={selectedCardId === card.id}
                    onClick={() => handleCardClick(card)}
                  />
                </div>
              );
            })}
          </div>
        </div>

        {/* Lower Control Bar: Draw Pile | Energy Orb | Discard Pile & End Turn Button */}
        <div className="w-full px-4 py-2 bg-slate-900/90 border border-slate-800 rounded-2xl flex items-center justify-between backdrop-blur-md shadow-2xl">
          {/* Left: Draw Pile Button */}
          <button
            onClick={() => {
              sounds.playButtonClick();
              onOpenDeckViewer('draw');
            }}
            className="flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-mono font-bold text-slate-300 transition-colors"
            title="뽑을 카드 덱 확인"
          >
            <Layers className="w-4 h-4 text-cyan-400" />
            <span>DRAW</span>
            <span className="px-1.5 py-0.5 rounded bg-slate-900 text-cyan-400">
              {player.drawPile.length}
            </span>
          </button>

          {/* Center: Energy Orb */}
          <div className="flex items-center gap-3">
            <div
              className={`w-14 h-14 rounded-full border-2 flex flex-col items-center justify-center font-mono font-black text-lg shadow-xl relative
                ${player.energy > 0
                  ? 'bg-gradient-to-br from-cyan-600 to-indigo-800 border-cyan-300 text-white shadow-[0_0_18px_rgba(6,182,212,0.6)] animate-pulse'
                  : 'bg-slate-900 border-slate-700 text-slate-500'
                }
              `}
            >
              <div className="flex items-center leading-none">
                <Zap className="w-4 h-4 mr-0.5 fill-current" />
                <span>{player.energy}</span>
              </div>
              <span className="text-[10px] text-cyan-200/80 leading-none">
                /{player.maxEnergy}
              </span>
            </div>
            <div className="hidden sm:block text-left font-mono">
              <div className="text-xs text-slate-300 font-bold">ENERGY</div>
              <div className="text-[10px] text-slate-500">턴마다 재충전</div>
            </div>
          </div>

          {/* Right: Discard Pile & End Turn Button */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                sounds.playButtonClick();
                onOpenDeckViewer('discard');
              }}
              className="flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-mono font-bold text-slate-300 transition-colors"
              title="버린 카드 더미 확인"
            >
              <RotateCcw className="w-4 h-4 text-purple-400" />
              <span>DISCARD</span>
              <span className="px-1.5 py-0.5 rounded bg-slate-900 text-purple-400">
                {player.discardPile.length}
              </span>
            </button>

            {/* End Turn Button */}
            <button
              disabled={!isPlayerTurn}
              onClick={() => {
                sounds.playButtonClick();
                onEndTurn();
              }}
              className={`px-5 py-2.5 rounded-xl font-mono font-bold text-sm flex items-center gap-2 border-2 transition-all shadow-xl
                ${isPlayerTurn
                  ? 'bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 border-rose-400 text-white shadow-[0_0_15px_rgba(244,63,94,0.4)] cursor-pointer active:scale-95'
                  : 'bg-slate-800 border-slate-700 text-slate-500 cursor-not-allowed'
                }
              `}
            >
              <span>턴 종료</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
