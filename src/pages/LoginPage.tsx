import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sprout, Lock, User, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

export function LoginPage() {
  const navigate = useNavigate();
  const [role, setRole] = useState<'farmer' | 'admin'>('farmer');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      // In a real app, you would set auth context here
      navigate('/dashboard');
    }, 1000);
  };

  return (
    <div className="flex min-h-screen w-full bg-stone-50">
      {/* Left Side - Hero / Branding */}
      <div className="relative hidden w-1/2 items-center justify-center overflow-hidden bg-green-900 lg:flex">
        {/* Background Pattern/Image Overlay */}
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1500382017468-9049fed747ef?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80')] bg-cover bg-center opacity-40 mix-blend-overlay"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-green-900/90 via-green-900/40 to-transparent"></div>

        <div className="relative z-10 max-w-xl p-12 text-white">
          <div className="mb-6 flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-white/30 bg-white/20 backdrop-blur-md">
              <Sprout className="h-7 w-7 text-green-300" />
            </div>
            <h1 className="text-3xl font-bold tracking-tight">꿈을 그리는 농장</h1>
          </div>
          <h2 className="mb-6 text-4xl font-bold leading-tight">
            데이터로 짓는
            <br />
            <span className="text-green-300">스마트 농업</span>의 시작
          </h2>
          <p className="mb-8 text-lg leading-relaxed text-green-100/80">
            복잡한 농지 관리는 이제 그만. <br />
            빅데이터 분석과 수익 시뮬레이션으로 <br />
            당신의 농지를 체계적으로 경영하세요.
          </p>

          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="h-5 w-5 text-green-400" />
              <span className="text-sm font-medium text-green-50">실시간 수익 시뮬레이션</span>
            </div>
            <div className="flex items-center gap-3">
              <CheckCircle2 className="h-5 w-5 text-green-400" />
              <span className="text-sm font-medium text-green-50">맞춤형 영농 스케줄 관리</span>
            </div>
            <div className="flex items-center gap-3">
              <CheckCircle2 className="h-5 w-5 text-green-400" />
              <span className="text-sm font-medium text-green-50">AI 기반 병해충 예찰 알림</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="flex flex-1 items-center justify-center p-6 lg:p-12">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center lg:text-left">
            <h3 className="text-2xl font-bold text-slate-900">로그인</h3>
            <p className="mt-2 text-sm text-slate-500">서비스 이용을 위해 로그인해주세요.</p>
          </div>

          {/* Role Selector Tabs */}
          <div className="grid grid-cols-2 gap-1 rounded-xl bg-slate-100 p-1">
            <button
              onClick={() => setRole('farmer')}
              className={cn(
                'flex items-center justify-center gap-2 rounded-lg py-2.5 text-sm font-medium transition-all',
                role === 'farmer'
                  ? 'border border-slate-200 bg-white text-green-700 shadow-sm'
                  : 'text-slate-500 hover:bg-slate-200/50 hover:text-slate-700',
              )}
            >
              <User className="h-4 w-4" />
              농부 (사용자)
            </button>
            <button
              onClick={() => setRole('admin')}
              className={cn(
                'flex items-center justify-center gap-2 rounded-lg py-2.5 text-sm font-medium transition-all',
                role === 'admin'
                  ? 'border border-slate-200 bg-white text-blue-700 shadow-sm'
                  : 'text-slate-500 hover:bg-slate-200/50 hover:text-slate-700',
              )}
            >
              <Lock className="h-4 w-4" />
              관리자
            </button>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">이메일</label>
              <Input
                type="email"
                placeholder={role === 'farmer' ? 'farmer@example.com' : 'admin@example.com'}
                className="h-11 bg-white"
                required
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-slate-700">비밀번호</label>
                <a href="#" className="text-xs text-green-600 hover:underline">
                  비밀번호 찾기
                </a>
              </div>
              <Input type="password" placeholder="••••••••" className="h-11 bg-white" required />
            </div>

            <Button
              type="submit"
              className={cn(
                'h-11 w-full text-base font-bold',
                role === 'farmer'
                  ? 'bg-green-600 hover:bg-green-700'
                  : 'bg-slate-800 hover:bg-slate-900',
              )}
              disabled={isLoading}
            >
              {isLoading ? '로그인 중...' : '로그인'}
            </Button>
          </form>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-slate-200" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-stone-50 px-2 text-slate-500">또는 소셜 로그인</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Button
              variant="outline"
              className="h-11 border-slate-200 hover:border-slate-300 hover:bg-white"
            >
              <svg className="mr-2 h-5 w-5" viewBox="0 0 24 24">
                <path
                  fill="#03C75A"
                  d="M16.273 12.845L7.376 0H0v24h7.726V11.156L16.624 24H24V0h-7.727v12.845z"
                />
              </svg>
              네이버
            </Button>
            <Button
              variant="outline"
              className="h-11 border-slate-200 hover:border-slate-300 hover:bg-white"
            >
              <svg className="mr-2 h-5 w-5" viewBox="0 0 24 24">
                <path
                  fill="#EA4335"
                  d="M12.24 10.285V14.4h6.806c-.275 1.765-2.056 5.174-6.806 5.174-4.095 0-7.439-3.389-7.439-7.574s3.345-7.574 7.439-7.574c2.33 0 3.891.989 4.785 1.849l3.254-3.138C18.189 1.186 15.479 0 12.24 0c-6.635 0-12 5.365-12 12s5.365 12 12 12c6.926 0 11.52-4.869 11.52-11.726 0-.788-.085-1.39-.189-1.989H12.24z"
                />
              </svg>
              Google
            </Button>
          </div>

          <p className="text-center text-sm text-slate-500">
            계정이 없으신가요?{' '}
            <a href="#" className="font-bold text-green-600 hover:underline">
              회원가입
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
