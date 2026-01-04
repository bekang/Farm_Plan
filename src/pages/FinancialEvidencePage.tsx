import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ArrowLeft, Calculator, Info, Database } from 'lucide-react';
import { FINANCIAL_EVIDENCE_DATA } from '@/data/mock/financialData';

export default function FinancialEvidencePage() {
  const navigate = useNavigate();
  const data = FINANCIAL_EVIDENCE_DATA;

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
            <CardDescription>{data.revenue.description}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-md border border-slate-200 bg-slate-50 p-4">
              <p className="mb-2 font-mono text-sm font-bold text-slate-700">공식:</p>
              <p className="rounded border bg-white p-2 text-center font-mono text-lg text-blue-600">
                {data.revenue.formula}
              </p>
            </div>
            <ul className="list-disc space-y-2 pl-4 text-sm text-slate-600">
              {data.revenue.items.map((item, idx) => (
                <li key={idx}>{item}</li>
              ))}
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
            <CardDescription>{data.expense.description}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-md border border-slate-200 bg-slate-50 p-4">
              <p className="mb-2 font-mono text-sm font-bold text-slate-700">공식:</p>
              <p className="rounded border bg-white p-2 text-center font-mono text-lg text-red-600">
                {data.expense.formula}
              </p>
            </div>
            <ul className="list-disc space-y-2 pl-4 text-sm text-slate-600">
              {data.expense.items.map((item, idx) => (
                <li key={idx}>{item}</li>
              ))}
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
            {data.sources.map((source, idx) => (
              <div key={idx} className="rounded-lg border p-3 transition-colors hover:bg-slate-50">
                <p className="mb-1 font-bold text-slate-800">{source.name}</p>
                <p className="text-slate-500">{source.desc}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
