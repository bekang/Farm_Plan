import { useFinancialLogic } from '@/features/financial/useFinancialLogic';
import { Button } from '@/components/ui/button';
import { Printer, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export function FinancialReportPage() {
  const navigate = useNavigate();
  const { state } = useFinancialLogic();
  const { stats, fieldStats, isLoading } = state; // removed allTransactions

  if (isLoading) {
    return <div className="p-8 text-center">보고서를 생성 중입니다...</div>;
  }

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="mx-auto my-8 min-h-screen max-w-4xl bg-white p-8 shadow-lg print:m-0 print:p-0 print:shadow-none">
      {/* Toolbar (Hidden in Print) */}
      <div className="mb-8 flex items-center justify-between print:hidden">
        <Button variant="ghost" onClick={() => navigate(-1)} className="gap-2">
          <ArrowLeft className="h-4 w-4" /> 뒤로가기
        </Button>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handlePrint}>
            <Printer className="mr-2 h-4 w-4" /> 인쇄
          </Button>
        </div>
      </div>

      {/* Report Content */}
      <div className="space-y-8 text-slate-900">
        <header className="border-b-2 border-slate-900 pb-8 text-center">
          <h1 className="mb-2 font-serif text-3xl font-bold">2023-2024 통합 경영 분석 리포트</h1>
          <p className="text-slate-500">
            꿈을 그리는 농장 | 일자: {new Date().toLocaleDateString()}
          </p>
        </header>

        {/* Executive Summary */}
        <section>
          <h2 className="mb-4 border-b border-slate-300 pb-2 text-xl font-bold">
            1. 재무 요약 (Executive Summary)
          </h2>
          <div className="grid grid-cols-3 gap-8 rounded-lg bg-slate-50 py-6 text-center">
            <div>
              <p className="mb-1 text-slate-500">총 매출액 (Revenue)</p>
              <p className="text-2xl font-bold text-blue-600">
                {(stats?.totalRevenue || 0).toLocaleString()} 원
              </p>
            </div>
            <div>
              <p className="mb-1 text-slate-500">총 지출액 (Expenses)</p>
              <p className="text-2xl font-bold text-red-500">
                {(stats?.totalExpense || 0).toLocaleString()} 원
              </p>
            </div>
            <div>
              <p className="mb-1 text-slate-500">순이익 (Net Income)</p>
              <p className="text-3xl font-bold text-green-600">
                {(stats?.netIncome || 0).toLocaleString()} 원
              </p>
              <p className="text-sm text-green-600/80">이익률 {stats?.profitMargin || 0}%</p>
            </div>
          </div>
        </section>

        {/* Field Performance */}
        <section>
          <h2 className="mb-4 border-b border-slate-300 pb-2 text-xl font-bold">
            2. 농지별 성과 분석 (Field Performance)
          </h2>
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-100 font-bold uppercase text-slate-700">
              <tr>
                <th className="px-4 py-3">농지명</th>
                <th className="px-4 py-3 text-right">매출</th>
                <th className="px-4 py-3 text-right">지출</th>
                <th className="px-4 py-3 text-right">순이익</th>
                <th className="px-4 py-3 text-right">이익률</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {fieldStats && fieldStats.length > 0 ? (
                fieldStats.map((field, idx) => (
                  <tr key={idx}>
                    <td className="px-4 py-3 font-medium">{field.name}</td>
                    <td className="px-4 py-3 text-right">
                      {(field.totalRevenue || 0).toLocaleString()}
                    </td>
                    <td className="px-4 py-3 text-right">
                      {(field.totalExpense || 0).toLocaleString()}
                    </td>
                    <td className="px-4 py-3 text-right font-bold text-green-700">
                      {(field.netProfit || 0).toLocaleString()}
                    </td>
                    <td className="px-4 py-3 text-right">{field.profitMargin || 0}%</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-4 py-3 text-center text-slate-500">
                    데이터가 없습니다.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </section>

        {/* Profit and Loss Statement */}
        <section>
          <h2 className="mb-4 border-b border-slate-300 pb-2 text-xl font-bold">
            3. 손익 계산서 (Income Statement)
          </h2>
          <div className="space-y-4">
            <div className="flex justify-between text-lg font-bold">
              <span>영업 수익 (Operating Revenue)</span>
              <span>{(stats?.totalRevenue || 0).toLocaleString()}</span>
            </div>
            <div className="flex justify-between pl-4 text-slate-600">
              <span>농산물 판매 수익</span>
              <span>{(stats?.totalRevenue || 0).toLocaleString()}</span>
            </div>

            <div className="flex justify-between pt-4 text-lg font-bold">
              <span>영업 비용 (Operating Expenses)</span>
              <span>({(stats?.totalExpense || 0).toLocaleString()})</span>
            </div>
            <div className="space-y-1 pl-4 text-slate-600">
              {/* Mock breakdown */}
              <div className="flex justify-between">
                <span>비료 및 자재비</span>
                <span>(3,250,000)</span>
              </div>
              <div className="flex justify-between">
                <span>인건비</span>
                <span>(1,800,000)</span>
              </div>
              <div className="flex justify-between">
                <span>기타 영농비</span>
                <span>(1,470,000)</span>
              </div>
            </div>

            <div className="flex justify-between border-t border-slate-900 pt-6 text-xl font-bold">
              <span>당기 순이익 (Net Income)</span>
              <span className="text-green-700">{(stats?.netIncome || 0).toLocaleString()}</span>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="pt-16 text-center text-xs text-slate-400">
          <p>본 보고서는 '꿈을 그리는 농장'의 내부 경영 데이터를 바탕으로 생성되었습니다.</p>
          <p>© 2024 Farm Management Systems. All rights reserved.</p>
        </footer>
      </div>
    </div>
  );
}
