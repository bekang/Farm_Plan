import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { GarakService } from '@/services/garakService';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { format, subDays } from 'date-fns';

export function PricePredictionChart() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedCrop, setSelectedCrop] = useState('고구마'); // Default

  // Mock crops for now - in real integration we'd use the global active crops
  const crops = ['고구마', '감자', '배추'];

  useEffect(() => {
    fetchData(selectedCrop);
  }, [selectedCrop]);

  const fetchData = async (cropName: string) => {
    setLoading(true);
    // For "Prediction" or "Trend", we need historical data.
    // Garak API 'data36' is Daily. To get a trend, we might need multiple calls or valid range params if supported.
    // The current GarakService.getDailyPrices fetches a specific date.
    // We need to fetch, say, last 7 days.

    const today = new Date();
    const promises = [];
    for (let i = 6; i >= 0; i--) {
      const d = subDays(today, i);
      const dateStr = format(d, 'yyyyMMdd');
      // We'll modify service to accept date if we haven't already
      promises.push(
        GarakService.getDailyPrices(cropName, dateStr).then((items) => ({
          date: format(d, 'MM-dd'),
          items,
        })),
      );
    }

    try {
      const results = await Promise.all(promises);
      // Aggregate data: We need 'Average Price' for a specific Grade usually '특' or '상'
      // For simplicity, let's take the average of all grades or pick '특' (Best).

      const chartData = results.map((r) => {
        // Find '특' grade or first item
        const item = r.items.find((i) => i.G_NAME === '특') || r.items[0];
        return {
          date: r.date,
          price: item ? parseInt(item.AV_P.replace(/,/g, '')) : 0,
          grade: item ? item.G_NAME : '-',
        };
      });

      setData(chartData);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-bold">작기별 도매 가격 추이 (가락시장)</CardTitle>
          <select
            className="rounded border p-1 text-sm"
            value={selectedCrop}
            onChange={(e) => setSelectedCrop(e.target.value)}
          >
            {crops.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] w-full">
          {loading ? (
            <div className="flex h-full items-center justify-center text-slate-400">
              데이터 로딩 중...
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" fontSize={12} />
                <YAxis fontSize={12} unit="원" />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="price"
                  name="평균가 (특)"
                  stroke="#8884d8"
                  activeDot={{ r: 8 }}
                />
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>
        <div className="mt-4 text-xs text-slate-500">
          * 가락시장 도매 경락 가격 기준 (제공: 서울특별시농수산식품공사)
        </div>
      </CardContent>
    </Card>
  );
}
