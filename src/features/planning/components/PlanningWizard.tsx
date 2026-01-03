import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Search,
  AlertCircle,
  ShoppingBag,
} from 'lucide-react';

// Services & Hooks
import { FieldService } from '@/services/fieldService';
import { useSearchCrops, useMarketRecommendations } from '@/hooks/useMarketCrops';
import { planFormSchema, type PlanFormValues } from '@/schemas/planningSchema';

// Types
import type { Field } from '@/types/farm';
import type { CropPlan } from '@/types/planning';
import type { MarketCrop } from '@/types/market';

// Helpers
const CULTIVATION_KB: Record<string, any> = {
  고추: {
    defaultMethod: 'transplanting',
    seedingDuration: 160,
    transplantDuration: 90,
    seedingCost: 100000,
    transplantCost: 1500000,
  },
  마늘: {
    defaultMethod: 'seeding',
    seedingDuration: 240,
    transplantDuration: 240,
    seedingCost: 2000000,
    transplantCost: 2000000,
  },
  양파: {
    defaultMethod: 'transplanting',
    seedingDuration: 260,
    transplantDuration: 220,
    seedingCost: 500000,
    transplantCost: 1200000,
  },
  default: {
    defaultMethod: 'transplanting',
    seedingDuration: 120,
    transplantDuration: 90,
    seedingCost: 500000,
    transplantCost: 1000000,
  },
};

interface PlanningWizardProps {
  preSelectedFieldId?: string;
  existingPlans?: CropPlan[];
  onComplete: (data: any) => void;
  onCancel: () => void;
}

export function PlanningWizard({
  preSelectedFieldId,
  existingPlans = [],
  onComplete,
  onCancel,
}: PlanningWizardProps) {
  const [step, setStep] = useState(1);
  const [fields, setFields] = useState<Field[]>([]);

  // Form Setup
  const form = useForm<PlanFormValues>({
    resolver: zodResolver(planFormSchema),
    defaultValues: {
      fieldId: preSelectedFieldId || '',
      plantingDate: new Date().toISOString().split('T')[0],
      includeSoilPrep: true,
      targetYield: 0,
      targetPrice: 0,
      estimatedCost: 0,
      plantingMethod: 'transplanting',
    },
  });

  const {
    register,
    watch,
    setValue,
    handleSubmit,
    formState: { errors },
  } = form;
  const watchedValues = watch(); // Watch all for side effects

  // Local State for Search (Not part of form technically until selected)
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMarketCrop, setSelectedMarketCrop] = useState<MarketCrop | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [predictionData, setPredictionData] = useState<any>(null);

  // React Query Hooks
  const { data: searchResults = [] } = useSearchCrops(searchQuery);

  // Safely get field for hook
  const selectedField = fields.find((f) => String(f.id) === watchedValues.fieldId);

  const { data: recommendations = [] } = useMarketRecommendations(
    selectedField?.location || '',
    selectedField?.facilityType || '',
  );

  // Load Fields
  useEffect(() => {
    const data = FieldService.getFields();
    setFields(data);
    if (!preSelectedFieldId && data.length > 0 && !watchedValues.fieldId) {
      setValue('fieldId', String(data[0].id));
    }
  }, [preSelectedFieldId, setValue, watchedValues.fieldId]);

  // Handle Crop Selection
  const handleSelectCrop = (crop: MarketCrop) => {
    setSelectedMarketCrop(crop);
    setValue('cropName', crop.name);
    if (crop.units && crop.units.length > 0) {
      setValue('unit', crop.units[0]);
    }

    // KB Logic
    const kbKey = Object.keys(CULTIVATION_KB).find((k) => crop.name.includes(k)) || 'default';
    const kb = CULTIVATION_KB[kbKey];
    // const growingDays = crop.growingDays || kb.transplantDuration;

    // Auto-set prediction defaults
    setValue('targetYield', crop.defaultYield || 0);
    setValue('targetPrice', crop.defaultPrice || 0);

    // Auto-set method
    setValue('plantingMethod', kb.defaultMethod);
  };

  // Calculate Harvest Date & Cost (Effect)
  useEffect(() => {
    if (!selectedMarketCrop || !watchedValues.plantingDate) return;

    const kbKey =
      Object.keys(CULTIVATION_KB).find((k) => selectedMarketCrop.name.includes(k)) || 'default';
    const kb = CULTIVATION_KB[kbKey];

    const duration =
      watchedValues.plantingMethod === 'seeding' ? kb.seedingDuration : kb.transplantDuration;
    const pDate = new Date(watchedValues.plantingDate);
    const hDate = new Date(pDate);
    hDate.setDate(hDate.getDate() + duration);

    const hDateStr = hDate.toISOString().split('T')[0];
    setValue('estimatedHarvestDate', hDateStr);

    // Cost Calc
    const areaRatio = selectedField ? selectedField.area / 1000 : 1;
    const baseCost =
      watchedValues.plantingMethod === 'seeding' ? kb.seedingCost : kb.transplantCost;
    setValue('estimatedCost', Math.round(baseCost * areaRatio));
  }, [
    watchedValues.plantingDate,
    watchedValues.plantingMethod,
    selectedMarketCrop,
    selectedField,
    setValue,
  ]);

  // Conflict Check (Custom Effect interacting with Form Error)
  useEffect(() => {
    if (!watchedValues.plantingDate || !watchedValues.estimatedHarvestDate) return;

    const normalize = (d: string) => new Date(d).setHours(0, 0, 0, 0);
    const MS_DAY = 24 * 60 * 60 * 1000;

    let start = normalize(watchedValues.plantingDate);
    if (watchedValues.includeSoilPrep) start -= 14 * MS_DAY;
    const end = normalize(watchedValues.estimatedHarvestDate);

    const hasConflict = existingPlans.some((plan) => {
      if (String(plan.fieldId) !== String(watchedValues.fieldId)) return false;

      let exStart = new Date(plan.plantingDate).setHours(0, 0, 0, 0);
      // @ts-ignore
      if (plan.includeSoilPrep) exStart -= 14 * MS_DAY;
      const exEnd = new Date(plan.expectedHarvestDate).setHours(0, 0, 0, 0);

      return start <= exEnd && end >= exStart;
    });

    if (hasConflict) {
      form.setError('plantingDate', { type: 'manual', message: '기존 작기와 일정이 중복됩니다!' });
    } else {
      form.clearErrors('plantingDate');
    }
  }, [
    watchedValues.plantingDate,
    watchedValues.estimatedHarvestDate,
    watchedValues.includeSoilPrep,
    watchedValues.fieldId,
    existingPlans,
    form,
  ]);

  // Simulation (Step 3)
  useEffect(() => {
    if (step === 3 && selectedMarketCrop && !isAnalyzing) {
      setIsAnalyzing(true);
      setTimeout(() => {
        // ... (Simulation Logic kept same for brevity, can be refactored to hook later)
        const yieldFactor = selectedField?.facilityType?.startsWith('vinyl') ? 1.3 : 1.0;
        const baseYieldPer1000 = selectedMarketCrop.defaultYield || 5000;
        const basePrice = selectedMarketCrop.defaultPrice || 1500;
        const area = selectedField?.area || 1000;

        const totalYield = Math.round((baseYieldPer1000 / 1000) * yieldFactor * area);
        const totalRevenue = Math.round(totalYield * basePrice);
        const totalCost = watchedValues.estimatedCost + Math.round(area * 15000); // Labor mock

        setPredictionData({
          totalYield,
          unitPrice: basePrice,
          totalRevenue,
          totalCost,
          netProfit: totalRevenue - totalCost,
          yieldPerPyeong: Math.round((baseYieldPer1000 / 1000) * yieldFactor),
        });

        // Sync back to form
        setValue('targetYield', totalYield);
        setValue('targetPrice', basePrice);
        setIsAnalyzing(false);
      }, 800);
    }
  }, [step, selectedMarketCrop]);

  const onSubmit = (data: any) => {
    onComplete({
      ...data,
      fieldName: selectedField?.name,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
      <Card className="flex max-h-[95vh] w-full max-w-4xl flex-col border-indigo-500 shadow-2xl">
        {/* Header */}
        <CardHeader className="shrink-0 border-b bg-slate-50 pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Badge className="border-indigo-200 bg-white text-indigo-600">Step {step}</Badge>
              <span className="text-xs text-slate-500">
                {step === 1 ? '작물 선택' : step === 2 ? '방식 설정' : '분석 및 확정'}
              </span>
            </div>
            <Button variant="ghost" size="icon" onClick={onCancel}>
              <AlertCircle className="h-5 w-5" />
            </Button>
          </div>
          <CardTitle className="flex items-center gap-2 text-xl">
            <ShoppingBag className="h-6 w-6 text-indigo-600" /> 스마트 작기 설계 (V2)
          </CardTitle>
        </CardHeader>

        <CardContent className="flex-1 space-y-6 overflow-y-auto p-6">
          {/* STEP 1 */}
          {step === 1 && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>대상 농지</Label>
                <Select
                  value={watchedValues.fieldId}
                  onChange={(e) => setValue('fieldId', e.target.value)}
                  disabled={!!preSelectedFieldId}
                >
                  <option value="" disabled>
                    농지를 선택하세요
                  </option>
                  {fields.map((f) => (
                    <option key={f.id} value={String(f.id)}>
                      {f.name} ({f.area}평)
                    </option>
                  ))}
                </Select>
              </div>

              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                <Input
                  placeholder="작물 검색 (자음 검색 가능)"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>

              {/* Results Grid */}
              <div className="grid max-h-60 grid-cols-2 gap-2 overflow-y-auto rounded border bg-slate-50 p-2 md:grid-cols-3">
                {searchQuery
                  ? searchResults.map((crop) => (
                      <div
                        key={crop.id}
                        onClick={() => handleSelectCrop(crop)}
                        className={`cursor-pointer rounded border p-3 hover:bg-indigo-50 ${selectedMarketCrop?.id === crop.id ? 'bg-indigo-50 ring-2 ring-indigo-500' : 'bg-white'}`}
                      >
                        <div className="font-bold">{crop.name}</div>
                        <div className="text-xs text-slate-400">{crop.category}</div>
                      </div>
                    ))
                  : recommendations.map((crop) => (
                      <div
                        key={crop.id}
                        onClick={() => handleSelectCrop(crop)}
                        className={`cursor-pointer rounded border border-amber-200 bg-white p-3 hover:bg-amber-50 ${selectedMarketCrop?.id === crop.id ? 'ring-2 ring-amber-500' : ''}`}
                      >
                        <div className="font-bold">{crop.name}</div>
                        <Badge
                          variant="secondary"
                          className="bg-amber-100 text-[10px] text-amber-800"
                        >
                          추천
                        </Badge>
                      </div>
                    ))}
              </div>
            </div>
          )}

          {/* STEP 2 */}
          {step === 2 && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                {['seeding', 'transplanting'].map((m: any) => (
                  <div
                    key={m}
                    onClick={() => setValue('plantingMethod', m)}
                    className={`cursor-pointer rounded-xl border-2 p-4 ${watchedValues.plantingMethod === m ? 'border-indigo-600 bg-indigo-50' : 'hover:border-slate-300'}`}
                  >
                    <div className="font-bold">
                      {m === 'seeding' ? '직파 (씨앗)' : '정식 (모종)'}
                    </div>
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>파종/정식일</Label>
                  <Input type="date" {...register('plantingDate')} />
                  {errors.plantingDate && (
                    <span className="text-xs font-bold text-red-500">
                      {errors.plantingDate.message}
                    </span>
                  )}
                </div>
                <div>
                  <Label>예상 수확일</Label>
                  <Input
                    type="date"
                    {...register('estimatedHarvestDate')}
                    readOnly
                    className="bg-slate-100 text-slate-500"
                  />
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  className="rounded"
                  {...register('includeSoilPrep')}
                  id="sp"
                />
                <Label htmlFor="sp">기초 작업 (14일) 포함</Label>
              </div>
            </div>
          )}

          {/* STEP 3 */}
          {step === 3 && predictionData && (
            <div className="space-y-4">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>항목</TableHead>
                    <TableHead className="text-right">값</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell>예상 생산량</TableCell>
                    <TableCell className="text-right">
                      {predictionData.totalYield?.toLocaleString()} kg
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>예상 매출</TableCell>
                    <TableCell className="text-right font-bold text-blue-600">
                      {predictionData.totalRevenue?.toLocaleString()} 원
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>예상 비용</TableCell>
                    <TableCell className="text-right font-bold text-red-600">
                      {predictionData.totalCost?.toLocaleString()} 원
                    </TableCell>
                  </TableRow>
                  <TableRow className="bg-slate-100">
                    <TableCell className="font-bold">순수익</TableCell>
                    <TableCell className="text-right font-bold text-indigo-700">
                      {predictionData.netProfit?.toLocaleString()} 원
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
              {isAnalyzing && (
                <div className="text-center text-sm text-slate-500">AI 분석 중...</div>
              )}
            </div>
          )}
        </CardContent>

        <CardFooter className="flex justify-between border-t bg-slate-50 p-4">
          <Button variant="outline" onClick={step === 1 ? onCancel : () => setStep((s) => s - 1)}>
            <ArrowLeft className="mr-2 h-4 w-4" /> 이전
          </Button>
          {step < 3 ? (
            <Button
              onClick={() => setStep((s) => s + 1)}
              disabled={step === 1 && !selectedMarketCrop}
            >
              다음 <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          ) : (
            <Button
              onClick={handleSubmit(onSubmit)}
              className="bg-green-600 hover:bg-green-700"
              disabled={Object.keys(errors).length > 0}
            >
              작기 확정 v2 <CheckCircle2 className="ml-2 h-4 w-4" />
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  );
}
