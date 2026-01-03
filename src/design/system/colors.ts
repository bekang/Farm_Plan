// Design System: Color Palette & Semantic Tokens
// 원칙: 색상 코드를 직접 쓰지 않고 의미(Semantic)를 부여하여 사용

export const PALETTE = {
  // Brand Colors
  BRAND: {
    GREEN: {
      50: '#f0fdf4',
      100: '#dcfce7',
      200: '#bbf7d0',
      300: '#86efac',
      400: '#4ade80',
      500: '#22c55e',
      600: '#16a34a', // Primary Action
      700: '#15803d',
      900: '#14532d',
    },
    PURPLE: {
      100: '#f3e8ff',
      500: '#a855f7',
      700: '#7e22ce',
    },
  },

  // Status Colors (Signal)
  STATUS: {
    SUCCESS: '#22c55e', // Success operation
    WARNING: '#f59e0b', // Requires attention
    DANGER: '#ef4444', // Critical error
    INFO: '#3b82f6', // Informational
  },

  // UI Colors
  UI: {
    BACKGROUND: '#f8fafc',
    CARD_BG: '#ffffff',
    BORDER: '#e2e8f0',
    TEXT_MAIN: '#1e293b', // slate-800
    TEXT_SUB: '#64748b', // slate-500
    TEXT_MUTED: '#94a3b8', // slate-400
  },
} as const;

// Usage Helper (Tailwind Class Mapping)
// 이 맵핑을 통해 추후 테마 변경 시 한 곳에서 수정 가능
export const THEME_CLASSES = {
  bg: {
    primary: 'bg-green-500',
    secondary: 'bg-slate-100',
    card: 'bg-white',
    danger: 'bg-red-500',
  },
  text: {
    primary: 'text-slate-800',
    secondary: 'text-slate-500',
    accent: 'text-green-600',
    danger: 'text-red-600',
  },
  border: {
    default: 'border-slate-200',
    focused: 'border-green-400',
    error: 'border-red-400',
  },
};
