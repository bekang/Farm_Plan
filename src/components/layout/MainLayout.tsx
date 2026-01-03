import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Sprout,
  Menu,
  X,
  Bell,
  Settings,
  LogOut,
  ChevronRight,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { FloatingChatBot } from '@/components/features/FloatingChatBot';
import { GlobalHeaderWidgets } from '@/components/layout/GlobalHeaderWidgets';

interface MainLayoutProps {
  children: React.ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const location = useLocation();

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  const menuItems = [
    { name: '대시보드', icon: LayoutDashboard, path: '/' },
    { name: '농지 관리', icon: Sprout, path: '/fields' },
    // 추후 추가될 메뉴들
    // { name: '작업 일정', icon: Calendar, path: '/tasks' },
    // { name: '분석 리포트', icon: PieChart, path: '/analytics' },
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
            <Link to="/" className="flex items-center gap-2 text-xl font-bold text-primary">
              <Sprout className="h-6 w-6" />
              <span>꿈을 그리는 농장</span>
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
                      ? 'bg-primary/10 text-primary'
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900',
                  )}
                  onClick={() => setIsSidebarOpen(false)} // mobile close
                >
                  <item.icon
                    className={cn('h-5 w-5', isActive ? 'text-primary' : 'text-slate-400')}
                  />
                  {item.name}
                  {isActive && <ChevronRight className="ml-auto h-4 w-4 text-primary/50" />}
                </Link>
              );
            })}
          </nav>

          {/* User Profile Summary (Bottom Sidebar) */}
          <div className="border-t border-slate-100 p-4">
            <div className="flex items-center gap-3 rounded-lg border border-slate-100 bg-slate-50 p-3">
              <Avatar className="h-10 w-10 border border-slate-200">
                <AvatarImage src="/placeholder-user.jpg" alt="User" />
                <AvatarFallback className="bg-primary/10 text-primary">농부</AvatarFallback>
              </Avatar>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-slate-900">변강현 농부님</p>
                <p className="truncate text-xs text-slate-500">관리자</p>
              </div>
            </div>
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
            <h2 className="hidden text-lg font-semibold text-slate-800 md:block">
              {menuItems.find((item) => item.path === location.pathname)?.name || '페이지'}
            </h2>
          </div>

          <div className="flex items-center gap-2 md:gap-4">
            {/* Header Widgets (Weather, Pest, Market) - Left of Notifications */}
            <GlobalHeaderWidgets />

            <div className="flex items-center gap-2 border-l pl-4">
              <Button variant="ghost" size="icon" className="relative text-slate-500">
                <Bell className="h-5 w-5" />
                <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-red-500"></span>
              </Button>
              <Button variant="ghost" size="icon" className="text-slate-500">
                <Settings className="h-5 w-5" />
              </Button>
              <div className="mx-1 h-6 w-px bg-slate-200"></div>
              <Button variant="ghost" size="sm" className="gap-2 text-slate-500">
                <LogOut className="h-4 w-4" />
                <span className="hidden md:inline">로그아웃</span>
              </Button>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-auto p-4 md:p-8">
          <div className="mx-auto flex h-full max-w-7xl flex-col">{children}</div>
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
}
