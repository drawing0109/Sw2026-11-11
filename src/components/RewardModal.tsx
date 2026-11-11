import React, { useEffect, useState } from 'react';
import { Card, Relic } from '../types/game';
import { CardComponent } from './CardComponent';
import { Trophy, Coins, Sparkles, ArrowRight, Check, X } from 'lucide-react';
import confetti from 'canvas-confetti';
import { sounds } from '../services/soundService';

interface RewardModalProps {
  goldReward: number;
  cardChoices: Card[];
  relicReward?: Relic | null;
  aiCommentary: string;
  onClaimGold: () => void;
  onClaimRelic: (relic: Relic) => void;
  onChooseCard: (card: Card) => void;
  onSkipCards: () => void;
  onFinishRewards: () => void;
  goldClaimed: boolean;
  relicClaimed: boolean;
  cardChosen: boolean;
}

export const RewardModal: React.FC<RewardModalProps> = ({
  goldReward,
  cardChoices,
  relicReward,
  aiCommentary,
  onClaimGold,
  onClaimRelic,
  onChooseCard,
  onSkipCards,
  onFinishRewards,
  goldClaimed,
  relicClaimed,
  cardChosen,
}) => {
  const [selectedCard, setSelectedCard] = useState<Card | null>(null);

  useEffect(() => {
    sounds.playVictory();
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.6 },
      colors: ['#06b6d4', '#a855f7', '#fbbf24'],
    });
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md select-none animate-fadeIn">
      <div className="relative w-full max-w-3xl bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 border-2 border-cyan-500/60 rounded-2xl p-6 sm:p-8 shadow-[0_0_40px_rgba(6,182,212,0.3)] flex flex-col justify-between max-h-[92vh] overflow-y-auto scrollbar-thin">
        {/* Header */}
        <div className="text-center pb-4 border-b border-slate-800">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-cyan-950/80 border border-cyan-400 text-cyan-300 mb-2 shadow-[0_0_15px_rgba(6,182,212,0.4)]">
            <Trophy className="w-6 h-6" />
          </div>
          <h2 className="text-xl sm:text-2xl font-black font-mono tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-indigo-200 to-purple-400 uppercase">
            전투 승리 (VICTORY)
          </h2>
          <p className="text-xs font-mono text-slate-400 mt-1">
            차원의 파편을 수습하고 전리품을 선택하십시오.
          </p>
        </div>

        {/* AI Narrator Commentary Box */}
        {aiCommentary && (
          <div className="my-4 p-3 rounded-xl bg-purple-950/30 border border-purple-500/40 flex items-start gap-3 shadow-inner">
            <div className="p-1 rounded-md bg-purple-900/60 text-purple-300 mt-0.5 shrink-0">
              <Sparkles className="w-4 h-4 animate-pulse" />
            </div>
            <div>
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-purple-400 block mb-0.5">
                AI 오버시어 전술 평론
              </span>
              <p className="text-xs text-slate-200 font-sans leading-relaxed italic">
                "{aiCommentary}"
              </p>
            </div>
          </div>
        )}

        {/* Rewards Section */}
        <div className="flex flex-col gap-3 my-2">
          {/* Gold Reward Item */}
          {!goldClaimed && (
            <button
              onClick={() => {
                sounds.playGoldChime();
                onClaimGold();
              }}
              className="w-full p-3.5 rounded-xl bg-slate-900 hover:bg-amber-950/40 border border-amber-600/50 hover:border-amber-400 flex items-center justify-between transition-all group cursor-pointer shadow-md"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-amber-950/80 border border-amber-500/60 flex items-center justify-center text-amber-400">
                  <Coins className="w-5 h-5 fill-current" />
                </div>
                <div className="text-left font-mono">
                  <div className="text-sm font-bold text-amber-300">
                    +{goldReward} GOLD
                  </div>
                  <div className="text-[10px] text-slate-400">골드 전리품 획득</div>
                </div>
              </div>
              <span className="text-xs font-mono text-amber-400 group-hover:translate-x-1 transition-transform">
                수령하기 &rarr;
              </span>
            </button>
          )}

          {/* Relic Reward Item (if Elite / Boss) */}
          {relicReward && !relicClaimed && (
            <button
              onClick={() => {
                sounds.playUpgrade();
                onClaimRelic(relicReward);
              }}
              className="w-full p-3.5 rounded-xl bg-slate-900 hover:bg-purple-950/40 border border-purple-600/50 hover:border-purple-400 flex items-center justify-between transition-all group cursor-pointer shadow-md"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-purple-950/80 border border-purple-500/60 flex items-center justify-center text-base">
                  {relicReward.icon}
                </div>
                <div className="text-left font-mono">
                  <div className="text-sm font-bold text-purple-300 flex items-center gap-2">
                    <span>{relicReward.name}</span>
                    <span className="text-[10px] px-1.5 py-0.2 rounded bg-purple-900/60 border border-purple-700 text-purple-200">
                      {relicReward.rarity}
                    </span>
                  </div>
                  <div className="text-[10px] text-slate-400">{relicReward.description}</div>
                </div>
              </div>
              <span className="text-xs font-mono text-purple-400 group-hover:translate-x-1 transition-transform">
                유물 장착 &rarr;
              </span>
            </button>
          )}

          {/* Card Selection Draft */}
          {!cardChosen && cardChoices.length > 0 && (
            <div className="mt-2 p-4 rounded-2xl bg-slate-950/80 border border-slate-800">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-mono text-cyan-400 font-bold uppercase tracking-wider">
                  덱에 추가할 카드 1장 선택
                </span>
                <button
                  onClick={() => {
                    sounds.playButtonClick();
                    onSkipCards();
                  }}
                  className="text-xs font-mono text-slate-400 hover:text-slate-200 px-2 py-1 rounded bg-slate-900 border border-slate-700 flex items-center gap-1 transition-colors"
                >
                  <X className="w-3.5 h-3.5" />
                  <span>건너뛰기</span>
                </button>
              </div>

              {/* 3 Card Choices */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 justify-items-center py-2">
                {cardChoices.map((card) => (
                  <div key={card.id} className="flex flex-col items-center">
                    <CardComponent
                      card={card}
                      scale={0.92}
                      selected={selectedCard?.id === card.id}
                      onClick={() => setSelectedCard(card)}
                    />
                    <button
                      onClick={() => {
                        sounds.playUpgrade();
                        onChooseCard(card);
                      }}
                      className="mt-2 w-full max-w-[150px] py-1.5 px-3 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-mono font-bold text-xs flex items-center justify-center gap-1 shadow-md transition-colors"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>선택</span>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Continue to Map Button */}
        <div className="pt-4 border-t border-slate-800 flex justify-end">
          <button
            onClick={() => {
              sounds.playButtonClick();
              onFinishRewards();
            }}
            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white font-mono font-bold text-sm flex items-center gap-2 shadow-lg transition-all cursor-pointer"
          >
            <span>지도 복귀</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
