import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Table as TableIcon, ChartLine } from 'lucide-react';
import { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

interface AnalysisDetailViewProps {
  type: 'soil' | 'water';
  data: any[];
  onBack: () => void;
}

export function AnalysisDetailView({ type, data, onBack }: AnalysisDetailViewProps) {
  const [viewMode, setViewMode] = useState<'chart' | 'table'>('table');

  // Sort data by date ascending for chart
  const sortedData = [...data].sort(
    (a, b) => new Date(a.test_date).getTime() - new Date(b.test_date).getTime(),
  );

  const title = type === 'soil' ? '토양 정밀 분석 상세' : '수질 상세 분석 상세';
  const lines =
    type === 'soil'
      ? [
          { key: 'ph', color: '#ef4444', name: 'pH (산도)' },
          { key: 'ec', color: '#3b82f6', name: 'EC (전기전도도)' },
          { key: 'om', color: '#10b981', name: '유기물' },
        ]
      : [
          { key: 'ph', color: '#ef4444', name: 'pH (산도)' },
          { key: 'ec', color: '#3b82f6', name: 'EC (전기전도도)' },
        ];

  return (
    <div className="space-y-6 duration-300 animate-in fade-in">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="outline" size="sm" onClick={onBack}>
            <ArrowLeft className="mr-2 h-4 w-4" /> 뒤로가기
          </Button>
          <h2 className="text-2xl font-bold">{title} 및 변화 추이</h2>
        </div>
        <div className="flex space-x-2">
          <Button
            variant={viewMode === 'chart' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('chart')}
          >
            <ChartLine className="mr-2 h-4 w-4" /> 차트 보기
          </Button>
          <Button
            variant={viewMode === 'table' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('table')}
          >
            <TableIcon className="mr-2 h-4 w-4" /> 표 보기
          </Button>
        </div>
      </div>

      {viewMode === 'chart' ? (
        <div className="grid gap-6">
          <Card>
            <CardHeader>
              <CardTitle>주요 지표 변화 추이</CardTitle>
            </CardHeader>
            <CardContent className="h-[400px]">
              {sortedData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={sortedData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="test_date" />
                    <YAxis />
                    <Tooltip
                      contentStyle={{
                        borderRadius: '8px',
                        border: 'none',
                        boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                      }}
                    />
                    <Legend />
                    {lines.map((line) => (
                      <Line
                        key={line.key}
                        type="monotone"
                        dataKey={line.key}
                        name={line.name}
                        stroke={line.color}
                        strokeWidth={2}
                        dot={{ r: 4, strokeWidth: 2 }}
                        activeDot={{ r: 6 }}
                      />
                    ))}
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex h-full items-center justify-center text-gray-400">
                  데이터가 부족하여 차트를 표시할 수 없습니다.
                </div>
              )}
            </CardContent>
          </Card>

          {type === 'soil' && (
            <Card>
              <CardHeader>
                <CardTitle>양분 상태 (Nutrients)</CardTitle>
              </CardHeader>
              <CardContent className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={sortedData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="test_date" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="p" name="인산 (P)" stroke="#8b5cf6" />
                    <Line type="monotone" dataKey="k" name="칼륨 (K)" stroke="#f59e0b" />
                    <Line type="monotone" dataKey="ca" name="칼슘 (Ca)" stroke="#6366f1" />
                    <Line type="monotone" dataKey="mg" name="마그네슘 (Mg)" stroke="#ec4899" />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          )}
        </div>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>상세 데이터 목록</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>날짜</TableHead>
                  <TableHead>pH</TableHead>
                  <TableHead>EC</TableHead>
                  {type === 'soil' ? (
                    <>
                      <TableHead>유기물</TableHead>
                      <TableHead>인산</TableHead>
                      <TableHead>칼륨</TableHead>
                      <TableHead>칼슘</TableHead>
                      <TableHead>마그네슘</TableHead>
                    </>
                  ) : (
                    <>
                      <TableHead>NO3-N</TableHead>
                      <TableHead>NH4-N</TableHead>
                      <TableHead>HCO3</TableHead>
                      <TableHead>P</TableHead>
                      <TableHead>K</TableHead>
                      <TableHead>Ca</TableHead>
                      <TableHead>Mg</TableHead>
                      <TableHead>S</TableHead>
                      <TableHead>Na</TableHead>
                      <TableHead>Cl</TableHead>
                      <TableHead>Fe</TableHead>
                      <TableHead>Mn</TableHead>
                      <TableHead>B</TableHead>
                      <TableHead>Zn</TableHead>
                      <TableHead>Cu</TableHead>
                      <TableHead>Mo</TableHead>
                    </>
                  )}
                </TableRow>
              </TableHeader>
              <TableBody>
                {[...data]
                  .sort((a, b) => new Date(b.test_date).getTime() - new Date(a.test_date).getTime())
                  .map((row, i) => (
                    <TableRow key={i}>
                      <TableCell className="font-medium">{row.test_date}</TableCell>
                      <TableCell>{row.ph}</TableCell>
                      <TableCell>{row.ec}</TableCell>
                      {type === 'soil' ? (
                        <>
                          <TableCell>{row.om}</TableCell>
                          <TableCell>{row.p}</TableCell>
                          <TableCell>{row.k}</TableCell>
                          <TableCell>{row.ca}</TableCell>
                          <TableCell>{row.mg}</TableCell>
                        </>
                      ) : (
                        <>
                          <TableCell>{row.no3_n}</TableCell>
                          <TableCell>{row.nh4_n}</TableCell>
                          <TableCell>{row.hco3}</TableCell>
                          <TableCell>{row.p}</TableCell>
                          <TableCell>{row.k}</TableCell>
                          <TableCell>{row.ca}</TableCell>
                          <TableCell>{row.mg}</TableCell>
                          <TableCell>{row.s}</TableCell>
                          <TableCell>{row.na}</TableCell>
                          <TableCell>{row.cl}</TableCell>
                          <TableCell>{row.fe}</TableCell>
                          <TableCell>{row.mn}</TableCell>
                          <TableCell>{row.b}</TableCell>
                          <TableCell>{row.zn}</TableCell>
                          <TableCell>{row.cu}</TableCell>
                          <TableCell>{row.mo}</TableCell>
                        </>
                      )}
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
