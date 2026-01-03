// Design System: Typography Tokens
// 원칙: 폰트 크기와 두께를 의미(Semantic) 단위로 관리

export const TYPOGRAPHY = {
  FONT_FAMILY: {
    KOREAN: '"Pretendard", "Apple SD Gothic Neo", "Malgun Gothic", sans-serif',
  },

  // Heading Levels
  HEADING: {
    H1: 'text-2xl font-bold tracking-tight', // Page Title
    H2: 'text-xl font-bold tracking-tight', // Section Title
    H3: 'text-lg font-bold', // Card Title
    H4: 'text-base font-semibold', // Widget Title
  },

  // Body Text
  BODY: {
    LARGE: 'text-lg',
    DEFAULT: 'text-base',
    SMALL: 'text-sm',
    TINY: 'text-xs',
  },

  // Font Weights
  WEIGHT: {
    REGULAR: 'font-normal',
    MEDIUM: 'font-medium',
    BOLD: 'font-bold',
  },
} as const;

// Helper to combine styles safely
export const textStyle = (
  size: keyof typeof TYPOGRAPHY.BODY,
  weight: keyof typeof TYPOGRAPHY.WEIGHT = 'REGULAR',
  colorClass: string = '',
) => {
  return `${TYPOGRAPHY.BODY[size]} ${TYPOGRAPHY.WEIGHT[weight]} ${colorClass}`;
};
