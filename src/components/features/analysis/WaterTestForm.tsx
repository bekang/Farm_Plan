import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import type { WaterTestResult } from '@/types';

interface WaterTestFormProps {
  fieldId: number;
  onSubmit: (data: Omit<WaterTestResult, 'id' | 'field_id'>) => void;
  onCancel: () => void;
}

export function WaterTestForm({ onSubmit, onCancel }: WaterTestFormProps) {
  const [formData, setFormData] = useState<Partial<WaterTestResult>>({
    test_date: new Date().toISOString().split('T')[0],
    ph: 0,
    ec: 0,
    no3_n: 0,
    nh4_n: 0,
    p: 0,
    k: 0,
    ca: 0,
    mg: 0,
    s: 0,
    fe: 0,
    mn: 0,
    b: 0,
    zn: 0,
    cu: 0,
    mo: 0,
    cl: 0,
    na: 0,
    hco3: 0,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'test_date' ? value : parseFloat(value) || 0,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.test_date) return;

    onSubmit({
      test_date: formData.test_date,
      ph: formData.ph || 0,
      ec: formData.ec || 0,
      no3_n: formData.no3_n,
      nh4_n: formData.nh4_n,
      p: formData.p,
      k: formData.k,
      ca: formData.ca,
      mg: formData.mg,
      s: formData.s,
      fe: formData.fe,
      mn: formData.mn,
      b: formData.b,
      zn: formData.zn,
      cu: formData.cu,
      mo: formData.mo,
      cl: formData.cl,
      na: formData.na,
      hco3: formData.hco3,
    } as Omit<WaterTestResult, 'id' | 'field_id'>);
  };

  return (
    <Card className="mx-auto w-full max-w-4xl">
      <CardHeader>
        <CardTitle>수질 검사 결과 입력 (양액/관주)</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            <div className="col-span-2 space-y-2 md:col-span-4">
              <label className="text-sm font-medium">검사 일자</label>
              <Input
                type="date"
                name="test_date"
                value={formData.test_date}
                onChange={handleChange}
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">산도 (pH)</label>
              <Input
                type="number"
                step="0.1"
                name="ph"
                value={formData.ph}
                onChange={handleChange}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">전기전도도 (EC)</label>
              <Input
                type="number"
                step="0.01"
                name="ec"
                value={formData.ec}
                onChange={handleChange}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">질산태질소 (NO3-N)</label>
              <Input
                type="number"
                step="0.1"
                name="no3_n"
                value={formData.no3_n}
                onChange={handleChange}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">암모니아태질소</label>
              <Input
                type="number"
                step="0.1"
                name="nh4_n"
                value={formData.nh4_n}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="border-t pt-4">
            <h4 className="mb-3 text-sm font-semibold">다량원소</h4>
            <div className="grid grid-cols-3 gap-3 md:grid-cols-6">
              {['p', 'k', 'ca', 'mg', 's'].map((el) => (
                <div key={el} className="space-y-1">
                  <label className="text-xs font-medium uppercase">{el}</label>
                  <Input
                    type="number"
                    step="0.01"
                    name={el}
                    value={(formData as any)[el]}
                    onChange={handleChange}
                    className="h-8 text-sm"
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="border-t pt-4">
            <h4 className="mb-3 text-sm font-semibold">미량원소</h4>
            <div className="grid grid-cols-3 gap-3 md:grid-cols-6">
              {['fe', 'mn', 'b', 'zn', 'cu', 'mo'].map((el) => (
                <div key={el} className="space-y-1">
                  <label className="text-xs font-medium uppercase">{el}</label>
                  <Input
                    type="number"
                    step="0.001"
                    name={el}
                    value={(formData as any)[el]}
                    onChange={handleChange}
                    className="h-8 text-sm"
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="border-t pt-4">
            <h4 className="mb-3 text-sm font-semibold">기타 이온</h4>
            <div className="grid grid-cols-3 gap-3">
              {['cl', 'na', 'hco3'].map((el) => (
                <div key={el} className="space-y-1">
                  <label className="text-xs font-medium uppercase">{el}</label>
                  <Input
                    type="number"
                    step="0.01"
                    name={el}
                    value={(formData as any)[el]}
                    onChange={handleChange}
                    className="h-8 text-sm"
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={onCancel}>
              취소
            </Button>
            <Button type="submit">저장</Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
