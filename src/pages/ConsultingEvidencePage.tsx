import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ArrowLeft, CheckCircle2, TrendingUp, CloudSun, AlertCircle } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { CONSULTING_EVIDENCE_DATA } from '@/data/mock/consultingData';

export default function ConsultingEvidencePage() {
  const navigate = useNavigate();
  const data = CONSULTING_EVIDENCE_DATA;

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
                <h4 className="mb-1 font-bold text-slate-800">적합도: {data.climate.score}% ({data.climate.label})</h4>
                <p className="text-sm text-slate-600">
                  {data.climate.description}
                </p>
              </div>
              <div className="w-1/3">
                <div className="mb-1 flex justify-between text-xs text-slate-500">
                  <span>부적합</span>
                  <span>매우 적합</span>
                </div>
                <Progress
                  value={data.climate.score}
                  className="h-2 bg-slate-100"
                  indicatorClassName="bg-orange-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2 rounded bg-slate-50 p-3 text-xs text-slate-500">
              {data.climate.details.map((item, idx) => (
                <div key={idx} className={`text-center ${idx < 2 ? 'border-r border-slate-200' : ''} p-2`}>
                  <span className="block font-bold text-slate-700">{item.label}</span>
                  {item.value}
                </div>
              ))}
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
                <h4 className="font-bold text-slate-800">{data.market.title}</h4>
                <p className="mt-1 text-sm leading-relaxed text-slate-600">
                  {data.market.content}
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
              {data.soil.map((item, idx) => (
                <li key={idx}>{item}</li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
