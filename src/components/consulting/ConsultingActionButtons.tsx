import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { FileText, CheckCircle2 } from 'lucide-react';

export function ConsultingActionButtons({ onGenerateReport }: { onGenerateReport: () => void }) {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center gap-4 rounded-xl border border-slate-200 bg-slate-50 p-6 md:flex-row">
      {/* Integrated Report Button (Triggers PDF Download - Simulated) */}
      <Button
        onClick={onGenerateReport}
        className="h-12 w-full gap-2 bg-indigo-600 px-6 text-white hover:bg-indigo-700 md:w-auto"
      >
        <FileText className="h-5 w-5" />
        통합 분석 리포트 다운로드
      </Button>

      {/* Evidence Page Button */}
      <Button
        variant="outline"
        onClick={() => navigate('/dashboard/consulting-evidence')}
        className="h-12 w-full gap-2 border-indigo-200 px-6 text-indigo-700 hover:bg-indigo-50 md:w-auto"
      >
        <CheckCircle2 className="h-5 w-5" />
        분석/제안 근거 확인하기
      </Button>
    </div>
  );
}
