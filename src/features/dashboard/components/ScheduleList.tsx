import { useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Download } from 'lucide-react';
import type { Task, CropCycle } from '@/types';
import type { Field } from '@/types/farm';
import { ExportService, type ExportFormat } from '@/services/exportService';
import { ExportDialog } from '@/components/common/ExportDialog';

// Helper: Format Date
const formatDate = (dateStr: string) => {
  const d = new Date(dateStr);
  const today = new Date();
  const diffTime = d.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  let dDay = '';
  if (diffDays === 0) dDay = '오늘';
  else if (diffDays > 0) dDay = `D-${diffDays}`;
  else dDay = `D+${Math.abs(diffDays)}`;

  return {
    full: d.toLocaleDateString('ko-KR', { month: 'long', day: 'numeric', weekday: 'short' }),
    dDay,
    diffDays, // Expose this for styling logic
  };
};

interface ScheduleListProps {
  tasks?: any[];
  cycles?: CropCycle[];
  fields?: Field[];
}

export function ScheduleList({ tasks = [], cycles = [], fields = [] }: ScheduleListProps) {
  const [isExportDialogOpen, setIsExportDialogOpen] = useState(false);
  const componentRef = useRef<HTMLDivElement>(null);

  const handleExport = (filename: string, format: ExportFormat) => {
    ExportService.exportTaskList(
      tasks,
      cycles,
      fields as any,
      format,
      filename,
      componentRef.current || undefined,
    );
  };

  // Dynamically generate tasks from cycles if no explicit tasks
  let displayTasks = [...tasks];
  if (displayTasks.length === 0 && cycles.length > 0) {
     cycles.forEach(c => {
        // Safe check for dates
        if(!c.start_date) return;
        
        displayTasks.push({
           id: c.id + '-plant',
           field_id: Number(c.field_id), // c.field_id is string|number, cast to number for compatibility if needed, or update Task type
           date: c.start_date,
           content: '파종/정식 예정',
           status: c.status === 'completed' ? 'completed' : 'pending',
           type: 'planting',
           crop_cycle_id: c.id
        } as any);

        if(c.end_date) {
             displayTasks.push({
               id: c.id + '-harvest',
               field_id: Number(c.field_id),
               date: c.end_date,
               content: '수확 예정',
               status: c.status === 'completed' ? 'completed' : 'pending',
               type: 'harvest',
               crop_cycle_id: c.id
            } as any);
        }
     });
  }

  // Sort tasks by date (upcoming first)
  const sortedTasks = [...displayTasks].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
  );

  // Enrich tasks with crop/field names if missing
  const enrichedTasks = sortedTasks.map((task: any) => {
    // If it's already a DashboardTask (has title, priority, etc), use it directly
    if (task.title && task.cropName) return task;

    // Legacy enrichment for Mock Tasks
    const cycle = cycles.find((c) => String(c.id) === String(task.crop_cycle_id));
    const field = fields.find((f) => String(f.id) === String(task.field_id));
    return {
      ...task,
      title: task.content, // Map content -> title for uniformity
      cropName: cycle?.crop_name || task.content.split(' ')[0], 
      fieldName: field?.name || '미지정 농지',
    };
  });

  return (
    <>
      <Card className="h-full" ref={componentRef}>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-base text-slate-700">작업 목록 (할 일)</CardTitle>
          <Button
            variant="outline"
            size="sm"
            className="h-7 gap-1 text-xs"
            onClick={() => setIsExportDialogOpen(true)}
          >
            <Download className="h-3 w-3" />
            <span className="hidden sm:inline">내보내기</span>
          </Button>
        </CardHeader>
        <CardContent className="h-[calc(100%-60px)]">
          <div className="h-full space-y-3 overflow-y-auto pr-2">
            {enrichedTasks.length > 0 ? (
              enrichedTasks.map((task) => {
                const dateInfo = formatDate(task.date);
                const isPast = task.status === 'completed';

                return (
                  <div
                    key={task.id}
                    className={`flex items-center gap-3 rounded-lg border p-3 ${isPast ? 'bg-slate-50 opacity-60' : 'bg-white transition-colors hover:border-green-300'}`}
                  >
                    {/* Main Content: Field & Crop & Date */}
                    <div className="min-w-0 flex-1">
                      <div className="mb-1 flex items-center gap-2">
                        <Badge
                          variant="outline"
                          className="shrink-0 border-slate-300 bg-slate-100 text-xs font-bold text-slate-700"
                        >
                          {task.fieldName}
                        </Badge>
                        <span
                          className={`shrink-0 rounded px-1.5 py-0.5 text-xs font-bold text-white ${
                             task.priority === 'high'
                                ? 'bg-red-500' // Urgent/Overdue
                                : task.title.includes('수확') 
                                    ? 'bg-blue-500' 
                                    : 'bg-green-600'
                          }`}
                        >
                          {task.cropName}
                        </span>
                      </div>

                      <h4
                        className={`truncate text-base font-semibold ${task.status === 'completed' ? 'text-slate-500 line-through' : 'text-slate-800'}`}
                      >
                        {task.title || task.content}
                      </h4>
                      <p className="mt-0.5 text-xs text-slate-500">{dateInfo.full}</p>
                    </div>

                    {/* D-Day Box (Right Side) */}
                    <div className="shrink-0 text-right">
                      <div
                        className={`rounded border px-2 py-1 text-sm font-bold ${
                          isPast
                            ? 'border-slate-200 bg-slate-100 text-slate-500'
                            : dateInfo.diffDays === 0
                              ? 'animate-pulse border-red-200 bg-red-50 text-red-600'
                              : dateInfo.diffDays > 0 && dateInfo.diffDays <= 7
                                ? 'border-orange-200 bg-orange-50 text-orange-600'
                                : 'border-green-200 bg-green-50 text-green-600'
                        }`}
                      >
                        {dateInfo.dDay}
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="py-8 text-center text-sm text-slate-400">예정된 작업이 없습니다.</div>
            )}
          </div>
        </CardContent>
      </Card>

      <ExportDialog
        isOpen={isExportDialogOpen}
        onClose={() => setIsExportDialogOpen(false)}
        onExport={handleExport}
        defaultFilename={`작업목록_${new Date().toISOString().split('T')[0]}`}
      />
    </>
  );
}
