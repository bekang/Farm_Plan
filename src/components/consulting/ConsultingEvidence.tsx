import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { CloudSun, TrendingUp, CheckCircle2, AlertCircle } from 'lucide-react';

export function ConsultingEvidence() {
  return (
    <Card className="mt-8 border-indigo-100 bg-indigo-50/30">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-indigo-900">
          <span className="rounded-full bg-indigo-100 p-1.5">
            <CheckCircle2 className="h-5 w-5 text-indigo-700" />
          </span>
          AI 컨설팅 근거 자료 (Evidence)
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* 1. Climate Match */}
        <div className="rounded-lg border border-indigo-100 bg-white p-5 shadow-sm">
          <div className="mb-3 flex items-start gap-4">
            <div className="rounded-lg bg-orange-100 p-2">
              <CloudSun className="h-6 w-6 text-orange-600" />
            </div>
            <div className="flex-1">
              <h4 className="mb-1 font-bold text-slate-800">기후 적합성 분석: 92% 적합</h4>
              <p className="text-sm leading-relaxed text-slate-600">
                선택된 작물(홍고추)은 생육 최적 온도가 <strong>25~30℃</strong>입니다. 현재 해당
                지역(전남 나주)의 최근 10년 8월 평균 기온은 27.5℃로 작물 생육에{' '}
                <span className="font-bold text-green-600">최적의 조건</span>을 갖추고 있습니다.
                또한 강수량 패턴 분석 결과, 수확기(9월) 강수 확률이 평년 대비 15% 낮아 탄저병 발생
                위험이 낮을 것으로 예측됩니다.
              </p>
            </div>
          </div>
          <div className="pl-12">
            <div className="mb-1 flex justify-between text-xs text-slate-500">
              <span>부적합</span>
              <span>매우 적합</span>
            </div>
            <Progress value={92} className="h-2 bg-slate-100" indicatorClassName="bg-orange-500" />
          </div>
        </div>

        {/* 2. Market Analysis */}
        <div className="rounded-lg border border-indigo-100 bg-white p-5 shadow-sm">
          <div className="mb-3 flex items-start gap-4">
            <div className="rounded-lg bg-blue-100 p-2">
              <TrendingUp className="h-6 w-6 text-blue-600" />
            </div>
            <div className="flex-1">
              <h4 className="mb-1 font-bold text-slate-800">시장성 및 도매가격 전망: 양호</h4>
              <p className="text-sm leading-relaxed text-slate-600">
                최근 5개년 도매시장 데이터를 분석한 결과, 9월 추석 시즌 직전 홍고추 수요가 급증하여
                평균 시세가
                <span className="font-bold text-red-500"> kg당 12,000원</span> 선을 형성합니다. 현재
                재배 면적 데이터를 기반으로 예측했을 때, 올해 공급량은 평년과 비슷할 것으로
                보이나(전년비 -2%), 수입 김치 파동으로 인한 국산 고추 소비 심리 회복이 가격을 지지할
                것으로 판단됩니다.
              </p>
            </div>
          </div>
          <div className="mt-2 border-t border-slate-50 pl-12 pt-2">
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <AlertCircle className="h-3 w-3" />
              <span>예측 근거: KAMIS 5년치 월별 평균가 + 농업관측센터 재배 의향 조사 결과</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
