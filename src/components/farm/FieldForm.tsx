import React, { useState } from 'react';
import type { Field } from '../../types/farm';
import { FieldService } from '../../services/fieldService';
import { Save, MapPin, Ruler, Thermometer, ArrowLeft } from 'lucide-react'; // Removed unused Droplets

interface FieldFormProps {
  onClose: () => void;
  initialData?: Field;
  onSave?: () => void;
}

interface FormState extends Partial<Field> {
  soilData?: { ph: number; ec: number; om?: number };
  waterData?: { ph: number; ec: number };
  // Add temporary fields for UI binding if they are not in Field but needed for form logic
  heatingChecked?: boolean;
}

export const FieldForm: React.FC<FieldFormProps> = ({ onClose, initialData, onSave }) => {
  const [formData, setFormData] = useState<FormState>(
    initialData || {
      name: '',
      location: '',
      area: 0,
      facilityType: 'open_field',
      cultivationMethod: 'soil',
      waterSource: 'tap', // Moved to top level
      equipment: { heating: false }, // Moved from specs
      specs: {
        height: 'medium',
      },
      soilData: { ph: 6.5, ec: 2.0, om: 20 },
      waterData: { ph: 7.0, ec: 0.5 },
    },
  );

  const handleChange = (field: keyof FormState, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSpecChange = (field: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      specs: { ...prev.specs, [field]: value },
    }));
  };

  const handleNestedChange = (parent: 'soilData' | 'waterData', field: string, value: number) => {
    setFormData((prev) => ({
      ...prev,
      [parent]: { ...prev[parent]!, [field]: value },
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.area) {
      alert('농장 이름과 면적은 필수입니다.');
      return;
    }

    // Construct initial history from form data
    const initialHistory = {
      soil: formData.soilData ? [{
        id: crypto.randomUUID(),
        date: new Date().toISOString().split('T')[0],
        ph: formData.soilData.ph,
        ec: formData.soilData.ec,
        om: formData.soilData.om
      }] : [],
      water: formData.waterData ? [{
        id: crypto.randomUUID(),
        date: new Date().toISOString().split('T')[0],
        ph: formData.waterData.ph,
        ec: formData.waterData.ec
      }] : []
    };

    const newField: Field = {
      id: initialData?.id || crypto.randomUUID(),
      name: formData.name!,
      location: formData.location || '위치 미지정',
      address: {
          province: '', // Default empty if not provided by form
          city: '',
          town: ''
      },
      area: Number(formData.area),
      facilityType: formData.facilityType as any,
      cultivationMethod: formData.cultivationMethod as any,
      specs: formData.specs || {},
      equipment: formData.equipment || {}, // Add missing equipment
      history: initialHistory, // Map to history
      registeredAt: initialData?.registeredAt || new Date().toISOString(),
      description: formData.description,
    };

    FieldService.saveField(newField);
    if (onSave) onSave();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/50 p-4 backdrop-blur-sm">
      <div className="my-8 flex max-h-[90vh] w-full max-w-2xl flex-col rounded-2xl bg-white shadow-2xl">
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between rounded-t-2xl border-b bg-white p-4">
          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="rounded-full p-2 transition-colors hover:bg-stone-100"
            >
              <ArrowLeft className="h-5 w-5 text-stone-600" />
            </button>
            <h2 className="text-xl font-bold text-stone-800">
              {initialData ? '농지 정보 수정' : '새 농지 등록'}
            </h2>
          </div>
          <button
            onClick={handleSubmit}
            className="flex items-center gap-2 rounded-lg bg-green-600 px-4 py-2 font-medium text-white shadow-sm transition-colors hover:bg-green-700 hover:shadow-md"
          >
            <Save className="h-4 w-4" />
            저장하기
          </button>
        </div>

        {/* Body */}
        <div className="space-y-8 overflow-y-auto p-6">
          {/* 1. Basic Info */}
          <section className="space-y-4">
            <h3 className="flex items-center gap-2 border-b pb-2 text-lg font-bold text-stone-700">
              <MapPin className="h-5 w-5 text-green-600" />
              기본 정보
            </h3>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <label className="mb-1 block text-sm font-medium text-stone-600">농장 별칭</label>
                <input
                  type="text"
                  className="w-full rounded-lg border border-stone-300 p-2.5 transition-all focus:border-transparent focus:ring-2 focus:ring-green-500"
                  placeholder="예: 뒷산 텃밭, 제1하우스"
                  value={formData.name}
                  onChange={(e) => handleChange('name', e.target.value)}
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-stone-600">
                  지역 (읍/면/동)
                </label>
                <input
                  type="text"
                  className="w-full rounded-lg border border-stone-300 p-2.5 transition-all focus:border-transparent focus:ring-2 focus:ring-green-500"
                  placeholder="예: 경북 김천시 아포읍"
                  value={formData.location}
                  onChange={(e) => handleChange('location', e.target.value)}
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-stone-600">
                  총 면적 (평)
                </label>
                <div className="relative">
                  <input
                    type="number"
                    className="w-full rounded-lg border border-stone-300 p-2.5 pr-12 transition-all focus:border-transparent focus:ring-2 focus:ring-green-500"
                    placeholder="1000"
                    value={formData.area || ''}
                    onChange={(e) => handleChange('area', Number(e.target.value))}
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-stone-400">
                    평
                  </span>
                </div>
              </div>
            </div>
          </section>

          {/* 2. Facility Specs */}
          <section className="space-y-4">
            <h3 className="flex items-center gap-2 border-b pb-2 text-lg font-bold text-stone-700">
              <Ruler className="h-5 w-5 text-blue-600" />
              시설 및 환경
            </h3>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <label className="mb-1 block text-sm font-medium text-stone-600">시설 형태</label>
                <select
                  className="w-full rounded-lg border border-stone-300 bg-white p-2.5"
                  value={formData.facilityType}
                  onChange={(e) => handleChange('facilityType', e.target.value)}
                >
                  <option value="open_field">노지 (Open Field)</option>
                  <option value="greenhouse">비닐하우스 (Greenhouse)</option>
                  <option value="multi_greenhouse">연동 하우스 (Multi-span)</option>
                  <option value="glass_greenhouse">유리 온실 (Glass)</option>
                  <option value="smart_farm">스마트팜 (Smart Farm)</option>
                </select>
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-stone-600">재배 방식</label>
                <select
                  className="w-full rounded-lg border border-stone-300 bg-white p-2.5"
                  value={formData.cultivationMethod}
                  onChange={(e) => handleChange('cultivationMethod', e.target.value)}
                >
                  <option value="soil">토경 재배 (Soil)</option>
                  <option value="hydroponics">양액/수경 재배 (Hydroponics)</option>
                </select>
              </div>
            </div>

            <div className="rounded-lg border border-stone-200 bg-stone-50 p-4">
              <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                <div>
                  <label className="mb-1 block text-xs text-stone-500">측고 (높이)</label>
                  <select
                    className="w-full rounded border p-2 text-sm"
                    value={formData.specs?.height}
                    onChange={(e) => handleSpecChange('height', e.target.value)}
                  >
                    <option value="low">낮음</option>
                    <option value="medium">보통</option>
                    <option value="high">높음 (High-wire)</option>
                  </select>
                </div>
                <div className="flex flex-col justify-end">
                  <label className="flex cursor-pointer items-center gap-2 rounded border bg-white p-2 transition-colors hover:bg-stone-50">
                    <input
                      type="checkbox"
                      className="h-4 w-4 rounded text-red-500"
                      checked={formData.equipment?.heating}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          equipment: { ...prev.equipment, heating: e.target.checked },
                        }))
                      }
                    />
                    <span className="text-sm font-medium text-stone-700">보온/난방 시설</span>
                  </label>
                </div>
                <div>
                  <label className="mb-1 block text-xs text-stone-500">용수원</label>
                  <select
                    className="w-full rounded border p-2 text-sm"
                    value={formData.waterSource}
                    onChange={(e) => handleChange('waterSource', e.target.value)}
                  >
                    <option value="ground">지하수</option>
                    <option value="tap">상수도</option>
                    <option value="river">하천수</option>
                  </select>
                </div>
              </div>
            </div>
          </section>

          {/* 3. Scientific Data */}
          <section className="space-y-4">
            <div className="flex items-center justify-between border-b pb-2">
              <h3 className="flex items-center gap-2 text-lg font-bold text-stone-700">
                <Thermometer className="h-5 w-5 text-purple-600" />
                정밀 분석 데이터
              </h3>
              <span className="rounded-full bg-purple-100 px-2 py-1 text-xs font-medium text-purple-800">
                AI 컨설팅 필수 데이터
              </span>
            </div>

            {formData.cultivationMethod === 'soil' ? (
              <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                <div>
                  <label className="mb-1 block text-sm font-medium text-stone-600">
                    토양 산도 (pH)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    className="w-full rounded border border-stone-300 p-2 focus:border-purple-500"
                    placeholder="6.5"
                    value={formData.soilData?.ph}
                    onChange={(e) =>
                      handleNestedChange('soilData', 'ph', parseFloat(e.target.value))
                    }
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-stone-600">
                    전기전도도 (EC)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    className="w-full rounded border border-stone-300 p-2 focus:border-purple-500"
                    placeholder="2.0"
                    value={formData.soilData?.ec}
                    onChange={(e) =>
                      handleNestedChange('soilData', 'ec', parseFloat(e.target.value))
                    }
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-stone-600">
                    유기물 (OM)
                  </label>
                  <input
                    type="number"
                    className="w-full rounded border border-stone-300 p-2 focus:border-purple-500"
                    placeholder="25 g/kg"
                    value={formData.soilData?.om}
                    onChange={(e) =>
                      handleNestedChange('soilData', 'om', parseFloat(e.target.value))
                    }
                  />
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <label className="mb-1 block text-sm font-medium text-blue-600">
                    원수 산도 (pH)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    className="w-full rounded border border-blue-200 bg-blue-50 p-2 focus:border-blue-500"
                    placeholder="7.0"
                    value={formData.waterData?.ph}
                    onChange={(e) =>
                      handleNestedChange('waterData', 'ph', parseFloat(e.target.value))
                    }
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-blue-600">
                    원수 EC (ds/m)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    className="w-full rounded border border-blue-200 bg-blue-50 p-2 focus:border-blue-500"
                    placeholder="0.5"
                    value={formData.waterData?.ec}
                    onChange={(e) =>
                      handleNestedChange('waterData', 'ec', parseFloat(e.target.value))
                    }
                  />
                </div>
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
};
