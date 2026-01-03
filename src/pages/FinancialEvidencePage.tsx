import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ArrowLeft, Calculator, Info, Database } from 'lucide-react';

export default function FinancialEvidencePage() {
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
            <Calculator className="h-6 w-6 text-indigo-600" />
            수입/지출 산출 근거
          </h1>
          <p className="text-sm text-slate-500">
            재무 데이터를 계산한 방식과 데이터 출처에 대한 설명입니다.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {/* Revenue Calculation */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <span className="rounded-full bg-blue-100 p-1.5 text-blue-700">
                <Info className="h-4 w-4" />
              </span>
              수입(매출) 계산 방식
            </CardTitle>
            <CardDescription>농산물 출하로 인한 수익 산출 로직</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-md border border-slate-200 bg-slate-50 p-4">
              <p className="mb-2 font-mono text-sm font-bold text-slate-700">공식:</p>
              <p className="rounded border bg-white p-2 text-center font-mono text-lg text-blue-600">
                매출액 = 출하량(kg) × 공판장 낙찰가(원)
              </p>
            </div>
            <ul className="list-disc space-y-2 pl-4 text-sm text-slate-600">
              <li>
                <strong>출하량 데이터:</strong> 스마트팜 IoT 저울 및 출하 기록 대장에서 자동 수집된
                데이터를 합산합니다.
              </li>
              <li>
                <strong>단가 데이터:</strong> 출하 당시의 실제 도매시장(가락시장 등) 낙찰 데이터
                또는 계약 재배 시 고정 단가를 적용합니다.
              </li>
              <li>
                위탁 수수료 등 제반 비용은 '지출'로 별도 처리하여 총 매출액에는 순수 낙찰 금액만
                반영됩니다.
              </li>
            </ul>
          </CardContent>
        </Card>

        {/* Expense Calculation */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <span className="rounded-full bg-red-100 p-1.5 text-red-700">
                <Info className="h-4 w-4" />
              </span>
              지출(비용) 계산 방식
            </CardTitle>
            <CardDescription>농지 운영에 투입된 총 비용 산출 로직</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-md border border-slate-200 bg-slate-50 p-4">
              <p className="mb-2 font-mono text-sm font-bold text-slate-700">공식:</p>
              <p className="rounded border bg-white p-2 text-center font-mono text-lg text-red-600">
                총 비용 = 고정비 + 변동비
              </p>
            </div>
            <ul className="list-disc space-y-2 pl-4 text-sm text-slate-600">
              <li>
                <strong>변동비:</strong> 종자, 비료, 농약 등 투입재 사용량(재고관리 연동) × 구매
                단가.
              </li>
              <li>
                <strong>인건비:</strong> 일용직 작업 시간 기록(스마트폰 태깅) × 설정된 시급/일당.
              </li>
              <li>
                <strong>고정비:</strong> 임차료, 기계 감가상각비 등 연간 비용을 월/일 단위로
                안분하여 적용합니다.
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>

      {/* Data Sources */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5 text-slate-500" />
            데이터 수집 출처 (Data Sources)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-4 text-sm md:grid-cols-3">
            <div className="rounded-lg border p-3 transition-colors hover:bg-slate-50">
              <p className="mb-1 font-bold text-slate-800">KAMIS (농산물유통정보)</p>
              <p className="text-slate-500">도소매 가격 및 평년 가격 데이터 API 연동</p>
            </div>
            <div className="rounded-lg border p-3 transition-colors hover:bg-slate-50">
              <p className="mb-1 font-bold text-slate-800">농촌진흥청 농사로</p>
              <p className="text-slate-500">표준 소득 자료 및 투입재 표준 비용 데이터</p>
            </div>
            <div className="rounded-lg border p-3 transition-colors hover:bg-slate-50">
              <p className="mb-1 font-bold text-slate-800">Farm IoT System</p>
              <p className="text-slate-500">현장 센서, 작업 일지, 출하 기록 실시간 동기화</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
