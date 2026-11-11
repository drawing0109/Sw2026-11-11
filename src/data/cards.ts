import { Card } from '../types/game';

export const STARTER_DECK: Card[] = [
  {
    id: 'starter_strike_1',
    name: '차원 타격',
    nameEn: 'Dimension Strike',
    cost: 1,
    type: 'ATTACK',
    rarity: 'STARTER',
    description: '적에게 6의 피해를 줍니다.',
    damage: 6,
    lore: '차원의 미세한 균열을 칼날 삼아 휘두릅니다.'
  },
  {
    id: 'starter_strike_2',
    name: '차원 타격',
    nameEn: 'Dimension Strike',
    cost: 1,
    type: 'ATTACK',
    rarity: 'STARTER',
    description: '적에게 6의 피해를 줍니다.',
    damage: 6,
    lore: '차원의 미세한 균열을 칼날 삼아 휘두릅니다.'
  },
  {
    id: 'starter_strike_3',
    name: '차원 타격',
    nameEn: 'Dimension Strike',
    cost: 1,
    type: 'ATTACK',
    rarity: 'STARTER',
    description: '적에게 6의 피해를 줍니다.',
    damage: 6,
    lore: '차원의 미세한 균열을 칼날 삼아 휘두릅니다.'
  },
  {
    id: 'starter_strike_4',
    name: '차원 타격',
    nameEn: 'Dimension Strike',
    cost: 1,
    type: 'ATTACK',
    rarity: 'STARTER',
    description: '적에게 6의 피해를 줍니다.',
    damage: 6,
    lore: '차원의 미세한 균열을 칼날 삼아 휘두릅니다.'
  },
  {
    id: 'starter_defend_1',
    name: '에너지 방벽',
    nameEn: 'Energy Barrier',
    cost: 1,
    type: 'SKILL',
    rarity: 'STARTER',
    description: '방어도를 5 얻습니다.',
    block: 5,
    lore: '신체 주위에 역장을 형성해 충격을 분산합니다.'
  },
  {
    id: 'starter_defend_2',
    name: '에너지 방벽',
    nameEn: 'Energy Barrier',
    cost: 1,
    type: 'SKILL',
    rarity: 'STARTER',
    description: '방어도를 5 얻습니다.',
    block: 5,
    lore: '신체 주위에 역장을 형성해 충격을 분산합니다.'
  },
  {
    id: 'starter_defend_3',
    name: '에너지 방벽',
    nameEn: 'Energy Barrier',
    cost: 1,
    type: 'SKILL',
    rarity: 'STARTER',
    description: '방어도를 5 얻습니다.',
    block: 5,
    lore: '신체 주위에 역장을 형성해 충격을 분산합니다.'
  },
  {
    id: 'starter_defend_4',
    name: '에너지 방벽',
    nameEn: 'Energy Barrier',
    cost: 1,
    type: 'SKILL',
    rarity: 'STARTER',
    description: '방어도를 5 얻습니다.',
    block: 5,
    lore: '신체 주위에 역장을 형성해 충격을 분산합니다.'
  },
  {
    id: 'starter_bash',
    name: '위상 강타',
    nameEn: 'Phase Bash',
    cost: 2,
    type: 'ATTACK',
    rarity: 'STARTER',
    description: '적에게 8의 피해를 주고 취약 2를 부여합니다.',
    damage: 8,
    vulnerable: 2,
    lore: '공간의 압력을 뭉쳐 적의 방호 체계를 무너뜨립니다.'
  },
  {
    id: 'starter_recharge',
    name: '나노 수복',
    nameEn: 'Nanite Repair',
    cost: 0,
    type: 'SKILL',
    rarity: 'STARTER',
    description: '방어도를 4 얻고 카드 1장을 뽑습니다.',
    block: 4,
    draw: 1,
    lore: '나노머신을 긴급 방출하여 틈새를 메웁니다.'
  }
];

export const CARD_POOL: Omit<Card, 'id'>[] = [
  // COMMON ATTACKS
  {
    name: '신속 찌르기',
    nameEn: 'Swift Thrust',
    cost: 1,
    type: 'ATTACK',
    rarity: 'COMMON',
    description: '적에게 9의 피해를 줍니다.',
    damage: 9,
    lore: '군더더기 없는 정밀한 고속 일격.'
  },
  {
    name: '연쇄 베기',
    nameEn: 'Twin Slash',
    cost: 1,
    type: 'ATTACK',
    rarity: 'COMMON',
    description: '적에게 5의 피해를 2회 줍니다.',
    damage: 5,
    hits: 2,
    lore: '양손의 플라즈마 블레이드로 교차 절단합니다.'
  },
  {
    name: '충격파',
    nameEn: 'Shockwave Pulse',
    cost: 1,
    type: 'ATTACK',
    rarity: 'COMMON',
    description: '적에게 7의 피해를 주고 약화 1을 부여합니다.',
    damage: 7,
    weak: 1,
    lore: '적의 공격 모터를 순간 마비시킵니다.'
  },
  {
    name: '부식 탄환',
    nameEn: 'Corrosive Round',
    cost: 1,
    type: 'ATTACK',
    rarity: 'COMMON',
    description: '적에게 6의 피해를 주고 나노 독 3을 중첩합니다.',
    damage: 6,
    poison: 3,
    lore: '장갑을 뚫고 내부 회로를 녹아내리게 합니다.'
  },

  // COMMON SKILLS
  {
    name: '강화 실드',
    nameEn: 'Reinforced Shield',
    cost: 1,
    type: 'SKILL',
    rarity: 'COMMON',
    description: '방어도를 8 얻습니다.',
    block: 8,
    lore: '격자형 에너지 실드를 강화합니다.'
  },
  {
    name: '회피 기동',
    nameEn: 'Evasive Maneuver',
    cost: 1,
    type: 'SKILL',
    rarity: 'COMMON',
    description: '방어도를 6 얻고 카드 1장을 뽑습니다.',
    block: 6,
    draw: 1,
    lore: '공간 도약으로 적의 궤적에서 벗어납니다.'
  },
  {
    name: '배터리 오버차지',
    nameEn: 'Overcharge Battery',
    cost: 0,
    type: 'SKILL',
    rarity: 'COMMON',
    description: '에너지를 1 얻고, 카드 1장을 뽑습니다.',
    energyGain: 1,
    draw: 1,
    lore: '예비 동력을 연소시켜 즉각적인 출력을 얻습니다.'
  },

  // UNCOMMON
  {
    name: '방패 밀치기',
    nameEn: 'Shield Slam',
    cost: 2,
    type: 'ATTACK',
    rarity: 'UNCOMMON',
    description: '현재 보유한 방어도만큼 적에게 피해를 줍니다.',
    damage: 0,
    specialEffect: 'SHIELD_SLAM',
    lore: '응축된 방어 필드를 정면으로 부딪쳐 폭발시킵니다.'
  },
  {
    name: '맹독 확산',
    nameEn: 'Toxic Outbreak',
    cost: 2,
    type: 'SKILL',
    rarity: 'UNCOMMON',
    description: '적에게 나노 독 7을 중첩하고 취약 2를 부여합니다.',
    poison: 7,
    vulnerable: 2,
    lore: '치명적인 나노 감염체를 전방위 살포합니다.'
  },
  {
    name: '오버클럭 프로토콜',
    nameEn: 'Overclock Protocol',
    cost: 0,
    type: 'SKILL',
    rarity: 'UNCOMMON',
    description: '에너지를 2 얻지만 체력을 3 소모합니다.',
    energyGain: 2,
    heal: -3,
    lore: '생체 코어의 안전장치를 해제하고 과부하를 유도합니다.'
  },
  {
    name: '흡혈의 칼날',
    nameEn: 'Vampiric Edge',
    cost: 1,
    type: 'ATTACK',
    rarity: 'UNCOMMON',
    description: '적에게 10의 피해를 주고 체력을 3 회복합니다.',
    damage: 10,
    heal: 3,
    lore: '적의 생체 에너지를 흡수하여 코어를 재구축합니다.'
  },
  {
    name: '반작용 가시 장갑',
    nameEn: 'Reactive Thorns',
    cost: 1,
    type: 'POWER',
    rarity: 'UNCOMMON',
    description: '가시 3을 획득합니다 (피격 시 적에게 피해 반사).',
    thorns: 3,
    lore: '장갑 표면에 고압 아크 방전기를 장착합니다.'
  },
  {
    name: '전술 최적화',
    nameEn: 'Tactical Refine',
    cost: 1,
    type: 'SKILL',
    rarity: 'UNCOMMON',
    description: '카드 3장을 뽑습니다.',
    draw: 3,
    lore: 'AI 프로세서가 최적의 전투 경로 3가지를 예측합니다.'
  },
  {
    name: '중력 붕괴',
    nameEn: 'Gravitational Collapse',
    cost: 2,
    type: 'ATTACK',
    rarity: 'UNCOMMON',
    description: '적에게 18의 피해를 줍니다.',
    damage: 18,
    lore: '국소 중력을 급격히 왜곡시켜 대상을 압착합니다.'
  },

  // RARE
  {
    name: '에이펙스 블레이드',
    nameEn: 'Apex Blade',
    cost: 2,
    type: 'ATTACK',
    rarity: 'RARE',
    description: '적에게 24의 강력한 피해를 줍니다.',
    damage: 24,
    lore: '차원의 정점 기술이 집약된 절대 파괴의 일격.'
  },
  {
    name: '절대 영점 방벽',
    nameEn: 'Absolute Zero Dome',
    cost: 2,
    type: 'SKILL',
    rarity: 'RARE',
    description: '방어도를 22 얻고 약화 2를 부여합니다.',
    block: 22,
    weak: 2,
    lore: '분자 운동을 정지시켜 그 어떤 충격도 동결합니다.'
  },
  {
    name: '인공지능 가속기',
    nameEn: 'AI Core Accelerator',
    cost: 3,
    type: 'POWER',
    rarity: 'RARE',
    description: '힘 2, 민첩 2를 영구히 획득합니다.',
    strength: 2,
    dexterity: 2,
    lore: 'Gemini 코어와 직접 신경망을 동기화합니다.'
  },
  {
    name: '나노 카타스트로피',
    nameEn: 'Nanite Catastrophe',
    cost: 2,
    type: 'SKILL',
    rarity: 'RARE',
    description: '적의 나노 독 수치를 2배로 증폭시킵니다.',
    specialEffect: 'DOUBLE_POISON',
    lore: '체내의 모든 나노 독을 동시에 기폭시킵니다.'
  },
  {
    name: '시공간 루프',
    nameEn: 'Chrono Loop',
    cost: 1,
    type: 'SKILL',
    rarity: 'RARE',
    description: '에너지를 2 얻고 카드 2장을 뽑습니다.',
    energyGain: 2,
    draw: 2,
    lore: '과거의 유리했던 시간대로 짧게 역행합니다.'
  }
];

export function upgradeCard(card: Card): Card {
  if (card.isUpgraded) return card;

  return {
    ...card,
    id: `${card.id}+`,
    name: `${card.name}+`,
    nameEn: `${card.nameEn}+`,
    isUpgraded: true,
    damage: card.damage ? Math.round(card.damage * 1.4) : undefined,
    block: card.block ? Math.round(card.block * 1.4) : undefined,
    hits: card.hits,
    draw: card.draw ? card.draw + 1 : undefined,
    energyGain: card.energyGain ? card.energyGain + 1 : undefined,
    vulnerable: card.vulnerable ? card.vulnerable + 1 : undefined,
    weak: card.weak ? card.weak + 1 : undefined,
    poison: card.poison ? Math.round(card.poison * 1.5) : undefined,
    strength: card.strength ? card.strength + 1 : undefined,
    dexterity: card.dexterity ? card.dexterity + 1 : undefined,
    thorns: card.thorns ? card.thorns + 2 : undefined,
    cost: card.cost > 1 && Math.random() > 0.6 ? card.cost - 1 : card.cost,
    description: getUpgradedDescription(card)
  };
}

function getUpgradedDescription(card: Card): string {
  let desc = card.description;
  if (card.damage) {
    const newDmg = Math.round(card.damage * 1.4);
    desc = desc.replace(new RegExp(`${card.damage}`, 'g'), `${newDmg}`);
  }
  if (card.block) {
    const newBlk = Math.round(card.block * 1.4);
    desc = desc.replace(new RegExp(`${card.block}`, 'g'), `${newBlk}`);
  }
  if (card.poison) {
    const newPsn = Math.round(card.poison * 1.5);
    desc = desc.replace(new RegExp(`${card.poison}`, 'g'), `${newPsn}`);
  }
  return desc;
}

export function getRandomCardReward(count: number = 3): Card[] {
  const selected: Card[] = [];
  const pool = [...CARD_POOL];

  for (let i = 0; i < count; i++) {
    if (pool.length === 0) break;
    const randIdx = Math.floor(Math.random() * pool.length);
    const item = pool.splice(randIdx, 1)[0];
    selected.push({
      id: `card_reward_${Date.now()}_${i}_${Math.random().toString(36).substring(2, 6)}`,
      ...item
    });
  }
  return selected;
}

export function analyzeDeckArchetype(deck: Card[]): { archetype: string; topCards: string[] } {
  let attackCount = 0;
  let skillCount = 0;
  let poisonCount = 0;
  let highCostCount = 0;

  deck.forEach(c => {
    if (c.type === 'ATTACK') attackCount++;
    if (c.type === 'SKILL') skillCount++;
    if (c.poison && c.poison > 0) poisonCount++;
    if (c.cost >= 2) highCostCount++;
  });

  const topCards = deck.slice(0, 5).map(c => c.name);

  if (poisonCount >= 3) {
    return { archetype: '나노 바이오 해저드 (지속 독뎀 & 침식)', topCards };
  }
  if (attackCount > skillCount * 1.5) {
    return { archetype: '폭풍 연타형 초공격 (Hyper Aggro)', topCards };
  }
  if (skillCount > attackCount * 1.3) {
    return { archetype: '철벽 방어 및 반격 (Iron Fortress)', topCards };
  }
  if (highCostCount >= 4) {
    return { archetype: '고출력 특이점 한방 (High Impact)', topCards };
  }
  return { archetype: '전술적 밸런스 덱 (Tactical Balanced)', topCards };
}
