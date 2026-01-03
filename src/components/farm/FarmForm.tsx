import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { KOREA_REGIONS } from '@/constants/regions';
import { Factory, Save, Wind, FlaskConical, AlertTriangle } from 'lucide-react';
import type { Field } from '@/types/farm';

export interface FarmFormProps {
  initialData?: Partial<Field>;
  existingFields?: Field[];
  onSubmit: (data: any) => void;
  onCancel: () => void;
  submitLabel?: string;
}

export function FarmForm({
  initialData,
  existingFields = [],
  onSubmit,
  onCancel,
  submitLabel = '저장하기',
}: FarmFormProps) {
  // 1. Validation State
  const [validationErrors, setValidationErrors] = useState<string[]>([]);

  // 2. Fully Consolidated State
  const [formData, setFormData] = useState<any>({
    id: '', 
    name: '',
    area: '',
    facilityType: 'vinyl_single',
    province: '',
    city: '',
    town: '',
    location: '',
    cultivationMethod: 'soil',
    cultivationDetail: '',
    substrateType: 'cocopeat',
    potMediaType: 'commercial',
    isMiniTunnel: false,
    hasGutter: false,
    
    // Facility Specs
    specs: {
      width: '', length: '', eaveHeight: '', ridgeHeight: '',
      roofCovering: 'po_0_1', sideCovering: 'po_0_1',
      roofInsulation: 'none', sideInsulation: 'none',
      ventType: 'roll_up', isSideVentAutomatic: false, isRoofVentAutomatic: false,
      aisleWidth: '', hasPipeRail: false, floorType: 'soil'
    },
    
    // Equipment
    equipment: {
      controller: false, irrigation: false, autoCurtain: false, heating: false,
      co2: false, cctv: false, flowFan: false, mist: false,
    },
    
    // Sensors (Rendered now)
    sensors: {
      weatherStation: false, tempHum: true, co2: false, soilMoisture: false,
      substrateScale: false, nutrient: false, drainage: false,
    },
    
    // Environment
    heatingSource: 'none',
    coolingType: 'none',
    
    // Default merged
    ...initialData,
    // Ensure history is initialized
    history: initialData?.history || { soil: [], water: [] }, 
  });

  // Effect: Sync initialData for Edits
  useEffect(() => {
    console.log('[FarmForm] Mounted. Validating version 2.1. Form Data:', initialData);
    if (initialData) {
      setFormData((prev: any) => ({ 
          ...prev, 
          ...initialData,
          history: initialData.history || { soil: [], water: [] } 
      }));
    }
  }, [initialData]);

  // Handler: Generic Text/Select/Checkbox
  const handleEditChange = (e: any) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev: any) => ({ 
        ...prev, 
        [name]: type === 'checkbox' ? checked : value 
    }));
    // Clear errors on change
    if(validationErrors.length > 0) setValidationErrors([]);
  };

  const handleEquipmentChange = (key: string, checked: boolean) => {
    setFormData((p: any) => ({ ...p, equipment: { ...p.equipment, [key]: checked } }));
  };

  const handleSensorChange = (key: string, checked: boolean) => {
    setFormData((p: any) => ({ ...p, sensors: { ...p.sensors, [key]: checked } }));
  };

  const handleLocationChange = (level: string, value: string) => {
    setFormData((prev: any) => {
      const updates: any = { [level]: value };
      if (level === 'province') { updates.city = ''; updates.town = ''; }
      if (level === 'city') { updates.town = ''; }
      return { ...prev, ...updates };
    });
    if(validationErrors.length > 0) setValidationErrors([]);
  };

  // Helper: Deep update for Soil/Water analysis data
  const updateScientificData = (type: 'soil' | 'water', field: string, value: string) => {
     const val = parseFloat(value);
     const numericVal = isNaN(val) ? value : val;
     
     setFormData((prev: any) => {
        const currentList = prev.history?.[type] || [];
        const recordIndex = 0; 
        const newRecord = currentList[recordIndex] ? { ...currentList[recordIndex] } : { id: `${Date.now()}-hist`, date: new Date().toISOString() };
        
        newRecord[field] = numericVal;
        
        const newList = [...currentList];
        newList[recordIndex] = newRecord;
        
        return { 
            ...prev, 
            history: { 
                ...prev.history, 
                [type]: newList 
            } 
        };
     });
  };

  const handleSubmit = (e?: React.FormEvent) => {
      if (e) e.preventDefault();
      setValidationErrors([]);

      const errors: string[] = [];

      // 1. Required Field Validation
      if (!formData.name || formData.name.trim() === '') errors.push('농지 이름 (필수)');
      if (!formData.area || Number(formData.area) <= 0) errors.push('총 면적 (0보다 커야 함)');
      
      // Strict Address Validation
      if (!formData.province) errors.push('주소 (시/도)를 선택해주세요.');
      if (!formData.city) errors.push('주소 (시/군/구)를 선택해주세요.');
      if (!formData.town) errors.push('주소 (읍/면/동)을 선택해주세요.');

      if (!formData.facilityType) errors.push('시설 형태를 선택해주세요.');
      if (!formData.cultivationMethod) errors.push('재배 방식을 선택해주세요.');
      
      // Strict Detail Validation
      if (!formData.cultivationDetail || formData.cultivationDetail.trim() === '') {
          errors.push('상세 재배 유형(토질/상토/배지 등)을 선택하거나 입력해주세요.');
      }

      // 2. Duplicate Check
      if (formData.name && existingFields.length > 0) {
          const isDuplicate = existingFields.some(f => 
              f.name.trim() === formData.name.trim() && 
              String(f.id) !== String(formData.id)
          );
          if (isDuplicate) {
              errors.push('이미 존재하는 농지 이름입니다.');
          }
      }

      if (errors.length > 0) {
        setValidationErrors(errors);
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
      }

      // 3. Prepare Final Data
      const region = (KOREA_REGIONS as any)[formData.province];
      const regionName = region?.name || formData.province || '';
      const regionCity = formData.city || '';
      const regionTown = formData.town || '';
      const locationStr = `${regionName} ${regionCity} ${regionTown}`.trim();

      const finalData = {
        ...formData,
        location: locationStr || formData.location, 
        address: {
          province: formData.province,
          city: formData.city,
          town: formData.town,
        },
        area: Number(formData.area),
      };

      console.log('Submitting Valid Farm Data:', finalData);
      onSubmit(finalData);
  };

  // --- Render Helpers ---
  const getCityOptions = () => {
    if (!formData.province) return [];
    const region = (KOREA_REGIONS as any)[formData.province];
    return region ? Object.keys(region.cities) : [];
  };

  const getTownOptions = () => {
    if (!formData.province || !formData.city) return [];
    const region = (KOREA_REGIONS as any)[formData.province];
    return region?.cities[formData.city] || [];
  };

  const getAvailableMethods = () => {
    const isNoji = formData.facilityType === 'open_field' || formData.facilityType === 'noji';
    let methods = [
      { value: 'soil', label: '토경 재배 (Soil)' },
      { value: 'pot', label: '화분/포트 재배 (Pot)' },
      { value: 'substrate', label: '고형 배지 경작 (Substrate)' },
      { value: 'dft', label: '담액 수경 (DFT)' },
      { value: 'nft', label: '박막 수경 (NFT)' },
      { value: 'aeroponics', label: '분무 수경 (Aeroponics)' },
    ];
    if (isNoji) methods = methods.filter(m => ['soil', 'pot', 'substrate'].includes(m.value));
    return methods;
  };

  const isOpenField = formData.facilityType === 'open_field' || formData.facilityType === 'noji';
  const soilData = formData.history?.soil?.[0] || {};
  const waterData = formData.history?.water?.[0] || {};

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* ERROR BANNER */}
      {validationErrors.length > 0 && (
          <div className="rounded-lg bg-red-50 p-4 border border-red-200 animate-pulse">
              <div className="flex items-start gap-3">
                  <AlertTriangle className="h-5 w-5 text-red-600 mt-0.5" />
                  <div>
                      <h4 className="font-bold text-red-700 text-sm mb-1">입력 정보를 확인해주세요</h4>
                      <ul className="list-disc pl-4 space-y-1">
                          {validationErrors.map((err, i) => (
                              <li key={i} className="text-red-600 text-xs font-medium">{err}</li>
                          ))}
                      </ul>
                  </div>
              </div>
          </div>
      )}

      {/* 1. REQUIRED BASIC INFO */}
      <div className={`rounded-xl border bg-white p-5 shadow-sm space-y-4 ${validationErrors.length > 0 ? 'border-red-300 ring-1 ring-red-100' : 'border-indigo-100'}`}>
        <h3 className="flex items-center gap-2 text-lg font-bold text-slate-800">
           <span className="flex h-6 w-6 items-center justify-center rounded-full bg-indigo-600 text-xs text-white">1</span>
           필수 기본 정보
        </h3>
        
        <div className="grid gap-6 md:grid-cols-2">
           <div className="space-y-2">
               <Label>농지 별칭 (이름) <span className="text-red-500">*</span></Label>
               <Input name="name" value={formData.name} onChange={handleEditChange} placeholder="예: 제1농지" className={validationErrors.some(e => e.includes('이름')) ? 'border-red-400 bg-red-50' : ''} />
           </div>
           <div className="space-y-2">
               <Label>총 면적 (평) <span className="text-red-500">*</span></Label>
               <Input name="area" type="number" value={formData.area} onChange={handleEditChange} placeholder="1000" className={validationErrors.some(e => e.includes('면적')) ? 'border-red-400 bg-red-50' : ''} />
           </div>
        </div>

        <div className="space-y-2">
            <Label>주소 (행정구역) <span className="text-red-500">*</span></Label>
            <div className="grid grid-cols-3 gap-2">
                <Select value={formData.province} onChange={(e) => handleLocationChange('province', e.target.value)} className={validationErrors.some(e => e.includes('주소')) ? 'border-red-400 bg-red-50' : ''}>
                    <option value="">시/도 선택</option>
                    {Object.keys(KOREA_REGIONS).map(r => <option key={r} value={r}>{(KOREA_REGIONS as any)[r].name}</option>)}
                </Select>
                <Select value={formData.city} onChange={(e) => handleLocationChange('city', e.target.value)} disabled={!formData.province}>
                    <option value="">시/군/구</option>
                    {getCityOptions().map(c => <option key={c} value={c}>{c}</option>)}
                </Select>
                <Select value={formData.town} onChange={(e) => handleLocationChange('town', e.target.value)} disabled={!formData.city}>
                    <option value="">읍/면/동</option>
                    {getTownOptions().map((t: string) => <option key={t} value={t}>{t}</option>)}
                </Select>
            </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-2">
                <Label>시설 형태 <span className="text-red-500">*</span></Label>
                <Select name="facilityType" value={formData.facilityType} onChange={handleEditChange}>
                    <option value="open_field">노지 (Open Field)</option>
                    <option value="vinyl_single">단동형 비닐하우스</option>
                    <option value="vinyl_multi">연동형 비닐하우스</option>
                    <option value="vinyl_greenhouse">복합 비닐 온실</option>
                    <option value="glass_greenhouse">유리 온실</option>
                </Select>
                <div className="mt-2 flex items-center gap-2 p-2 bg-slate-50 rounded border border-slate-100">
                    <Checkbox id="isMiniTunnel" checked={formData.isMiniTunnel} onChange={(e) => setFormData((p: any) => ({...p, isMiniTunnel: e.target.checked}))} />
                    <Label htmlFor="isMiniTunnel" className="cursor-pointer text-sm">미니 터널 설치</Label>
                </div>
            </div>
            
            <div className="space-y-2">
                <Label>재배 방식 <span className="text-red-500">*</span></Label>
                <Select name="cultivationMethod" value={formData.cultivationMethod} onChange={handleEditChange}>
                    {getAvailableMethods().map(m => <option key={m.value} value={m.value}>{m.label}</option>)}
                </Select>
                
                {formData.cultivationMethod && (
                    <div className="mt-2 animate-in fade-in">
                        <Label className="text-[10px] text-slate-400 mb-1 block">상세 유형 (선택) <span className="text-red-500">*</span></Label>
                        {formData.cultivationMethod === 'soil' && (
                             <Select name="cultivationDetail" value={formData.cultivationDetail} onChange={handleEditChange}>
                                <option value="">-- 토양 성분 선택 --</option>
                                <option value="sandy">사질토 (모래)</option>
                                <option value="loam">양토 (일반)</option>
                                <option value="clay">점질토 (진흙)</option>
                             </Select>
                        )}
                        {/* RESTORED: Substrate Specific Options */}
                        {formData.cultivationMethod === 'substrate' && (
                             <Select name="cultivationDetail" value={formData.cultivationDetail} onChange={handleEditChange}>
                                <option value="">-- 배지 선택 --</option>
                                <option value="cocopeat">코코피트 (Cocopeat)</option>
                                <option value="perlite">펄라이트 (Perlite)</option>
                                <option value="rockwool">암면 (Rockwool)</option>
                             </Select>
                        )}
                         {/* RESTORED: Pot Specific Options */}
                         {formData.cultivationMethod === 'pot' && (
                             <Select name="cultivationDetail" value={formData.cultivationDetail} onChange={handleEditChange}>
                                <option value="">-- 상토 종류 선택 --</option>
                                <option value="commercial">상업용 상토</option>
                                <option value="custom">자가 제조 상토</option>
                             </Select>
                        )}
                        {['dft', 'nft', 'aeroponics'].includes(formData.cultivationMethod) && (
                             <Select name="cultivationDetail" value={formData.cultivationDetail} onChange={handleEditChange}>
                                <option value="">-- 배지 선택 --</option>
                                <option value="sponge">스펀지</option>
                                <option value="rockwool_cube">암면 큐브</option>
                             </Select>
                        )}
                        {!['soil', 'substrate', 'pot', 'dft', 'nft', 'aeroponics'].includes(formData.cultivationMethod) && (
                            <Input name="cultivationDetail" value={formData.cultivationDetail || ''} onChange={handleEditChange} placeholder="상세 유형 입력" />
                        )}
                    </div>
                )}
                
                 <div className="mt-2 flex items-center gap-2">
                    <Checkbox id="hasGutter" checked={formData.hasGutter} onChange={(e) => setFormData((p: any) => ({...p, hasGutter: e.target.checked}))} />
                    <Label htmlFor="hasGutter" className="cursor-pointer text-xs text-blue-600 font-bold">거터(Gutter) 설치됨</Label>
                </div>
            </div>
        </div>
      </div>

      {/* 2. OPTIONAL DETAILS (Scientific Data RESTORED) */}
      <div className="rounded-xl border border-slate-200 bg-white shadow-sm">
         <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="details" className="border-b-0 px-5">
               <AccordionTrigger className="hover:no-underline py-4">
                  <div className="flex items-center gap-2 text-lg font-bold text-slate-700">
                     <span className="flex h-6 w-6 items-center justify-center rounded-full bg-slate-200 text-xs text-slate-600">2</span>
                     상세 환경설정 (선택)
                  </div>
               </AccordionTrigger>
               <AccordionContent className="pt-2 pb-6 space-y-8">
                  
                  {/* Facility Specs (Always Visible for Verification, Disabled if Open Field) */}
                  <div className={`pt-6 border-t border-dashed ${isOpenField ? 'opacity-50 grayscale' : ''}`}>
                      <h4 className="flex items-center gap-2 font-bold text-slate-700 mb-4">
                          <Factory className="h-4 w-4" /> 시설 상세 및 자재 (Specs)
                          {isOpenField && <span className="text-xs text-slate-400 font-normal ml-2">* 노지는 입력 불필요</span>}
                      </h4>
                      
                      {/* 1. Dimensions */}
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                          <div><Label className="text-xs mb-1 block">폭 (Width, m)</Label><Input type="number" disabled={isOpenField} value={formData.specs?.width || ''} onChange={(e) => setFormData((p:any) => ({...p, specs:{...p.specs, width: e.target.value}}))} placeholder="7.0" /></div>
                          <div><Label className="text-xs mb-1 block">길이 (Length, m)</Label><Input type="number" disabled={isOpenField} value={formData.specs?.length || ''} onChange={(e) => setFormData((p:any) => ({...p, specs:{...p.specs, length: e.target.value}}))} placeholder="90.0" /></div>
                          <div><Label className="text-xs mb-1 block">측고 (Eave H, m)</Label><Input type="number" disabled={isOpenField} value={formData.specs?.eaveHeight || ''} onChange={(e) => setFormData((p:any) => ({...p, specs:{...p.specs, eaveHeight: e.target.value}}))} placeholder="2.0" /></div>
                          <div><Label className="text-xs mb-1 block">동고 (Ridge H, m)</Label><Input type="number" disabled={isOpenField} value={formData.specs?.ridgeHeight || ''} onChange={(e) => setFormData((p:any) => ({...p, specs:{...p.specs, ridgeHeight: e.target.value}}))} placeholder="3.5" /></div>
                      </div>

                      {/* 2. Covering & Insulation (Requested Restoration) */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 bg-slate-50 p-3 rounded-lg border border-slate-100">
                           <div className="space-y-2">
                               <Label className="text-xs font-bold text-slate-500">피복재 (Covering)</Label>
                               <div className="grid grid-cols-2 gap-2">
                                   <div>
                                       <Label className="text-[10px] text-slate-400">지붕 (Roof)</Label>
                                       <Select disabled={isOpenField} value={formData.specs?.roofCovering || 'po_0_1'} onChange={(e) => setFormData((p:any) => ({...p, specs:{...p.specs, roofCovering: e.target.value}}))}>
                                          <option value="po_0_1">PO필름 0.1mm</option>
                                          <option value="po_0_15">PO필름 0.15mm</option>
                                          <option value="pe_0_08">PE필름 0.08mm</option>
                                          <option value="fluorine">불소필름</option>
                                          <option value="glass">유리 (4mm)</option>
                                          <option value="pc">폴리카보네이트</option>
                                       </Select>
                                   </div>
                                   <div>
                                       <Label className="text-[10px] text-slate-400">측면 (Side)</Label>
                                       <Select disabled={isOpenField} value={formData.specs?.sideCovering || 'po_0_1'} onChange={(e) => setFormData((p:any) => ({...p, specs:{...p.specs, sideCovering: e.target.value}}))}>
                                          <option value="po_0_1">PO필름 0.1mm</option>
                                          <option value="po_0_15">PO필름 0.15mm</option>
                                          <option value="insect_net">방충망 (Net)</option>
                                       </Select>
                                   </div>
                               </div>
                           </div>
                           <div className="space-y-2">
                               <Label className="text-xs font-bold text-slate-500">보온재 (Insulation)</Label>
                               <div className="grid grid-cols-2 gap-2">
                                   <div>
                                       <Label className="text-[10px] text-slate-400">지붕 (Roof)</Label>
                                       <Select disabled={isOpenField} value={formData.specs?.roofInsulation || 'none'} onChange={(e) => setFormData((p:any) => ({...p, specs:{...p.specs, roofInsulation: e.target.value}}))}>
                                          <option value="none">없음</option>
                                          <option value="multi_layer">다겹 보온커튼</option>
                                          <option value="single_layer">부직포 (단겹)</option>
                                          <option value="aluminum">알루미늄 스크린</option>
                                       </Select>
                                   </div>
                                    <div>
                                       <Label className="text-[10px] text-slate-400">측면 (Side)</Label>
                                       <Select disabled={isOpenField} value={formData.specs?.sideInsulation || 'none'} onChange={(e) => setFormData((p:any) => ({...p, specs:{...p.specs, sideInsulation: e.target.value}}))}>
                                          <option value="none">없음</option>
                                          <option value="multi_layer">다겹 보온커튼</option>
                                          <option value="vinyl_thick">비닐 (이중)</option>
                                       </Select>
                                   </div>
                               </div>
                           </div>
                      </div>

                      {/* 3. Condensed Equipment Checklist */}
                      <Label className="text-xs font-bold text-slate-500 mb-2 block">환경 제어 장비 (Equipment)</Label>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                          {Object.entries({
                              controller: '환경제어기', irrigation: '양액기', heating: '난방기',
                              autoCurtain: '자동개폐기', flowFan: '유동팬', co2: 'CO2시비',
                              cctv: 'CCTV', mist: '미스트'
                          }).map(([k, label]) => (
                              <div key={k} className="flex items-center gap-2">
                                  <Checkbox id={`eq-${k}`} disabled={isOpenField} checked={!!formData.equipment?.[k]} onChange={(e) => handleEquipmentChange(k, (e.target as any).checked)} />
                                  <Label htmlFor={`eq-${k}`} className="text-xs cursor-pointer">{label}</Label>
                              </div>
                          ))}
                      </div>
                  </div>

                   {/* Sensors Section (NEW - Moved below facility specs for logic flow) */}
                   {/* Sensors Section (NEW - Moved below facility specs for logic flow) */}
                    <div className="space-y-4 pt-4 border-t border-dashed">
                      <h4 className="flex items-center gap-2 font-bold text-slate-700">
                          <Wind className="h-4 w-4 text-indigo-500" /> 환경 및 토양 센서 (Sensors)
                      </h4>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-slate-50 rounded-xl border border-slate-100">
                          {Object.entries({
                              weatherStation: '외부 기상대',
                              tempHum: '온습도 센서',
                              co2: 'CO2 센서',
                              soilMoisture: '토양/배지 수분',
                              substrateScale: '배지 중량판',
                              nutrient: '배양액 센서(EC/pH)',
                              drainage: '배액 측정기'
                          }).map(([k, label]) => (
                              <div key={k} className="flex items-center gap-2">
                                   <Checkbox 
                                      id={`sensor-${k}`} 
                                      checked={!!formData.sensors?.[k]} 
                                      onChange={(e) => handleSensorChange(k, (e.target as any).checked)} 
                                   />
                                   <Label htmlFor={`sensor-${k}`} className="text-xs cursor-pointer">{label}</Label>
                              </div>
                          ))}
                      </div>
                    </div>

                  {/* FULL Scientific Analysis Data */}
                  <div className="space-y-4">
                     <h4 className="flex items-center gap-2 font-bold text-slate-700 border-b pb-2">
                        <FlaskConical className="h-5 w-5 text-indigo-500" /> 
                        정밀 토양/수질 분석 데이터
                     </h4>
                     
                     <div className="grid gap-6">
                        {/* Soil Data Section */}
                        <div className="space-y-4 bg-stone-50 p-5 rounded-xl border border-stone-100">
                             <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center gap-2">
                                    <span className="w-2 h-2 rounded-full bg-amber-600"></span>
                                    <Label className="font-bold text-stone-700 text-sm">토양 분석 정보 (Soil Analysis)</Label>
                                </div>
                                <span className="text-[10px] text-stone-400">단위: pH, dS/m, %, ppm, cmol+/kg</span>
                             </div>
                             
                             <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                 <div><Label className="text-xs mb-1 block">산도 (pH)</Label><Input type="number" step="0.1" value={soilData.ph || ''} onChange={(e) => updateScientificData('soil', 'ph', e.target.value)} placeholder="6.0" className="bg-white" /></div>
                                 <div><Label className="text-xs mb-1 block">전기전도도 (EC)</Label><Input type="number" step="0.1" value={soilData.ec || ''} onChange={(e) => updateScientificData('soil', 'ec', e.target.value)} placeholder="2.0" className="bg-white" /></div>
                                 <div><Label className="text-xs mb-1 block">유기물 (OM)</Label><Input type="number" step="0.1" value={soilData.om || ''} onChange={(e) => updateScientificData('soil', 'om', e.target.value)} placeholder="2.5" className="bg-white" /></div>
                                 <div><Label className="text-xs mb-1 block">유효인산 (P2O5)</Label><Input type="number" step="1" value={soilData.p2o5 || ''} onChange={(e) => updateScientificData('soil', 'p2o5', e.target.value)} placeholder="300" className="bg-white" /></div>
                             </div>

                             <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                                 <div className="space-y-2">
                                     <Label className="text-xs font-bold text-stone-500">양이온/다량원소</Label>
                                     <div className="grid grid-cols-3 gap-2">
                                         <Input type="number" step="0.1" value={soilData.k2o || ''} onChange={(e) => updateScientificData('soil', 'k2o', e.target.value)} placeholder="K (K2O)" className="bg-white text-xs h-8" />
                                         <Input type="number" step="0.1" value={soilData.cao || ''} onChange={(e) => updateScientificData('soil', 'cao', e.target.value)} placeholder="Ca (CaO)" className="bg-white text-xs h-8" />
                                         <Input type="number" step="0.1" value={soilData.mgo || ''} onChange={(e) => updateScientificData('soil', 'mgo', e.target.value)} placeholder="Mg (MgO)" className="bg-white text-xs h-8" />
                                         <Input type="number" step="0.1" value={soilData.no3_n || ''} onChange={(e) => updateScientificData('soil', 'no3_n', e.target.value)} placeholder="NO3-N" className="bg-white text-xs h-8" />
                                         <Input type="number" step="0.1" value={soilData.nh4_n || ''} onChange={(e) => updateScientificData('soil', 'nh4_n', e.target.value)} placeholder="NH4-N" className="bg-white text-xs h-8" />
                                     </div>
                                 </div>
                                 <div className="space-y-2">
                                     <Label className="text-xs font-bold text-stone-500">미량원소 (ppm)</Label>
                                     <div className="grid grid-cols-3 gap-2">
                                         <Input type="number" step="0.1" value={soilData.fe || ''} onChange={(e) => updateScientificData('soil', 'fe', e.target.value)} placeholder="Fe" className="bg-white text-xs h-8" />
                                         <Input type="number" step="0.1" value={soilData.mn || ''} onChange={(e) => updateScientificData('soil', 'mn', e.target.value)} placeholder="Mn" className="bg-white text-xs h-8" />
                                         <Input type="number" step="0.1" value={soilData.zn || ''} onChange={(e) => updateScientificData('soil', 'zn', e.target.value)} placeholder="Zn" className="bg-white text-xs h-8" />
                                         <Input type="number" step="0.1" value={soilData.b || ''} onChange={(e) => updateScientificData('soil', 'b', e.target.value)} placeholder="B" className="bg-white text-xs h-8" />
                                         <Input type="number" step="0.1" value={soilData.cu || ''} onChange={(e) => updateScientificData('soil', 'cu', e.target.value)} placeholder="Cu" className="bg-white text-xs h-8" />
                                         <Input type="number" step="0.01" value={soilData.mo || ''} onChange={(e) => updateScientificData('soil', 'mo', e.target.value)} placeholder="Mo" className="bg-white text-xs h-8" />
                                     </div>
                                 </div>
                             </div>
                        </div>

                        {/* Water Data Section */}
                        <div className="space-y-4 bg-blue-50 p-5 rounded-xl border border-blue-100">
                             <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center gap-2">
                                    <span className="w-2 h-2 rounded-full bg-blue-600"></span>
                                    <Label className="font-bold text-blue-700 text-sm">원수 수질 데이터 (Water Analysis)</Label>
                                </div>
                                <span className="text-[10px] text-blue-400">단위: pH, dS/m, ppm</span>
                             </div>

                             <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                 <div><Label className="text-xs mb-1 block">pH</Label><Input type="number" step="0.1" value={waterData.ph || ''} onChange={(e) => updateScientificData('water', 'ph', e.target.value)} placeholder="7.0" className="bg-white" /></div>
                                 <div><Label className="text-xs mb-1 block">EC (dS/m)</Label><Input type="number" step="0.1" value={waterData.ec || ''} onChange={(e) => updateScientificData('water', 'ec', e.target.value)} placeholder="0.5" className="bg-white" /></div>
                                 <div><Label className="text-xs mb-1 block">중탄산 (HCO3)</Label><Input type="number" step="1" value={waterData.hco3 || ''} onChange={(e) => updateScientificData('water', 'hco3', e.target.value)} placeholder="60" className="bg-white" /></div>
                                 <div><Label className="text-xs mb-1 block">나트륨 (Na)</Label><Input type="number" step="1" value={waterData.na || ''} onChange={(e) => updateScientificData('water', 'na', e.target.value)} placeholder="10" className="bg-white" /></div>
                             </div>

                             <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                                 <div className="space-y-2">
                                     <Label className="text-xs font-bold text-blue-500">다량 이온 (ppm)</Label>
                                     <div className="grid grid-cols-3 gap-2">
                                         <Input type="number" step="0.1" value={waterData.no3_n || ''} onChange={(e) => updateScientificData('water', 'no3_n', e.target.value)} placeholder="NO3-N" className="bg-white text-xs h-8" />
                                         <Input type="number" step="0.1" value={waterData.nh4_n || ''} onChange={(e) => updateScientificData('water', 'nh4_n', e.target.value)} placeholder="NH4-N" className="bg-white text-xs h-8" />
                                         <Input type="number" step="0.1" value={waterData.ca || ''} onChange={(e) => updateScientificData('water', 'ca', e.target.value)} placeholder="Ca" className="bg-white text-xs h-8" />
                                         <Input type="number" step="0.1" value={waterData.mg || ''} onChange={(e) => updateScientificData('water', 'mg', e.target.value)} placeholder="Mg" className="bg-white text-xs h-8" />
                                         <Input type="number" step="0.1" value={waterData.so4 || ''} onChange={(e) => updateScientificData('water', 'so4', e.target.value)} placeholder="S (SO4)" className="bg-white text-xs h-8" />
                                         <Input type="number" step="0.1" value={waterData.cl || ''} onChange={(e) => updateScientificData('water', 'cl', e.target.value)} placeholder="Cl" className="bg-white text-xs h-8" />
                                     </div>
                                 </div>
                                 <div className="space-y-2">
                                     <Label className="text-xs font-bold text-blue-500">미량 원소 (ppm)</Label>
                                     <div className="grid grid-cols-3 gap-2">
                                         <Input type="number" step="0.1" value={waterData.fe || ''} onChange={(e) => updateScientificData('water', 'fe', e.target.value)} placeholder="Fe" className="bg-white text-xs h-8" />
                                         <Input type="number" step="0.1" value={waterData.mn || ''} onChange={(e) => updateScientificData('water', 'mn', e.target.value)} placeholder="Mn" className="bg-white text-xs h-8" />
                                         <Input type="number" step="0.1" value={waterData.zn || ''} onChange={(e) => updateScientificData('water', 'zn', e.target.value)} placeholder="Zn" className="bg-white text-xs h-8" />
                                         <Input type="number" step="0.1" value={waterData.b || ''} onChange={(e) => updateScientificData('water', 'b', e.target.value)} placeholder="B" className="bg-white text-xs h-8" />
                                         <Input type="number" step="0.1" value={waterData.cu || ''} onChange={(e) => updateScientificData('water', 'cu', e.target.value)} placeholder="Cu" className="bg-white text-xs h-8" />
                                         <Input type="number" step="0.01" value={waterData.mo || ''} onChange={(e) => updateScientificData('water', 'mo', e.target.value)} placeholder="Mo" className="bg-white text-xs h-8" />
                                     </div>
                                 </div>
                             </div>
                        </div>
                     </div>
                  </div>

                  {/* Facility Specs moved up */}
               </AccordionContent>
            </AccordionItem>
         </Accordion>
      </div>

      <div className="flex justify-end gap-2 pt-4">
        <Button variant="outline" type="button" onClick={onCancel} className="h-12 px-6">
          취소
        </Button>
        <Button 
            type="button"
            className="h-12 bg-green-600 px-8 text-base font-bold shadow-md shadow-green-200 transition-all hover:bg-green-700 hover:shadow-lg" 
            onClick={(e) => handleSubmit(e)}
        >
          <Save className="mr-2 h-4 w-4" /> {submitLabel}
        </Button>
      </div>
    </div>
  );
}
