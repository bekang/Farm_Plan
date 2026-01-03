import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import type { Field } from '@/types/farm';

interface FieldFormProps {
  initialData?: Field;
  onSubmit: (data: any) => void; // Allow loose typing for submission construction
  onCancel: () => void;
}

export function FieldForm({ initialData, onSubmit, onCancel }: FieldFormProps) {
  // Map initialData to form logic. 
  // Field type has facilityType, description. Form uses local state.
  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    location: initialData?.location || '',
    area: initialData?.area || 0,
    facilityType: initialData?.facilityType || 'open_field',
    crop: initialData?.description || '', // Map description to 'crop' input
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'area' ? parseFloat(value) || 0 : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name) return;

    // Construct valid Field object (partial)
    const submissionData = {
      name: formData.name,
      location: formData.location,
      area: formData.area,
      facilityType: formData.facilityType,
      description: formData.crop, // Save crop to description
      
      // Default / Mock values for required Field props
      address: { province: '경기도', city: '수원시', town: '영통구' },
      cultivationMethod: 'soil',
      specs: {},
    };

    onSubmit(submissionData);
  };

  return (
    <Card className="mx-auto w-full max-w-lg">
      <CardHeader>
        <CardTitle>{initialData ? '농지 수정' : '새 농지 등록'}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">농지 이름 (필수)</label>
            <Input
              name="name"
              placeholder="예: 뒷산 1번 밭"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">위치/주소</label>
            <Input
              name="location"
              placeholder="주소를 입력하세요"
              value={formData.location}
              onChange={handleChange}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">면적 (평)</label>
              <Input type="number" name="area" value={formData.area} onChange={handleChange} />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">시설 유형</label>
              <select
                name="facilityType" // Match state key
                value={formData.facilityType}
                onChange={handleChange}
                className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <option value="open_field">노지</option>
                <option value="vinyl_single">비닐하우스 (단동)</option>
                <option value="vinyl_multi">비닐하우스 (연동)</option>
                <option value="glass_greenhouse">유리온실</option>
                <option value="smart_farm">스마트팜</option>
              </select>
            </div>
          </div>
          
           <div className="space-y-2">
            <label className="text-sm font-medium">재배 작물 (설명)</label>
            <Input
              name="crop"
              placeholder="예: 고추, 마늘"
              value={formData.crop}
              onChange={handleChange}
            />
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
