/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import {
  PlayerState,
  Enemy,
  MapNode,
  Card,
  Relic,
  GameEvent,
  GameEventChoice,
  CombatFloatingText,
  RunStats,
} from './types/game';
import { STARTER_DECK, getRandomCardReward, upgradeCard, analyzeDeckArchetype } from './data/cards';
import { ALL_RELICS, getRandomRelic } from './data/relics';
import { createEnemyForFloor } from './data/enemies';
import { generateRunMap, MapFloor } from './utils/mapGenerator';
import {
  checkAiStatus,
  fetchAiEvent,
  fetchAiBoss,
  fetchAiCommentary,
  fetchAiCardForge,
} from './services/aiService';
import { sounds } from './services/soundService';

import { TopBar } from './components/TopBar';
import { MapView } from './components/MapView';
import { CombatView } from './components/CombatView';
import { EventModal } from './components/EventModal';
import { RewardModal } from './components/RewardModal';
import { ShopModal } from './components/ShopModal';
import { CampfireModal } from './components/CampfireModal';
import { DeckViewerModal } from './components/DeckViewerModal';
import { GameOverModal } from './components/GameOverModal';

type GameScreen = 'MAP' | 'COMBAT' | 'REWARD' | 'EVENT' | 'SHOP' | 'CAMPFIRE' | 'GAME_OVER';

const MAX_FLOORS = 15;

export default function App() {
  // Game Navigation & State
  const [screen, setScreen] = useState<GameScreen>('MAP');
  const [map, setMap] = useState<MapFloor[]>(() => generateRunMap(MAX_FLOORS));
  const [currentFloor, setCurrentFloor] = useState<number>(0);
  const [currentNodeId, setCurrentNodeId] = useState<string | null>(null);

  // Player State
  const [player, setPlayer] = useState<PlayerState>(() => ({
    hp: 75,
    maxHp: 75,
    block: 0,
    energy: 3,
    maxEnergy: 3,
    gold: 99,
    deck: [...STARTER_DECK],
    drawPile: [],
    hand: [],
    discardPile: [],
    relics: [ALL_RELICS[1]], // starts with Phase Anchor (10 block at start)
    statuses: { vulnerable: 0, weak: 0, poison: 0, strength: 0, dexterity: 0, thorns: 0 },
  }));

  // Combat State
  const [enemy, setEnemy] = useState<Enemy | null>(null);
  const [isPlayerTurn, setIsPlayerTurn] = useState<boolean>(true);
  const [floatingTexts, setFloatingTexts] = useState<CombatFloatingText[]>([]);
  const [combatLog, setCombatLog] = useState<string[]>([]);
  const [combatTurnCount, setCombatTurnCount] = useState<number>(1);
  const [damageTakenInCombat, setDamageTakenInCombat] = useState<number>(0);
  const [cardsPlayedInCombat, setCardsPlayedInCombat] = useState<number>(0);

  // AI & Modals
  const [aiStatus, setAiStatus] = useState<{ hasKey: boolean; model: string }>({ hasKey: false, model: 'procedural' });
  const [currentEvent, setCurrentEvent] = useState<GameEvent | null>(null);
  const [isEventLoading, setIsEventLoading] = useState<boolean>(false);
  const [aiCommentary, setAiCommentary] = useState<string>('');

  // Rewards State
  const [goldReward, setGoldReward] = useState<number>(25);
  const [cardChoices, setCardChoices] = useState<Card[]>([]);
  const [relicReward, setRelicReward] = useState<Relic | null>(null);
  const [goldClaimed, setGoldClaimed] = useState<boolean>(false);
  const [relicClaimed, setRelicClaimed] = useState<boolean>(false);
  const [cardChosen, setCardChosen] = useState<boolean>(false);

  // Shop State
  const [shopCards, setShopCards] = useState<{ card: Card; price: number; bought: boolean }[]>([]);
  const [shopRelics, setShopRelics] = useState<{ relic: Relic; price: number; bought: boolean }[]>([]);
  const [removalPrice, setRemovalPrice] = useState<number>(75);
  const [hasRemovedCardInShop, setHasRemovedCardInShop] = useState<boolean>(false);

  // Modals & Deck Inspection
  const [deckViewerMode, setDeckViewerMode] = useState<'view' | 'remove' | 'upgrade' | null>(null);
  const [deckViewerPile, setDeckViewerPile] = useState<'deck' | 'draw' | 'discard'>('deck');
  const [isMapViewOpen, setIsMapViewOpen] = useState<boolean>(false);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);

  // Run Statistics
  const [runStats, setRunStats] = useState<RunStats>({
    floorsCleared: 0,
    enemiesDefeated: 0,
    cardsPlayed: 0,
    damageDealt: 0,
    goldEarned: 0,
  });

  // Check AI availability on mount
  useEffect(() => {
    checkAiStatus().then(setAiStatus);
  }, []);

  // Helper for floating combat text
  const addFloatingText = (text: string, color: string, target: 'player' | 'enemy') => {
    const id = `ft_${Date.now()}_${Math.random()}`;
    setFloatingTexts((prev) => [...prev, { id, text, color, target }]);
    setTimeout(() => {
      setFloatingTexts((prev) => prev.filter((item) => item.id !== id));
    }, 1200);
  };

  // Sound toggle
  const handleToggleSound = () => {
    sounds.enabled = !soundEnabled;
    setSoundEnabled(!soundEnabled);
  };

  // Restart new run
  const handleRestartRun = () => {
    setMap(generateRunMap(MAX_FLOORS));
    setCurrentFloor(0);
    setCurrentNodeId(null);
    setPlayer({
      hp: 75,
      maxHp: 75,
      block: 0,
      energy: 3,
      maxEnergy: 3,
      gold: 99,
      deck: [...STARTER_DECK],
      drawPile: [],
      hand: [],
      discardPile: [],
      relics: [ALL_RELICS[1]],
      statuses: { vulnerable: 0, weak: 0, poison: 0, strength: 0, dexterity: 0, thorns: 0 },
    });
    setRunStats({
      floorsCleared: 0,
      enemiesDefeated: 0,
      cardsPlayed: 0,
      damageDealt: 0,
      goldEarned: 0,
    });
    setScreen('MAP');
  };

  // Node Selection Handler
  const handleSelectNode = async (node: MapNode) => {
    setCurrentFloor(node.floor);
    setCurrentNodeId(node.id);
    setIsMapViewOpen(false);

    if (node.type === 'COMBAT' || node.type === 'ELITE' || node.type === 'BOSS') {
      await startCombat(node.floor, node.type === 'ELITE', node.type === 'BOSS');
    } else if (node.type === 'EVENT') {
      await startEvent(node.floor);
    } else if (node.type === 'SHOP') {
      startShop();
    } else if (node.type === 'CAMPFIRE') {
      setScreen('CAMPFIRE');
    }
  };

  // Start Combat
  const startCombat = async (floor: number, isElite: boolean, isBoss: boolean) => {
    let newEnemy = createEnemyForFloor(floor, isElite, isBoss);

    // If Elite or Boss, use Gemini AI to tailor counter-enemy based on player deck!
    if (isElite || isBoss) {
      const { archetype, topCards } = analyzeDeckArchetype(player.deck);
      const aiBossData = await fetchAiBoss({
        floor,
        isBoss,
        deckArchetype: archetype,
        topCards,
        hp: player.hp,
        relics: player.relics.map((r) => r.name),
      });

      newEnemy = {
        ...newEnemy,
        ...aiBossData,
        currentHp: aiBossData.hp || newEnemy.maxHp,
        maxHp: aiBossData.hp || newEnemy.maxHp,
      };
    }

    // Prepare deck piles
    const shuffled = [...player.deck].sort(() => Math.random() - 0.5);
    const hasQuantumCore = player.relics.some((r) => r.id === 'relic_quantum_core');
    const startEnergy = hasQuantumCore ? 4 : 3;

    // Relic triggers at combat start
    let startBlock = 0;
    let startThorns = 0;
    if (player.relics.some((r) => r.id === 'relic_preserved_anchor')) {
      startBlock += 10;
    }
    if (player.relics.some((r) => r.id === 'relic_spiked_plating')) {
      startThorns += 3;
    }
    if (player.relics.some((r) => r.id === 'relic_singularity_gem')) {
      newEnemy.statuses.vulnerable = 2;
      newEnemy.statuses.weak = 2;
    }

    // Initial draw (5 cards, or 7 if Chrono Gear relic)
    const initialDrawCount = player.relics.some((r) => r.id === 'relic_chrono_gear') ? 7 : 5;
    const hand = shuffled.splice(0, initialDrawCount);

    setEnemy(newEnemy);
    setPlayer((prev) => ({
      ...prev,
      block: startBlock,
      energy: startEnergy,
      maxEnergy: startEnergy,
      drawPile: shuffled,
      hand: hand,
      discardPile: [],
      statuses: {
        vulnerable: 0,
        weak: 0,
        poison: 0,
        strength: 0,
        dexterity: 0,
        thorns: startThorns,
      },
    }));

    setIsPlayerTurn(true);
    setCombatTurnCount(1);
    setDamageTakenInCombat(0);
    setCardsPlayedInCombat(0);
    setCombatLog([`${newEnemy.name}와의 전투 개시!`]);
    setScreen('COMBAT');
  };

  // Card Play Logic
  const handlePlayCard = (card: Card) => {
    if (!enemy || !isPlayerTurn) return;
    if (player.energy < card.cost) return;

    // Spend energy
    setPlayer((prev) => ({
      ...prev,
      energy: prev.energy - card.cost,
      hand: prev.hand.filter((c) => c !== card),
      discardPile: [...prev.discardPile, card],
    }));

    setCardsPlayedInCombat((prev) => prev + 1);
    setRunStats((prev) => ({ ...prev, cardsPlayed: prev.cardsPlayed + 1 }));

    // 1. Calculate Damage
    let damage = card.damage || 0;
    if (card.specialEffect === 'SHIELD_SLAM') {
      damage = player.block;
    }
    if (damage > 0) {
      // Add strength
      damage += player.statuses.strength;
      // Weakness penalty (-25%)
      if (player.statuses.weak > 0) {
        damage = Math.max(1, Math.floor(damage * 0.75));
      }
      // Enemy Vulnerable bonus (+50%)
      if (enemy.statuses.vulnerable > 0) {
        damage = Math.floor(damage * 1.5);
      }

      const hits = card.hits || 1;
      let totalAppliedDamage = 0;

      for (let h = 0; h < hits; h++) {
        totalAppliedDamage += damage;
      }

      sounds.playAttackHit();
      addFloatingText(`-${totalAppliedDamage}`, 'text-red-400', 'enemy');

      // Enemy takes damage
      setEnemy((prev) => {
        if (!prev) return null;
        let remHp = prev.currentHp;
        let remBlock = prev.block;

        if (remBlock >= totalAppliedDamage) {
          remBlock -= totalAppliedDamage;
        } else {
          const leftover = totalAppliedDamage - remBlock;
          remBlock = 0;
          remHp = Math.max(0, remHp - leftover);
        }

        return { ...prev, currentHp: remHp, block: remBlock };
      });

      setRunStats((prev) => ({ ...prev, damageDealt: prev.damageDealt + totalAppliedDamage }));

      // Check enemy thorns
      if (enemy.statuses.thorns > 0) {
        setPlayer((prev) => {
          let pRemHp = prev.hp;
          let pRemBlock = prev.block;
          const thornsDmg = enemy.statuses.thorns;
          if (pRemBlock >= thornsDmg) {
            pRemBlock -= thornsDmg;
          } else {
            pRemHp = Math.max(0, pRemHp - (thornsDmg - pRemBlock));
            pRemBlock = 0;
          }
          addFloatingText(`-${thornsDmg} (가시)`, 'text-amber-400', 'player');
          return { ...prev, hp: pRemHp, block: pRemBlock };
        });
      }
    }

    // 2. Calculate Block
    if (card.block) {
      let blockGain = card.block + player.statuses.dexterity;
      sounds.playShieldBlock();
      setPlayer((prev) => ({ ...prev, block: prev.block + blockGain }));
      addFloatingText(`+${blockGain} 방어도`, 'text-cyan-400', 'player');
    }

    // 3. Status Applications & Debuffs
    if (card.vulnerable) {
      setEnemy((prev) => prev ? { ...prev, statuses: { ...prev.statuses, vulnerable: prev.statuses.vulnerable + card.vulnerable! } } : null);
      addFloatingText(`취약 +${card.vulnerable}`, 'text-rose-400', 'enemy');
    }
    if (card.weak) {
      setEnemy((prev) => prev ? { ...prev, statuses: { ...prev.statuses, weak: prev.statuses.weak + card.weak! } } : null);
      addFloatingText(`약화 +${card.weak}`, 'text-amber-400', 'enemy');
    }
    if (card.poison) {
      setEnemy((prev) => prev ? { ...prev, statuses: { ...prev.statuses, poison: prev.statuses.poison + card.poison! } } : null);
      addFloatingText(`나노독 +${card.poison}`, 'text-emerald-400', 'enemy');
    }
    if (card.specialEffect === 'DOUBLE_POISON' && enemy.statuses.poison > 0) {
      setEnemy((prev) => prev ? { ...prev, statuses: { ...prev.statuses, poison: prev.statuses.poison * 2 } } : null);
      addFloatingText(`독 폭발 2배!`, 'text-emerald-400', 'enemy');
    }

    // 4. Buffs & Heals & Draws
    if (card.strength) {
      setPlayer((prev) => ({ ...prev, statuses: { ...prev.statuses, strength: prev.statuses.strength + card.strength! } }));
    }
    if (card.dexterity) {
      setPlayer((prev) => ({ ...prev, statuses: { ...prev.statuses, dexterity: prev.statuses.dexterity + card.dexterity! } }));
    }
    if (card.thorns) {
      setPlayer((prev) => ({ ...prev, statuses: { ...prev.statuses, thorns: prev.statuses.thorns + card.thorns! } }));
    }
    if (card.heal) {
      if (card.heal > 0) {
        sounds.playHeal();
        setPlayer((prev) => ({ ...prev, hp: Math.min(prev.maxHp, prev.hp + card.heal!) }));
        addFloatingText(`+${card.heal} HP`, 'text-emerald-400', 'player');
      } else {
        // Self damage (Overclock)
        const selfDmg = Math.abs(card.heal);
        setPlayer((prev) => ({ ...prev, hp: Math.max(1, prev.hp - selfDmg) }));
        addFloatingText(`-${selfDmg} 과부하`, 'text-red-400', 'player');
      }
    }
    if (card.energyGain) {
      setPlayer((prev) => ({ ...prev, energy: prev.energy + card.energyGain! }));
    }
    if (card.draw) {
      drawCards(card.draw);
    }
  };

  // Helper to draw N cards from drawPile, reshuffling discardPile if needed
  const drawCards = (count: number) => {
    setPlayer((prev) => {
      let currentDraw = [...prev.drawPile];
      let currentDiscard = [...prev.discardPile];
      let currentHand = [...prev.hand];

      for (let i = 0; i < count; i++) {
        if (currentDraw.length === 0) {
          if (currentDiscard.length === 0) break;
          currentDraw = [...currentDiscard].sort(() => Math.random() - 0.5);
          currentDiscard = [];
        }
        if (currentDraw.length > 0) {
          currentHand.push(currentDraw.shift()!);
          sounds.playDrawCard();
        }
      }

      return {
        ...prev,
        drawPile: currentDraw,
        discardPile: currentDiscard,
        hand: currentHand,
      };
    });
  };

  // Check Victory or Defeat after each state update
  useEffect(() => {
    if (screen !== 'COMBAT' || !enemy) return;

    // Check Enemy Defeated
    if (enemy.currentHp <= 0) {
      handleCombatVictory();
    } else if (player.hp <= 0) {
      // Check Player Defeated
      setScreen('GAME_OVER');
    }
  }, [enemy?.currentHp, player.hp, screen]);

  // Victory Handler
  const handleCombatVictory = async () => {
    if (!enemy) return;

    // Update run stats
    setRunStats((prev) => ({
      ...prev,
      enemiesDefeated: prev.enemiesDefeated + 1,
      floorsCleared: Math.max(prev.floorsCleared, currentFloor),
    }));

    // If Floor 15 Boss defeated, trigger ultimate victory!
    if (enemy.isBoss && currentFloor >= MAX_FLOORS) {
      setScreen('GAME_OVER');
      return;
    }

    // Calculate Gold Reward (Midas chip relic grants +50%)
    let baseGold = Math.floor(18 + currentFloor * 4 + Math.random() * 10);
    if (enemy.isElite) baseGold += 30;
    if (player.relics.some((r) => r.id === 'relic_midas_chip')) {
      baseGold = Math.floor(baseGold * 1.5);
    }
    setGoldReward(baseGold);

    // Card drafting choices (3 random cards)
    setCardChoices(getRandomCardReward(3));

    // Relic reward (guaranteed on Elite/Boss, 20% on normal)
    if (enemy.isElite || enemy.isBoss || Math.random() < 0.2) {
      const existingIds = player.relics.map((r) => r.id);
      setRelicReward(getRandomRelic(existingIds));
    } else {
      setRelicReward(null);
    }

    setGoldClaimed(false);
    setRelicClaimed(false);
    setCardChosen(false);

    // Trigger Nanite Injector relic (+6 HP on victory)
    if (player.relics.some((r) => r.id === 'relic_nanite_injector')) {
      setPlayer((prev) => ({ ...prev, hp: Math.min(prev.maxHp, prev.hp + 6) }));
    }

    // Call Gemini AI for victory commentary
    setAiCommentary('AI 감시관이 전투 데이터를 정밀 분석하고 있습니다...');
    setScreen('REWARD');

    const commentary = await fetchAiCommentary({
      enemyName: enemy.name,
      turns: combatTurnCount,
      hpRemaining: player.hp,
      maxHp: player.maxHp,
      damageTaken: damageTakenInCombat,
      cardsPlayed: cardsPlayedInCombat,
    });
    setAiCommentary(commentary);
  };

  // Turn End Handler
  const handleEndTurn = () => {
    if (!isPlayerTurn || !enemy) return;
    setIsPlayerTurn(false);

    // 1. Move remaining hand cards to discard pile
    setPlayer((prev) => {
      // Reflective Mirror relic: retain half block, otherwise reset block to 0
      let newBlock = 0;
      if (prev.relics.some((r) => r.id === 'relic_mirror_shield')) {
        newBlock = Math.floor(prev.block / 2);
      }
      return {
        ...prev,
        block: newBlock,
        discardPile: [...prev.discardPile, ...prev.hand],
        hand: [],
      };
    });

    // 2. Enemy turn sequence
    setTimeout(() => {
      executeEnemyTurn();
    }, 600);
  };

  const executeEnemyTurn = () => {
    if (!enemy) return;

    // Check poison on enemy at start of enemy turn
    if (enemy.statuses.poison > 0) {
      const poisonDmg = enemy.statuses.poison;
      addFloatingText(`-${poisonDmg} (독)`, 'text-emerald-400', 'enemy');
      setEnemy((prev) =>
        prev
          ? {
              ...prev,
              currentHp: Math.max(0, prev.currentHp - poisonDmg),
              statuses: { ...prev.statuses, poison: prev.statuses.poison - 1 },
            }
          : null
      );
    }

    // Execute current intent
    const intent = enemy.intents[enemy.currentIntentIndex] || enemy.intents[0];

    // Intent execution
    if (intent.type.includes('ATTACK')) {
      let enemyDmg = intent.value + enemy.statuses.strength;
      if (enemy.statuses.weak > 0) {
        enemyDmg = Math.max(1, Math.floor(enemyDmg * 0.75));
      }
      if (player.statuses.vulnerable > 0) {
        enemyDmg = Math.floor(enemyDmg * 1.5);
      }

      sounds.playAttackHit();

      setPlayer((prev) => {
        let pRemHp = prev.hp;
        let pRemBlock = prev.block;

        if (pRemBlock >= enemyDmg) {
          pRemBlock -= enemyDmg;
          addFloatingText('방어됨!', 'text-cyan-400', 'player');
        } else {
          const unblocked = enemyDmg - pRemBlock;
          pRemBlock = 0;
          pRemHp = Math.max(0, pRemHp - unblocked);
          addFloatingText(`-${unblocked}`, 'text-red-400', 'player');
          setDamageTakenInCombat((d) => d + unblocked);
        }

        // Check if player has Thorns (retaliate!)
        if (prev.statuses.thorns > 0) {
          const tDmg = prev.statuses.thorns;
          setEnemy((e) =>
            e ? { ...e, currentHp: Math.max(0, e.currentHp - tDmg) } : null
          );
          addFloatingText(`-${tDmg} (반사)`, 'text-amber-400', 'enemy');
        }

        return { ...prev, hp: pRemHp, block: pRemBlock };
      });
    }

    if (intent.type.includes('DEFEND')) {
      sounds.playShieldBlock();
      setEnemy((prev) =>
        prev ? { ...prev, block: prev.block + intent.value } : null
      );
      addFloatingText(`+${intent.value} 방어`, 'text-cyan-400', 'enemy');
    }

    if (intent.buff) {
      if (intent.buff.includes('STRENGTH')) {
        const val = parseInt(intent.buff.split('_')[1] || '1', 10);
        setEnemy((prev) =>
          prev
            ? { ...prev, statuses: { ...prev.statuses, strength: prev.statuses.strength + val } }
            : null
        );
        addFloatingText(`힘 +${val}`, 'text-red-400', 'enemy');
      }
    }

    if (intent.debuff) {
      if (intent.debuff === 'VULNERABLE') {
        setPlayer((prev) => ({
          ...prev,
          statuses: { ...prev.statuses, vulnerable: prev.statuses.vulnerable + 2 },
        }));
        addFloatingText(`취약 2턴`, 'text-rose-400', 'player');
      }
      if (intent.debuff === 'WEAK') {
        setPlayer((prev) => ({
          ...prev,
          statuses: { ...prev.statuses, weak: prev.statuses.weak + 2 },
        }));
        addFloatingText(`약화 2턴`, 'text-amber-400', 'player');
      }
    }

    // Rotate intent
    setEnemy((prev) => {
      if (!prev) return null;
      const nextIdx = (prev.currentIntentIndex + 1) % prev.intents.length;
      return {
        ...prev,
        currentIntentIndex: nextIdx,
        block: 0, // enemy block resets at end of enemy turn
        statuses: {
          ...prev.statuses,
          vulnerable: Math.max(0, prev.statuses.vulnerable - 1),
          weak: Math.max(0, prev.statuses.weak - 1),
        },
      };
    });

    // End enemy turn -> return to player turn
    setTimeout(() => {
      startPlayerTurn();
    }, 700);
  };

  const startPlayerTurn = () => {
    setCombatTurnCount((prev) => prev + 1);

    // Apply poison to player if any
    setPlayer((prev) => {
      let currentHp = prev.hp;
      if (prev.statuses.poison > 0) {
        currentHp = Math.max(0, currentHp - prev.statuses.poison);
        addFloatingText(`-${prev.statuses.poison} (독)`, 'text-emerald-400', 'player');
      }

      // Check Bio Synthesizer relic (+3 block at turn start)
      let turnStartBlock = prev.block;
      if (prev.relics.some((r) => r.id === 'relic_blood_vial')) {
        turnStartBlock += 3;
      }

      // Decrement player status durations
      const newVulnerable = Math.max(0, prev.statuses.vulnerable - 1);
      const newWeak = Math.max(0, prev.statuses.weak - 1);
      const newPoison = Math.max(0, prev.statuses.poison - 1);

      return {
        ...prev,
        hp: currentHp,
        block: turnStartBlock,
        energy: prev.maxEnergy,
        statuses: {
          ...prev.statuses,
          vulnerable: newVulnerable,
          weak: newWeak,
          poison: newPoison,
        },
      };
    });

    // Draw 5 cards
    drawCards(5);
    setIsPlayerTurn(true);
  };

  // Start Dynamic AI Event
  const startEvent = async (floor: number) => {
    setIsEventLoading(true);
    setCurrentEvent(null);
    setScreen('EVENT');

    const { archetype } = analyzeDeckArchetype(player.deck);
    const eventData = await fetchAiEvent({
      floor,
      hp: player.hp,
      maxHp: player.maxHp,
      gold: player.gold,
      deckArchetype: archetype,
      cardCount: player.deck.length,
      relics: player.relics.map((r) => r.name),
    });

    setCurrentEvent(eventData);
    setIsEventLoading(false);
  };

  // Handle Event Choice
  const handleSelectEventChoice = (choice: GameEventChoice) => {
    const { effect } = choice;

    if (effect.type === 'HP_COST') {
      setPlayer((prev) => ({ ...prev, hp: Math.max(1, prev.hp - effect.value) }));
    } else if (effect.type === 'HP_GAIN') {
      sounds.playHeal();
      setPlayer((prev) => ({ ...prev, hp: Math.min(prev.maxHp, prev.hp + effect.value) }));
    } else if (effect.type === 'GOLD_GAIN') {
      sounds.playGoldChime();
      setPlayer((prev) => ({ ...prev, gold: prev.gold + effect.value }));
    } else if (effect.type === 'GOLD_COST') {
      setPlayer((prev) => ({ ...prev, gold: Math.max(0, prev.gold - effect.value) }));
    } else if (effect.type === 'MAX_HP_GAIN') {
      setPlayer((prev) => ({ ...prev, maxHp: prev.maxHp + effect.value, hp: prev.hp + effect.value }));
    }

    if (effect.reward_card) {
      const newCards = getRandomCardReward(1);
      if (newCards[0]) {
        setPlayer((prev) => ({ ...prev, deck: [...prev.deck, newCards[0]] }));
      }
    }

    if (effect.reward_relic) {
      const existing = player.relics.map((r) => r.id);
      const newRelic = getRandomRelic(existing);
      setPlayer((prev) => ({ ...prev, relics: [...prev.relics, newRelic] }));
    }

    if (effect.remove_card) {
      // Trigger card removal modal
      setDeckViewerMode('remove');
      return;
    }

    if (effect.upgrade_card) {
      setDeckViewerMode('upgrade');
      return;
    }

    // Finished event, return to map
    setScreen('MAP');
  };

  // Start Shop
  const startShop = () => {
    const cards = getRandomCardReward(3).map((card, idx) => ({
      card,
      price: card.rarity === 'RARE' ? 120 : card.rarity === 'UNCOMMON' ? 75 : 50,
      bought: false,
    }));

    const existingRelicIds = player.relics.map((r) => r.id);
    const r1 = getRandomRelic(existingRelicIds);
    const r2 = getRandomRelic([...existingRelicIds, r1.id]);

    setShopCards(cards);
    setShopRelics([
      { relic: r1, price: 150, bought: false },
      { relic: r2, price: 175, bought: false },
    ]);
    setHasRemovedCardInShop(false);
    setScreen('SHOP');
  };

  // Shop Purchases
  const handleBuyShopCard = (index: number) => {
    const item = shopCards[index];
    if (!item || item.bought || player.gold < item.price) return;

    sounds.playGoldChime();
    setPlayer((prev) => ({
      ...prev,
      gold: prev.gold - item.price,
      deck: [...prev.deck, item.card],
    }));

    setShopCards((prev) =>
      prev.map((c, i) => (i === index ? { ...c, bought: true } : c))
    );
  };

  const handleBuyShopRelic = (index: number) => {
    const item = shopRelics[index];
    if (!item || item.bought || player.gold < item.price) return;

    sounds.playUpgrade();
    setPlayer((prev) => ({
      ...prev,
      gold: prev.gold - item.price,
      relics: [...prev.relics, item.relic],
    }));

    setShopRelics((prev) =>
      prev.map((r, i) => (i === index ? { ...r, bought: true } : r))
    );
  };

  const handleBuyShopHeal = (cost: number, healAmount: number) => {
    sounds.playHeal();
    setPlayer((prev) => ({
      ...prev,
      gold: prev.gold - cost,
      hp: Math.min(prev.maxHp, prev.hp + healAmount),
    }));
  };

  // Card Removal / Upgrade Picker
  const handleSelectCardInDeckViewer = (card: Card) => {
    if (deckViewerMode === 'remove') {
      setPlayer((prev) => ({
        ...prev,
        deck: prev.deck.filter((c) => c !== card),
      }));
      setHasRemovedCardInShop(true);
      setRemovalPrice((p) => p + 25);
      setDeckViewerMode(null);
    } else if (deckViewerMode === 'upgrade') {
      const upgraded = upgradeCard(card);
      sounds.playUpgrade();
      setPlayer((prev) => ({
        ...prev,
        deck: prev.deck.map((c) => (c === card ? upgraded : c)),
      }));
      setDeckViewerMode(null);
    }
  };

  // Campfire Forge with Gemini
  const handleForgeCard = async (wishPrompt: string): Promise<Card | null> => {
    const { archetype, topCards } = analyzeDeckArchetype(player.deck);
    const forged = await fetchAiCardForge({
      playerArchetype: archetype,
      currentDeckKeywords: topCards,
      playerWish: wishPrompt,
    });
    if (forged) {
      setPlayer((prev) => ({ ...prev, deck: [...prev.deck, forged] }));
      return forged;
    }
    return null;
  };

  return (
    <div className="w-screen h-screen flex flex-col bg-slate-950 text-slate-100 overflow-hidden font-sans">
      {/* Universal Top Bar */}
      <TopBar
        player={player}
        floor={currentFloor}
        maxFloors={MAX_FLOORS}
        aiStatus={aiStatus}
        soundEnabled={soundEnabled}
        onToggleSound={handleToggleSound}
        onOpenDeck={() => {
          setDeckViewerPile('deck');
          setDeckViewerMode('view');
        }}
        showMapButton={screen !== 'MAP' && screen !== 'GAME_OVER'}
        onOpenMap={() => setIsMapViewOpen(true)}
      />

      {/* Main View Area */}
      <main className="flex-1 flex overflow-hidden relative">
        {screen === 'MAP' && (
          <MapView
            map={map}
            currentFloor={currentFloor}
            currentNodeId={currentNodeId}
            onSelectNode={handleSelectNode}
            canChooseNode={true}
          />
        )}

        {screen === 'COMBAT' && enemy && (
          <CombatView
            player={player}
            enemy={enemy}
            onPlayCard={handlePlayCard}
            onEndTurn={handleEndTurn}
            isPlayerTurn={isPlayerTurn}
            floatingTexts={floatingTexts}
            combatLog={combatLog}
            onOpenDeckViewer={(mode) => {
              setDeckViewerPile(mode);
              setDeckViewerMode('view');
            }}
          />
        )}
      </main>

      {/* Popups & Modals */}
      {/* 1. Reward Modal */}
      {screen === 'REWARD' && (
        <RewardModal
          goldReward={goldReward}
          cardChoices={cardChoices}
          relicReward={relicReward}
          aiCommentary={aiCommentary}
          goldClaimed={goldClaimed}
          relicClaimed={relicClaimed}
          cardChosen={cardChosen}
          onClaimGold={() => {
            setPlayer((prev) => ({ ...prev, gold: prev.gold + goldReward }));
            setGoldClaimed(true);
          }}
          onClaimRelic={(relic) => {
            setPlayer((prev) => ({ ...prev, relics: [...prev.relics, relic] }));
            setRelicClaimed(true);
          }}
          onChooseCard={(card) => {
            setPlayer((prev) => ({ ...prev, deck: [...prev.deck, card] }));
            setCardChosen(true);
          }}
          onSkipCards={() => setCardChosen(true)}
          onFinishRewards={() => setScreen('MAP')}
        />
      )}

      {/* 2. AI Event Modal */}
      {screen === 'EVENT' && (
        <EventModal
          event={currentEvent}
          loading={isEventLoading}
          onSelectChoice={handleSelectEventChoice}
        />
      )}

      {/* 3. Shop Modal */}
      {screen === 'SHOP' && (
        <ShopModal
          player={player}
          shopCards={shopCards}
          shopRelics={shopRelics}
          removalPrice={removalPrice}
          hasRemovedCard={hasRemovedCardInShop}
          onBuyCard={handleBuyShopCard}
          onBuyRelic={handleBuyShopRelic}
          onBuyHeal={handleBuyShopHeal}
          onInitiateRemoveCard={() => {
            setPlayer((prev) => ({ ...prev, gold: prev.gold - removalPrice }));
            setDeckViewerMode('remove');
          }}
          onLeaveShop={() => setScreen('MAP')}
        />
      )}

      {/* 4. Campfire Modal */}
      {screen === 'CAMPFIRE' && (
        <CampfireModal
          player={player}
          onRest={(healAmount) => {
            setPlayer((prev) => ({ ...prev, hp: Math.min(prev.maxHp, prev.hp + healAmount) }));
          }}
          onInitiateUpgrade={() => {
            setDeckViewerMode('upgrade');
          }}
          onForgeCard={handleForgeCard}
          onFinishCampfire={() => setScreen('MAP')}
        />
      )}

      {/* 5. Deck Viewer Modal (Browse / Remove / Upgrade) */}
      {deckViewerMode !== null && (
        <DeckViewerModal
          cards={
            deckViewerPile === 'deck'
              ? player.deck
              : deckViewerPile === 'draw'
              ? player.drawPile
              : player.discardPile
          }
          title={
            deckViewerMode === 'remove'
              ? '소멸시킬 카드 1장 선택'
              : deckViewerMode === 'upgrade'
              ? '강화할 카드 1장 선택'
              : deckViewerPile === 'draw'
              ? '뽑을 카드 덱 (DRAW PILE)'
              : deckViewerPile === 'discard'
              ? '버린 카드 더미 (DISCARD PILE)'
              : '전체 보유 덱 (DECK INSPECTOR)'
          }
          subtitle={
            deckViewerMode === 'remove'
              ? '덱에서 영구히 제거할 카드를 클릭하십시오.'
              : deckViewerMode === 'upgrade'
              ? '아직 강화되지 않은 카드를 클릭하여 능력치를 강화하십시오.'
              : '카드 목록을 확인하십시오.'
          }
          mode={deckViewerMode}
          onSelectCard={handleSelectCardInDeckViewer}
          onClose={() => setDeckViewerMode(null)}
        />
      )}

      {/* 6. Overlay Map Viewer (when viewing map during Campfire / Shop) */}
      {isMapViewOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md select-none animate-fadeIn">
          <div className="relative w-full max-w-4xl h-[90vh] bg-slate-900 border-2 border-slate-700 rounded-2xl flex flex-col overflow-hidden shadow-2xl">
            <div className="p-4 border-b border-slate-800 flex items-center justify-between">
              <h3 className="font-mono font-bold text-sm text-cyan-400">
                차원 경로 지도 (DIMENSION MAP)
              </h3>
              <button
                onClick={() => setIsMapViewOpen(false)}
                className="px-3 py-1 rounded bg-slate-800 text-xs font-mono text-slate-300 hover:text-white"
              >
                닫기
              </button>
            </div>
            <div className="flex-1 overflow-hidden flex">
              <MapView
                map={map}
                currentFloor={currentFloor}
                currentNodeId={currentNodeId}
                onSelectNode={() => {}}
                canChooseNode={false}
              />
            </div>
          </div>
        </div>
      )}

      {/* 7. Game Over Modal (Victory or Defeat) */}
      {screen === 'GAME_OVER' && (
        <GameOverModal
          isVictory={player.hp > 0 && currentFloor >= MAX_FLOORS}
          stats={runStats}
          floor={currentFloor}
          onRestart={handleRestartRun}
        />
      )}
    </div>
  );
}
