import { Relic } from '../types/game';

export const ALL_RELICS: Relic[] = [
  {
    id: 'relic_quantum_core',
    name: '양자 코어',
    nameEn: 'Quantum Core',
    rarity: 'BOSS',
    icon: '⚡',
    description: '매 전투 시작 시 에너지를 +1 추가로 얻습니다 (최대 4 에너지).',
    flavorText: '시공간 축소 입자가 끝없는 에너지를 무선 공급합니다.'
  },
  {
    id: 'relic_preserved_anchor',
    name: '위상 고정 닻',
    nameEn: 'Phase Anchor',
    rarity: 'COMMON',
    icon: '⚓',
    description: '전투 시작 시 방어도를 10 얻습니다.',
    flavorText: '전장에 진입하는 순간 단단한 중력 결계를 펼칩니다.'
  },
  {
    id: 'relic_nanite_injector',
    name: '나노 자가치유기',
    nameEn: 'Nanite Injector',
    rarity: 'COMMON',
    icon: '💉',
    description: '전투 승리 시 체력을 6 회복합니다.',
    flavorText: '적의 파괴된 부품에서 유기 나노 물질을 추출해 신체를 수복합니다.'
  },
  {
    id: 'relic_midas_chip',
    name: '마이더스 암호화 칩',
    nameEn: 'Midas Cipher Chip',
    rarity: 'UNCOMMON',
    icon: '🪙',
    description: '전투 승리 시 획득하는 골드가 50% 증가합니다.',
    flavorText: '암호화폐 거래 프로토콜을 해킹하여 전리품을 배로 증폭합니다.'
  },
  {
    id: 'relic_chrono_gear',
    name: '시간 왜곡 태엽',
    nameEn: 'Chrono Gear',
    rarity: 'UNCOMMON',
    icon: '⏱️',
    description: '1턴째에 카드를 2장 추가로 뽑습니다 (총 7장).',
    flavorText: '전투 초반 지각 능력을 수 초 앞당겨 대응합니다.'
  },
  {
    id: 'relic_spiked_plating',
    name: '가시 가변 장갑',
    nameEn: 'Spiked Reactive Armor',
    rarity: 'UNCOMMON',
    icon: '🛡️',
    description: '전투 시작 시 가시 3을 얻습니다 (피격 시 적에게 3 반사 피해).',
    flavorText: '적의 공격이 닿는 즉시 역방향 플라즈마 스파크를 방출합니다.'
  },
  {
    id: 'relic_singularity_gem',
    name: '특이점의 파편',
    nameEn: 'Singularity Shard',
    rarity: 'RARE',
    icon: '🔮',
    description: '전투 시작 시 적에게 취약 2와 약화 2를 부여합니다.',
    flavorText: '적의 전술 시스템에 진폭 오류를 유도합니다.'
  },
  {
    id: 'relic_blood_vial',
    name: '인공 생체 앰플',
    nameEn: 'Bio Synthesizer',
    rarity: 'COMMON',
    icon: '🧪',
    description: '매 턴 시작 시 방어도를 3 얻습니다.',
    flavorText: '미세한 역장이 끊김 없이 지속 방호합니다.'
  },
  {
    id: 'relic_ai_compass',
    name: 'Gemini 의식 나침반',
    nameEn: 'AI Consciousness Compass',
    rarity: 'RARE',
    icon: '👁️',
    description: 'AI 이벤트 노드에서 주어지는 보상이 크게 증폭됩니다.',
    flavorText: '차원 너머의 초인공지능과 감응하는 양자 송수신기.'
  },
  {
    id: 'relic_adrenal_stim',
    name: '아드레날린 오버클러커',
    nameEn: 'Adrenaline Overclocker',
    rarity: 'RARE',
    icon: '💊',
    description: '체력이 50% 이하로 떨어지면 힘 3과 민첩 3을 즉시 얻습니다.',
    flavorText: '생체 위험 신호에 반응하여 전투 능력을 극대화합니다.'
  },
  {
    id: 'relic_mirror_shield',
    name: '반사 거울 배리어',
    nameEn: 'Reflective Mirror',
    rarity: 'BOSS',
    icon: '🪞',
    description: '턴 종료 시 남은 방어도가 사라지지 않고 절반이 다음 턴으로 보존됩니다.',
    flavorText: '형성된 방어 역장을 폐기하지 않고 축적합니다.'
  },
  {
    id: 'relic_void_stone',
    name: '공허의 심장',
    nameEn: 'Void Heart',
    rarity: 'BOSS',
    icon: '🖤',
    description: '최대 체력이 +20 증가하고 즉시 20을 회복합니다.',
    flavorText: '공허의 본질을 코어에 주입하여 그릇을 확장합니다.'
  }
];

export function getRandomRelic(excludeIds: string[] = []): Relic {
  const available = ALL_RELICS.filter(r => !excludeIds.includes(r.id));
  if (available.length === 0) return ALL_RELICS[0];
  const idx = Math.floor(Math.random() * available.length);
  return available[idx];
}
