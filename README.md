# 🚚 물류 운송비 계산기

운행거리, 차량 수, km당 운임을 입력하면 **총 운송비**와 기준 운임 대비 **절감액·절감률**을 즉시 계산해 주는 웹앱입니다.
React + Vite + TypeScript로 만들었으며, 외부 데이터베이스나 API 키 없이 브라우저에서만 동작합니다.

## 주요 기능

- 운행거리(km), 차량 수, km당 운임, 기준(기존) km당 운임 입력
- 총 운송비 자동 계산 (입력 즉시 반영)
- 운송비 절감액 및 절감률 표시 (기준보다 비싸면 추가 비용·증가율로 표시)
- KPI 카드 4종: 총 운송비 / 절감액 / 절감률 / 총 운행거리
- 계산 근거(산식)와 기준·적용 운송비 비교 막대 그래프
- PC·태블릿·모바일 반응형, 다크 모드 자동 대응

## 계산 방식

| 항목 | 산식 |
| --- | --- |
| 총 운행거리 | 운행거리 × 차량 수 |
| 총 운송비 | 총 운행거리 × km당 운임 |
| 기준 운송비 | 총 운행거리 × 기준 km당 운임 |
| 절감액 | 기준 운송비 − 총 운송비 |
| 절감률 | 절감액 ÷ 기준 운송비 × 100 |

## 실행 방법

Node.js 18 이상이 필요합니다.

```bash
npm install      # 의존성 설치
npm run dev      # 개발 서버 실행 → http://localhost:5173
npm run build    # 프로덕션 빌드 (dist/ 생성)
npm run preview  # 빌드 결과 미리보기
```

## Vercel 배포

1. 이 폴더를 GitHub 저장소에 push 합니다.
2. [Vercel](https://vercel.com)에서 **Add New → Project**로 저장소를 가져옵니다.
3. Framework Preset이 **Vite**로 자동 인식됩니다. (Build Command: `npm run build`, Output Directory: `dist`)
4. **Deploy**를 누르면 배포가 완료됩니다.

Vercel CLI를 사용할 경우: `npx vercel` (미리보기) / `npx vercel --prod` (프로덕션)

## 프로젝트 구조

```
├── index.html
├── public/favicon.svg
├── src/
│   ├── main.tsx      # 진입점
│   ├── App.tsx       # 화면(KPI 카드·입력·결과)
│   ├── calc.ts       # 운송비 계산 로직
│   └── index.css     # 스타일·반응형
├── vercel.json
├── vite.config.ts
└── tsconfig.json
```

## 보안 및 개인정보

- 개인정보, API 키, 환경 변수를 사용하지 않습니다.
- 입력값은 브라우저 메모리에서만 계산되며 저장·전송되지 않습니다.
- `.env` 파일은 `.gitignore`로 커밋에서 제외됩니다.
