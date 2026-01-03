import { Button } from '@/components/ui/button';
import { useFinancialLogic } from '@/features/financial/useFinancialLogic';
import { ICONS } from '@/design/system/icons';
import { cn } from '@/lib/utils';
import { useState, useEffect } from 'react';
import { FinancialOverview } from '@/components/financial/FinancialOverview';
import { FieldFinancialCard } from '@/components/financial/FieldFinancialCard';
import { FinancialPieChart } from '@/components/financial/FinancialPieChart'; // Keep for legacy if needed, or remove
import { ModernFinancialChart } from '@/components/financial/ModernFinancialChart';
import { LedgerTable } from '@/components/financial/LedgerTable';
import { AnalysisReportButton } from '@/components/financial/AnalysisReportButton';
import { FinancialEvidenceButton } from '@/components/financial/FinancialEvidenceButton'; // Added
import { EFFECTS } from '@/design/effects/animations';
import { FinancialService } from '@/services/financialService';
import { Wallet } from 'lucide-react';

export function FinancialLedgerPage() {
  const { state, actions } = useFinancialLogic();
  const { stats, fieldStats, transactions, isLoading } = state;

  // New State for Chart Data
  const [chartData, setChartData] = useState<{
    profitByFarm: any[];
    profitByCrop: any[];
    expenseByFarm: any[];
    expenseByCategory: any[];
  }>({
    profitByFarm: [],
    profitByCrop: [],
    expenseByFarm: [],
    expenseByCategory: [],
  });

  useEffect(() => {
    const loadCharts = async () => {
      // Use filtered transactions from state instead of fetching all again
      const data = await FinancialService.getChartData(transactions);
      setChartData(data);
    };
    loadCharts();
  }, [transactions]); 

  return (
    <div className={cn('space-y-8 pb-12', EFFECTS.ANIMATION.FADE_IN_UP)}>
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="flex items-center gap-2 text-2xl font-bold text-slate-900">
            <Wallet className="h-8 w-8 text-indigo-600" />
            농지 경영 장부
          </h1>
          <p className="text-sm text-slate-500">
            회계 기간: <span className="font-medium text-slate-700">{state.startDate} ~ {state.endDate}</span>
          </p>
        </div>
        
        <div className="flex items-center gap-2">
            <div className="flex items-center gap-2 rounded-lg border bg-white p-1 px-3 shadow-sm">
                <span className="text-xs font-semibold text-slate-500">기간 설정</span>
                <input 
                    type="date" 
                    className="border-none bg-transparent text-sm text-slate-700 outline-none"
                    value={state.startDate}
                    onChange={(e) => actions.setStartDate(e.target.value)}
                />
                <span className="text-slate-400">~</span>
                <input 
                    type="date" 
                    className="border-none bg-transparent text-sm text-slate-700 outline-none"
                    value={state.endDate}
                    onChange={(e) => actions.setEndDate(e.target.value)}
                />
            </div>
            <Button variant="outline" className="gap-2" onClick={actions.exportToExcel}>
            <ICONS.COMMON.SETTINGS className="h-4 w-4" />
            엑셀 다운로드
            </Button>
        </div>
      </div>

      {/* Row 1: Overall Summary */}
      <section>
        <FinancialOverview summary={stats} />
      </section>

      {/* Row 2: 4 Charts */}
      <section className="grid h-[300px] grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        <ModernFinancialChart title="농지별 수익" data={chartData.profitByFarm} type="radial" />
        <ModernFinancialChart title="작물별 수익" data={chartData.profitByCrop} type="bar" />
        <ModernFinancialChart title="농지별 지출" data={chartData.expenseByFarm} type="radial" />
        <ModernFinancialChart title="품목별 지출" data={chartData.expenseByCategory} type="bar" />
      </section>

      {/* Row 3: Farm Specific Data (List style vertical stack based on user feedback to 'scroll down') 
               User wanted 'Below that detailed transaction items' which implies flow. 
               Let's keep cards but make them full width or grid based on clarity. 
               The image suggests maybe list items. Let's try 1 col for clarity if they have detail.
            */}
      <section className="space-y-4">
        <h3 className="text-lg font-bold text-slate-800">농지별 상세 현황</h3>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {fieldStats.map((field, idx) => (
            <FieldFinancialCard key={idx} stats={field} />
          ))}
        </div>
      </section>

      {/* Row 4: Detailed Transaction Table (Scrollable) */}
      <section>
        <h3 className="mb-4 text-lg font-bold text-slate-800">상세 거래 내역</h3>
        <LedgerTable transactions={transactions} isLoading={isLoading} fieldMap={state.fieldMap} />
      </section>

      {/* Row 5: Evidence & Report Buttons */}
      <section className="flex flex-col justify-center gap-4 border-t pt-8 md:flex-row">
        <div className="w-full max-w-sm">
          <FinancialEvidenceButton />
        </div>
        <div className="w-full max-w-sm">
          <AnalysisReportButton />
        </div>
      </section>
    </div>
  );
}
