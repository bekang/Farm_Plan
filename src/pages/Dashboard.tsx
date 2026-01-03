import { useDashboardLogic } from '@/features/dashboard/useDashboardLogic';

import { FinancialSummary } from '@/features/dashboard/components/FinancialSummary';
import { ScheduleGantt } from '@/features/dashboard/components/ScheduleGantt';
import { ScheduleList } from '@/features/dashboard/components/ScheduleList';
import { QuickAccessMenu } from '@/features/dashboard/components/QuickAccessMenu';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

import { LABELS } from '@/design/content/labels';

export function Dashboard() {
  // 1. Logic & State Management separated into Hook
  const { state } = useDashboardLogic();
  const { stats, schedules } = state;

  return (
    <div className="flex h-full flex-col space-y-6">
      <header className="mb-6 shrink-0">
        <h1 className="text-2xl font-bold text-slate-800">{LABELS.DASHBOARD.TITLE}</h1>
        <p className="text-slate-500">{LABELS.DASHBOARD.SUBTITLE}</p>
      </header>

      {/* 1. Quick Access Section */}
      <QuickAccessMenu />

      {/* 2. Main Content Stack */}
      <div className="mb-8 flex flex-col space-y-6">
        {/* 2.1 Financial Summary */}
        <FinancialSummary data={stats.financial} previousData={stats.financial} />

        {/* 2.2 Schedule Gantt Chart */}
        <Card className="shrink-0 overflow-hidden">
          <CardHeader>
            <CardTitle>전체 농기 스케줄</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <ScheduleGantt
              cycles={schedules}
              fields={state.fields}
              onCycleClick={(id) => console.log('Cycle clicked:', id)}
            />
          </CardContent>
        </Card>


        {/* 2.3 Task List Component */}
        <div className="min-h-0 flex-1">
          <ScheduleList 
            tasks={state.tasks || []} 
            cycles={schedules} 
            fields={state.fields} 
          />
        </div>
      </div>
    </div>
  );
}
