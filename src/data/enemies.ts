import { Enemy } from '../types/game';

export const STANDARD_ENEMIES: Omit<Enemy, 'id' | 'currentHp' | 'block' | 'currentIntentIndex' | 'statuses'>[] = [
  {
    name: '사이버 하운드',
    title: '정찰용 바이오 메카',
    lore: '고속으로 접근하여 날카로운 티타늄 이빨로 물어뜯습니다.',
    maxHp: 38,
    colorTheme: 'cyan',
    mechanic_name: '신속 돌진',
    mechanic_desc: '첫 턴에 높은 기동력으로 선제 공격을 감행합니다.',
    intents: [
      { type: 'ATTACK', value: 8, desc: '고속 물어뜯기 (8 피해)' },
      { type: 'ATTACK_DEBUFF', value: 6, debuff: 'WEAK', desc: '위협의 하울링 (6 피해 + 약화 1턴)' },
      { type: 'ATTACK', value: 11, desc: '도약 강타 (11 피해)' },
      { type: 'DEFEND', value: 8, desc: '방호 자세 (8 방어)' }
    ]
  },
  {
    name: '폭주 드론 V-7',
    title: '자율형 감시 병기',
    lore: '시스템 결함으로 모든 유기체를 침입자로 식별하고 레이저를 난사합니다.',
    maxHp: 44,
    colorTheme: 'amber',
    mechanic_name: '에너지 충전',
    mechanic_desc: '주기적으로 방어막을 전개하고 레이저를 증폭합니다.',
    intents: [
      { type: 'ATTACK', value: 7, desc: '펄스 레이저 (7 피해)' },
      { type: 'DEFEND_BUFF', value: 9, buff: 'STRENGTH_1', desc: '실드 충전 (9 방어 + 공격력 1 증가)' },
      { type: 'HEAVY_ATTACK', value: 14, desc: '과충전 집속 광선 (14 피해)' }
    ]
  },
  {
    name: '보이드 센트리',
    title: '공허의 파수꾼',
    lore: '차원의 틈새를 지키며 공간 왜곡 방어막을 끊임없이 복구합니다.',
    maxHp: 52,
    colorTheme: 'purple',
    mechanic_name: '위상 왜곡',
    mechanic_desc: '높은 방어력을 상시 유지하며 방심한 틈에 침식 공격을 가합니다.',
    intents: [
      { type: 'DEFEND', value: 12, desc: '공간 장벽 (12 방어)' },
      { type: 'ATTACK_DEBUFF', value: 9, debuff: 'VULNERABLE', desc: '차원 침식 (9 피해 + 취약 2턴)' },
      { type: 'ATTACK', value: 13, desc: '보이드 슬래시 (13 피해)' }
    ]
  },
  {
    name: '양자 골렘',
    title: '고대 나노 집합체',
    lore: '수십만 개의 나노 블록이 결합하여 육중한 파괴력을 행사합니다.',
    maxHp: 65,
    colorTheme: 'crimson',
    mechanic_name: '육중한 장갑',
    mechanic_desc: '공격력과 체력이 높지만 행동 템포가 정직합니다.',
    intents: [
      { type: 'ATTACK', value: 10, desc: '헤비 스톰프 (10 피해)' },
      { type: 'HEAVY_ATTACK', value: 18, desc: '양자 파쇄격 (18 대미지)' },
      { type: 'DEFEND_BUFF', value: 14, buff: 'STRENGTH_2', desc: '나노 경화 (14 방어 + 힘 2)' }
    ]
  }
];

export function createEnemyForFloor(floor: number, isElite: boolean = false, isBoss: boolean = false): Enemy {
  if (isBoss) {
    return {
      id: `boss_${floor}_${Date.now()}`,
      name: '차원 지배자 크로노스-Ω',
      title: '시공간의 단절된 관리자',
      lore: '차원의 왜곡 지점에 서식하는 초인공지능 코어로, 플레이어의 전술을 실시간 분석합니다.',
      maxHp: 210,
      currentHp: 210,
      block: 0,
      isBoss: true,
      colorTheme: 'purple',
      mechanic_name: '차원 과부하',
      mechanic_desc: '주기적으로 파괴적인 전체 폭격과 강화 방벽을 번갈아 전개합니다.',
      intents: [
        { type: 'ATTACK', value: 16, desc: '차원 파쇄 광선 (16 피해)' },
        { type: 'DEFEND_BUFF', value: 15, buff: 'STRENGTH_2', desc: '양자 방벽 (15 방어) 및 힘 2 증가' },
        { type: 'ATTACK_DEBUFF', value: 14, debuff: 'VULNERABLE', desc: '양자 침식 (14 피해 + 취약 2턴)' },
        { type: 'HEAVY_ATTACK', value: 25, desc: '시공간 붕괴 폭격 (25 치명타 피해!)' }
      ],
      currentIntentIndex: 0,
      statuses: { vulnerable: 0, weak: 0, poison: 0, strength: 0, thorns: 0 }
    };
  }

  if (isElite) {
    return {
      id: `elite_${floor}_${Date.now()}`,
      name: '사이퍼 나이트 (Cypher Knight)',
      title: '가변 장갑의 엘리트 경비병',
      lore: '플레이어의 연타 공세를 역이용하기 위해 설계된 방어형 킬러 안드로이드입니다.',
      maxHp: 95 + floor * 3,
      currentHp: 95 + floor * 3,
      block: 0,
      isElite: true,
      colorTheme: 'amber',
      mechanic_name: '반작용 장갑',
      mechanic_desc: '피격 시 반사 대미지를 유발하는 가시 상태를 지니고 있습니다.',
      intents: [
        { type: 'ATTACK', value: 13, desc: '플라즈마 블레이드 (13 피해)' },
        { type: 'DEFEND', value: 12, desc: '티타늄 실드 (12 방어)' },
        { type: 'ATTACK_DEBUFF', value: 11, debuff: 'WEAK', desc: '마비 충격 (11 피해 + 약화 2턴)' },
        { type: 'HEAVY_ATTACK', value: 19, desc: '오버드라이브 일격 (19 피해)' }
      ],
      currentIntentIndex: 0,
      statuses: { vulnerable: 0, weak: 0, poison: 0, strength: 0, thorns: 2 }
    };
  }

  const base = STANDARD_ENEMIES[Math.floor(Math.random() * STANDARD_ENEMIES.length)];
  const hpBonus = Math.floor(floor * 2.5);

  return {
    id: `enemy_${floor}_${Date.now()}`,
    name: base.name,
    title: base.title,
    lore: base.lore,
    maxHp: base.maxHp + hpBonus,
    currentHp: base.maxHp + hpBonus,
    block: 0,
    colorTheme: base.colorTheme,
    mechanic_name: base.mechanic_name,
    mechanic_desc: base.mechanic_desc,
    intents: base.intents,
    currentIntentIndex: 0,
    statuses: { vulnerable: 0, weak: 0, poison: 0, strength: 0, thorns: 0 }
  };
}
