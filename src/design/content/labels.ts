// Design System: Content & Text Resources
// 원칙: 화면의 모든 텍스트는 이 파일에서 관리 (나중에 다국어 지원 용이)

export const LABELS = {
  COMMON: {
    LOADING: '불러오는 중...',
    ERROR: '오류가 발생했습니다.',
    EMPTY: '데이터가 없습니다.',
    VIEW_ALL: '전체보기',
    SETTINGS: '설정',
    CLOSE: '닫기',
  },
  DASHBOARD: {
    TITLE: '대시보드',
    SUBTITLE: '오늘의 농지 현황을 한눈에 확인하세요.',
    WIDGETS: {
      WEATHER: '날씨',
      PEST: '병해충',
      MARKET: '주요 시세',
    },
    SECTIONS: {
      QUICK_ACCESS: '빠른 실행',
      FINANCIAL: '재무 요약',
      SCHEDULE: '전체 농기 스케줄',
      TASKS: '주요 작업 일정',
    },
  },
  FARM: {
    FIELD_SELECTOR: '농지 선택',
    CROP_SELECTOR: '작물 선택',
  },
} as const;
