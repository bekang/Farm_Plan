import { useState, useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Select } from '@/components/ui/select';
import { AlertCircle, CheckCircle2, Search, Calendar as CalendarIcon, Calculator } from 'lucide-react';
import { useSearchCrops } from '@/hooks/useMarketCrops';
import { SimpleCalendar } from './SimpleCalendar';
import { FinancialCalculatorModal } from './FinancialCalculatorModal';
import { planFormSchema, type PlanFormValues } from '@/schemas/planningSchema';
import type { CropPlan, CostDetail, RevenueItem } from '@/types/planning';
import type { MarketCrop } from '@/types/market';

// Helpers (Same as Wizard)
const CULTIVATION_KB: Record<string, any> = {
  고추: { defaultMethod: 'transplanting', seedingDuration: 160, transplantDuration: 90, seedingCost: 100000, transplantCost: 1500000 },
  마늘: { defaultMethod: 'seeding', seedingDuration: 240, transplantDuration: 240, seedingCost: 2000000, transplantCost: 2000000 },
  양파: { defaultMethod: 'transplanting', seedingDuration: 260, transplantDuration: 220, seedingCost: 500000, transplantCost: 1200000 },
  default: { defaultMethod: 'transplanting', seedingDuration: 120, transplantDuration: 90, seedingCost: 500000, transplantCost: 1000000 },
};

interface SinglePagePlanFormProps {
  fieldId: string;
  existingPlans: CropPlan[];
  onComplete: (data: any) => void;
}

export function SinglePagePlanForm({
  fieldId,
  existingPlans,
  onComplete,
}: SinglePagePlanFormProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMarketCrop, setSelectedMarketCrop] = useState<MarketCrop | null>(null);
  const [prediction, setPrediction] = useState<any>(null);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false); // Calendar State
  const [isCalculatorOpen, setIsCalculatorOpen] = useState(false); // Calculator State
  
  // Detailed Financial State
  const [detailedCosts, setDetailedCosts] = useState<CostDetail | undefined>(undefined);
  const [detailedRevenues, setDetailedRevenues] = useState<RevenueItem[] | undefined>(undefined);

  const calendarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
        if (calendarRef.current && !calendarRef.current.contains(event.target as Node)) {
            setIsCalendarOpen(false);
        }
    }
    if (isCalendarOpen) {
        document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
        document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isCalendarOpen]);

  // React Hook Form
  const { register, handleSubmit, setValue, watch, formState: { errors }, clearErrors } = useForm<PlanFormValues>({
    resolver: zodResolver(planFormSchema),
    defaultValues: {
      fieldId,
      plantingMethod: 'transplanting',
      includeSoilPrep: false,
    }
  });

  const watchedValues = watch();

  // Search Data
  const { data: searchResults = [] } = useSearchCrops(searchQuery);

  // Handlers
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    if (!e.target.value) {
        setSelectedMarketCrop(null);
    }
  };

  const handleSelectCrop = (crop: MarketCrop) => {
    setSelectedMarketCrop(crop);
    setValue('cropName', crop.name);
    setSearchQuery(crop.name); // Set input to name
    
    // Generate Prediction
    const info = CULTIVATION_KB[crop.name] || CULTIVATION_KB.default;
    const today = new Date();
    const harvestDate = new Date(today);
    const duration = info.sortingDuration || (info.seedingDuration + info.transplantDuration); // Approximate
    harvestDate.setDate(today.getDate() + duration);

    // Mock Financials
    const area = 300; // Mock 300 pyung
    const yieldPerArea = 10; // kg
    const estYield = area * yieldPerArea;
    const estPrice = crop.defaultPrice || 5000;
    const revenue = estYield * estPrice;
    
    const cost = info.defaultMethod === 'transplanting' ? info.transplantCost : info.seedingCost;

    setPrediction({
        duration,
        harvestDate: harvestDate.toISOString().split('T')[0],
        revenue,
        cost,
        yield: estYield
    });

    // Set Default Values
    setValue('estimatedHarvestDate', harvestDate.toISOString().split('T')[0]);
    setValue('estimatedCost', cost);
    setValue('targetYield', estYield);
    setValue('targetPrice', estPrice);
  };

  // Effect: Calculate Soil Prep Dates
  useEffect(() => {
    if (watchedValues.includeSoilPrep && watchedValues.plantingDate && watchedValues.soilPrepDuration) {
        const plant = new Date(watchedValues.plantingDate);
        const end = new Date(plant);
        end.setDate(plant.getDate() - 1); // finish 1 day before planting
        
        const start = new Date(end);
        start.setDate(end.getDate() - (watchedValues.soilPrepDuration || 0) + 1);
        
        setValue('soilPrepEndDate', end.toISOString().split('T')[0]);
        setValue('soilPrepStartDate', start.toISOString().split('T')[0]);
        setValue('soilPrepTiming', 'before'); // Default to before
    }
  }, [watchedValues.includeSoilPrep, watchedValues.plantingDate, watchedValues.soilPrepDuration, setValue]);

  // Handler for Calculator Save
  const handleCalculatorSave = (costs: CostDetail, revenues: RevenueItem[]) => {
      setDetailedCosts(costs);
      setDetailedRevenues(revenues);
      
      const totalCost = Object.values(costs).reduce((a, b) => a + b, 0);
      const totalRevenue = revenues.reduce((a, b) => a + (b.amount * b.price), 0);
      
      // Update displayed prediction
      if (prediction) {
          setPrediction({
              ...prediction,
              cost: totalCost,
              revenue: totalRevenue
          });
      }
      
      // Update form values for simple fallback
      setValue('estimatedCost', totalCost);
  };

  const onSubmit = (data: any) => {
    // Merge Detailed Financials
    const finalData = {
        ...data,
        costDetails: detailedCosts,
        revenueItems: detailedRevenues
    };
    
    onComplete(finalData);
    
    // Reset Form State
    setSearchQuery('');
    setSelectedMarketCrop(null);
    setPrediction(null);
    setDetailedCosts(undefined);
    setDetailedRevenues(undefined);
    setValue('plantingDate', ''); 
    clearErrors();
  };

  return (
    <div className="w-full animate-in fade-in slide-in-from-top-4">
      <Card className="flex w-full flex-col border-indigo-500 shadow-lg md:flex-row">
        
        {/* LEFT: Input Form */}
        <div className="flex-1 bg-white p-6">
           <div className="mb-6 flex items-center justify-between">
              <h2 className="text-xl font-bold text-slate-800">새 작기 계획 추가</h2>
           </div>
           
           <div className="space-y-6">
              {/* 1. Crop Select */}
              <div className="space-y-2">
                 <Label>작물 선택</Label>
                 {selectedMarketCrop ? (
                    <div className="flex items-center justify-between rounded-lg border-2 border-indigo-100 bg-indigo-50 p-3">
                       <span className="font-bold text-indigo-700">{selectedMarketCrop.name}</span>
                       <Button variant="ghost" size="sm" onClick={() => setSelectedMarketCrop(null)} className="h-6 text-xs text-indigo-400">변경</Button>
                    </div>
                 ) : (
                    <div className="relative">
                       <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                       <Input 
                          placeholder="작물 검색 (예: 고추, 마늘) 또는 직접 입력" 
                          value={searchQuery}
                          onChange={handleSearchChange}
                          className="pl-9"
                       />
                       {/* Dropdown Results */}
                       {searchResults.length > 0 && searchQuery && !selectedMarketCrop && (
                          <div className="absolute z-10 mt-1 max-h-40 w-full overflow-y-auto rounded-md border bg-white shadow-lg">
                             {searchResults.map(crop => (
                                <div key={crop.id} onClick={() => handleSelectCrop(crop)} className="cursor-pointer p-2 hover:bg-slate-50">{crop.name}</div>
                             ))}
                          </div>
                       )}
                    </div>
                 )}
              </div>

                  
               {/* 2. Date & Method */}
               <div className="grid grid-cols-2 gap-4">
                   <div>
                      <Label>파종/정식일</Label>
                      <div className="relative" ref={calendarRef}>
                        <Input 
                            value={watchedValues.plantingDate || ''}
                            onClick={() => setIsCalendarOpen(true)}
                            readOnly
                            className="cursor-pointer"
                            placeholder="날짜 선택"
                        />
                        <CalendarIcon className="absolute right-3 top-2.5 h-4 w-4 text-slate-400" />
                        {/* Calendar Popup */}
                        
                        {isCalendarOpen && (
                            <div className="absolute top-full left-0 z-50 mt-1 bg-white shadow-xl rounded-lg border p-2">
                                <SimpleCalendar 
                                    selectedDate={watchedValues.plantingDate ? new Date(watchedValues.plantingDate) : null}
                                    onSelect={(date) => {
                                        // Use local date string to avoid timezone issues
                                        const year = date.getFullYear();
                                        const month = String(date.getMonth() + 1).padStart(2, '0');
                                        const day = String(date.getDate()).padStart(2, '0');
                                        setValue('plantingDate', `${year}-${month}-${day}`);
                                        setIsCalendarOpen(false);
                                    }}
                                    blockedRanges={existingPlans
                                        .filter(p => String(p.fieldId) === String(fieldId))
                                        .map(p => {
                                            const start = new Date(p.plantingDate);
                                            // Handle Existing Prep
                                            if (p.includeSoilPrep && p.soilPrepStartDate) {
                                                const prepStart = new Date(p.soilPrepStartDate);
                                                if (prepStart < start) start.setTime(prepStart.getTime());
                                            } else if (p.includeSoilPrep) {
                                                // Fallback
                                                start.setDate(start.getDate() - 14);
                                            }
                                            
                                            return {
                                                start: start,
                                                end: new Date(p.expectedHarvestDate),
                                                label: p.cropName
                                            };
                                        })
                                    }
                                />
                            </div>
                        )}
                      </div>
                      {errors.plantingDate && <p className="mt-1 text-xs font-bold text-red-500">{errors.plantingDate.message}</p>}
                   </div>
                  <div>
                     <Label>재배 방식</Label>
                      <Select 
                         value={watchedValues.plantingMethod} 
                         onChange={(e) => setValue('plantingMethod', e.target.value as any)}
                      >
                         <option value="transplanting">모종 정식</option>
                         <option value="seeding">직파 (씨앗)</option>
                      </Select>
                  </div>
               </div>
               
                {/* 3. Soil Prep (New Duration Based UI) */}
                <div className="rounded-lg border border-slate-200 bg-slate-50 p-4 transition-all hover:border-amber-200 hover:bg-amber-50/50">
                   <div className="flex items-center justify-between">
                       <div className="flex items-center gap-2">
                           <div className="flex h-8 w-8 items-center justify-center rounded bg-white shadow-sm ring-1 ring-slate-100">
                               <span className="text-lg">🚜</span>
                           </div>
                           <div className="flex flex-col">
                               <Label className="font-bold text-slate-900">기초 작업 (밭 만들기)</Label>
                               <span className="text-[10px] text-slate-500">파종 전 퇴비 작업 등</span>
                           </div>
                       </div>
                       
                       <div className="flex items-center gap-2">
                           <Label htmlFor="soil-prep-switch" className="text-xs font-bold text-slate-600 cursor-pointer">
                              {watchedValues.includeSoilPrep ? '일정 포함' : '일정 추가'}
                           </Label>
                           <Switch 
                              id="soil-prep-switch"
                              checked={watchedValues.includeSoilPrep}
                              onCheckedChange={(checked) => setValue('includeSoilPrep', checked)}
                           />
                       </div>
                   </div>
                   
                   {watchedValues.includeSoilPrep && (
                       <div className="mt-4 animate-in slide-in-from-top-2 border-t border-slate-200 pt-4 space-y-4">
                           <div className="grid grid-cols-1 gap-4">
                               <div className="space-y-1">
                                    <Label className="text-xs text-slate-600">작업 기간 (일)</Label>
                                    <div className="flex items-center gap-2">
                                        <Input 
                                            type="number"
                                            className="h-9 w-24 bg-white text-sm"
                                            {...register('soilPrepDuration', { valueAsNumber: true })}
                                            placeholder="15"
                                        />
                                        <span className="text-sm text-slate-600">일간</span>
                                    </div>
                               </div>
                               <div className="rounded bg-amber-50 p-2 text-xs text-amber-700">
                                   * 정식(파종)일 하루 전까지 마무리가 되도록 자동 계산됩니다.
                               </div>
                           </div>
                           
                            {/* Display Calculated Dates */}
                            <div className="rounded bg-amber-100/50 p-2 text-center text-xs text-amber-800">
                                📅 예상 작업 기간: {watchedValues.soilPrepStartDate || '-'} ~ {watchedValues.soilPrepEndDate || '-'}
                            </div>

                           <p className="text-[10px] text-amber-600">* 파종일({watchedValues.plantingDate})을 기준으로 자동 계산됩니다.</p>
                       </div>
                   )}
                </div>
            </div>
         </div>

         {/* RIGHT: Visual Aid (Bubble/Preview) */}
         <div className="flex w-full flex-col justify-between bg-slate-50 p-6 md:w-1/3 border-l border-slate-100">
           <div>
              <h3 className="mb-4 flex items-center gap-2 font-bold text-slate-700">
                 <AlertCircle className="h-4 w-4 text-indigo-500" /> 예상 시뮬레이션
              </h3>
              
              {selectedMarketCrop && prediction ? (
                 <div className="space-y-4">
                    {/* Bubble 1: Schedule */}
                    <div className="relative rounded-2xl rounded-tl-none bg-white p-4 shadow-sm ring-1 ring-black/5">
                        <p className="mb-1 text-xs font-bold text-indigo-500">예상 일정</p>
                        <p className="text-sm text-slate-700">
                           <span className="font-bold">{watchedValues.plantingDate}</span> 부터<br/>
                           약 <span className="font-bold text-indigo-600">{prediction.duration}일</span> 동안 재배하여<br/>
                           <span className="font-bold">{prediction.harvestDate}</span> 경 수확 예정입니다.
                        </p>
                    </div>

                    {/* Bubble 2: Financial */}
                    <div className="relative rounded-2xl rounded-tl-none bg-white p-4 shadow-sm ring-1 ring-black/5">
                        <p className="mb-1 text-xs font-bold text-green-600">수익 예측</p>
                        <div className="flex justify-between text-sm">
                           <span className="text-slate-500">예상 매출</span>
                           <span className="font-bold">{prediction.revenue.toLocaleString()}원</span>
                        </div>
                        <div className="flex justify-between text-sm">
                           <span className="text-slate-500">예상 비용</span>
                           <span className="font-bold text-red-500">-{prediction.cost.toLocaleString()}원</span>
                        </div>
                        <div className="mt-2 border-t pt-2 text-right font-bold text-green-700">
                           + {(prediction.revenue - prediction.cost).toLocaleString()}원
                        </div>
                        
                        {/* New Detail Button */}
                        <div className="mt-3">
                            <Button 
                                variant="outline" 
                                size="sm" 
                                type="button" 
                                className="w-full text-xs h-8 border-indigo-200 text-indigo-700 hover:bg-indigo-50"
                                onClick={() => setIsCalculatorOpen(true)}
                                disabled={!selectedMarketCrop}
                            >
                                <Calculator className="h-3 w-3 mr-1" /> 상세 견적 및 분석
                            </Button>
                        </div>
                    </div>
                 </div>
              ) : (
                 <div className="py-10 text-center text-sm text-slate-400">
                    작물과 날짜를 선택하면<br/>예상 결과를 미리 보여드립니다.
                 </div>
              )}
           </div>

           <Button 
               className="mt-6 w-full bg-indigo-600 hover:bg-indigo-700" 
               size="lg"
               onClick={handleSubmit(onSubmit)}
               disabled={!searchQuery || !!errors.plantingDate}
           >
              <CheckCircle2 className="mr-2 h-4 w-4" /> 작기 추가하기
           </Button>
        </div>

      </Card>
      
      {/* Calculator Modal */}
      {selectedMarketCrop && (
          <FinancialCalculatorModal 
            isOpen={isCalculatorOpen}
            onClose={() => setIsCalculatorOpen(false)}
            onSave={handleCalculatorSave}
            cropName={selectedMarketCrop.name}
            initialCosts={detailedCosts}
            initialRevenues={detailedRevenues}
            fieldArea={300} // Mock field area
          />
      )}
    </div>
  );
}
