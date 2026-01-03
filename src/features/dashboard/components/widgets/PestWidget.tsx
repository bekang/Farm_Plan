import { useState, useEffect } from 'react';
import { Bug, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { PestService, type PestAlert } from '@/services/pestService';
import { EFFECTS } from '@/design/effects/animations';

interface PestWidgetProps {
  isActive: boolean;
  onToggle: () => void;
  onClose: () => void;
  fields: any[]; // Using any[] temporarily if Type is complex, or ideally Field[]
  selectedFieldId?: string | number | null;
}

export function PestWidget({
  isActive,
  onToggle,
  onClose,
  fields,
  selectedFieldId,
}: PestWidgetProps) {
  const [pestAlerts, setPestAlerts] = useState<PestAlert[]>([]);

  useEffect(() => {
    PestService.getPestAlerts().then(setPestAlerts);
  }, []);

  const hasPestWarning = pestAlerts.some((a) => a.alertLevel === '경보');

  return (
    <div className="relative">
      <Button
        variant="ghost"
        className={cn(
          'flex h-9 items-center gap-2 rounded-full border px-3',
          EFFECTS.TRANSITION.DEFAULT,
          isActive
            ? 'border-red-200 bg-red-50 text-red-700'
            : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50',
          hasPestWarning && EFFECTS.ANIMATION.PULSE_RED,
        )}
        onClick={onToggle}
      >
        <Bug className={cn('h-4 w-4', hasPestWarning ? 'text-red-600' : 'text-slate-500')} />
        <span className="hidden text-xs font-medium md:inline">병해충</span>
        {hasPestWarning && (
          <span
            className={cn(
              'absolute -right-1 -top-1 h-2 w-2 rounded-full',
              EFFECTS.ANIMATION.PING_RED,
            )}
          />
        )}
      </Button>

      {isActive && (
        <div
          className={cn('absolute right-0 top-full z-50 mt-2 w-72', EFFECTS.ANIMATION.FADE_IN_DOWN)}
        >
          <Card className="border-slate-200 p-4 shadow-xl">
            <div className="mb-3 flex items-start justify-between">
              <h4 className="flex items-center gap-1 text-sm font-bold text-slate-700">
                <Bug className="h-4 w-4 text-red-500" /> 병해충 예보
              </h4>
              <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Field Info (Read only here as Pest is usually regional) */}
            <div className="mb-3 px-1 text-xs text-slate-500">
              {selectedFieldId
                ? fields.find((f) => String(f.id) === String(selectedFieldId))?.location
                : '전체 지역'}{' '}
              기준
            </div>

            <div className="mb-2 max-h-[200px] space-y-2 overflow-y-auto">
              {pestAlerts.length > 0 ? (
                pestAlerts.map((alert, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between rounded bg-slate-50 p-2 text-sm"
                  >
                    <span className="font-medium text-slate-700">{alert.cropName}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-slate-500">{alert.pestName}</span>
                      <Badge
                        variant={alert.alertLevel === '경보' ? 'destructive' : 'secondary'}
                        className="h-5 px-1 text-[10px]"
                      >
                        {alert.alertLevel}
                      </Badge>
                    </div>
                  </div>
                ))
              ) : (
                <div className="py-2 text-center text-xs text-slate-400">현재 예보가 없습니다.</div>
              )}
            </div>
            <div className="flex justify-end border-t pt-2">
              <a
                href="https://ncpms.rda.go.kr"
                target="_blank"
                rel="noreferrer"
                className="text-xs text-blue-500 hover:underline"
              >
                국가농작물병해충관리시스템 &gt;
              </a>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
