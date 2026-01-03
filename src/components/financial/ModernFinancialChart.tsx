import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  Cell,
  RadialBarChart,
  RadialBar,
  Legend
} from 'recharts';

interface ModernFinancialChartProps {
  title: string;
  data: { name: string; value: number; shortName?: string }[];
  type?: 'radial' | 'bar';
}

const COLORS = [
  '#6366f1', // Indigo
  '#10b981', // Emerald
  '#f43f5e', // Rose
  '#f59e0b', // Amber
  '#0ea5e9', // Sky
  '#8b5cf6', // Violet
  '#ec4899', // Pink
];

export function ModernFinancialChart({ title, data, type = 'bar' }: ModernFinancialChartProps) {
  // Graceful empty state
  const validData = data && data.length > 0 ? data.filter(d => d.value > 0) : [];

  if (validData.length === 0) return (
    <Card className="flex h-full flex-col opacity-50 border-slate-200 shadow-sm">
      <CardHeader className="pb-2 pt-4 px-4">
        <CardTitle className="text-sm font-bold text-slate-800 tracking-tight">{title}</CardTitle>
      </CardHeader>
      <CardContent className="flex h-[260px] items-center justify-center text-xs text-slate-400">
        데이터 없음
      </CardContent>
    </Card>
  );

  // Prepare data with distinct colors for Bar/Radial mapping
  const chartData = validData.map((d, i) => ({
    ...d,
    fill: COLORS[i % COLORS.length],
    shortName: d.name.length > 6 && d.name.includes(' ') ? d.name.split(' ')[0] : d.name
  }));

  // Render content based on type
  const renderChart = () => {
    if (type === 'radial') {
      return (
        <ResponsiveContainer width="100%" height="100%">
          <RadialBarChart 
            innerRadius="20%" 
            outerRadius="100%" 
            barSize={16} 
            data={chartData}
            startAngle={180} 
            endAngle={0}
            cx="50%"
            cy="70%"
          >
            <RadialBar
              label={{ position: 'insideStart', fill: '#fff', fontSize: 10, fontWeight: 'bold' }}
              background
              dataKey="value"
              cornerRadius={10} 
            />
            <Legend 
              iconSize={8} 
              layout="horizontal" 
              verticalAlign="bottom" 
              wrapperStyle={{ fontSize: '11px' }}
            />
            <Tooltip 
              cursor={{ fill: 'transparent' }}
              contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
              formatter={(val: any) => [`${(Number(val) || 0).toLocaleString()}원`, '금액']}
            />
          </RadialBarChart>
        </ResponsiveContainer>
      );
    }

    // Default to 'bar' (Horizontal for readability)
    return (
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={chartData}
          layout="vertical"
          margin={{ top: 10, right: 30, left: 30, bottom: 5 }} // Increased left margin for labels
          barSize={24}
        >
          <XAxis type="number" hide />
          <YAxis 
            type="category" 
            dataKey="shortName" 
            tick={{ fontSize: 11, fill: '#475569' }} 
            width={70}
            interval={0}
          />
          <Tooltip
            cursor={{ fill: '#f1f5f9', radius: 4 }}
            contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
            formatter={(val: any) => [`${(Number(val) || 0).toLocaleString()}원`, '금액']}
          />
          <Bar dataKey="value" radius={[0, 4, 4, 0]}>
            {chartData.map((_, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    );
  };

  return (
    <Card className="flex h-full flex-col border-slate-200 shadow-sm overflow-hidden hover:shadow-md transition-all">
      <CardHeader className="pb-0 pt-4 px-4">
        <CardTitle className="text-sm font-bold text-slate-800 tracking-tight">
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="h-[260px] w-full p-2">
        {renderChart()}
      </CardContent>
    </Card>
  );
}
