import { useWeather } from '@/hooks/useFarmQueries';
import { REGION_COORDS, DEFAULT_COORDS } from '@/constants/regionCoords';
import { Sun, CloudRain, Snowflake, Cloud, Droplets } from 'lucide-react';
import { cn } from '@/lib/utils'; // Assuming utils exists

interface FarmWeatherCardProps {
  province: string;
}

export function FarmWeatherCard({ province }: FarmWeatherCardProps) {
  const coords = REGION_COORDS[province] || DEFAULT_COORDS;
  const { data: weather, isLoading, isError } = useWeather(coords.lat, coords.lng);

  if (isLoading) return <div className="text-xs text-slate-400">날씨 로딩 중...</div>;
  if (isError || !weather) return <div className="text-xs text-slate-400">-</div>;

  // Visual Helper (Simplified)
  const getIcon = (pty: string, sky: string) => {
    if (pty === '1' || pty === '4') return <CloudRain className="h-6 w-6 text-blue-500" />;
    if (pty === '3') return <Snowflake className="h-6 w-6 text-cyan-400" />;
    if (pty === '2') return <CloudRain className="h-6 w-6 text-purple-400" />;
    if (sky === '3' || sky === '4') return <Cloud className="h-6 w-6 text-slate-400" />;
    return <Sun className="h-6 w-6 text-orange-500 animate-pulse" />;
  };

  return (
    <div className="flex flex-col items-end justify-center min-w-[80px]">
      <div className="flex items-center gap-1.5 bg-white/60 px-2 py-1 rounded-lg border border-slate-100 shadow-sm">
        <span className="text-lg font-bold text-slate-800 tracking-tighter">{weather.tmp}°</span>
        {getIcon(weather.pty, weather.sky)}
      </div>
      <div className="mt-1 flex items-center justify-end gap-2 text-[10px] font-medium text-slate-500">
         <span>{weather.pty !== '0' ? '비/눈' : (weather.sky === '1' ? '맑음' : '흐림')}</span>
         <div className="flex items-center gap-0.5 text-slate-400">
            <Droplets className="h-2.5 w-2.5" /> 
            <span>{weather.reh}%</span>
         </div>
      </div>
    </div>
  );
}
