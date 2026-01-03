// Design System: Effects & Animations
// 원칙: 애니메이션과 상호작용 스타일을 중앙에서 관리

export const EFFECTS = {
  // Tailwind Animation Classes
  ANIMATION: {
    PULSE_RED: 'animate-pulse border-red-300 bg-red-50 text-red-600',
    PULSE_BLUE: 'animate-pulse border-blue-300 bg-blue-50 text-blue-600',
    PING_RED: 'animate-ping bg-red-500',
    PING_BLUE: 'animate-ping bg-blue-500',
    FADE_IN_DOWN: 'animate-in fade-in slide-in-from-top-2',
    FADE_IN_UP: 'animate-in fade-in slide-in-from-bottom-2',
  },

  // Transition Presets
  TRANSITION: {
    DEFAULT: 'transition-all duration-200 ease-in-out',
    SLOW: 'transition-all duration-500 ease-in-out',
    HOVER_SCALE: 'hover:scale-105 active:scale-95',
  },

  // Interaction States (Hover, Active, Focus)
  INTERACTION: {
    WIDGET_BUTTON: 'hover:bg-slate-50 cursor-pointer',
    CARD_HOVER: 'hover:border-green-400 hover:shadow-md cursor-pointer',
  },
} as const;
