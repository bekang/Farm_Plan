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
  Calendar,
  FileText,
  Database,
  Key,
  Users,
  TableProperties,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { USER_MENU_ITEMS } from '@/config/menuConfig';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { FloatingChatBot } from '@/components/features/FloatingChatBot';
import { GlobalHeaderWidgets } from '@/components/layout/GlobalHeaderWidgets';

export const RootLayout: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const location = useLocation();
  // Role State with Persistence
  const [isAdmin, setIsAdmin] = useState(() => {
    return typeof window !== 'undefined' ? sessionStorage.getItem('isAdmin') === 'true' : false;
  });

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  
  const handleToggleAdmin = () => {
      const newState = !isAdmin;
      setIsAdmin(newState);
      sessionStorage.setItem('isAdmin', String(newState));
  };

  // Filter Menus based on Role
  // Load hidden menu items
  const hiddenMenuIds = typeof window !== 'undefined' ? JSON.parse(localStorage.getItem('hidden_menu_items') || '[]') : [];
  
  // Import Config (Assuming import is added at top, but I need to add import line too. Since I can't do two edits in one replace without overlap, I'll do the logic first then import)
  // Actually, I can't use USER_MENU_ITEMS without import. 
  // I will replace the logic here with a temporary robust version, then add import in next step.
  const menuItems = isAdmin
      ? [
        { name: '데이터 관리자', icon: Settings, path: '/dashboard/admin' },
        { name: '재무 증빙 목록', icon: FileText, path: '/dashboard/financial-evidence' },
        { name: '컨설팅 리포트', icon: Database, path: '/dashboard/consulting-evidence' },
        { name: '프로그램 테이블 키 관리', icon: TableProperties, path: '/dashboard/admin/table-config' },
        { name: '프로그램 테이블 관리', icon: LayoutDashboard, path: '/dashboard/admin/structure-viewer' },
        { name: 'API 키 관리', icon: Key, path: '/dashboard/admin/api-config' },
        { name: '사용자 관리', icon: Users, path: '/dashboard/admin/users' },
      ]
    : USER_MENU_ITEMS.filter(item => !hiddenMenuIds.includes(item.id));

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
                  onClick={handleToggleAdmin}
                  className="text-[10px] text-blue-500 underline hover:text-blue-700"
                  title="클릭하여 모드 전환"
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
