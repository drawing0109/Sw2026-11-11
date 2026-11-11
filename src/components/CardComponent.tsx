import React from 'react';
import { Card } from '../types/game';
import { Sword, Shield, Zap, Sparkles, AlertCircle, Droplets } from 'lucide-react';

interface CardComponentProps {
  card: Card;
  onClick?: () => void;
  disabled?: boolean;
  selected?: boolean;
  scale?: number;
  showCost?: boolean;
  isPlayable?: boolean;
}

export const CardComponent: React.FC<CardComponentProps> = ({
  card,
  onClick,
  disabled = false,
  selected = false,
  scale = 1,
  showCost = true,
  isPlayable = true,
}) => {
  // Color themes based on Card Type
  const getTypeStyles = () => {
    switch (card.type) {
      case 'ATTACK':
        return {
          border: 'border-red-500/60 hover:border-red-400 group-hover:shadow-red-500/30',
          bg: 'from-slate-900 via-red-950/40 to-slate-900',
          headerBg: 'bg-red-900/60 text-red-200 border-red-700/50',
          tag: '공격 (Attack)',
          tagColor: 'text-red-400 bg-red-950/80 border-red-800/60',
          accent: 'text-red-400',
        };
      case 'SKILL':
        return {
          border: 'border-cyan-500/60 hover:border-cyan-400 group-hover:shadow-cyan-500/30',
          bg: 'from-slate-900 via-cyan-950/40 to-slate-900',
          headerBg: 'bg-cyan-900/60 text-cyan-200 border-cyan-700/50',
          tag: '스킬 (Skill)',
          tagColor: 'text-cyan-400 bg-cyan-950/80 border-cyan-800/60',
          accent: 'text-cyan-400',
        };
      case 'POWER':
        return {
          border: 'border-amber-500/60 hover:border-amber-400 group-hover:shadow-amber-500/30',
          bg: 'from-slate-900 via-amber-950/40 to-slate-900',
          headerBg: 'bg-amber-900/60 text-amber-200 border-amber-700/50',
          tag: '파워 (Power)',
          tagColor: 'text-amber-400 bg-amber-950/80 border-amber-800/60',
          accent: 'text-amber-400',
        };
      default:
        return {
          border: 'border-purple-500/60 hover:border-purple-400',
          bg: 'from-slate-900 via-purple-950/40 to-slate-900',
          headerBg: 'bg-purple-900/60 text-purple-200 border-purple-700/50',
          tag: '특이점 (Anomaly)',
          tagColor: 'text-purple-400 bg-purple-950/80 border-purple-800/60',
          accent: 'text-purple-400',
        };
    }
  };

  const styles = getTypeStyles();
  const isUpgraded = card.isUpgraded;

  return (
    <div
      onClick={!disabled ? onClick : undefined}
      style={{ transform: `scale(${scale})` }}
      className={`relative group w-44 h-64 rounded-xl border-2 select-none transition-all duration-200 flex flex-col justify-between p-2.5 shadow-lg backdrop-blur-md cursor-pointer
        ${styles.bg} ${styles.border}
        ${isUpgraded ? 'ring-2 ring-amber-400/80 shadow-amber-500/30' : ''}
        ${selected ? '-translate-y-5 shadow-2xl ring-2 ring-emerald-400 border-emerald-400' : ''}
        ${!disabled && isPlayable ? 'hover:-translate-y-3 hover:shadow-2xl' : ''}
        ${disabled || !isPlayable ? 'opacity-50 grayscale-40 cursor-not-allowed hover:translate-y-0' : ''}
      `}
    >
      {/* Energy Cost Badge */}
      {showCost && (
        <div
          className={`absolute -top-3 -left-3 w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm shadow-md border-2 z-10
            ${card.cost === 0 ? 'bg-emerald-600 border-emerald-400 text-white' : 'bg-cyan-600 border-cyan-300 text-white shadow-cyan-500/50'}
          `}
          title={`에너지 소모: ${card.cost}`}
        >
          <Zap className="w-3.5 h-3.5 mr-0.5 fill-current" />
          {card.cost}
        </div>
      )}

      {/* Upgraded Star Badge */}
      {isUpgraded && (
        <div className="absolute -top-2.5 -right-2.5 w-6 h-6 rounded-full bg-amber-500 border border-amber-300 flex items-center justify-center shadow-lg text-amber-950 z-10">
          <Sparkles className="w-3.5 h-3.5 fill-current" />
        </div>
      )}

      {/* Card Header: Title & English subtitle */}
      <div>
        <div className="flex items-center justify-between gap-1 mb-1">
          <h4 className={`font-bold text-sm truncate tracking-tight ${isUpgraded ? 'text-amber-300 font-extrabold' : 'text-slate-100'}`}>
            {card.name}
          </h4>
        </div>
        <p className="text-[10px] text-slate-400 tracking-wider truncate uppercase font-mono">
          {card.nameEn}
        </p>
      </div>

      {/* Card Art / Icon Vignette */}
      <div className="relative my-1.5 h-20 rounded-lg overflow-hidden border border-slate-700/60 bg-slate-950/80 flex items-center justify-center shadow-inner">
        <div className="absolute inset-0 bg-radial from-transparent via-black/40 to-black/80" />
        
        {card.type === 'ATTACK' && (
          <div className="flex items-center justify-center text-red-500/80 group-hover:scale-110 transition-transform duration-300">
            <Sword className="w-10 h-10 drop-shadow-[0_0_8px_rgba(239,68,68,0.7)]" />
          </div>
        )}
        {card.type === 'SKILL' && (
          <div className="flex items-center justify-center text-cyan-400/80 group-hover:scale-110 transition-transform duration-300">
            <Shield className="w-10 h-10 drop-shadow-[0_0_8px_rgba(6,182,212,0.7)]" />
          </div>
        )}
        {card.type === 'POWER' && (
          <div className="flex items-center justify-center text-amber-400/80 group-hover:scale-110 transition-transform duration-300">
            <Sparkles className="w-10 h-10 drop-shadow-[0_0_8px_rgba(245,158,11,0.7)]" />
          </div>
        )}

        {/* Quick stat icons on the image */}
        <div className="absolute bottom-1 right-1 flex items-center gap-1 text-[11px] font-mono font-bold">
          {card.damage !== undefined && card.damage > 0 && (
            <span className="flex items-center bg-red-950/90 text-red-300 px-1 py-0.5 rounded border border-red-800/80">
              ⚔️ {card.damage}{card.hits ? `×${card.hits}` : ''}
            </span>
          )}
          {card.block !== undefined && card.block > 0 && (
            <span className="flex items-center bg-cyan-950/90 text-cyan-300 px-1 py-0.5 rounded border border-cyan-800/80">
              🛡️ {card.block}
            </span>
          )}
          {card.poison !== undefined && card.poison > 0 && (
            <span className="flex items-center bg-emerald-950/90 text-emerald-300 px-1 py-0.5 rounded border border-emerald-800/80">
              <Droplets className="w-3 h-3 mr-0.5 text-emerald-400" /> {card.poison}
            </span>
          )}
        </div>
      </div>

      {/* Card Description */}
      <div className="flex-1 flex flex-col justify-center px-1">
        <p className="text-xs text-slate-200 leading-snug font-sans text-center">
          {card.description}
        </p>
      </div>

      {/* Card Footer: Tag & Rarity */}
      <div className="pt-1.5 border-t border-slate-800 flex items-center justify-between text-[10px]">
        <span className={`px-1.5 py-0.5 rounded border font-medium ${styles.tagColor}`}>
          {styles.tag}
        </span>
        <span className="text-slate-400 uppercase font-mono tracking-wider">
          {card.rarity === 'STARTER' ? '기본' : card.rarity}
        </span>
      </div>
    </div>
  );
};
