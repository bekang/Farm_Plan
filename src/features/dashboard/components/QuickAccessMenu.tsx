import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { BookOpen, Sparkles, ChevronRight } from 'lucide-react';

export function QuickAccessMenu() {
  return (
    <div className="mb-6">
      <h2 className="mb-4 flex items-center gap-2 text-xl font-bold text-slate-800">
        📝 농장 경영 & 분석
      </h2>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <Link to="/dashboard/financial-ledger" className="group">
          <Card className="h-full cursor-pointer border-slate-200 bg-white transition-all hover:border-green-400 hover:shadow-md">
            <CardContent className="flex items-center gap-4 p-6">
              <div className="rounded-full bg-green-100 p-3 text-green-600 transition-transform group-hover:scale-110">
                <BookOpen className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-800 group-hover:text-green-700">
                  농장 경영 장부
                </h3>
                <p className="text-sm text-slate-500">
                  전체 농지의 매출/지출/순수익 상세 내역 확인
                </p>
              </div>
              <ChevronRight className="ml-auto h-5 w-5 text-slate-300 group-hover:text-green-500" />
            </CardContent>
          </Card>
        </Link>

        <Link to="/dashboard/consulting-report" className="group">
          <Card className="h-full cursor-pointer border-slate-200 bg-white transition-all hover:border-purple-400 hover:shadow-md">
            <CardContent className="flex items-center gap-4 p-6">
              <div className="rounded-full bg-purple-100 p-3 text-purple-600 transition-transform group-hover:scale-110">
                <Sparkles className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-800 group-hover:text-purple-700">
                  종합 영농 컨설팅
                </h3>
                <p className="text-sm text-slate-500">AI 기반 전체 농장 운영 진단 및 리포트</p>
              </div>
              <ChevronRight className="ml-auto h-5 w-5 text-slate-300 group-hover:text-purple-500" />
            </CardContent>
          </Card>
        </Link>
      </div>
    </div>
  );
}
