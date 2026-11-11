import { MapNode, NodeType } from '../types/game';

export interface MapFloor {
  floorNumber: number;
  nodes: MapNode[];
}

export function generateRunMap(totalFloors: number = 15): MapFloor[] {
  const map: MapFloor[] = [];

  for (let f = 1; f <= totalFloors; f++) {
    const nodes: MapNode[] = [];

    if (f === 1) {
      // 3 initial entry pathways
      for (let i = 0; i < 3; i++) {
        nodes.push({
          id: `node_1_${i}`,
          floor: 1,
          type: i === 1 ? 'EVENT' : 'COMBAT',
          connections: [],
          label: i === 1 ? '미스터리 균열' : '차원 정찰대'
        });
      }
    } else if (f === totalFloors) {
      // Boss floor
      nodes.push({
        id: `node_${f}_0`,
        floor: f,
        type: 'BOSS',
        connections: [],
        label: '차원 지배자 (FINAL BOSS)'
      });
    } else if (f === totalFloors - 1) {
      // Campfire before Boss
      nodes.push({
        id: `node_${f}_0`,
        floor: f,
        type: 'CAMPFIRE',
        connections: [`node_${totalFloors}_0`],
        label: '최후의 휴식지'
      });
    } else {
      // Intermediate floors: 2 to 3 nodes
      const nodeCount = (f % 2 === 0) ? 3 : 2;

      for (let i = 0; i < nodeCount; i++) {
        let type: NodeType = 'COMBAT';
        let label = '차원 방어군';

        if (f === 5 || f === 10) {
          if (i === 0) {
            type = 'SHOP';
            label = '차원 상점';
          } else {
            type = 'EVENT';
            label = 'AI 이상 현상';
          }
        } else if (f === 7 || f === 12) {
          if (i === 0) {
            type = 'ELITE';
            label = '엘리트 가디언';
          } else {
            type = 'COMBAT';
            label = '강습 부대';
          }
        } else if (f === 6 || f === 11) {
          if (i === 1) {
            type = 'CAMPFIRE';
            label = '나노 재충전소';
          } else {
            type = 'EVENT';
            label = '미스터리 신호';
          }
        } else {
          // Weighted random
          const rand = Math.random();
          if (rand < 0.35) {
            type = 'COMBAT';
            label = '차원 경비병';
          } else if (rand < 0.65) {
            type = 'EVENT';
            label = 'AI 조우 사건';
          } else if (rand < 0.85) {
            type = 'CAMPFIRE';
            label = '휴식 셸터';
          } else {
            type = 'SHOP';
            label = '방랑 상인';
          }
        }

        nodes.push({
          id: `node_${f}_${i}`,
          floor: f,
          type,
          connections: [],
          label
        });
      }
    }

    map.push({ floorNumber: f, nodes });
  }

  // Connect floors forward
  for (let f = 0; f < map.length - 1; f++) {
    const currentFloor = map[f];
    const nextFloor = map[f + 1];

    currentFloor.nodes.forEach((currNode, cIdx) => {
      if (nextFloor.nodes.length === 1) {
        currNode.connections.push(nextFloor.nodes[0].id);
      } else if (currentFloor.nodes.length === nextFloor.nodes.length) {
        // Direct and adjacent
        currNode.connections.push(nextFloor.nodes[cIdx].id);
        if (cIdx + 1 < nextFloor.nodes.length) {
          currNode.connections.push(nextFloor.nodes[cIdx + 1].id);
        }
      } else if (currentFloor.nodes.length < nextFloor.nodes.length) {
        // Expand
        currNode.connections.push(nextFloor.nodes[cIdx].id);
        currNode.connections.push(nextFloor.nodes[cIdx + 1].id);
      } else {
        // Converge
        const targetIdx = Math.min(cIdx, nextFloor.nodes.length - 1);
        currNode.connections.push(nextFloor.nodes[targetIdx].id);
        if (targetIdx > 0 && Math.random() > 0.5) {
          currNode.connections.push(nextFloor.nodes[targetIdx - 1].id);
        }
      }
      // Deduplicate connections
      currNode.connections = Array.from(new Set(currNode.connections));
    });

    // Ensure every node in nextFloor is reachable
    nextFloor.nodes.forEach((nextNode, nIdx) => {
      const isReachable = currentFloor.nodes.some(cn => cn.connections.includes(nextNode.id));
      if (!isReachable) {
        const closestCurrent = currentFloor.nodes[Math.min(nIdx, currentFloor.nodes.length - 1)];
        closestCurrent.connections.push(nextNode.id);
      }
    });
  }

  return map;
}
