import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import type { SoilTestResult } from '@/types';

interface SoilTestFormProps {
  fieldId: number;
  onSubmit: (data: Omit<SoilTestResult, 'id' | 'field_id'>) => void;
  onCancel: () => void;
}

export function SoilTestForm({ onSubmit, onCancel }: SoilTestFormProps) {
  // Initialize with today's date and empty numeric values
  const [formData, setFormData] = useState<Partial<SoilTestResult>>({
    test_date: new Date().toISOString().split('T')[0],
    ph: 0,
    om: 0,
    p2o5: 0,
    k: 0,
    ca: 0,
    mg: 0,
    ec: 0,
    no3_n: 0,
    nh4_n: 0,
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

    // Type assertion is safe here because we initialized with 0s and input ensures numbers
    onSubmit({
      test_date: formData.test_date,
      ph: formData.ph || 0,
      om: formData.om || 0,
      p2o5: formData.p2o5 || 0,
      k: formData.k || 0,
      ca: formData.ca || 0,
      mg: formData.mg || 0,
      ec: formData.ec || 0,
      no3_n: formData.no3_n,
      nh4_n: formData.nh4_n,
    });
  };

  return (
    <Card className="mx-auto w-full max-w-2xl">
      <CardHeader>
        <CardTitle>토양 검정 결과 입력</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">검사 일자</label>
              <Input
                type="date"
                name="test_date"
                value={formData.test_date}
                onChange={handleChange}
                required
              />
            </div>
            {/* pH */}
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
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">유기물 (OM)</label>
              <Input
                type="number"
                step="0.1"
                name="om"
                value={formData.om}
                onChange={handleChange}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">전기전도도 (EC)</label>
              <Input
                type="number"
                step="0.1"
                name="ec"
                value={formData.ec}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">유효인산 (P2O5)</label>
              <Input
                type="number"
                step="1"
                name="p2o5"
                value={formData.p2o5}
                onChange={handleChange}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">칼륨 (K)</label>
              <Input type="number" step="0.1" name="k" value={formData.k} onChange={handleChange} />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">칼슘 (Ca)</label>
              <Input
                type="number"
                step="0.1"
                name="ca"
                value={formData.ca}
                onChange={handleChange}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">마그네슘 (Mg)</label>
              <Input
                type="number"
                step="0.1"
                name="mg"
                value={formData.mg}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 border-t pt-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-500">
                질산태질소 (NO3-N) <span className="text-xs text-gray-400">(선택)</span>
              </label>
              <Input
                type="number"
                step="0.1"
                name="no3_n"
                value={formData.no3_n}
                onChange={handleChange}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-500">
                암모니아태질소 (NH4-N) <span className="text-xs text-gray-400">(선택)</span>
              </label>
              <Input
                type="number"
                step="0.1"
                name="nh4_n"
                value={formData.nh4_n}
                onChange={handleChange}
              />
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
