import React, { useEffect, useRef } from 'react';
import { MapFloor } from '../utils/mapGenerator';
import { MapNode, NodeType } from '../types/game';
import { Sword, Skull, ShoppingCart, Flame, HelpCircle, Crown, ChevronUp } from 'lucide-react';
import { sounds } from '../services/soundService';

interface MapViewProps {
  map: MapFloor[];
  currentFloor: number;
  currentNodeId: string | null;
  onSelectNode: (node: MapNode) => void;
  canChooseNode: boolean;
}

export const MapView: React.FC<MapViewProps> = ({
  map,
  currentFloor,
  currentNodeId,
  onSelectNode,
  canChooseNode,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const activeNodeRef = useRef<HTMLDivElement>(null);

  // Auto scroll to current floor
  useEffect(() => {
    if (activeNodeRef.current) {
      activeNodeRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [currentFloor]);

  // Find currently selected node
  const currentNode = currentNodeId
    ? map.flatMap(f => f.nodes).find(n => n.id === currentNodeId)
    : null;

  // Determine which nodes are eligible to click
  const isNodeAvailable = (node: MapNode) => {
    if (!canChooseNode) return false;
    if (currentFloor === 0 && node.floor === 1) return true;
    if (currentNode && node.floor === currentFloor + 1) {
      return currentNode.connections.includes(node.id);
    }
    return false;
  };

  const getNodeIcon = (type: NodeType) => {
    switch (type) {
      case 'COMBAT':
        return <Sword className="w-5 h-5 text-red-400" />;
      case 'ELITE':
        return <Skull className="w-5 h-5 text-amber-400" />;
      case 'SHOP':
        return <ShoppingCart className="w-5 h-5 text-emerald-400" />;
      case 'CAMPFIRE':
        return <Flame className="w-5 h-5 text-orange-400" />;
      case 'EVENT':
        return <HelpCircle className="w-5 h-5 text-purple-400" />;
      case 'BOSS':
        return <Crown className="w-6 h-6 text-amber-300 animate-pulse" />;
    }
  };

  const getNodeStyle = (type: NodeType) => {
    switch (type) {
      case 'COMBAT':
        return 'border-red-500/50 hover:border-red-400 bg-red-950/40 text-red-300';
      case 'ELITE':
        return 'border-amber-500/60 hover:border-amber-400 bg-amber-950/50 text-amber-300 shadow-[0_0_15px_rgba(245,158,11,0.25)]';
      case 'SHOP':
        return 'border-emerald-500/50 hover:border-emerald-400 bg-emerald-950/40 text-emerald-300';
      case 'CAMPFIRE':
        return 'border-orange-500/50 hover:border-orange-400 bg-orange-950/40 text-orange-300';
      case 'EVENT':
        return 'border-purple-500/50 hover:border-purple-400 bg-purple-950/40 text-purple-300 shadow-[0_0_12px_rgba(168,85,247,0.2)]';
      case 'BOSS':
        return 'border-amber-400 bg-gradient-to-b from-amber-950/80 to-purple-950/80 text-amber-200 shadow-[0_0_25px_rgba(251,191,36,0.4)] scale-110';
    }
  };

  // Reversed floors so Floor 15 Boss is at the top, Floor 1 at the bottom (like Slay the Spire)
  const reversedFloors = [...map].reverse();

  return (
    <div className="relative flex-1 flex flex-col items-center justify-between overflow-hidden bg-slate-950 p-4">
      {/* Background Grid Accent */}
      <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:24px_24px] opacity-25 pointer-events-none" />

      {/* Header Banner */}
      <div className="relative z-10 w-full max-w-2xl text-center py-2 bg-slate-900/80 border border-slate-800 rounded-xl backdrop-blur-md mb-2 shadow-lg">
        <h2 className="text-sm font-mono tracking-widest text-cyan-400 uppercase font-bold flex items-center justify-center gap-2">
          <span>차원 붕괴 지도 (DIMENSIONAL LATTICE)</span>
        </h2>
        <p className="text-xs text-slate-400 mt-0.5">
          {canChooseNode ? '다음 진행할 경로의 노드를 선택하십시오.' : '현재 차원의 전투 또는 사건을 해결하십시오.'}
        </p>
      </div>

      {/* Map Tree Scroll Area */}
      <div
        ref={containerRef}
        className="relative z-10 w-full max-w-xl flex-1 overflow-y-auto px-4 py-6 scrollbar-thin scrollbar-thumb-slate-700"
      >
        <div className="flex flex-col items-center gap-6">
          {reversedFloors.map((floor) => {
            const isFloorActive = floor.floorNumber === currentFloor;
            const isFloorPassed = floor.floorNumber < currentFloor;

            return (
              <div
                key={`floor_${floor.floorNumber}`}
                className="w-full flex items-center justify-between gap-4 relative group"
              >
                {/* Floor Label */}
                <div className="w-16 text-right font-mono text-xs">
                  <span
                    className={`px-2 py-0.5 rounded font-bold ${
                      isFloorActive
                        ? 'bg-cyan-500 text-slate-950 shadow-[0_0_8px_rgba(6,182,212,0.8)]'
                        : isFloorPassed
                        ? 'text-slate-600'
                        : 'text-slate-400'
                    }`}
                  >
                    F{floor.floorNumber}
                  </span>
                </div>

                {/* Nodes on this floor */}
                <div className="flex-1 flex items-center justify-center gap-8 sm:gap-12 relative py-2">
                  {floor.nodes.map((node) => {
                    const isAvailable = isNodeAvailable(node);
                    const isCurrent = node.id === currentNodeId;
                    const isPassed = isFloorPassed;

                    return (
                      <div
                        key={node.id}
                        ref={isCurrent ? activeNodeRef : undefined}
                        className="relative flex flex-col items-center"
                      >
                        {/* Current Player Indicator */}
                        {isCurrent && (
                          <div className="absolute -top-7 flex flex-col items-center animate-bounce">
                            <span className="text-[10px] font-mono font-extrabold text-cyan-400 bg-cyan-950/90 px-1.5 py-0.5 rounded border border-cyan-500/80">
                              YOU
                            </span>
                            <ChevronUp className="w-4 h-4 text-cyan-400 -mt-1" />
                          </div>
                        )}

                        {/* Node Button */}
                        <button
                          disabled={!isAvailable}
                          onClick={() => {
                            sounds.playButtonClick();
                            onSelectNode(node);
                          }}
                          className={`w-14 h-14 rounded-2xl border-2 flex flex-col items-center justify-center transition-all duration-300 relative group/btn
                            ${getNodeStyle(node.type)}
                            ${isAvailable ? 'ring-4 ring-cyan-400/50 cursor-pointer animate-pulse hover:scale-115 hover:ring-cyan-300' : ''}
                            ${isCurrent ? 'ring-4 ring-cyan-400 bg-cyan-950 text-cyan-200 scale-105' : ''}
                            ${!isAvailable && !isCurrent ? (isPassed ? 'opacity-35 grayscale' : 'opacity-60') : ''}
                          `}
                        >
                          {getNodeIcon(node.type)}
                          <span className="text-[9px] font-mono mt-0.5 font-bold truncate max-w-[50px]">
                            {node.type}
                          </span>

                          {/* Hover Tooltip */}
                          <div className="absolute bottom-16 pointer-events-none opacity-0 group-hover/btn:opacity-100 transition-opacity w-44 p-2 rounded-lg bg-slate-900/95 border border-slate-700 text-xs text-center z-50 shadow-2xl backdrop-blur-md">
                            <div className="font-bold text-slate-100">{node.label}</div>
                            <div className="text-[10px] text-slate-400 mt-0.5">
                              {node.type === 'COMBAT' && '일반 적과의 카드 배틀'}
                              {node.type === 'ELITE' && '강력한 엘리트 적 (유물 보상)'}
                              {node.type === 'SHOP' && '카드/유물 구매 및 정제'}
                              {node.type === 'CAMPFIRE' && '체력 회복 또는 카드 강화'}
                              {node.type === 'EVENT' && 'AI 동적 서사 미스터리 조우'}
                              {node.type === 'BOSS' && '차원 지배자 크로노스-Ω'}
                            </div>
                          </div>
                        </button>
                      </div>
                    );
                  })}
                </div>

                {/* Right empty spacer for symmetry */}
                <div className="w-16" />
              </div>
            );
          })}
        </div>
      </div>

      {/* Legend Footer */}
      <div className="relative z-10 w-full max-w-2xl py-2 px-4 rounded-xl bg-slate-900/90 border border-slate-800 flex items-center justify-around text-xs font-mono text-slate-400 mt-2 shadow-inner">
        <div className="flex items-center gap-1.5">
          <Sword className="w-4 h-4 text-red-400" />
          <span>전투</span>
        </div>
        <div className="flex items-center gap-1.5">
          <Skull className="w-4 h-4 text-amber-400" />
          <span>엘리트</span>
        </div>
        <div className="flex items-center gap-1.5">
          <HelpCircle className="w-4 h-4 text-purple-400" />
          <span>AI 이벤트</span>
        </div>
        <div className="flex items-center gap-1.5">
          <ShoppingCart className="w-4 h-4 text-emerald-400" />
          <span>상점</span>
        </div>
        <div className="flex items-center gap-1.5">
          <Flame className="w-4 h-4 text-orange-400" />
          <span>휴식지</span>
        </div>
        <div className="flex items-center gap-1.5">
          <Crown className="w-4 h-4 text-amber-300" />
          <span>보스</span>
        </div>
      </div>
    </div>
  );
};
