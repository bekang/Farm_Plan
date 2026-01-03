import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ArrowLeft, CheckCircle2, TrendingUp, CloudSun, AlertCircle } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

export default function ConsultingEvidencePage() {
  const navigate = useNavigate();

  return (
    <div className="mx-auto max-w-4xl space-y-6 pb-12">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="flex items-center gap-2 text-2xl font-bold text-slate-900">
            <CheckCircle2 className="h-6 w-6 text-indigo-600" />
            컨설팅 근거 자료 (Evidence)
          </h1>
          <p className="text-sm text-slate-500">
            AI 농지 정밀 진단 및 추천의 기반이 되는 데이터 분석 근거입니다.
          </p>
        </div>
      </div>

      <div className="space-y-6 duration-500 animate-in slide-in-from-bottom-4">
        {/* 1. Climate Match */}
        <Card className="border-indigo-100 shadow-sm">
          <CardHeader className="border-b border-indigo-50 bg-indigo-50/30">
            <CardTitle className="flex items-center gap-2 text-indigo-900">
              <CloudSun className="h-5 w-5 text-orange-600" />
              기후 적합성 분석 (Climate Suitability)
            </CardTitle>
            <CardDescription>
              재배 작물(홍고추)의 생육 조건과 현재 농지 기후 데이터 비교
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 pt-6">
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <h4 className="mb-1 font-bold text-slate-800">적합도: 92% (매우 적합)</h4>
                <p className="text-sm text-slate-600">
                  최근 10년 8월 평균 기온 <strong>27.5℃</strong>는 홍고추 생육 최적 온도(25~30℃)
                  범위 내에 완벽하게 포함됩니다.
                </p>
              </div>
              <div className="w-1/3">
                <div className="mb-1 flex justify-between text-xs text-slate-500">
                  <span>부적합</span>
                  <span>매우 적합</span>
                </div>
                <Progress
                  value={92}
                  className="h-2 bg-slate-100"
                  indicatorClassName="bg-orange-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2 rounded bg-slate-50 p-3 text-xs text-slate-500">
              <div className="border-r border-slate-200 p-2 text-center">
                <span className="block font-bold text-slate-700">평균 기온</span>
                27.5℃ (적정)
              </div>
              <div className="border-r border-slate-200 p-2 text-center">
                <span className="block font-bold text-slate-700">강수량</span>
                평년비 85% (양호)
              </div>
              <div className="p-2 text-center">
                <span className="block font-bold text-slate-700">일조시간</span>
                185hr/월 (매우 우수)
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 2. Market Analysis */}
        <Card className="border-indigo-100 shadow-sm">
          <CardHeader className="border-b border-indigo-50 bg-indigo-50/30">
            <CardTitle className="flex items-center gap-2 text-indigo-900">
              <TrendingUp className="h-5 w-5 text-blue-600" />
              시장성 및 가격 전망 (Market Analysis)
            </CardTitle>
            <CardDescription>KAMIS 도매시장 가격 트렌드 및 수급 전망 기반 분석</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 pt-6">
            <div className="flex items-start gap-3">
              <AlertCircle className="mt-0.5 h-5 w-5 text-blue-500" />
              <div>
                <h4 className="font-bold text-slate-800">예상 출하 시기(9월) 가격 강세 전망</h4>
                <p className="mt-1 text-sm leading-relaxed text-slate-600">
                  전년 대비 재배 면적이 2% 감소하여 공급 부족이 예상됩니다. 특히 김장철을 앞둔
                  9월~11월 사이 수요가 급증하는 패턴(계절 지수 1.2)을 고려할 때, 평년 대비 약{' '}
                  <strong>15~20% 높은 시세</strong>가 형성될 것으로 예측됩니다.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 3. Soil Analysis Details */}
        <Card className="border-indigo-100 shadow-sm">
          <CardHeader className="border-b border-indigo-50 bg-indigo-50/30">
            <CardTitle className="flex items-center gap-2 text-indigo-900">
              <span className="text-xl">🌱</span>
              토양 정밀 분석 결과
            </CardTitle>
            <CardDescription>스마트팜 IoT 센서 수집 데이터 기반</CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <ul className="list-disc space-y-2 pl-5 text-sm text-slate-600">
              <li>
                <strong>pH 농도:</strong> 6.5 (중성) - 대부분의 작물에 적합하며 양분 흡수율이 높음.
              </li>
              <li>
                <strong>유기물 함량:</strong> 2.8% - 권장범위(3.0~5.0%) 대비 약간 부족. 추비 시
                유기질 비료 권장.
              </li>
              <li>
                <strong>EC (전기전도도):</strong> 1.2 dS/m - 염류 집적 없이 안정적인 상태.
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
