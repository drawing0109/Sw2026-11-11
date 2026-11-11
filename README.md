# Apex Dimension

Google AI Studio와 Gemini를 활용한 SF 판타지 로그라이크 덱빌딩 게임입니다. 매 실행마다 달라지는 15층 경로를 탐험하고, 카드를 조합해 적과 싸우며, 플레이어의 덱과 상황에 맞춰 생성되는 이벤트와 엘리트·보스에 도전하세요.

## 주요 기능

- **로그라이크 진행**: 전투, 이벤트, 상점, 캠프파이어로 구성된 경로를 따라 최종 보스가 있는 15층까지 진행합니다.
- **턴제 카드 전투**: 에너지와 방어도를 관리하고 공격·방어·상태 효과 카드를 활용합니다. 적의 다음 행동 의도를 확인해 대응할 수 있습니다.
- **덱 성장과 자원 관리**: 전투 보상으로 카드와 골드를 얻고, 유물을 모으며, 상점에서 카드를 구매하거나 제거할 수 있습니다. 캠프파이어에서는 회복·강화·카드 제련을 선택할 수 있습니다.
- **Gemini 기반 동적 콘텐츠**: 플레이어의 층수, 체력, 골드, 덱 성향 등을 바탕으로 이벤트와 엘리트·보스를 생성합니다. 전투 후 해설과 맞춤형 카드 제련도 지원합니다.
- **대체 콘텐츠 제공**: API 키가 없거나 AI 요청에 실패하면 게임을 이어갈 수 있도록 기본 이벤트·적·해설·카드를 제공합니다.
- **게임 UI**: 지도와 덱 뷰어, 보상 및 상점 모달, 전투 효과와 사운드 제어를 제공합니다.

## 기술 스택

- React 19, TypeScript
- Vite 8, Tailwind CSS 4
- Express 4 및 `tsx` 기반 서버
- Google GenAI SDK (`@google/genai`)
- Bun lockfile을 사용하는 패키지 관리

## 시작하기

### 준비 사항

- [Bun](https://bun.sh/) 설치
- Gemini 생성 기능을 사용하려면 Google AI Studio에서 발급한 Gemini API 키

### 설치 및 실행

```bash
bun install
cp .env.example .env
```

`.env` 파일에 API 키를 설정합니다.

```dotenv
GEMINI_API_KEY="YOUR_GEMINI_API_KEY"
```

개발 서버를 실행합니다.

```bash
bun run dev
```

기본 주소는 `http://localhost:3000`입니다. `PORT` 환경 변수로 포트를 변경할 수 있습니다.

> API 키를 설정하지 않아도 게임은 기본 콘텐츠를 사용해 실행됩니다. Gemini 연동 기능을 활성화하려면 `GEMINI_API_KEY`가 필요합니다. 키를 클라이언트 코드에 넣지 말고 서버 환경 변수나 배포 플랫폼의 비밀 설정에 보관하세요.

## 명령어

| 명령어 | 설명 |
| --- | --- |
| `bun run dev` | 개발 모드에서 Express와 Vite 실행 |
| `bun run build` | Vite 프로덕션 빌드 생성 (`dist/`) |
| `bun run preview` | Vite 빌드 미리보기 |
| `bun run start` | Express 서버 시작; `NODE_ENV=production`이면 `dist/`의 정적 파일 제공 |
| `bun run lint` | TypeScript 타입 검사 (`tsc --noEmit`) |
| `bun run clean` | 빌드 산출물 정리 |

프로덕션 빌드 및 실행 예시:

```bash
bun run build
NODE_ENV=production bun run start
```

## Gemini API

Gemini 요청은 서버에서 처리하며 브라우저는 같은 출처의 API 엔드포인트를 호출합니다.

| 엔드포인트 | 기능 |
| --- | --- |
| `GET /api/ai/status` | API 키 설정 여부와 AI 상태 확인 |
| `POST /api/gemini/event` | 플레이어 상태에 맞는 이벤트 생성 |
| `POST /api/gemini/boss` | 덱 성향을 반영한 엘리트 또는 보스 생성 |
| `POST /api/gemini/commentary` | 전투 결과 해설 생성 |
| `POST /api/gemini/card-forge` | 플레이어의 희망 사항과 덱에 맞춘 카드 제련 |

AI 기능은 서버의 `GEMINI_API_KEY`를 사용합니다. AI 요청이나 응답 처리에 실패하면 각 기능은 기본 콘텐츠로 대체됩니다.

## 프로젝트 구조

```text
.
├── server.ts                 # Express 서버 및 Gemini API 라우트
├── index.html                # 앱 HTML 진입점
├── src/
│   ├── App.tsx               # 게임 상태와 진행 로직
│   ├── components/           # 지도, 전투, 카드 및 모달 UI
│   ├── data/                 # 카드, 적, 유물 데이터
│   ├── services/             # AI API 클라이언트와 사운드
│   ├── types/                # 게임 타입 정의
│   └── utils/                 # 맵 생성 등 유틸리티
├── .env.example              # 환경 변수 예시
└── package.json              # 스크립트와 의존성
```

## 배포 참고

앱은 Google AI Studio 환경을 고려해 구성되어 있으며, 해당 환경에서는 `GEMINI_API_KEY`와 앱 URL을 비밀 설정으로 제공할 수 있습니다. 다른 환경에 배포할 때는 서버에서 `GEMINI_API_KEY`를 설정하고, 프로덕션 정적 파일을 제공하도록 `NODE_ENV=production`으로 실행하세요.

## 라이선스

소스 코드에는 Apache-2.0 SPDX 표기가 포함되어 있습니다. 저장소에 별도의 `LICENSE` 파일은 현재 포함되어 있지 않습니다.
