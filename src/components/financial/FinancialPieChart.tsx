import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';

interface FinancialPieChartProps {
  title: string;
  data: { name: string; value: number }[];
  type?: 'pie' | 'donut';
}

// Sophisticated Color Palette (Indigo, Emerald, Rose, Amber, Sky, Violet, Slate)
const COLORS = [
  '#6366f1', // Indigo 500
  '#10b981', // Emerald 500
  '#f43f5e', // Rose 500
  '#f59e0b', // Amber 500
  '#0ea5e9', // Sky 500
  '#8b5cf6', // Violet 500
  '#64748b', // Slate 500
  '#ec4899', // Pink 500
];

export function FinancialPieChart(props: FinancialPieChartProps) {
  const { title, data, type = 'pie' } = props;

  // Filter out zero values for cleaner chart
  const validData = data && data.length > 0 ? data.filter(d => d.value > 0) : [];

  if (validData.length === 0) return (
    <Card className="flex h-full flex-col opacity-50 border-slate-200 shadow-sm">
        <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-700">{title}</CardTitle>
        </CardHeader>
        <CardContent className="flex h-[250px] items-center justify-center text-xs text-slate-400">
            데이터 없음
        </CardContent>
    </Card>
  );

  // Shorten names for clean display
  const chartData = validData.map(d => ({
    ...d,
    shortName: d.name.length > 6 && d.name.includes(' ') ? d.name.split(' ')[0] : d.name
  }));

  // Use percentages for responsive scaling
  const innerRadius = type === 'donut' ? '45%' : '0%';
  const outerRadius = '70%'; // 70% of the container's min dimension

  return (
    <Card className="flex h-full flex-col border-slate-200 shadow-sm overflow-hidden hover:shadow-md transition-all">
      <CardHeader className="pb-2 pt-4 px-4">
        <CardTitle className="text-sm font-bold text-slate-800 tracking-tight">
            {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="h-[260px] w-full p-0">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart margin={{ top: 10, right: 10, bottom: 10, left: 10 }}>
            <Pie
              data={chartData}
              cx="50%"
              cy="45%"
              innerRadius={innerRadius}
              outerRadius={outerRadius}
              paddingAngle={2}
              dataKey="value"
              nameKey="shortName" 
              startAngle={90}
              endAngle={-270}
              stroke="white"
              strokeWidth={2}
            >
              {chartData.map((_, index) => (
                <Cell 
                    key={`cell-${index}`} 
                    fill={COLORS[index % COLORS.length]} 
                />
              ))}
            </Pie>
            <Tooltip
              formatter={(value: any) => [`${Number(value).toLocaleString()}원`, '금액']}
              contentStyle={{
                borderRadius: '8px',
                border: '1px solid #e2e8f0',
                boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                padding: '8px 12px',
                fontSize: '11px'
              }}
              itemStyle={{ color: '#0f172a', fontWeight: 600 }}
            />
            <Legend 
                layout="horizontal"
                verticalAlign="bottom"
                align="center"
                iconType="circle"
                iconSize={6}
                wrapperStyle={{ 
                    paddingTop: '0px',
                    paddingBottom: '10px',
                    fontSize: '10px',
                    width: '100%',
                    display: 'flex',
                    flexWrap: 'wrap',
                    justifyContent: 'center',
                    gap: '4px'
                }}
                formatter={(value) => <span className="text-slate-600 ml-1">{value}</span>}
            />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
