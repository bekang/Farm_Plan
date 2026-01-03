import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { type ImprovementItem } from '@/services/consultingService';
import { Badge } from '@/components/ui/badge';

interface ImprovementPlanWidgetProps {
  items: ImprovementItem[];
}

export function ImprovementPlanWidget({ items }: ImprovementPlanWidgetProps) {
  const getPriorityColor = (p: string) => {
    if (p === 'high') return 'bg-red-100 text-red-700 hover:bg-red-200';
    if (p === 'medium') return 'bg-amber-100 text-amber-700 hover:bg-amber-200';
    return 'bg-green-100 text-green-700 hover:bg-green-200';
  };

  return (
    <Card className="border-slate-200">
      <CardHeader>
        <CardTitle className="text-lg font-bold text-slate-800">🚀 AI 제안 개선 플랜</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {items.map((item) => (
            <div
              key={item.id}
              className="flex flex-col gap-4 rounded-lg border border-slate-100 bg-slate-50/50 p-4 transition-colors hover:bg-slate-50 md:flex-row"
            >
              <div className="flex-1">
                <div className="mb-2 flex items-center gap-2">
                  <Badge className={getPriorityColor(item.priority)}>
                    {item.priority.toUpperCase()} Priority
                  </Badge>
                  <span className="text-xs text-slate-400">#{item.category.toUpperCase()}</span>
                </div>
                <h4 className="mb-1 font-bold text-slate-800">{item.action}</h4>
                <p className="text-sm text-slate-500">{item.expectedOutcome}</p>
              </div>

              <div className="flex items-center md:justify-end">
                <Badge variant="outline" className="ml-auto bg-white md:ml-0">
                  {item.status === 'completed' ? '완료됨' : '진행 대기'}
                </Badge>
              </div>
            </div>
          ))}

          {items.length === 0 && (
            <div className="py-8 text-center text-slate-500">제안된 개선 사항이 없습니다.</div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
