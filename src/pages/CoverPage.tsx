import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Sprout, 
  LineChart, 
  ArrowRight, 
  CheckCircle2, 
  Quote,
  LogIn,
  UserPlus
} from 'lucide-react';
import { Button } from '@/components/ui/button';

export function CoverPage() {
  const navigate = useNavigate();
  const [hoveredService, setHoveredService] = useState<string | null>(null);

  const handleServiceSelect = () => {
    // In a real app, we might store the selected service in context/redux
    navigate('/login');
  };

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-slate-900 text-white font-sans selection:bg-green-500 selection:text-white">
      {/* Background Gradients */}
      <div className="absolute inset-0 z-0">
        <div className="absolute -left-1/4 -top-1/4 h-[800px] w-[800px] rounded-full bg-green-900/40 blur-[120px]" />
        <div className="absolute -bottom-1/4 -right-1/4 h-[600px] w-[600px] rounded-full bg-indigo-900/30 blur-[100px]" />
      </div>

      {/* Main Container */}
      <div className="relative z-10 mx-auto flex min-h-screen max-w-7xl flex-col items-center justify-center px-6 py-12 lg:px-8">
        
        {/* Header / Hero */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16 space-y-4"
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-sm backdrop-blur-md">
            <span className="flex h-2 w-2 rounded-full bg-green-500 animate-pulse"></span>
            <span className="text-slate-300">Future of Agriculture</span>
          </div>
          <h1 className="text-5xl font-extrabold tracking-tight sm:text-7xl bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
            꿈을 그리는 농장
          </h1>
          <p className="mx-auto max-w-2xl text-lg text-slate-400">
            데이터 기반의 정밀 농업과 전문가 컨설팅을 통해<br className="hidden sm:block" />
            당신의 농업을 한 단계 더 스마트하게 만듭니다.
          </p>
        </motion.div>

        {/* Service Selection Cards */}
        <div className="grid w-full max-w-5xl grid-cols-1 gap-8 md:grid-cols-2">
            
            {/* Service 1: Farm Management - Navigate to Login */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              onMouseEnter={() => setHoveredService('farm')}
              onMouseLeave={() => setHoveredService(null)}
              onClick={() => navigate('/login')}
              className={`group cursor-pointer relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-8 transition-all duration-300 hover:border-green-500/50 hover:bg-white/10 ${hoveredService === 'consulting' ? 'opacity-50 blur-[2px]' : 'opacity-100'}`}
            >
               <div className="mb-6 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-green-500/20 text-green-400 group-hover:bg-green-500 group-hover:text-white transition-colors duration-300">
                  <Sprout className="h-7 w-7" />
               </div>
               <h3 className="mb-2 text-2xl font-bold text-white">스마트 영농 관리</h3>
               <p className="mb-6 text-slate-400 group-hover:text-slate-200 transition-colors">
                  작기 계획부터 영농 일지, 자재 관리까지.<br/>
                  모든 농업 활동을 체계적으로 기록하고 관리하세요.
               </p>
               
               <ul className="mb-8 space-y-3 text-sm text-slate-500 group-hover:text-slate-300">
                 <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-green-500" /> 작기별 타임라인 스케줄링</li>
                 <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-green-500" /> 실시간 시장 가격 & 기상 분석</li>
                 <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-green-500" /> 수익성 분석 및 시뮬레이션</li>
               </ul>

               <div className="flex items-center text-sm font-bold text-green-400 group-hover:text-green-300">
                  시작하기 (로그인) <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
               </div>
            </motion.div>

            {/* Service 2: Consulting - No Action */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              onMouseEnter={() => setHoveredService('consulting')}
              onMouseLeave={() => setHoveredService(null)}
              className={`group cursor-not-allowed relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-8 transition-all duration-300 hover:border-slate-500/50 ${hoveredService === 'farm' ? 'opacity-50 blur-[2px]' : 'opacity-100'}`}
            >
               {/* Disabled Overlay */}
               <div className="absolute inset-0 bg-slate-900/60 z-10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                   <span className="text-slate-300 font-medium px-4 py-2 rounded-full border border-white/10 bg-black/50 backdrop-blur-sm">준비 중인 서비스입니다</span>
               </div>

               <div className="mb-6 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-500/20 text-indigo-400 transition-colors duration-300">
                  <LineChart className="h-7 w-7" />
               </div>
               <h3 className="mb-2 text-2xl font-bold text-white">데이터 영농 컨설팅</h3>
               <p className="mb-6 text-slate-400 transition-colors">
                  전문 데이터 분석을 통한 맞춤형 솔루션.<br/>
                  리스크를 줄이고 최고의 생산성을 경험하세요.
               </p>
               
               <ul className="mb-8 space-y-3 text-sm text-slate-500">
                 <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-indigo-500" /> AI 기반 토양/환경 정밀 진단</li>
                 <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-indigo-500" /> 전문가 1:1 영농 리포트</li>
                 <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-indigo-500" /> 보조금 및 지원사업 매칭</li>
               </ul>

               <div className="flex items-center text-sm font-bold text-indigo-400/50">
                  자세히 보기 <ArrowRight className="ml-2 h-4 w-4" />
               </div>
            </motion.div>

        </div>

        {/* Footer / Quote */}
        <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 1 }}
            className="mt-20 flex flex-col items-center text-center opacity-60"
        >
            <Quote className="mb-2 h-6 w-6 text-slate-600" />
            <p className="text-sm font-light text-slate-500 italic">
                "농업은 더 이상 경험이 아닌, 과학이자 데이터입니다."
            </p>
        </motion.div>

      </div>
    </div>
  );
}
