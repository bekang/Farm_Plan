import { Button } from '@/components/ui/button';
import { Download, RefreshCw } from 'lucide-react';

interface ConsultingHeaderProps {
  onGenerate: () => void;
  onExport: () => void;
  isLoading: boolean;
  hasReport: boolean;
  title?: string;
}

export function ConsultingHeader({
  onGenerate,
  onExport,
  isLoading,
  hasReport,
  title,
}: ConsultingHeaderProps) {
  return (
    <div className="mb-6 flex flex-col justify-between gap-4 md:flex-row md:items-center">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">{title || '종합 영농 컨설팅'}</h1>
        <p className="text-slate-500">AI가 분석한 농지 운영 상태와 개선 제안을 확인하세요.</p>
      </div>

      <div className="flex gap-2">
        <Button
          variant="outline"
          onClick={onExport}
          disabled={!hasReport || isLoading}
          className="flex items-center gap-2"
        >
          <Download className="h-4 w-4" />
          <span className="hidden sm:inline">리포트 다운로드</span>
        </Button>

        <Button
          onClick={onGenerate}
          disabled={isLoading}
          className="flex items-center gap-2 bg-indigo-600 text-white hover:bg-indigo-700"
        >
          <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
          <span>{isLoading ? '분석 중...' : '새 리포트 생성'}</span>
        </Button>
      </div>
    </div>
  );
}
