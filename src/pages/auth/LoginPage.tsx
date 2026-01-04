import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Sprout, CheckCircle2, Loader2, LogIn } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils'; // Keep for consistency if needed, though simpler now

export function LoginPage() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const handleGoogleLogin = () => {
    setIsLoading(true);

    // Mock Google Login Logic
    setTimeout(() => {
      setIsLoading(false);
      
      // Simulating Google User Data
      const mockGoogleUser = {
          name: "김농부",
          email: "farmer@gmail.com",
          photoUrl: "https://github.com/shadcn.png"
      };

      localStorage.setItem('isAuthenticated', 'true');
      localStorage.setItem('userEmail', mockGoogleUser.email);
      localStorage.setItem('googleUser', JSON.stringify(mockGoogleUser));
      
      // SIMULATION: Check if user has completed onboarding (Phone/Address)
      // For demo, let's say "farmer@gmail.com" gives a specific flow
      // Randomly decide if new user for demo purposes, or simulate "New User" on first click
      const hasCompletedOnboarding = localStorage.getItem('hasCompletedOnboarding');

      if (hasCompletedOnboarding === 'true') {
          // Existing User -> Dashboard
          localStorage.setItem('userRole', 'USER'); // Default role
          navigate('/dashboard');
      } else {
          // New User -> Onboarding
          navigate('/onboarding');
      }
    }, 1500);
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
            구글 계정 하나로 간편하게 시작하세요.
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
          </div>
        </div>
      </div>

      {/* Right Side - Login Action */}
      <div className="flex flex-1 items-center justify-center p-6 lg:p-12">
        <div className="w-full max-w-md space-y-8 text-center">
          <div>
            <h3 className="text-3xl font-bold text-slate-900">환영합니다</h3>
            <p className="mt-2 text-slate-500">Google 계정으로 간편하게 시작하세요.</p>
          </div>

          <div className="mt-8 space-y-4">
             <Button
                size="lg"
                className="w-full h-14 text-lg font-medium bg-white text-slate-600 border border-slate-200 hover:bg-slate-50 hover:border-slate-300 shadow-sm relative group transition-all"
                onClick={handleGoogleLogin}
                disabled={isLoading}
             >
                {isLoading ? (
                    <Loader2 className="h-6 w-6 animate-spin text-green-600" />
                ) : (
                    <>
                        {/* Google Logo */}
                        <svg className="absolute left-4 h-6 w-6" viewBox="0 0 24 24">
                             <path
                               fill="#EA4335"
                               d="M12.24 10.285V14.4h6.806c-.275 1.765-2.056 5.174-6.806 5.174-4.095 0-7.439-3.389-7.439-7.574s3.345-7.574 7.439-7.574c2.33 0 3.891.989 4.785 1.849l3.254-3.138C18.189 1.186 15.479 0 12.24 0c-6.635 0-12 5.365-12 12s5.365 12 12 12c6.926 0 11.52-4.869 11.52-11.726 0-.788-.085-1.39-.189-1.989H12.24z"
                             />
                        </svg>
                        <span className="group-hover:text-slate-900 transition-colors">Google 계정으로 계속하기</span>
                    </>
                )}
             </Button>

             <p className="text-xs text-slate-400 mt-6 px-8 leading-relaxed">
                계속 진행함으로써, 꿈을 그리는 농장의 <a href="#" className="underline hover:text-slate-600">이용약관</a> 및 <a href="#" className="underline hover:text-slate-600">개인정보처리방침</a>에 동의하게 됩니다.
             </p>
          </div>
        </div>
        
        {/* Home Link Overlay */}
        <div className="absolute top-6 right-6 lg:top-12 lg:right-12">
           <Link to="/" className="text-sm text-slate-400 hover:text-slate-600 flex items-center gap-1">
             <LogIn className="h-4 w-4" /> 홈으로 이동
           </Link>
        </div>
      </div>
    </div>
  );
}
