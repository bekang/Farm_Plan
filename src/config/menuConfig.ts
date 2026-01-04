// Menu Configuration
import {
  LayoutDashboard,
  Sprout,
  Calculator,
  Wallet,
  HelpingHand,
  Tractor,
  Link as LinkIcon,
} from 'lucide-react';

export interface MenuItem {
  id: string; // Unique ID for toggling
  name: string;
  icon: any; // Lucide Icon
  path: string;
  defaultVisible: boolean;
}

export const USER_MENU_ITEMS: MenuItem[] = [
  { id: 'dashboard', name: '대시보드', icon: LayoutDashboard, path: '/dashboard', defaultVisible: true },
  { id: 'ledger', name: '농지 경영 장부', icon: Wallet, path: '/dashboard/financial-ledger', defaultVisible: true },
  { id: 'consulting', name: '종합 영농 컨설팅', icon: Sprout, path: '/dashboard/consulting-report', defaultVisible: true },
  { id: 'farm-mgmt', name: '내 농지 관리', icon: Sprout, path: '/dashboard/farm-dashboard', defaultVisible: true },
  { id: 'planning', name: '농지별 작기 계획하기', icon: Calculator, path: '/dashboard/planning', defaultVisible: true },
  { id: 'support', name: '지원사업 찾기', icon: HelpingHand, path: '/dashboard/support-programs', defaultVisible: true }, // New
  { id: 'rental', name: '농기계 임대사업소 찾기', icon: Tractor, path: '/dashboard/machinery-rental', defaultVisible: true }, // New
  { id: 'links', name: '관련 링크 관리', icon: LinkIcon, path: '/dashboard/link-management', defaultVisible: true }, // New
];
