# 이벤트 프로모션 페이지

Vue 3 + TypeScript로 구현한 인터랙티브 이벤트 응모 페이지입니다.

## 1. 데모

🔗 [https://rlawlsdud1.github.io/event-promo/](https://rlawlsdud1.github.io/event-promo/)

## 2. 기능

### 필수 요구사항

- ✅ 이벤트 정보 표시 (제목, 기간, 설명, 보상)
- ✅ 실시간 카운트다운 타이머
- ✅ GSAP 기반 페이지 진입 애니메이션
- ✅ 카드 뒤집기 인터랙션 (보상 항목)
- ✅ 응모 폼 (이름, 연락처, 이메일, 약관 동의)
- ✅ 유효성 검사 및 에러 처리
- ✅ MockAPI 연동

### 추가 구현

- ✅ 중복 응모 방지 (SHA-256 해싱 + LocalStorage)
- ✅ 이벤트 종료 시 응모 제한
- ✅ 제출 성공 시 공유하기 기능
- ✅ 반응형 디자인
- ✅ Vitest 기반 테스트 코드
- ✅ GitHub Actions CI/CD

## 3. 실행 방법

```bash
# 설치
npm install

# 개발 서버 실행
npm run dev

# 테스트 실행
npm run test
```

## 4. 기술 스택 및 선정 이유

- **Vue 3 (Composition API) + TypeScript**

  - 과제 필수 요구사항
  - Composition API로 로직 재사용성 향상
  - TypeScript로 타입 안정성 확보

- **Tailwind CSS**

  - 유틸리티 기반으로 빠른 스타일링
  - 반응형 디자인 간편 구현

- **GSAP**

  - 고성능 애니메이션 라이브러리

- **Axios**

  - fetch 대비 간결한 문법
  - 인스턴스 생성으로 공통 설정 재사용

- **Vitest + Vue Test Utils**

  - Vite 네이티브 통합으로 빠른 테스트 실행

- **Vite**

  - 빠른 개발 서버 및 빌드 속도

- **GitHub Pages + GitHub Actions**
  - 무료 호스팅 및 자동 배포
  - CI/CD 파이프라인 구축

## 5. 프로젝트 구조

```
src/
├── components/          # 재사용 가능한 컴포넌트
│   ├── icons/          # SVG 아이콘 컴포넌트
│   ├── Toast.vue       # 범용 토스트 알림
│   └── ...
├── composables/        # Vue Composition 함수
│   ├── useCountdown.ts # 카운트다운 로직
│   └── useScrollReveal.ts # 스크롤 애니메이션
├── pages/              # 페이지 컴포넌트
├── services/           # API 서비스
├── types/              # TypeScript 타입 정의
└── __tests__/          # 테스트 파일
```

## 6. 트러블슈팅

### iOS Safari 카드 플립 애니메이션 버그

**문제**: iOS Safari에서 카드를 뒤집었을 때 앞면이 투과되어 보이는 현상 발생

**원인**: Safari의 WebKit 엔진이 `backface-visibility: hidden`만으로는 3D transform 렌더링을 제대로 처리하지 못함

**해결**:

```css
/* 기존 - backface-visibility만 사용 */
.backface-hidden {
  backface-visibility: hidden;
  -webkit-backface-visibility: hidden;
}

/* 개선 - translateZ()와 z-index 추가 */
.card-front {
  z-index: 2;
  transform: rotateY(0deg) translateZ(1px);
  -webkit-transform: rotateY(0deg) translateZ(1px);
}

.card-back {
  z-index: 1;
  transform: rotateY(180deg) translateZ(0px);
  -webkit-transform: rotateY(180deg) translateZ(0px);
}

.reward-card {
  transform: translateZ(0); /* 하드웨어 가속 */
  -webkit-transform: translateZ(0);
}
```

Safari는 `backface-visibility`만으로 충분하지 않아 `translateZ()`를 사용해 앞/뒷면의 깊이를 다르게 설정하고, `z-index`로 렌더링 순서를 명시해야 정상 작동
