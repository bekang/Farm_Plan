import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { LABELS } from '@/design/content/labels';
import type { FinancialTransaction } from '@/data/processed/farm_types';

interface LedgerTableProps {
  transactions: FinancialTransaction[];
  isLoading: boolean;
  fieldMap?: Record<string, string>;
}

export function LedgerTable({ transactions, isLoading, fieldMap = {} }: LedgerTableProps) {
  // Scrollable Table Implementation
  return (
    <Card className="flex h-full flex-col">
      <CardHeader className="flex flex-row items-center justify-between py-4">
        <CardTitle>상세 거래 내역</CardTitle>
        <div className="text-sm text-slate-500">총 {transactions.length}건</div>
      </CardHeader>
      <CardContent className="relative min-h-0 flex-1 p-0">
        {isLoading ? (
          <div className="flex h-64 items-center justify-center text-slate-400">
            {LABELS.COMMON.LOADING}
          </div>
        ) : (
          <div className="h-[500px] overflow-auto border-t">
            <table className="relative w-full text-left text-sm">
              <thead className="sticky top-0 z-10 border-b bg-slate-50 shadow-sm">
                <tr>
                  <th className="h-10 w-[120px] bg-slate-50 px-4 font-medium text-slate-500">
                    날짜
                  </th>
                  <th className="h-10 w-[100px] bg-slate-50 px-4 font-medium text-slate-500">
                    농지
                  </th>
                  <th className="h-10 w-[80px] bg-slate-50 px-4 font-medium text-slate-500">
                    구분
                  </th>
                  <th className="h-10 w-[120px] bg-slate-50 px-4 font-medium text-slate-500">
                    분류
                  </th>
                  <th className="h-10 bg-slate-50 px-4 font-medium text-slate-500">내용</th>
                  <th className="h-10 w-[120px] bg-slate-50 px-4 text-right font-medium text-slate-500">
                    금액
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {transactions.length > 0 ? (
                  transactions.map((t) => (
                    <tr key={t.id} className="transition-colors hover:bg-slate-50/50">
                      <td className="p-3 font-mono text-xs text-slate-500">{t.date}</td>
                      <td className="p-3">
                        <Badge variant="outline" className="text-[10px] font-normal text-slate-500">
                          {fieldMap[t.field_id] || `농지 ${t.field_id}`}
                        </Badge>
                      </td>
                      <td className="p-3">
                        <span
                          className={cn(
                            'inline-flex items-center rounded px-2 py-0.5 text-[10px] font-medium',
                            t.type === 'income'
                              ? 'bg-blue-50 text-blue-700'
                              : 'bg-red-50 text-red-700',
                          )}
                        >
                          {t.type === 'income' ? '수입' : '지출'}
                        </span>
                      </td>
                      <td className="p-3 font-medium text-slate-600">{t.category}</td>
                      <td
                        className="max-w-[300px] truncate p-3 text-slate-600"
                        title={t.description}
                      >
                        {t.description}
                      </td>
                      <td
                        className={cn(
                          'p-3 text-right font-mono font-medium',
                          t.type === 'income' ? 'text-blue-600' : 'text-red-600',
                        )}
                      >
                        {t.type === 'income' ? '+' : '-'}
                        {t.amount.toLocaleString()}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="h-24 text-center text-xs text-slate-400">
                      거래 내역이 없습니다.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
