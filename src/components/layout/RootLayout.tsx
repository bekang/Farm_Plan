import { useState } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Sprout,
  Menu,
  X,
  Settings,
  LogOut,
  ChevronRight,
  Calculator,
  Wallet,
  HelpingHand,
  Tractor,
  Link as LinkIcon,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { FloatingChatBot } from '@/components/features/FloatingChatBot';
import { GlobalHeaderWidgets } from '@/components/layout/GlobalHeaderWidgets';

export const RootLayout: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const location = useLocation();
  // Role State (Mock: Toggleable for demo)
  const [isAdmin, setIsAdmin] = useState(false);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  // Filter Menus based on Role
  const menuItems = isAdmin
    ? [{ name: '데이터 관리자', icon: Settings, path: '/dashboard/admin' }]
    : [
        { name: '대시보드', icon: LayoutDashboard, path: '/dashboard' },
        { name: '농지 경영 장부', icon: Wallet, path: '/dashboard/financial-ledger' }, // Added
        { name: '종합 영농 컨설팅', icon: Sprout, path: '/dashboard/consulting-report' }, // Added
        { name: '내 농지 관리', icon: Sprout, path: '/dashboard/farm-dashboard' },
        { name: '농지별 작기 계획하기', icon: Calculator, path: '/dashboard/planning' },
        { name: '지원사업 찾기', icon: HelpingHand, path: '/dashboard/support-programs' }, // New
        { name: '농기계 임대사업소 찾기', icon: Tractor, path: '/dashboard/machinery-rental' }, // New
        { name: '관련 링크 관리', icon: LinkIcon, path: '/dashboard/link-management' }, // New
      ];

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50 font-sans">
      {/* Sidebar - Desktop & Mobile */}
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-40 w-64 transform border-r border-slate-200 bg-white transition-transform duration-200 ease-in-out lg:static lg:inset-0 lg:translate-x-0',
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full',
        )}
      >
        <div className="flex h-full flex-col">
          {/* Logo Area */}
          <div className="flex h-16 items-center border-b border-slate-100 px-6">
            <Link
              to="/dashboard"
              className="flex items-center gap-2 text-xl font-bold text-green-700"
            >
              <span className="text-2xl">🌱</span>
              <span className="tracking-tight">꿈을 그리는 농장</span>
            </Link>
            <button onClick={toggleSidebar} className="ml-auto text-slate-500 lg:hidden">
              <X className="h-6 w-6" />
            </button>
          </div>

          {/* Navigation Menu */}
          <nav className="flex-1 space-y-1 overflow-y-auto px-4 py-6">
            {menuItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={cn(
                    'flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-colors',
                    isActive
                      ? 'bg-green-50 text-green-700'
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900',
                  )}
                  onClick={() => setIsSidebarOpen(false)} // mobile close
                >
                  <item.icon
                    className={cn('h-5 w-5', isActive ? 'text-green-600' : 'text-slate-400')}
                  />
                  {item.name}
                  {isActive && <ChevronRight className="ml-auto h-4 w-4 text-green-600/50" />}
                </Link>
              );
            })}
          </nav>

          {/* Role Indicator (Sidebar Bottom - Optional Info) */}
          <div className="border-t border-slate-100 p-4 text-center text-xs text-slate-400">
            현재 모드: {isAdmin ? '관리자 (Page Manager)' : '사용자 (Farmer)'}
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex min-w-0 flex-1 flex-col">
        {/* Header */}
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-slate-200 bg-white px-4 lg:px-8">
          <div className="flex items-center gap-4">
            <button
              onClick={toggleSidebar}
              className="-ml-2 rounded-md p-2 text-slate-500 hover:bg-slate-100 lg:hidden"
            >
              <Menu className="h-6 w-6" />
            </button>
            <h2 className="hidden text-lg font-bold text-slate-800 md:block">
              {menuItems.find((item) => item.path === location.pathname)?.name || '페이지'}
            </h2>
          </div>

          <div className="flex items-center gap-4">
            {/* Header Widgets (Weather, Pest, Market) */}
            <GlobalHeaderWidgets />

            {/* Settings / Profile Section (Replaces Sidebar Profile) */}
            <div className="flex items-center gap-3 border-l border-slate-200 pl-4">
              {/* Mode Toggle for Demo */}
              <div className="mr-2 flex flex-col items-end">
                <span className="text-xs font-bold text-slate-700">
                  변강현 {isAdmin ? '관리자' : '농부'}님
                </span>
                <button
                  onClick={() => setIsAdmin(!isAdmin)}
                  className="text-[10px] text-blue-500 underline hover:text-blue-700"
                  title="클릭하여 모드 전환 (테스트용)"
                >
                  [{isAdmin ? '사용자 모드로 전환' : '관리자 모드로 전환'}]
                </button>
              </div>

              <Avatar className="h-9 w-9 cursor-pointer border border-slate-200 transition-all hover:ring-2 hover:ring-green-500">
                <AvatarImage src="/placeholder-user.jpg" />
                <AvatarFallback
                  className={cn('text-white', isAdmin ? 'bg-slate-700' : 'bg-green-600')}
                >
                  {isAdmin ? 'M' : 'F'}
                </AvatarFallback>
              </Avatar>

              <div className="flex flex-col gap-1">
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 justify-start px-2 text-xs text-slate-600 hover:bg-slate-100"
                >
                  <Settings className="mr-1 h-3 w-3" />
                  설정 관리
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 justify-start px-2 text-xs text-red-500 hover:bg-red-50 hover:text-red-600"
                >
                  <LogOut className="mr-1 h-3 w-3" />
                  로그아웃
                </Button>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-auto bg-stone-50 p-4 md:p-8">
          <Outlet />
        </main>
      </div>

      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/50 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Global Floating ChatBot */}
      <FloatingChatBot />
    </div>
  );
};
