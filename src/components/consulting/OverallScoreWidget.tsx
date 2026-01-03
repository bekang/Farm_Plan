import { Card, CardContent } from '@/components/ui/card';
import { ConsultingService } from '@/services/consultingService';

interface OverallScoreWidgetProps {
  score: number;
  grade: 'A' | 'B' | 'C' | 'D' | 'F';
  summary: string;
}

export function OverallScoreWidget({ score, grade, summary }: OverallScoreWidgetProps) {
  const gradeColor = ConsultingService.getGradeColor(grade);

  return (
    <Card className="overflow-hidden border-slate-200">
      <CardContent className="p-6">
        <div className="flex flex-col items-center gap-6 md:flex-row">
          {/* Score Circle */}
          <div className="relative flex h-32 w-32 shrink-0 items-center justify-center">
            <svg className="h-full w-full -rotate-90 transform">
              <circle cx="64" cy="64" r="60" stroke="#f1f5f9" strokeWidth="8" fill="transparent" />
              <circle
                cx="64"
                cy="64"
                r="60"
                stroke="currentColor"
                strokeWidth="8"
                fill="transparent"
                strokeDasharray={377}
                strokeDashoffset={377 - (377 * score) / 100}
                className={gradeColor.replace('bg-', '')} // Use text color driven by grade
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-3xl font-bold text-slate-800">{score}</span>
              <span className={`text-lg font-bold ${gradeColor.split(' ')[0]}`}>Grade {grade}</span>
            </div>
          </div>

          {/* Summary Text */}
          <div className="flex-1 text-center md:text-left">
            <h3 className="mb-2 text-lg font-bold text-slate-800">종합 평가</h3>
            <p className="leading-relaxed text-slate-600">{summary}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
