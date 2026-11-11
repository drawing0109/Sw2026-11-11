import React, { useState } from 'react';
import { PlayerState, Card } from '../types/game';
import { Flame, Heart, Sparkles, Hammer, ArrowRight, Loader2, Wand2 } from 'lucide-react';
import { sounds } from '../services/soundService';
import { CardComponent } from './CardComponent';

interface CampfireModalProps {
  player: PlayerState;
  onRest: (healAmount: number) => void;
  onInitiateUpgrade: () => void;
  onForgeCard: (wishPrompt: string) => Promise<Card | null>;
  onFinishCampfire: () => void;
}

export const CampfireModal: React.FC<CampfireModalProps> = ({
  player,
  onRest,
  onInitiateUpgrade,
  onForgeCard,
  onFinishCampfire,
}) => {
  const [hasActed, setHasActed] = useState(false);
  const [isForging, setIsForging] = useState(false);
  const [forgedCard, setForgedCard] = useState<Card | null>(null);
  const [wishInput, setWishInput] = useState('');
  const [showForgeInput, setShowForgeInput] = useState(false);

  const healAmount = Math.round(player.maxHp * 0.3);

  const handleRest = () => {
    sounds.playHeal();
    onRest(healAmount);
    setHasActed(true);
  };

  const handleForge = async () => {
    setIsForging(true);
    sounds.playButtonClick();
    const newCard = await onForgeCard(wishInput.trim() || '특이점을 다루는 강력한 차원 전술');
    setIsForging(false);
    if (newCard) {
      setForgedCard(newCard);
      sounds.playUpgrade();
      setHasActed(true);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md select-none animate-fadeIn">
      <div className="relative w-full max-w-3xl bg-gradient-to-b from-slate-900 via-slate-900 to-orange-950/40 border-2 border-orange-500/60 rounded-2xl p-6 sm:p-8 shadow-[0_0_40px_rgba(249,115,22,0.25)] flex flex-col justify-between max-h-[92vh] overflow-y-auto scrollbar-thin">
        {/* Header */}
        <div className="text-center pb-4 border-b border-slate-800">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-orange-950/80 border border-orange-500/60 text-orange-400 mb-2 shadow-[0_0_15px_rgba(249,115,22,0.4)]">
            <Flame className="w-6 h-6 animate-pulse" />
          </div>
          <h2 className="text-xl sm:text-2xl font-black font-mono tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-amber-200 to-purple-400 uppercase">
            나노 재충전소 (CAMPFIRE)
          </h2>
          <p className="text-xs font-mono text-slate-400 mt-1">
            균열 속 안전 구역입니다. 재정비를 진행하십시오.
          </p>
        </div>

        {/* Content */}
        <div className="my-6">
          {!hasActed ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Option 1: Rest */}
              <button
                onClick={handleRest}
                disabled={player.hp >= player.maxHp}
                className={`p-5 rounded-2xl border-2 flex flex-col items-center justify-between gap-3 text-center transition-all group shadow-lg cursor-pointer
                  ${player.hp >= player.maxHp
                    ? 'bg-slate-900/50 border-slate-800 opacity-50 cursor-not-allowed'
                    : 'bg-slate-900 hover:bg-rose-950/40 border-rose-600/50 hover:border-rose-400 hover:scale-102 hover:shadow-[0_0_20px_rgba(244,63,94,0.3)]'
                  }
                `}
              >
                <div className="w-12 h-12 rounded-xl bg-rose-950/80 border border-rose-500/60 flex items-center justify-center text-rose-400 group-hover:scale-110 transition-transform">
                  <Heart className="w-6 h-6 fill-current" />
                </div>
                <div>
                  <h3 className="font-bold font-mono text-sm text-slate-100">
                    휴식 (REST)
                  </h3>
                  <p className="text-xs text-rose-300 font-mono mt-1">
                    체력 +{healAmount} 회복
                  </p>
                  <p className="text-[11px] text-slate-400 mt-1">
                    현재: {player.hp} / {player.maxHp}
                  </p>
                </div>
              </button>

              {/* Option 2: Smith */}
              <button
                onClick={() => {
                  sounds.playButtonClick();
                  onInitiateUpgrade();
                }}
                className="p-5 rounded-2xl bg-slate-900 hover:bg-amber-950/40 border-2 border-amber-600/50 hover:border-amber-400 flex flex-col items-center justify-between gap-3 text-center transition-all group shadow-lg cursor-pointer hover:scale-102 hover:shadow-[0_0_20px_rgba(245,158,11,0.3)]"
              >
                <div className="w-12 h-12 rounded-xl bg-amber-950/80 border border-amber-500/60 flex items-center justify-center text-amber-400 group-hover:scale-110 transition-transform">
                  <Hammer className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold font-mono text-sm text-slate-100">
                    제련 (SMITH)
                  </h3>
                  <p className="text-xs text-amber-300 font-mono mt-1">
                    카드 1장 영구 강화
                  </p>
                  <p className="text-[11px] text-slate-400 mt-1">
                    위력, 방어도, 효율 향상
                  </p>
                </div>
              </button>

              {/* Option 3: AI Anomaly Forge */}
              <button
                onClick={() => {
                  sounds.playButtonClick();
                  setShowForgeInput(true);
                }}
                className="p-5 rounded-2xl bg-slate-900 hover:bg-purple-950/40 border-2 border-purple-600/50 hover:border-purple-400 flex flex-col items-center justify-between gap-3 text-center transition-all group shadow-lg cursor-pointer hover:scale-102 hover:shadow-[0_0_20px_rgba(168,85,247,0.3)]"
              >
                <div className="w-12 h-12 rounded-xl bg-purple-950/80 border border-purple-500/60 flex items-center justify-center text-purple-400 group-hover:scale-110 transition-transform">
                  <Wand2 className="w-6 h-6 animate-pulse" />
                </div>
                <div>
                  <h3 className="font-bold font-mono text-sm text-slate-100 flex items-center justify-center gap-1">
                    <span>AI 차원 연성</span>
                    <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                  </h3>
                  <p className="text-xs text-purple-300 font-mono mt-1">
                    신규 카드 즉석 창조
                  </p>
                  <p className="text-[11px] text-slate-400 mt-1">
                    Gemini AI 주문 제작
                  </p>
                </div>
              </button>
            </div>
          ) : (
            <div className="p-6 rounded-2xl bg-slate-950/80 border border-slate-800 text-center flex flex-col items-center gap-4">
              <div className="text-sm font-mono text-emerald-400 font-bold">
                ✓ 재정비가 완료되었습니다.
              </div>

              {forgedCard && (
                <div className="flex flex-col items-center">
                  <div className="text-xs font-mono text-purple-300 mb-2">
                    [AI가 연성한 신규 카드]
                  </div>
                  <CardComponent card={forgedCard} scale={0.92} />
                </div>
              )}
            </div>
          )}

          {/* AI Forge Input Modal Overlay */}
          {showForgeInput && !hasActed && (
            <div className="mt-4 p-5 rounded-2xl bg-slate-950 border border-purple-500/60 shadow-2xl flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono text-purple-300 font-bold flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-purple-400" />
                  <span>차원 코어 연성 프롬프트 (선택 사항)</span>
                </span>
                <button
                  onClick={() => setShowForgeInput(false)}
                  className="text-xs text-slate-500 hover:text-slate-300"
                >
                  취소
                </button>
              </div>

              <input
                type="text"
                value={wishInput}
                onChange={(e) => setWishInput(e.target.value)}
                placeholder="예: 독과 방어도를 동시에 주는 카드, 고비용 일격필살 등..."
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-slate-200 text-xs focus:border-purple-400 focus:outline-hidden"
              />

              <button
                disabled={isForging}
                onClick={handleForge}
                className="w-full py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-mono font-bold text-xs flex items-center justify-center gap-2 shadow-lg cursor-pointer"
              >
                {isForging ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Gemini AI 연성 중...</span>
                  </>
                ) : (
                  <>
                    <Wand2 className="w-4 h-4" />
                    <span>연성 개시 (카드 1장 획득)</span>
                  </>
                )}
              </button>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="pt-4 border-t border-slate-800 flex justify-end">
          <button
            onClick={() => {
              sounds.playButtonClick();
              onFinishCampfire();
            }}
            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 text-white font-mono font-bold text-sm flex items-center gap-2 shadow-lg transition-all cursor-pointer"
          >
            <span>캠프파이어 종료</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
