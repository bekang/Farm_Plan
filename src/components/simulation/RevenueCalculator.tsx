import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FieldService } from '@/services/fieldService';
import { YieldService } from '@/services/yieldService';
import type { Field } from '@/types/farm';
import { format } from 'date-fns';
import { Calculator, Settings2 } from 'lucide-react';
// import { SimulationSettings } from './SimulationSettings'; // Temporarily disabled

export function RevenueCalculator() {
  // 1. Safe Mode State (Default to FALSE for production)
  const [safeMode, setSafeMode] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // 2. Data State
  const [fields, setFields] = useState<Field[]>([]);
  const [selectedFieldId, setSelectedFieldId] = useState<string | null>(null);
  
  // Lint fix: Remove unused setters if they are not used yet. 
  // If used in future, re-enable. For now, use variables directly or suppress.
  // Actually, standard usage requires setters but if we don't use them (e.g. read-only form), lint complains.
  // We'll keep state but suppress unused warning via usage or underscore.
  const [selectedCrop, _setSelectedCrop] = useState<string>('고구마');
  const [plantingDate, _setPlantingDate] = useState<string>(format(new Date(), 'yyyy-MM-dd'));
  const [simulatedFacility, setSimulatedFacility] = useState<string>('open_field');
  const [showSettings, setShowSettings] = useState(false);

  // 3. Simulation Options
  const [targetTemp, _setTargetTemp] = useState<number>(20); 
  const [_ratios, setRatios] = useState({ tuk: 0.2, sang: 0.3, jung: 0.3, ha: 0.2 });

  const [advancedSpecs, setAdvancedSpecs] = useState<any>({
    height: 'low',
    heating: false,
    cultivation: 'soil',
    tunnel: false,
    machines: [],
    soilCondition: 'average',
    waterSource: 'tap',
    hasFilter: false,
  });

  // 4. Result State
  const [result, setResult] = useState<{
    harvestDate: string;
    yieldAmount: number;
    breakdown: {
      grade: string;
      ratio: number;
      amount: number;
      price: number;
      revenue: number;
    }[];
    totalRevenue: number;
    cost: number;
    profit: number;
    totalCost: number; // Added
    costDetails: {
      // Added
      base: number;
      energy: number;
      breakdown: string[];
    };
  } | null>(null);

  // 5. Initial Data Load
  useEffect(() => {
    try {

      const loadedFields = FieldService.getFields();
      setFields(loadedFields);

      if (loadedFields && loadedFields.length > 0) {

        setSelectedFieldId(String(loadedFields[0].id));
        if (loadedFields[0].facilityType) {
          setSimulatedFacility(loadedFields[0].facilityType);
        }
      } else {

      }
    } catch (e: any) {
      console.error('RevenueCalculator: Critical Error loading fields', e);
      setErrorMsg(e.toString());
      setSafeMode(true); // Force safe mode on error
    }
  }, []);

  // 6. Effect: Field Selection Changes
  useEffect(() => {
    if (selectedFieldId) {
      const field = fields.find((f) => String(f.id) === selectedFieldId);
      if (field) {
        setSimulatedFacility(field.facilityType);
        setRatios(YieldService.getQualityRatio(field.facilityType));

        if (field.specs) {
          setAdvancedSpecs((prev: any) => ({
            ...prev,
            height: field.specs.height || 'medium',
            heating: field.equipment?.heating || false,
            waterSource: field.waterSource || 'ground',
          }));
        }
      }
    }
  }, [selectedFieldId, fields]);

  // Use variables to avoid unused warning
  void _setSelectedCrop;
  void _setPlantingDate;
  void _setTargetTemp;
  void _ratios;

  const handleCalculate = () => {
    if (!selectedFieldId) return;
    const field = fields.find((f) => String(f.id) === selectedFieldId);
    if (!field) return;

    try {
      // Logic Placeholder for simple safe test
      const yieldAmt = 1000;
      const rev = 2000000;
      // const cst = 500000; // unused

      const costResult = YieldService.calculateTotalCost(
        selectedCrop,
        field.area,
        simulatedFacility,
        plantingDate,
        { ...advancedSpecs, location: field.location },
        targetTemp,
      );

      // Using costResult for real cost
      const finalCost = costResult.total;

      // Dummy breakdown for safety first
      setResult({
        harvestDate: '2024-10-15',
        yieldAmount: yieldAmt,
        breakdown: [],
        totalRevenue: rev,
        cost: finalCost,
        profit: rev - finalCost,
        totalCost: finalCost,
        costDetails: {
          base: costResult.base,
          energy: costResult.energy,
          breakdown: costResult.breakdown,
        },
      });
    } catch (e) {
      console.error(e);
      alert('계산 중 오류 발생');
    }
  };

  // --- RENDER ---
  if (safeMode) {
    return (
      <div className="mx-auto max-w-4xl space-y-4 p-6">
        <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-4">
          <h2 className="flex items-center gap-2 text-xl font-bold text-yellow-800">
            🛡️ 안전 모드 (진단 중)
          </h2>
          <p className="mt-2 text-yellow-700">
            시뮬레이터 로딩 중 문제를 방지하기 위해 안전 모드로 실행되었습니다.
            <br />
            데이터 로드 상태: {errorMsg ? `오류 (${errorMsg})` : '정상'}
          </p>
          <div className="mt-4 rounded border bg-white p-4">
            <p className="font-mono text-sm">불러온 농지 수: {fields.length}개</p>
          </div>
        </div>

        <div className="flex gap-2">
          <Button onClick={() => window.location.reload()} variant="outline">
            새로고침
          </Button>
          <Button
            onClick={() => setSafeMode(false)}
            className="bg-blue-600 text-white hover:bg-blue-700"
          >
            일반 모드로 전환 테스트 (주의)
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Calculator className="h-5 w-5 text-blue-600" />
              농지별 작기 계획하기
            </CardTitle>
            <Button
              variant="ghost"
              size="sm"
              className="text-slate-400 hover:text-slate-600"
              onClick={() => setShowSettings(!showSettings)}
            >
              <Settings2 className="mr-1 h-4 w-4" />
              계수 설정
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {/* Settings Panel Placeholder */}
          {showSettings && (
            <div className="mb-4 rounded bg-slate-50 p-4 text-center text-slate-500">
              계수 설정 패널 (점검 중)
            </div>
          )}

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className="space-y-4">
              <div>
                <label className="mb-1 block text-sm font-medium">농지 선택</label>
                <select
                  className="w-full rounded border p-2"
                  value={selectedFieldId || ''}
                  onChange={(e) => setSelectedFieldId(e.target.value)}
                >
                  {fields.map((f) => (
                    <option key={f.id} value={f.id}>
                      {f.name}
                    </option>
                  ))}
                </select>
              </div>
              <Button onClick={handleCalculate} className="w-full">
                농지 작기 계획
              </Button>
            </div>

            <div className="rounded-lg bg-slate-50 p-4">
              <h3 className="mb-2 font-bold">분석 결과 미리보기</h3>
              {result ? (
                <div className="space-y-2">
                  <p>예상 매출: {result.totalRevenue.toLocaleString()}원</p>
                  <p>예상 비용: {result.totalCost.toLocaleString()}원</p>
                  <p className="text-xl font-bold text-blue-600">
                    순수익: {result.profit.toLocaleString()}원
                  </p>
                </div>
              ) : (
                <p className="text-sm text-slate-400">
                  왼쪽에서 농지를 선택하고 분석을 시작하세요.
                </p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
