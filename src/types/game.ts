export type CardType = 'ATTACK' | 'SKILL' | 'POWER';
export type CardRarity = 'STARTER' | 'COMMON' | 'UNCOMMON' | 'RARE' | 'ANOMALY';

export interface Card {
  id: string;
  name: string;
  nameEn: string;
  cost: number;
  type: CardType;
  rarity: CardRarity;
  description: string;
  damage?: number;
  block?: number;
  hits?: number;
  draw?: number;
  energyGain?: number;
  vulnerable?: number; // turns of vulnerable to enemy
  weak?: number; // turns of weak to enemy
  poison?: number; // stacks of poison
  strength?: number; // player strength gain
  dexterity?: number; // player dexterity gain
  thorns?: number; // player thorns gain
  heal?: number; // direct heal
  specialEffect?: string;
  isUpgraded?: boolean;
  lore?: string;
}

export interface Relic {
  id: string;
  name: string;
  nameEn: string;
  description: string;
  rarity: 'COMMON' | 'UNCOMMON' | 'RARE' | 'BOSS';
  icon: string;
  flavorText: string;
  // Trigger hooks
  onCombatStart?: (state: PlayerState) => Partial<PlayerState>;
  onTurnStart?: (state: PlayerState) => Partial<PlayerState>;
  onVictory?: (state: PlayerState) => Partial<PlayerState>;
  onCardPlay?: (card: Card, state: PlayerState) => Partial<PlayerState>;
}

export type IntentType = 
  | 'ATTACK' 
  | 'DEFEND' 
  | 'BUFF' 
  | 'DEBUFF' 
  | 'ATTACK_DEBUFF' 
  | 'DEFEND_BUFF' 
  | 'HEAVY_ATTACK';

export interface EnemyIntent {
  type: IntentType;
  value: number;
  buff?: string;
  debuff?: string;
  desc: string;
}

export interface Enemy {
  id: string;
  name: string;
  title?: string;
  lore?: string;
  maxHp: number;
  currentHp: number;
  block: number;
  intents: EnemyIntent[];
  currentIntentIndex: number;
  statuses: {
    vulnerable: number;
    weak: number;
    poison: number;
    strength: number;
    thorns: number;
  };
  mechanic_name?: string;
  mechanic_desc?: string;
  colorTheme?: string;
  isElite?: boolean;
  isBoss?: boolean;
}

export interface PlayerState {
  hp: number;
  maxHp: number;
  block: number;
  energy: number;
  maxEnergy: number;
  gold: number;
  deck: Card[];
  drawPile: Card[];
  hand: Card[];
  discardPile: Card[];
  relics: Relic[];
  statuses: {
    vulnerable: number;
    weak: number;
    poison: number;
    strength: number;
    dexterity: number;
    thorns: number;
  };
}

export type NodeType = 'COMBAT' | 'ELITE' | 'SHOP' | 'CAMPFIRE' | 'EVENT' | 'BOSS';

export interface MapNode {
  id: string;
  floor: number;
  type: NodeType;
  connections: string[]; // target node ids in floor + 1
  label: string;
}

export interface GameEventChoice {
  id: number;
  text: string;
  effect: {
    type: 'HP_COST' | 'HP_GAIN' | 'GOLD_GAIN' | 'GOLD_COST' | 'MAX_HP_GAIN' | 'NONE';
    value: number;
    reward_card?: boolean;
    reward_relic?: boolean;
    remove_card?: boolean;
    upgrade_card?: boolean;
  };
}

export interface GameEvent {
  event_title: string;
  narrative: string;
  choices: GameEventChoice[];
}

export interface CombatFloatingText {
  id: string;
  text: string;
  color: string;
  target: 'player' | 'enemy';
}

export interface RunStats {
  floorsCleared: number;
  enemiesDefeated: number;
  cardsPlayed: number;
  damageDealt: number;
  goldEarned: number;
}
