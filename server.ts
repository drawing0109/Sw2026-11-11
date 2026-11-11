import express from 'express';
import { createServer as createViteServer } from 'vite';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI, Type } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = parseInt(process.env.PORT || '3000', 10);

app.use(express.json());

// Initialize GoogleGenAI
const apiKey = process.env.GEMINI_API_KEY;
let ai: GoogleGenAI | null = null;
if (apiKey) {
  ai = new GoogleGenAI({
    apiKey: apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// Check AI status
app.get('/api/ai/status', (_req, res) => {
  res.json({
    hasKey: !!apiKey,
    model: 'gemini-3.8-flash',
  });
});

// Dynamic narrative event generation
app.post('/api/gemini/event', async (req, res) => {
  const { floor, hp, maxHp, gold, deckArchetype, cardCount, relics } = req.body;

  const fallbackEvent = {
    event_title: "시공간 균열의 방랑 상인",
    narrative: `차원의 틈새에서 푸른 입자를 흩뿌리는 의문의 방랑자가 나타났습니다. 그(녀)는 당신의 불안정한 ${deckArchetype || '차원'} 덱을 훑어보며 미소를 짓습니다. "생명력의 편린이나 금화 중 무엇을 대가로 바치겠는가?"`,
    choices: [
      {
        id: 1,
        text: "차원의 피를 바치고 미지의 유물을 받는다 (체력 14 소모, 유물 1개 획득)",
        effect: { type: "HP_COST", value: 14, reward_relic: true }
      },
      {
        id: 2,
        text: "금화를 지불하고 카드를 정제한다 (골드 60 소모, 카드 1장 제거)",
        effect: { type: "GOLD_COST", value: 60, remove_card: true }
      },
      {
        id: 3,
        text: "방랑자를 밀치고 경계를 유지하며 물러선다 (변화 없음)",
        effect: { type: "NONE", value: 0 }
      }
    ]
  };

  if (!ai || !apiKey) {
    return res.json(fallbackEvent);
  }

  try {
    const prompt = `당신은 하드코어 SF 판타지 로그라이크 덱빌더 'Apex Dimension (에이펙스 디멘전)'의 세계관 내레이터 및 던전 마스터입니다.
현재 플레이어의 상태:
- 현재 층수: ${floor}층
- 현재 체력: ${hp} / ${maxHp} (${Math.round((hp / maxHp) * 100)}%)
- 소지 골드: ${gold}G
- 덱 주력 성향: ${deckArchetype || '균형 잡힌 전투'} (총 ${cardCount}장)
- 보유 유물 목록: ${Array.isArray(relics) ? relics.join(', ') : '없음'}

플레이어의 현재 상황(체력이 낮으면 위험/기회, 골드가 많으면 탐욕/제물, 특정 덱 성향을 저격하거나 강화)에 맞춘 흥미진진한 독창적 미스터리 조우(Encounter) 이벤트를 JSON 형식으로 생성하세요.

반드시 다음 3가지 선택지를 제공하세요:
1. 리스크 & 하이 리턴 (체력 소모 또는 저주 vs 강력한 보상 - 유물/희귀 카드/강화)
2. 자원 교환 (골드 획득 또는 골드 소모 vs 카드 제거/체력 회복)
3. 안전한 회피 또는 소소한 이득 (변화 없음 또는 체력 소량 회복)

반드시 아래 JSON 스키마를 준수하십시오:
{
  "event_title": "짧고 매력적인 사건 제목",
  "narrative": "플레이어의 호기심과 긴장감을 자극하는 2~3문장의 몰입도 높은 묘사",
  "choices": [
    {
      "id": 1,
      "text": "선택지 설명 및 명확한 보상/비용 요약",
      "effect": {
        "type": "HP_COST" | "HP_GAIN" | "GOLD_GAIN" | "GOLD_COST" | "MAX_HP_GAIN" | "NONE",
        "value": number,
        "reward_card": boolean,
        "reward_relic": boolean,
        "remove_card": boolean,
        "upgrade_card": boolean
      }
    }
  ]
}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            event_title: { type: Type.STRING },
            narrative: { type: Type.STRING },
            choices: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.INTEGER },
                  text: { type: Type.STRING },
                  effect: {
                    type: Type.OBJECT,
                    properties: {
                      type: { type: Type.STRING },
                      value: { type: Type.INTEGER },
                      reward_card: { type: Type.BOOLEAN },
                      reward_relic: { type: Type.BOOLEAN },
                      remove_card: { type: Type.BOOLEAN },
                      upgrade_card: { type: Type.BOOLEAN },
                    },
                    required: ['type', 'value']
                  }
                },
                required: ['id', 'text', 'effect']
              }
            }
          },
          required: ['event_title', 'narrative', 'choices']
        }
      }
    });

    const parsed = JSON.parse(response.text || '{}');
    if (parsed.event_title && parsed.choices && parsed.choices.length > 0) {
      return res.json(parsed);
    }
    return res.json(fallbackEvent);
  } catch (error) {
    console.error('Error in /api/gemini/event:', error);
    return res.json(fallbackEvent);
  }
});

// Custom tailored Elite / Boss monster generation based on player's deck
app.post('/api/gemini/boss', async (req, res) => {
  const { floor, isBoss, deckArchetype, topCards, hp, relics } = req.body;

  const fallbackBoss = isBoss ? {
    name: "차원 지배자 크로노스-Ω",
    title: "왜곡된 시공간의 종언",
    lore: "차원의 붕괴 지점에 서식하는 고대 AI 코어가 플레이어의 덱 구조를 파악하고 대항 전술을 전개합니다.",
    hp: 220,
    mechanic_name: "차원 과부하",
    mechanic_desc: "플레이어가 턴당 3번째 카드를 사용할 때마다 방어력 5를 획득하고 나노 화상을 입힙니다.",
    colorTheme: "purple",
    intents: [
      { type: "ATTACK", value: 16, desc: "차원 파쇄 광선 (16 데미지)" },
      { type: "DEFEND_BUFF", value: 14, buff: "STRENGTH_2", desc: "방어막 전개 (14 방어도) 및 공격력 2 증가" },
      { type: "ATTACK_DEBUFF", value: 12, debuff: "VULNERABLE", desc: "양자 침식 (12 데미지 + 취약 2턴)" },
      { type: "HEAVY_ATTACK", value: 24, desc: "시공간 붕괴 폭격 (24 대규모 데미지!)" }
    ]
  } : {
    name: "사이퍼 나이트 (Cypher Knight)",
    title: "보이드 가디언",
    lore: "플레이어의 강력한 공세를 받아치기 위해 설계된 가변 장갑의 엘리트 경비병입니다.",
    hp: 110,
    mechanic_name: "반작용 장갑",
    mechanic_desc: "피격 시 공격자에게 2의 반사 피해를 입히는 가시 장갑을 상시 유지합니다.",
    colorTheme: "amber",
    intents: [
      { type: "ATTACK", value: 13, desc: "플라즈마 참격 (13 데미지)" },
      { type: "DEFEND", value: 12, desc: "에너지 배리어 (12 방어)" },
      { type: "ATTACK_DEBUFF", value: 10, debuff: "WEAK", desc: "교란 펄스 (10 데미지 + 약화 2턴)" }
    ]
  };

  if (!ai || !apiKey) {
    return res.json(fallbackBoss);
  }

  try {
    const prompt = `당신은 로그라이크 덱빌딩 게임 'Apex Dimension'의 맞춤형 적(몬스터) 설계자입니다.
플레이어 상태:
- 난이도/노드 종류: ${isBoss ? '보스 (Floor ' + floor + ')' : '엘리트 몬스터 (Floor ' + floor + ')'}
- 플레이어 덱 성향: ${deckArchetype}
- 주요 보유 카드: ${Array.isArray(topCards) ? topCards.join(', ') : '타격, 방어'}
- 체력: ${hp}
- 보유 유물: ${Array.isArray(relics) ? relics.join(', ') : '없음'}

플레이어의 덱 성향(예: 연타 공격 중심이면 방어/가시 카운터, 방어 존버형이면 점진적 공격력 증가 또는 침식 디버프, 고비용 한방형이면 취약 유발)을 지능적으로 카운터하거나 전략적 도전을 제공하는 매력적인 SF 몬스터를 생성하세요.

반드시 적절한 체력:
- 엘리트: 85~120 HP
- 보스: 190~260 HP

반드시 3~4개의 행동 의도 패턴(순환식)을 작성하세요.
JSON 스키마:
{
  "name": "멋진 SF/사이버네틱 명칭 (한국어 및 영문)",
  "title": "칭호 (예: '망각의 데이터 집행관')",
  "lore": "플레이어 덱을 어떻게 주시하고 있는지 드러내는 1~2문장의 배경",
  "hp": number,
  "mechanic_name": "고유 특수 기믹 명칭",
  "mechanic_desc": "보스의 고유 패시브 설명",
  "colorTheme": "purple" | "cyan" | "amber" | "crimson",
  "intents": [
    {
      "type": "ATTACK" | "DEFEND" | "BUFF" | "DEBUFF" | "ATTACK_DEBUFF" | "DEFEND_BUFF" | "HEAVY_ATTACK",
      "value": number,
      "buff": string,
      "debuff": string,
      "desc": "플레이어에게 보일 의도 요약"
    }
  ]
}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            name: { type: Type.STRING },
            title: { type: Type.STRING },
            lore: { type: Type.STRING },
            hp: { type: Type.INTEGER },
            mechanic_name: { type: Type.STRING },
            mechanic_desc: { type: Type.STRING },
            colorTheme: { type: Type.STRING },
            intents: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  type: { type: Type.STRING },
                  value: { type: Type.INTEGER },
                  buff: { type: Type.STRING },
                  debuff: { type: Type.STRING },
                  desc: { type: Type.STRING }
                },
                required: ['type', 'value', 'desc']
              }
            }
          },
          required: ['name', 'title', 'lore', 'hp', 'mechanic_name', 'mechanic_desc', 'intents']
        }
      }
    });

    const parsed = JSON.parse(response.text || '{}');
    if (parsed.name && parsed.hp && parsed.intents && parsed.intents.length > 0) {
      return res.json(parsed);
    }
    return res.json(fallbackBoss);
  } catch (err) {
    console.error('Error generating boss with Gemini:', err);
    return res.json(fallbackBoss);
  }
});

// Victory battle commentary
app.post('/api/gemini/commentary', async (req, res) => {
  const { enemyName, turns, hpRemaining, maxHp, damageTaken, cardsPlayed } = req.body;

  const fallbackQuotes = [
    `차원의 감시관: "적절한 전술적 판단이었다. ${enemyName}의 잔해가 데이터 그리드로 흡수된다."`,
    `차원의 감시관: "치명타를 흘려보내며 우아하게 격파했다. 다음 균열이 입을 벌린다."`,
    `차원의 감시관: "체력 ${hpRemaining}/${maxHp}을 보존한 인상적인 승리로군. 에너지 파동이 너를 강화한다."`
  ];
  const fallback = fallbackQuotes[Math.floor(Math.random() * fallbackQuotes.length)];

  if (!ai || !apiKey) {
    return res.json({ commentary: fallback });
  }

  try {
    const isCloseCall = hpRemaining < maxHp * 0.25;
    const isFlawless = damageTaken === 0;

    const prompt = `로그라이크 덱빌더 'Apex Dimension'의 인공지능 나레이터(감시관)로서 전투 종료 평가를 1~2문장으로 남기세요.
- 쓰러뜨린 적: ${enemyName}
- 소요 턴수: ${turns}턴
- 남은 체력: ${hpRemaining}/${maxHp} (${isCloseCall ? '극적인 빈사 상태 탈출!' : ''}${isFlawless ? '피해 0 완벽한 승리(Flawless)!' : ''})
- 총 사용 카드수: ${cardsPlayed}장
SF 특유의 차갑고도 경외감 있는 어조로 플레이어의 전술을 촌철살인으로 평론하세요.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
    });

    const commentary = (response.text || fallback).trim().replace(/^["']|["']$/g, '');
    res.json({ commentary });
  } catch (err) {
    console.error('Error in commentary:', err);
    res.json({ commentary: fallback });
  }
});

// AI Anomaly Card Forge (at Campfire or Event)
app.post('/api/gemini/card-forge', async (req, res) => {
  const { playerArchetype, currentDeckKeywords, playerWish } = req.body;

  const fallbackCard = {
    id: `forge_${Date.now()}`,
    name: "특이점 수렴",
    nameEn: "Singularity Convergence",
    cost: 1,
    type: "SKILL",
    rarity: "RARE",
    description: "방어도를 10 얻고, 이번 턴에 다음 공격 카드가 주는 피해가 2배가 됩니다.",
    block: 10,
    specialEffect: "DOUBLE_NEXT_ATTACK",
    lore: "AI 코어가 시공간을 비틀어 연산해낸 특이점 결정체."
  };

  if (!ai || !apiKey) {
    return res.json(fallbackCard);
  }

  try {
    const prompt = `로그라이크 카드 게임 'Apex Dimension'의 AI 카드 제련소입니다.
플레이어의 성향: ${playerArchetype || '전투 지속형'}
현재 덱 키워드: ${Array.isArray(currentDeckKeywords) ? currentDeckKeywords.join(', ') : '타격, 방어, 독'}
플레이어의 제련 의도/소원: "${playerWish || '새로운 차원의 강력한 기술'}"

플레이어가 사용할 유니크하고 밸런스가 잡힌 신규 카드 1장을 창작하세요.
비용(cost)은 0, 1, 2 중 하나여야 합니다.
유형은 ATTACK, SKILL, POWER 중 하나입니다.
희귀도는 UNCOMMON 또는 RARE입니다.

JSON 스키마:
{
  "name": "독창적인 한국어 카드 이름",
  "nameEn": "English Card Name",
  "cost": number (0~3),
  "type": "ATTACK" | "SKILL" | "POWER",
  "rarity": "UNCOMMON" | "RARE",
  "description": "명확하고 간결한 효과 설명 (예: '적에게 14의 피해를 주고 취약 2를 부여합니다.')",
  "damage": number or 0,
  "block": number or 0,
  "hits": number or 1,
  "vulnerable": number or 0,
  "weak": number or 0,
  "poison": number or 0,
  "energyGain": number or 0,
  "draw": number or 0,
  "lore": "1문장의 SF 플레이버 텍스트"
}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            name: { type: Type.STRING },
            nameEn: { type: Type.STRING },
            cost: { type: Type.INTEGER },
            type: { type: Type.STRING },
            rarity: { type: Type.STRING },
            description: { type: Type.STRING },
            damage: { type: Type.INTEGER },
            block: { type: Type.INTEGER },
            hits: { type: Type.INTEGER },
            vulnerable: { type: Type.INTEGER },
            weak: { type: Type.INTEGER },
            poison: { type: Type.INTEGER },
            energyGain: { type: Type.INTEGER },
            draw: { type: Type.INTEGER },
            lore: { type: Type.STRING }
          },
          required: ['name', 'cost', 'type', 'rarity', 'description']
        }
      }
    });

    const parsed = JSON.parse(response.text || '{}');
    if (parsed.name && parsed.type) {
      return res.json({
        id: `ai_card_${Date.now()}`,
        ...parsed
      });
    }
    return res.json(fallbackCard);
  } catch (err) {
    console.error('Error forging card with Gemini:', err);
    return res.json(fallbackCard);
  }
});

// Setup Vite dev server or static files
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(port, '0.0.0.0', () => {
    console.log(`Apex Dimension full-stack server running on http://0.0.0.0:${port}`);
  });
}

startServer();
