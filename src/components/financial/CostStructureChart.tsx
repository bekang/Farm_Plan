import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';

interface CostStructureChartProps {
  stats: any; // Using granular type would be better but keeping simple for now
}

const COLORS = ['#ef4444', '#f97316', '#eab308', '#22c55e', '#3b82f6', '#8b5cf6', '#64748b'];

export function CostStructureChart({ stats }: CostStructureChartProps) {
  if (!stats || !stats.categoryBreakdown || !stats.categoryBreakdown.expense) return null;

  const expenseData = Object.entries(stats.categoryBreakdown.expense)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => Number(b.value) - Number(a.value));

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="text-base text-slate-700">지출 구조 분석</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[250px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={expenseData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
              >
                {expenseData.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                formatter={(value: any) => `${Number(value).toLocaleString()}원`}
                contentStyle={{
                  borderRadius: '8px',
                  border: 'none',
                  boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                }}
              />
              <Legend wrapperStyle={{ fontSize: '12px' }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
