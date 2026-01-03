import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
// Extend type temporarily if needed or just use intersection type
import type { FinancialSummary } from '@/data/processed/farm_types';

interface ExtendedFinancialSummary extends FinancialSummary {
    name?: string;
}

interface FieldFinancialCardProps {
  stats: ExtendedFinancialSummary;
}

export function FieldFinancialCard({ stats }: FieldFinancialCardProps) {
  // Destructure directly from the passed summary object
  const { fieldId, totalRevenue, netProfit, topExpenseCategories } = stats;
  const isProfitable = netProfit >= 0;
  const profitMargin = totalRevenue > 0 ? (netProfit / totalRevenue) * 100 : 0;

  return (
    <Card className="overflow-hidden border-slate-200 shadow-sm transition-shadow hover:shadow-md">
      <CardHeader className="border-b border-slate-100 bg-slate-50 pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base font-bold text-slate-800">
            {stats.name || `제 ${fieldId} 농지`}
          </CardTitle>
          <Badge variant={isProfitable ? 'default' : 'destructive'} className="font-mono">
            {isProfitable ? '흑자' : '적자'}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4 pt-4">
        {/* Main Metrics */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="mb-1 text-xs text-slate-500">총 수입</p>
            <p className="font-bold text-blue-600">+{totalRevenue.toLocaleString()}</p>
          </div>
          <div>
            <p className="mb-1 text-xs text-slate-500">순수익</p>
            <p className={cn('font-bold', isProfitable ? 'text-green-600' : 'text-red-600')}>
              {isProfitable ? '+' : ''}
              {netProfit.toLocaleString()}
            </p>
          </div>
        </div>

        {/* Profit Margin Bar */}
        <div className="space-y-1">
          <div className="flex justify-between text-xs">
            <span className="text-slate-500">수익률</span>
            <span className={cn('font-medium', isProfitable ? 'text-green-600' : 'text-red-500')}>
              {profitMargin.toFixed(1)}%
            </span>
          </div>
          <Progress value={Math.max(0, Math.min(100, profitMargin))} className="h-1.5" />
        </div>

        {/* Top Expenses List */}
        <div className="border-t border-slate-100 pt-2">
          <p className="mb-2 text-xs font-semibold text-slate-700">주요 지출 항목</p>
          <div className="space-y-2">
            {topExpenseCategories.map((item, i) => (
              <div key={i} className="flex items-center justify-between text-xs">
                <span className="rounded bg-slate-100 px-1.5 py-0.5 text-slate-500">
                  {item.category}
                </span>
                <span className="font-mono text-slate-700">
                  -{item.amount.toLocaleString()} ({item.percentage.toFixed(0)}%)
                </span>
              </div>
            ))}
            {topExpenseCategories.length === 0 && (
              <p className="text-xs text-slate-400">지출 내역 없음</p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
