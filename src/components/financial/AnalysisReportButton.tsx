import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { FileText } from 'lucide-react';

export function AnalysisReportButton() {
  const navigate = useNavigate();

  return (
    <Button
      variant="default"
      className="h-12 w-full bg-indigo-600 text-lg hover:bg-indigo-700"
      onClick={() => navigate('/dashboard/financial-report')}
    >
      <FileText className="mr-2 h-5 w-5" />
      통합 경영 분석 리포트 보기
    </Button>
  );
}
