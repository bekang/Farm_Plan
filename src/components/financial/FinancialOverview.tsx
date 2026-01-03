import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { Wallet, DollarSign, TrendingDown } from 'lucide-react';

interface FinancialOverviewProps {
  summary: {
    totalRevenue: number;
    totalExpense: number;
    netProfit: number;
  } | null;
}

export function FinancialOverview({ summary }: FinancialOverviewProps) {
  if (!summary) return null;

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
      {/* Revenue */}
      <Card className="border-blue-100 bg-gradient-to-br from-blue-50 to-white shadow-sm">
        <CardContent className="flex items-center justify-between p-6">
          <div>
            <p className="mb-1 text-sm font-medium text-blue-600">총 매출액</p>
            <h3 className="text-2xl font-bold text-slate-800">
              {summary.totalRevenue.toLocaleString()}원
            </h3>
          </div>
          <div className="rounded-full bg-blue-100 p-3 text-blue-600">
            <DollarSign className="h-6 w-6" />
          </div>
        </CardContent>
      </Card>

      {/* Expense */}
      <Card className="border-red-100 bg-gradient-to-br from-red-50 to-white shadow-sm">
        <CardContent className="flex items-center justify-between p-6">
          <div>
            <p className="mb-1 text-sm font-medium text-red-600">총 지출액</p>
            <h3 className="text-2xl font-bold text-slate-800">
              {summary.totalExpense.toLocaleString()}원
            </h3>
          </div>
          <div className="rounded-full bg-red-100 p-3 text-red-600">
            <TrendingDown className="h-6 w-6" />
          </div>
        </CardContent>
      </Card>

      {/* Profit */}
      <Card
        className={cn(
          'border shadow-sm',
          summary.netProfit >= 0
            ? 'border-green-100 bg-gradient-to-br from-green-50 to-white'
            : 'border-orange-100 bg-gradient-to-br from-orange-50 to-white',
        )}
      >
        <CardContent className="flex items-center justify-between p-6">
          <div>
            <p
              className={cn(
                'mb-1 text-sm font-medium',
                summary.netProfit >= 0 ? 'text-green-600' : 'text-orange-600',
              )}
            >
              순수익
            </p>
            <h3
              className={cn(
                'text-2xl font-bold',
                summary.netProfit >= 0 ? 'text-green-700' : 'text-orange-700',
              )}
            >
              {summary.netProfit >= 0 ? '+' : ''}
              {summary.netProfit.toLocaleString()}원
            </h3>
          </div>
          <div
            className={cn(
              'rounded-full p-3',
              summary.netProfit >= 0
                ? 'bg-green-100 text-green-600'
                : 'bg-orange-100 text-orange-600',
            )}
          >
            <Wallet className="h-6 w-6" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
