import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { type AIAnalysis } from '@/services/consultingService';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, AlertCircle, HelpCircle } from 'lucide-react';

interface AiAnalysisWidgetProps {
  title: string;
  icon: React.ReactNode;
  analysis: AIAnalysis;
}

export function AiAnalysisWidget({ title, icon, analysis }: AiAnalysisWidgetProps) {
  const getSentimentColor = (s: string) => {
    if (s === 'positive') return 'bg-green-100 text-green-700 border-green-200';
    if (s === 'negative') return 'bg-red-100 text-red-700 border-red-200';
    return 'bg-slate-100 text-slate-700 border-slate-200';
  };

  const getIcon = (s: string) => {
    if (s === 'positive') return <CheckCircle2 className="h-4 w-4 text-green-600" />;
    if (s === 'negative') return <AlertCircle className="h-4 w-4 text-red-600" />;
    return <HelpCircle className="h-4 w-4 text-slate-500" />;
  };

  return (
    <Card className="h-full border-slate-200">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
        <CardTitle className="flex items-center gap-2 text-base font-bold text-slate-800">
          {icon}
          {title}
        </CardTitle>
        <Badge variant="outline" className={getSentimentColor(analysis.sentiment)}>
          {analysis.sentiment.toUpperCase()}
        </Badge>
      </CardHeader>
      <CardContent>
        <p className="mb-3 text-sm font-medium text-slate-800">{analysis.summary}</p>
        <ul className="space-y-2">
          {analysis.details.map((detail, idx) => (
            <li key={idx} className="flex items-start gap-2 text-xs text-slate-500">
              <span className="mt-0.5 flex min-w-[16px] justify-center">
                {getIcon(analysis.sentiment)}
              </span>
              <span>{detail}</span>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
