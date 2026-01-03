
import { X, Sun, CloudRain, Snowflake, Cloud, MapPin, Star } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { useWeather } from '@/hooks/useFarmQueries';
import type { Field } from '@/types/farm';
import { EFFECTS } from '@/design/effects/animations';

interface WeatherWidgetProps {
  isActive: boolean;
  onToggle: () => void;
  onClose: () => void;
  fields: Field[];
  selectedFieldId?: string | number | null;
  onFieldChange: (id: string | number) => void;
  onSetMainFarm?: (id: string | number) => void;
  isMainFarm?: boolean;
}

export function WeatherWidget({
  isActive,
  onToggle,
  onClose,
  fields,
  selectedFieldId,
  onFieldChange,
  onSetMainFarm,
  isMainFarm,
}: WeatherWidgetProps) {
  
  // Determine target location
  const activeField = fields.find((f) => String(f.id) === String(selectedFieldId));
  const lat = activeField?.latitude || 36.139; // Default: Gimcheon
  const lng = activeField?.longitude || 128.113;

  const { data: weather, isLoading } = useWeather(lat, lng);

  // Derived state for warning
  const isWeatherWarning = weather
    ? weather.pty !== '0' || Number(weather.tmp) > 33 || Number(weather.tmp) < -10
    : false;
  const isHeatWave = weather ? Number(weather.tmp) >= 33 : false;

  // Helper: Map weather to Icon & Color
  const getWeatherVisuals = (sky: string, pty: string) => {
    // PTY: 0(None), 1(Rain), 2(Rain/Snow), 3(Snow), 4(Shower)
    if (pty === '1' || pty === '4')
      return {
        icon: <CloudRain className="h-12 w-12 text-blue-500" />,
        label: '비',
        bg: 'bg-blue-50',
      };
    if (pty === '3')
      return {
        icon: <Snowflake className="h-12 w-12 text-blue-300" />,
        label: '눈',
        bg: 'bg-slate-50',
      };
    if (pty === '2')
      return {
        icon: <CloudRain className="h-12 w-12 text-purple-400" />,
        label: '진눈깨비',
        bg: 'bg-purple-50',
      };

    // SKY: 1(Clear), 3(Cloudy), 4(Overcast)
    if (sky === '3' || sky === '4')
      return {
        icon: <Cloud className="h-12 w-12 text-slate-400" />,
        label: '흐림',
        bg: 'bg-slate-50',
      };
    return {
      icon: <Sun className="animate-spin-slow h-12 w-12 text-orange-400" />,
      label: '맑음',
      bg: 'bg-orange-50',
    };
  };

  const visuals = weather
    ? getWeatherVisuals(weather.sky, weather.pty)
    : { icon: <Sun className="h-12 w-12 text-slate-200" />, label: '-', bg: 'bg-slate-50' };
  
  const currentLocationName = activeField
    ? `${activeField.name} (${activeField.location})`
    : '경북 김천시 (기본)';

  return (
    <div className="relative">
      <Button
        variant="ghost"
        className={cn(
          'flex h-9 items-center gap-2 rounded-full border px-3',
          EFFECTS.TRANSITION.DEFAULT,
          isActive
            ? 'border-blue-200 bg-blue-50 text-blue-700'
            : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50',
          isWeatherWarning && EFFECTS.ANIMATION.PULSE_RED,
        )}
        onClick={onToggle}
      >
        {/* Small Icon for Button */}
        {weather?.pty !== '0' ? (
          <CloudRain className="h-4 w-4 text-blue-500" />
        ) : (
          <Sun className="h-4 w-4 text-orange-500" />
        )}

        <span className="hidden text-xs font-medium md:inline">
          {weather ? `${weather.tmp}°C` : isLoading ? '...' : '날씨'}
        </span>
        {isWeatherWarning && (
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
          <Card className="overflow-hidden border-slate-200 shadow-xl">
            {/* Header with Location */}
            <div className="flex items-center justify-between border-b bg-white p-3">
              <div className="flex items-center gap-1">
                <MapPin className="h-3.5 w-3.5 text-slate-400" />
                <span className="max-w-[140px] truncate text-xs font-bold text-slate-600">
                  {currentLocationName}
                </span>
              </div>
              <div className="flex items-center gap-1">
                {/* Main Farm Toggle */}
                {onSetMainFarm && selectedFieldId && (
                  <button
                    onClick={() => onSetMainFarm(selectedFieldId)}
                    className={cn(
                      "rounded-full p-1 hover:bg-slate-100",
                      isMainFarm ? "text-yellow-400" : "text-slate-300 hover:text-yellow-400"
                    )}
                    title={isMainFarm ? "대표 농장입니다" : "대표 농장으로 설정"}
                  >
                    <Star className={cn("h-4 w-4", isMainFarm && "fill-current")} />
                  </button>
                )}
                <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Visual Body */}
            <div
              className={cn(
                'flex flex-col items-center justify-center p-6 transition-colors',
                visuals.bg,
              )}
            >
              {weather ? (
                <>
                  <div className="mb-3 transform drop-shadow-md transition-transform duration-300 hover:scale-110">
                    {visuals.icon}
                  </div>
                  <div className="mb-1 text-4xl font-bold tracking-tighter text-slate-800">
                    {weather.tmp}°
                  </div>
                  <div className="rounded-full bg-white/50 px-3 py-1 text-sm font-medium text-slate-600 backdrop-blur-sm">
                    {visuals.label}
                  </div>

                  {/* Detailed Stats Grid */}
                  <div className="mt-4 grid w-full grid-cols-2 gap-2">
                    <div className="rounded bg-white/60 p-2 text-center">
                      <span className="block text-[10px] text-slate-500">강수확률</span>
                      <span className="text-xs font-bold text-blue-600">{weather.pop}%</span>
                    </div>
                    <div className="rounded bg-white/60 p-2 text-center">
                      <span className="block text-[10px] text-slate-500">습도</span>
                      <span className="text-xs font-bold text-slate-700">{weather.reh}%</span>
                    </div>
                  </div>

                  {isHeatWave && (
                    <div className="mt-3 flex w-full animate-pulse items-center justify-center gap-1 rounded border border-red-200 bg-red-100/80 p-2 text-xs font-bold text-red-600">
                      ⚠️ 폭염 주의
                    </div>
                  )}
                </>
              ) : (
                <div className="py-8 text-xs text-slate-400">
                    {isLoading ? '날씨 정보를 불러오는 중...' : '날씨 정보를 가져올 수 없습니다.'}
                </div>
              )}
            </div>

            {/* Footer Controls */}
            <div className="border-t bg-slate-50 p-3">
              <label className="mb-1 block text-[10px] text-slate-500">지역 변경</label>
              <select
                className="w-full rounded border bg-white p-1.5 text-xs transition-colors hover:border-slate-400"
                value={selectedFieldId || ''}
                onChange={(e) => onFieldChange(e.target.value)}
              >
                <option value="">기본 (김천시)</option>
                {fields.map((f) => (
                  <option key={f.id} value={f.id}>
                    {f.name} ({f.location})
                  </option>
                ))}
              </select>

              <div className="mt-2 flex justify-end">
                <a
                  href="https://www.weather.go.kr"
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-0.5 text-[10px] text-slate-400 hover:text-blue-500"
                >
                  기상청 제공 &gt;
                </a>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
