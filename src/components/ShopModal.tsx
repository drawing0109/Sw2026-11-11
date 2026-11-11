import React, { useState } from 'react';
import { Card, Relic, PlayerState } from '../types/game';
import { CardComponent } from './CardComponent';
import { ShoppingCart, Coins, Heart, Trash2, ArrowRight, Check } from 'lucide-react';
import { sounds } from '../services/soundService';

interface ShopModalProps {
  player: PlayerState;
  shopCards: { card: Card; price: number; bought: boolean }[];
  shopRelics: { relic: Relic; price: number; bought: boolean }[];
  removalPrice: number;
  hasRemovedCard: boolean;
  onBuyCard: (index: number) => void;
  onBuyRelic: (index: number) => void;
  onBuyHeal: (cost: number, healAmount: number) => void;
  onInitiateRemoveCard: () => void;
  onLeaveShop: () => void;
}

export const ShopModal: React.FC<ShopModalProps> = ({
  player,
  shopCards,
  shopRelics,
  removalPrice,
  hasRemovedCard,
  onBuyCard,
  onBuyRelic,
  onBuyHeal,
  onInitiateRemoveCard,
  onLeaveShop,
}) => {
  const [healBought, setHealBought] = useState(false);
  const healCost = 50;
  const healAmount = 25;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md select-none animate-fadeIn">
      <div className="relative w-full max-w-4xl bg-gradient-to-b from-slate-900 via-slate-900 to-emerald-950/40 border-2 border-emerald-500/60 rounded-2xl p-6 sm:p-8 shadow-[0_0_40px_rgba(16,185,129,0.25)] flex flex-col justify-between max-h-[92vh] overflow-y-auto scrollbar-thin">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-950/80 border border-emerald-500/60 flex items-center justify-center text-emerald-400 shadow-inner">
              <ShoppingCart className="w-6 h-6" />
            </div>
            <div>
              <div className="text-[10px] font-mono tracking-widest text-emerald-400 uppercase font-bold">
                DIMENSIONAL MERCHANT // 차원 암거래소
              </div>
              <h2 className="text-xl font-bold text-slate-100 font-mono">
                상인 바이스-09의 밀수창고
              </h2>
            </div>
          </div>

          {/* Current Player Gold */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-amber-950/70 border border-amber-500/60 text-amber-300 font-mono text-sm font-bold shadow-md">
            <Coins className="w-4 h-4 fill-current" />
            <span>{player.gold} G</span>
          </div>
        </div>

        {/* Goods Area */}
        <div className="flex flex-col gap-6 my-4">
          {/* 1. Cards on Sale */}
          <div>
            <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-300 mb-3 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-cyan-400" />
              <span>특수 군용 카드 전술 팩</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 justify-items-center">
              {shopCards.map((item, idx) => (
                <div key={`${item.card.id}_${idx}`} className="flex flex-col items-center">
                  <div className={item.bought ? 'opacity-30 grayscale pointer-events-none' : ''}>
                    <CardComponent card={item.card} scale={0.92} />
                  </div>
                  <button
                    disabled={item.bought || player.gold < item.price}
                    onClick={() => onBuyCard(idx)}
                    className={`mt-2 w-full max-w-[150px] py-1.5 px-3 rounded-lg font-mono font-bold text-xs flex items-center justify-center gap-1.5 shadow-md transition-all
                      ${item.bought
                        ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                        : player.gold >= item.price
                        ? 'bg-amber-500 hover:bg-amber-400 text-amber-950 cursor-pointer hover:scale-105'
                        : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                      }
                    `}
                  >
                    {item.bought ? (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        <span>판매완료</span>
                      </>
                    ) : (
                      <>
                        <Coins className="w-3.5 h-3.5 fill-current" />
                        <span>{item.price} G</span>
                      </>
                    )}
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* 2. Relics & Services */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Relics */}
            <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800">
              <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-purple-400 mb-3 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-purple-400" />
                <span>희귀 차원 유물</span>
              </h4>

              <div className="flex flex-col gap-2">
                {shopRelics.map((item, idx) => (
                  <div
                    key={`${item.relic.id}_${idx}`}
                    className={`p-3 rounded-xl border flex items-center justify-between transition-all
                      ${item.bought
                        ? 'bg-slate-900/40 border-slate-800 opacity-40'
                        : 'bg-slate-900 border-slate-700 hover:border-purple-500/60'
                      }
                    `}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-purple-950/80 border border-purple-500/60 flex items-center justify-center text-sm">
                        {item.relic.icon}
                      </div>
                      <div className="text-left font-mono">
                        <div className="text-xs font-bold text-slate-200">
                          {item.relic.name}
                        </div>
                        <div className="text-[10px] text-slate-400 max-w-[160px] truncate">
                          {item.relic.description}
                        </div>
                      </div>
                    </div>

                    <button
                      disabled={item.bought || player.gold < item.price}
                      onClick={() => onBuyRelic(idx)}
                      className={`px-3 py-1.5 rounded-lg font-mono font-bold text-xs flex items-center gap-1 shadow-md
                        ${item.bought
                          ? 'bg-slate-800 text-slate-500'
                          : player.gold >= item.price
                          ? 'bg-amber-500 hover:bg-amber-400 text-amber-950'
                          : 'bg-slate-800 text-slate-500'
                        }
                      `}
                    >
                      {item.bought ? '완료' : `${item.price} G`}
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Special Services: Card Removal & Heal */}
            <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 flex flex-col justify-between gap-3">
              <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-400 mb-1 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                <span>특수 정제 및 수리 서비스</span>
              </h4>

              {/* Card Removal */}
              <div className="p-3 rounded-xl bg-slate-900 border border-slate-700 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-red-950/80 border border-red-500/60 flex items-center justify-center text-red-400">
                    <Trash2 className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold font-mono text-slate-200">
                      덱 압축 / 카드 1장 소멸
                    </div>
                    <div className="text-[10px] text-slate-400 font-mono">
                      불필요한 카드를 영구 제거
                    </div>
                  </div>
                </div>

                <button
                  disabled={hasRemovedCard || player.gold < removalPrice}
                  onClick={onInitiateRemoveCard}
                  className={`px-3 py-1.5 rounded-lg font-mono font-bold text-xs flex items-center gap-1 shadow-md
                    ${hasRemovedCard
                      ? 'bg-slate-800 text-slate-500'
                      : player.gold >= removalPrice
                      ? 'bg-red-500 hover:bg-red-400 text-slate-950'
                      : 'bg-slate-800 text-slate-500'
                    }
                  `}
                >
                  {hasRemovedCard ? '이용 완료' : `${removalPrice} G`}
                </button>
              </div>

              {/* Emergency Heal */}
              <div className="p-3 rounded-xl bg-slate-900 border border-slate-700 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-rose-950/80 border border-rose-500/60 flex items-center justify-center text-rose-400">
                    <Heart className="w-4 h-4 fill-current" />
                  </div>
                  <div>
                    <div className="text-xs font-bold font-mono text-slate-200">
                      나노 생체 수리팩 (+{healAmount} HP)
                    </div>
                    <div className="text-[10px] text-slate-400 font-mono">
                      즉각적인 체력 응급 복원
                    </div>
                  </div>
                </div>

                <button
                  disabled={healBought || player.gold < healCost || player.hp >= player.maxHp}
                  onClick={() => {
                    setHealBought(true);
                    onBuyHeal(healCost, healAmount);
                  }}
                  className={`px-3 py-1.5 rounded-lg font-mono font-bold text-xs flex items-center gap-1 shadow-md
                    ${healBought || player.hp >= player.maxHp
                      ? 'bg-slate-800 text-slate-500'
                      : player.gold >= healCost
                      ? 'bg-emerald-500 hover:bg-emerald-400 text-emerald-950'
                      : 'bg-slate-800 text-slate-500'
                    }
                  `}
                >
                  {healBought ? '완료' : `${healCost} G`}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Footer: Leave Shop */}
        <div className="pt-4 border-t border-slate-800 flex justify-end">
          <button
            onClick={() => {
              sounds.playButtonClick();
              onLeaveShop();
            }}
            className="px-6 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white font-mono font-bold text-sm flex items-center gap-2 border border-slate-700 transition-colors shadow-lg cursor-pointer"
          >
            <span>상점 떠나기</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
