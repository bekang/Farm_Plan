// Design System: Icons & Assets
// 원칙: 아이콘 라이브러리 교체나 이미지 경로 변경 시 이 파일만 수정하면 됨

import {
  CloudSun,
  CloudRain,
  Snowflake,
  Cloud,
  Sun,
  Bug,
  TrendingUp,
  X,
  MapPin,
  BookOpen,
  Sparkles,
  ChevronRight,
  Activity,
  ArrowRight,
  Leaf,
  Droplets,
  Wind,
} from 'lucide-react';

export const ICONS = {
  WEATHER: {
    DEFAULT: CloudSun,
    SUN: Sun,
    RAIN: CloudRain,
    SNOW: Snowflake,
    CLOUD: Cloud,
  },
  PEST: {
    DEFAULT: Bug,
  },
  MARKET: {
    DEFAULT: TrendingUp,
  },
  COMMON: {
    CLOSE: X,
    LOCATION: MapPin,
    ARROW_RIGHT: ArrowRight,
    CHEVRON_RIGHT: ChevronRight,
    SETTINGS: Sparkles, // Example mapping
  },
  MENU: {
    LEDGER: BookOpen,
    REPORT: Sparkles,
    DASHBOARD: Activity,
  },
  FARM: {
    FIELD: MapPin,
    CROP: Leaf,
    WATER: Droplets,
    WIND: Wind,
  },
} as const;
