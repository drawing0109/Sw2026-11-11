import { GameEvent, Enemy, Card } from '../types/game';

export interface EventRequestParams {
  floor: number;
  hp: number;
  maxHp: number;
  gold: number;
  deckArchetype: string;
  cardCount: number;
  relics: string[];
}

export interface BossRequestParams {
  floor: number;
  isBoss: boolean;
  deckArchetype: string;
  topCards: string[];
  hp: number;
  relics: string[];
}

export interface CommentaryParams {
  enemyName: string;
  turns: number;
  hpRemaining: number;
  maxHp: number;
  damageTaken: number;
  cardsPlayed: number;
}

export interface CardForgeParams {
  playerArchetype: string;
  currentDeckKeywords: string[];
  playerWish?: string;
}

export async function checkAiStatus(): Promise<{ hasKey: boolean; model: string }> {
  try {
    const res = await fetch('/api/ai/status');
    if (res.ok) {
      return await res.json();
    }
  } catch (e) {
    console.warn('AI status check failed:', e);
  }
  return { hasKey: false, model: 'procedural' };
}

export async function fetchAiEvent(params: EventRequestParams): Promise<GameEvent> {
  try {
    const res = await fetch('/api/gemini/event', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    });
    if (res.ok) {
      return await res.json();
    }
  } catch (err) {
    console.error('Failed to fetch AI event, using procedural fallback:', err);
  }

  // Fallback
  return {
    event_title: '잊혀진 연금술사의 나노 공방',
    narrative: '당신은 기이한 보라색 연기가 피어오르는 버려진 공방에 들어섰다. 구석에 불안정하게 흔들리는 마나 항아리가 보인다.',
    choices: [
      {
        id: 1,
        text: '손을 넣어 마나의 힘을 흡수한다. (체력 10 소모, 무작위 카드 1장 획득)',
        effect: { type: 'HP_COST', value: 10, reward_card: true }
      },
      {
        id: 2,
        text: '항아리를 조심스럽게 해체하여 골드를 챙긴다. (골드 50 획득)',
        effect: { type: 'GOLD_GAIN', value: 50 }
      },
      {
        id: 3,
        text: '위험해 보이므로 무시하고 지나친다. (변화 없음)',
        effect: { type: 'NONE', value: 0 }
      }
    ]
  };
}

export async function fetchAiBoss(params: BossRequestParams): Promise<Partial<Enemy> & { hp?: number }> {
  try {
    const res = await fetch('/api/gemini/boss', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    });
    if (res.ok) {
      return await res.json();
    }
  } catch (err) {
    console.error('Failed to fetch AI boss, using default:', err);
  }

  return {
    name: params.isBoss ? '차원 왜곡자 말로스-Ω' : '사이퍼 가디언',
    title: params.isBoss ? '시공간의 단절된 관리자' : '보이드 수호자',
    lore: `플레이어의 ${params.deckArchetype} 성향을 분석하고 카운터 전술을 전개합니다.`,
    mechanic_name: '위상 왜곡 장갑',
    mechanic_desc: '피격 시 반동으로 공격자에게 가시 피해를 입힙니다.',
  };
}

export async function fetchAiCommentary(params: CommentaryParams): Promise<string> {
  try {
    const res = await fetch('/api/gemini/commentary', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    });
    if (res.ok) {
      const data = await res.json();
      if (data.commentary) return data.commentary;
    }
  } catch (err) {
    console.error('Failed to fetch AI commentary:', err);
  }

  const quotes = [
    `차원의 감시관: "적절한 전술적 판단이었다. ${params.enemyName}의 잔해가 데이터 그리드로 흡수된다."`,
    `차원의 감시관: "체력 ${params.hpRemaining}/${params.maxHp}을 보존한 인상적인 승리로군. 에너지 파동이 너를 강화한다."`,
    `차원의 감시관: "${params.turns}턴 만에 적의 저항을 깔끔히 분쇄했다."`
  ];
  return quotes[Math.floor(Math.random() * quotes.length)];
}

export async function fetchAiCardForge(params: CardForgeParams): Promise<Card> {
  try {
    const res = await fetch('/api/gemini/card-forge', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    });
    if (res.ok) {
      const card = await res.json();
      if (card && card.name) {
        return card;
      }
    }
  } catch (err) {
    console.error('Failed to forge card with AI:', err);
  }

  return {
    id: `forge_${Date.now()}`,
    name: '특이점 수렴',
    nameEn: 'Singularity Convergence',
    cost: 1,
    type: 'SKILL',
    rarity: 'ANOMALY',
    description: '방어도를 12 얻고 다음 공격 카드의 피해량이 50% 증가합니다.',
    block: 12,
    lore: '차원 코어가 압축 연산해낸 특이점 결정체.'
  };
}
