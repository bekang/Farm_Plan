import { useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Download } from 'lucide-react';
import type { CropCycle, Task } from '@/types';
import type { Field } from '@/types/farm';
import { ExportService, type ExportFormat } from '@/services/exportService';
import { ExportDialog } from '@/components/common/ExportDialog';

// Helper function to format date for display
const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('ko-KR', { month: 'short', day: 'numeric' });
};

interface ScheduleGanttProps {
  fields?: Field[];
  cycles: CropCycle[];
  tasks?: Task[];
  onCycleClick?: (cycleId: string) => void;
  activeCycleId?: string | null;
}

export function ScheduleGantt({
  fields = [],
  cycles,
  tasks = [],
  onCycleClick,
  activeCycleId,
}: ScheduleGanttProps) {
  const [zoomLevel, setZoomLevel] = useState(1); // 1 = 100% (default), 2 = 200% width
  const [isExportDialogOpen, setIsExportDialogOpen] = useState(false);
  const componentRef = useRef<HTMLDivElement>(null);

  const handleExport = (filename: string, format: ExportFormat) => {
    ExportService.exportCropSchedule(
      cycles,
      fields as any,
      format,
      filename,
      componentRef.current || undefined,
    );
  };

  // Determine Timeline Range based on Cycles
  // If no cycles, default to current year. If cycles exist, pad 1 month before minStart and 1 month after maxEnd.
  const getTimelineRange = () => {
    if (cycles.length === 0) {
      const now = new Date();
      return {
        start: new Date(now.getFullYear(), 0, 1),
        end: new Date(now.getFullYear(), 11, 31),
        totalMonths: 12,
      };
    }

    const starts = cycles.map((c) => new Date(c.start_date).getTime());
    const ends = cycles.map((c) => new Date(c.end_date).getTime());
    const minTime = Math.min(...starts);
    const maxTime = Math.max(...ends);

    const minDate = new Date(minTime);
    const maxDate = new Date(maxTime);

    // Add 1 month buffer before only if it doesn't push way back, but actually let's just start from the month of the earliest crop
    // To make it look nice, let's start at the 1st of the minDate month
    const startDate = new Date(minDate.getFullYear(), minDate.getMonth(), 1);
    // End date should be the end of the maxDate month
    const endDate = new Date(maxDate.getFullYear(), maxDate.getMonth() + 1, 0);

    // Calculate total months difference
    const totalMonths =
      (endDate.getFullYear() - startDate.getFullYear()) * 12 +
      (endDate.getMonth() - startDate.getMonth()) +
      1;

    return { start: startDate, end: endDate, totalMonths };
  };

  const { start: timelineStart, end: timelineEnd, totalMonths } = getTimelineRange();

  // Generate month headers dynamically
  const timelineHeaders = Array.from({ length: totalMonths }, (_, i) => {
    const d = new Date(timelineStart.getFullYear(), timelineStart.getMonth() + i, 1);
    return {
      year: d.getFullYear(),
      month: d.getMonth() + 1,
      label: `${d.getMonth() + 1}월`,
      fullLabel: `${d.getFullYear()}.${d.getMonth() + 1}`,
    };
  });

  // Process cycles to position bars relative to the new dynamic timeline
  const timelineDuration = timelineEnd.getTime() - timelineStart.getTime();

  const processedCycles = cycles.map((cycle) => {
    const start = new Date(cycle.start_date).getTime();
    const end = new Date(cycle.end_date).getTime();

    // Clamp visually to timeline if needed, but usually we expanded timeline to fit
    const effectiveStart = Math.max(start, timelineStart.getTime());
    const effectiveEnd = Math.min(end, timelineEnd.getTime());

    const left = ((effectiveStart - timelineStart.getTime()) / timelineDuration) * 100;
    const width = ((effectiveEnd - effectiveStart) / timelineDuration) * 100;

    return { ...cycle, left, width };
  });

  // Calculate Year Groups for the top header row
  const yearGroups = timelineHeaders.reduce(
    (acc, curr) => {
      const last = acc[acc.length - 1];
      if (last && last.year === curr.year) {
        last.count++;
      } else {
        acc.push({ year: curr.year, count: 1 });
      }
      return acc;
    },
    [] as { year: number; count: number }[],
  );

  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth() + 1;

  return (
    <>
      <Card ref={componentRef}>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-base text-slate-700">
            전체 농기 스케줄
            <div className="ml-2 text-xs font-normal text-slate-500">
              {timelineHeaders.length > 0 ? (
                <>
                  ({timelineHeaders[0].fullLabel} ~{' '}
                  {timelineHeaders[timelineHeaders.length - 1].fullLabel})
                </>
              ) : (
                <span>(기간 정보 없음)</span>
              )}
            </div>
          </CardTitle>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              className="h-7 gap-1 text-xs"
              onClick={() => setIsExportDialogOpen(true)}
            >
              <Download className="h-3 w-3" />
              <span className="hidden sm:inline">내보내기</span>
            </Button>
            <span className="ml-2 text-xs text-slate-500">배율: x{zoomLevel}</span>
            <input
              type="range"
              min="1"
              max="3"
              step="0.5"
              value={zoomLevel}
              onChange={(e) => setZoomLevel(parseFloat(e.target.value))}
              className="h-1 w-24 cursor-pointer appearance-none rounded-lg bg-slate-200 accent-green-600"
            />
          </div>
        </CardHeader>
        <CardContent>
          {/* Scrollable Container */}
          <div className="overflow-hidden overflow-x-auto rounded-lg border bg-slate-50">
            <div
              style={{
                minWidth: `${(totalMonths / 12) * 100 * zoomLevel}%`,
                transition: 'min-width 0.3s ease',
              }}
            >
              {/* Header Group */}
              <div className="flex flex-col border-b bg-white">
                {/* Row 1: Years */}
                <div className="flex border-b">
                  {/* Spacer for sticky column */}
                  <div className="sticky left-0 z-20 w-24 shrink-0 border-r bg-slate-50" />

                  <div className="flex flex-1">
                    {yearGroups.map((yg, idx) => {
                      const isCurrent = yg.year === currentYear;
                      return (
                        <div
                          key={idx}
                          style={{ flex: yg.count }}
                          className={`border-r py-1 text-center text-xs font-bold text-slate-600 last:border-0 ${isCurrent ? 'z-10 bg-white ring-2 ring-inset ring-slate-800' : 'bg-slate-50'} `}
                        >
                          {yg.year}
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Row 2: Months */}
                <div className="flex">
                  <div className="sticky left-0 z-20 flex w-24 shrink-0 items-center justify-center border-r bg-slate-100 p-2 text-center text-xs font-bold shadow-[1px_0_3px_rgba(0,0,0,0.05)]">
                    농지/작물
                  </div>
                  <div className="relative flex flex-1">
                    {timelineHeaders.map((m, idx) => {
                      const isCurrent = m.year === currentYear && m.month === currentMonth;
                      return (
                        <div
                          key={idx}
                          className={`flex min-w-[3rem] flex-1 items-center justify-center border-r p-2 text-center text-xs last:border-0 ${isCurrent ? 'z-10 bg-white font-bold text-slate-900 ring-2 ring-inset ring-slate-800' : 'text-slate-500'} `}
                        >
                          {m.label}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Timeline Rows */}
              <div className="divide-y bg-white">
                {fields.map((field) => {
                  const fieldCycles = processedCycles.filter(
                    (c) => String(c.field_id) === String(field.id),
                  );
                  if (fieldCycles.length === 0) return null;

                  return (
                    <div key={field.id} className="group flex transition-colors hover:bg-slate-50">
                      {/* Field Name Label (Sticky) */}
                      <div className="sticky left-0 z-20 flex w-24 shrink-0 flex-col justify-center border-r bg-slate-50 p-3 text-xs font-medium shadow-[1px_0_3px_rgba(0,0,0,0.05)]">
                        <span className="truncate" title={field.name}>
                          {field.name}
                        </span>
                      </div>

                      {/* Timeline Area */}
                      <div className="relative h-12 flex-1">
                        {/* Month Grid Lines (Background) */}
                        <div className="pointer-events-none absolute inset-0 flex">
                          {timelineHeaders.map((_, i) => (
                            <div
                              key={i}
                              className="flex-1 border-r border-slate-100 last:border-0"
                            />
                          ))}
                        </div>

                        {/* Crop Bars */}
                        {fieldCycles.map((cycle) => (
                          <div
                            key={cycle.id}
                            className={`absolute top-2 flex h-8 cursor-pointer items-center rounded-md border px-2 shadow-sm transition-all hover:brightness-95 ${cycle.color || 'bg-green-200 text-green-900'} ${activeCycleId === cycle.id ? 'z-10 ring-2 ring-blue-500 ring-offset-1' : ''} `}
                            style={{ left: `${cycle.left}%`, width: `${cycle.width}%` }}
                            onClick={() => onCycleClick?.(cycle.id)}
                            title={`${cycle.crop_name} (${formatDate(cycle.start_date)} ~ ${formatDate(cycle.end_date)})`}
                          >
                            <div className="w-full truncate text-xs font-bold">
                              {cycle.crop_name}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Detail View for Active Cycle */}
          {activeCycleId && (
            <div className="mt-4 rounded-lg border bg-blue-50 p-4 duration-200 animate-in fade-in zoom-in-95">
              <h4 className="mb-3 flex items-center gap-2 text-sm font-bold text-blue-900">
                📌 {cycles.find((c) => c.id === activeCycleId)?.crop_name} 상세 일정
                <span className="ml-auto text-xs font-normal text-blue-700">
                  {formatDate(cycles.find((c) => c.id === activeCycleId)!.start_date)} ~{' '}
                  {formatDate(cycles.find((c) => c.id === activeCycleId)!.end_date)}
                </span>
              </h4>

              {/* Filter tasks for this cycle */}
              <div className="flex gap-2 overflow-x-auto pb-2">
                {tasks
                  .filter((t) => t.crop_cycle_id === activeCycleId)
                  .map((task) => (
                    <div
                      key={task.id}
                      className="flex min-w-[120px] flex-col gap-1 rounded border bg-white p-3 shadow-sm"
                    >
                      <span className="font-mono text-[10px] text-slate-500">
                        {formatDate(task.date)}
                      </span>
                      <span className="text-xs font-medium">{task.content}</span>
                      <Badge
                        variant={task.status === 'completed' ? 'secondary' : 'default'}
                        className="mt-1 h-5 w-fit px-1 py-0 text-[10px]"
                      >
                        {task.status === 'completed' ? '완료' : '예정'}
                      </Badge>
                    </div>
                  ))}
                {tasks.filter((t) => t.crop_cycle_id === activeCycleId).length === 0 && (
                  <div className="p-2 text-xs text-blue-400">등록된 상세 작업이 없습니다.</div>
                )}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <ExportDialog
        isOpen={isExportDialogOpen}
        onClose={() => setIsExportDialogOpen(false)}
        onExport={handleExport}
        defaultFilename={`농기스케줄_${new Date().toISOString().split('T')[0]}`}
      />
    </>
  );
}
