import React, { useState } from 'react';
import { Card } from '../types/game';
import { CardComponent } from './CardComponent';
import { X, Layers, Trash2, Hammer } from 'lucide-react';
import { sounds } from '../services/soundService';

interface DeckViewerModalProps {
  cards: Card[];
  title?: string;
  subtitle?: string;
  mode?: 'view' | 'remove' | 'upgrade';
  onSelectCard?: (card: Card) => void;
  onClose: () => void;
}

export const DeckViewerModal: React.FC<DeckViewerModalProps> = ({
  cards,
  title = '보유 덱 목록 (DECK INSPECTOR)',
  subtitle = '현재 보유 중인 모든 카드입니다.',
  mode = 'view',
  onSelectCard,
  onClose,
}) => {
  const [filterType, setFilterType] = useState<'ALL' | 'ATTACK' | 'SKILL' | 'POWER'>('ALL');

  const filteredCards = cards.filter((c) => {
    if (filterType === 'ALL') return true;
    return c.type === filterType;
  });

  const handleCardClick = (card: Card) => {
    if (mode === 'upgrade' && card.isUpgraded) {
      return; // Already upgraded
    }
    if (onSelectCard) {
      sounds.playButtonClick();
      onSelectCard(card);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md select-none animate-fadeIn">
      <div className="relative w-full max-w-5xl bg-slate-900 border-2 border-slate-700 rounded-2xl p-6 shadow-2xl flex flex-col justify-between max-h-[92vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-cyan-400">
              {mode === 'remove' ? (
                <Trash2 className="w-5 h-5 text-red-400" />
              ) : mode === 'upgrade' ? (
                <Hammer className="w-5 h-5 text-amber-400" />
              ) : (
                <Layers className="w-5 h-5" />
              )}
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-slate-100 font-mono flex items-center gap-2">
                <span>{title}</span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-slate-800 text-cyan-400 font-mono">
                  {cards.length} 장
                </span>
              </h2>
              <p className="text-xs text-slate-400">{subtitle}</p>
            </div>
          </div>

          <button
            onClick={() => {
              sounds.playButtonClick();
              onClose();
            }}
            className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 flex items-center justify-center text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Filter bar */}
        <div className="flex items-center gap-2 py-3">
          {(['ALL', 'ATTACK', 'SKILL', 'POWER'] as const).map((t) => (
            <button
              key={t}
              onClick={() => {
                sounds.playButtonClick();
                setFilterType(t);
              }}
              className={`px-3 py-1 rounded-lg text-xs font-mono font-semibold transition-colors
                ${filterType === t
                  ? 'bg-cyan-500 text-slate-950 shadow-md font-bold'
                  : 'bg-slate-800 text-slate-400 hover:text-slate-200'
                }
              `}
            >
              {t === 'ALL' ? '전체' : t}
            </button>
          ))}
        </div>

        {/* Cards Grid */}
        <div className="flex-1 overflow-y-auto p-4 scrollbar-thin scrollbar-thumb-slate-700">
          {filteredCards.length === 0 ? (
            <div className="h-64 flex items-center justify-center text-slate-500 font-mono text-xs">
              해당 분류의 카드가 없습니다.
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 justify-items-center">
              {filteredCards.map((card, idx) => {
                const canSelect = mode === 'remove' || (mode === 'upgrade' && !card.isUpgraded);
                return (
                  <div
                    key={`${card.id}_${idx}`}
                    className="relative group flex flex-col items-center"
                  >
                    <div className={mode === 'upgrade' && card.isUpgraded ? 'opacity-40 grayscale' : ''}>
                      <CardComponent
                        card={card}
                        scale={0.85}
                        onClick={canSelect ? () => handleCardClick(card) : undefined}
                      />
                    </div>

                    {mode === 'remove' && (
                      <button
                        onClick={() => handleCardClick(card)}
                        className="mt-1 w-full max-w-[130px] py-1 px-2 rounded bg-red-600 hover:bg-red-500 text-white font-mono text-xs font-bold shadow-md cursor-pointer"
                      >
                        제거하기
                      </button>
                    )}

                    {mode === 'upgrade' && (
                      <button
                        disabled={card.isUpgraded}
                        onClick={() => handleCardClick(card)}
                        className={`mt-1 w-full max-w-[130px] py-1 px-2 rounded font-mono text-xs font-bold shadow-md
                          ${card.isUpgraded
                            ? 'bg-slate-800 text-slate-600 cursor-not-allowed'
                            : 'bg-amber-500 hover:bg-amber-400 text-slate-950 cursor-pointer'
                          }
                        `}
                      >
                        {card.isUpgraded ? '강화 완료' : '강화하기'}
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-slate-800 flex justify-end">
          <button
            onClick={() => {
              sounds.playButtonClick();
              onClose();
            }}
            className="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-mono text-xs font-bold transition-colors cursor-pointer"
          >
            닫기
          </button>
        </div>
      </div>
    </div>
  );
};
