import { useEffect } from 'react';
import { useConsultingLogic } from '@/features/consulting/useConsultingLogic';
import { ConsultingHeader } from '@/components/consulting/ConsultingHeader';
import { OverallScoreWidget } from '@/components/consulting/OverallScoreWidget';
import { AiAnalysisWidget } from '@/components/consulting/AiAnalysisWidget';
import { ImprovementPlanWidget } from '@/components/consulting/ImprovementPlanWidget';
import { CloudRain, Sprout, Bug, Factory, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ConsultingActionButtons } from '@/components/consulting/ConsultingActionButtons';

export function ConsultingReportPage() {
  const { state, actions } = useConsultingLogic();
  const { report, isLoading, error } = state;

  // Auto-load if fieldId is present in Query String
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const fieldId = params.get('fieldId');
    if (fieldId) {
      actions.generateReport(fieldId);
    }
  }, [actions.generateReport]);

  return (
    <div className="flex h-full flex-col space-y-6 overflow-y-auto pb-10">
      <ConsultingHeader
        onGenerate={actions.generateReport}
        onExport={actions.exportReport}
        isLoading={isLoading}
        hasReport={!!report}
      />

      {/* New Action Buttons (Evidence & Download) */}
      {report && <ConsultingActionButtons onGenerateReport={actions.exportReport} />}

      {error && (
        <div className="flex items-center gap-2 rounded-lg bg-red-50 p-4 text-red-600">
          <AlertTriangle className="h-5 w-5" />
          {error}
        </div>
      )}

      {!report && !isLoading && !error && (
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-slate-200 bg-slate-50 py-20">
          <Sprout className="mb-4 h-16 w-16 text-slate-300" />
          <h3 className="mb-2 text-lg font-bold text-slate-600">아직 생성된 리포트가 없습니다.</h3>
          <p className="mb-6 text-slate-500">
            "새 리포트 생성" 버튼을 눌러 AI 농지 정밀 진단을 받아보세요.
          </p>
          <Button onClick={() => actions.generateReport('1')} className="bg-indigo-600 hover:bg-indigo-700">
            지금 분석 시작하기
          </Button>
        </div>
      )}

      {report && (
        <div className="space-y-6 duration-500 animate-in fade-in slide-in-from-bottom-5">
          {/* 1. Overall Score */}
          <OverallScoreWidget
            score={report.overallScore}
            grade={report.scoreGrade}
            summary={report.analysis.soil.summary} // Using soil summary as generic for now, or add general summary
          />

          {/* 2. Detailed Grid */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
            <AiAnalysisWidget
              title="토양 건강"
              icon={<Sprout className="h-5 w-5 text-green-600" />}
              analysis={report.analysis.soil}
            />
            <AiAnalysisWidget
              title="기상 환경"
              icon={<CloudRain className="h-5 w-5 text-blue-600" />}
              analysis={report.analysis.weather}
            />
            <AiAnalysisWidget
              title="병해충 위험"
              icon={<Bug className="h-5 w-5 text-red-600" />}
              analysis={report.analysis.pest}
            />
            <AiAnalysisWidget
              title="운영 효율"
              icon={<Factory className="h-5 w-5 text-purple-600" />}
              analysis={report.analysis.efficiency}
            />
          </div>

          {/* 3. Improvement Plan */}
          <ImprovementPlanWidget items={report.improvementPlan} />
        </div>
      )}
    </div>
  );
}
