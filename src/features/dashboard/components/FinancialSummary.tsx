import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowUpRight, ArrowDownRight, DollarSign, Wallet, TrendingUp } from 'lucide-react';

interface FinancialSummaryProps {
  data: {
    revenue: number;
    expense: number;
    net_profit: number;
    revenue_growth: number;
    expense_growth: number;
  };
  previousData?: {
    revenue: number;
    expense: number;
    net_profit: number;
    revenue_growth: number;
    expense_growth: number;
  };
}

export function FinancialSummary({ data }: FinancialSummaryProps) {
  // Format currency
  const formatMoney = (amount: number) => {
    return new Intl.NumberFormat('ko-KR', { style: 'currency', currency: 'KRW' }).format(amount);
  };

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
      {/* Revenue Card */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-nowrap text-sm font-medium text-slate-500">
            총 매출 (예상)
          </CardTitle>
          <DollarSign className="h-4 w-4 shrink-0 text-emerald-500" />
        </CardHeader>
        <CardContent>
          <div className="break-words text-xl font-bold text-slate-800 lg:text-2xl">
            {formatMoney(data.revenue)}
          </div>
          <p className="mt-1 flex flex-wrap items-center text-xs text-muted-foreground">
            <span
              className={
                data.revenue_growth >= 0
                  ? 'flex shrink-0 items-center text-emerald-500'
                  : 'flex shrink-0 items-center text-red-500'
              }
            >
              {data.revenue_growth >= 0 ? (
                <ArrowUpRight className="mr-1 h-4 w-4" />
              ) : (
                <ArrowDownRight className="mr-1 h-4 w-4" />
              )}
              {Math.abs(data.revenue_growth)}%
            </span>
            <span className="ml-1 text-nowrap">전년 대비</span>
          </p>
        </CardContent>
      </Card>

      {/* Expense Card */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-nowrap text-sm font-medium text-slate-500">총 지출</CardTitle>
          <Wallet className="h-4 w-4 shrink-0 text-red-500" />
        </CardHeader>
        <CardContent>
          <div className="break-words text-xl font-bold text-slate-800 lg:text-2xl">
            {formatMoney(data.expense)}
          </div>
          <p className="mt-1 flex flex-wrap items-center text-xs text-muted-foreground">
            <span
              className={
                data.expense_growth <= 0
                  ? 'flex shrink-0 items-center text-emerald-500'
                  : 'flex shrink-0 items-center text-red-500'
              }
            >
              {/* Expense going down is green (good), up is red (bad) */}
              {data.expense_growth > 0 ? (
                <ArrowUpRight className="mr-1 h-4 w-4" />
              ) : (
                <ArrowDownRight className="mr-1 h-4 w-4" />
              )}
              {Math.abs(data.expense_growth)}%
            </span>
            <span className="ml-1 text-nowrap">전년 대비</span>
          </p>
        </CardContent>
      </Card>

      {/* Net Profit Card */}
      <Card className="border-emerald-100 bg-emerald-50">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-nowrap text-sm font-medium text-emerald-700">순수익</CardTitle>
          <TrendingUp className="h-4 w-4 shrink-0 text-emerald-600" />
        </CardHeader>
        <CardContent>
          <div className="break-words text-xl font-bold text-emerald-700 lg:text-2xl">
            {formatMoney(data.net_profit)}
          </div>
          <p className="mt-1 flex-wrap text-xs text-emerald-600/80">
            매출 이익률 {((data.net_profit / data.revenue) * 100).toFixed(1)}%
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
