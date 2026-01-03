import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Plus, LayoutGrid, List } from 'lucide-react';
import { useFields } from '@/hooks/useFarmQueries';
import { usePlans } from '@/hooks/usePlanQueries';
import { FieldPlanningCard } from '@/components/farm/FieldPlanningCard';
import { PlanningWizard } from '@/features/planning/components/PlanningWizard';
import { PlanService } from '@/services/planService';
import type { CropPlan } from '@/types/planning';

export function CropPlanningPage() {
  const navigate = useNavigate();
  const { data: fields = [] } = useFields();
  const { data: allPlans = [] } = usePlans(); // Fetch all plans to distribute to cards

  const [isWizardOpen, setIsWizardOpen] = useState(false);
  const [selectedFieldIdForWizard, setSelectedFieldIdForWizard] = useState<string>('');

  // Helper to get active/upcoming plans for a field
  const getFieldPlans = (fieldId: string) => {
    return allPlans.filter(p => String(p.fieldId) === String(fieldId));
  };

  const activePlansCount = allPlans.filter(p => p.status === 'growing').length;
  const totalRevenue = allPlans.reduce((sum, p) => sum + (p.targetYield * p.targetPrice), 0);

  const handleQuickAdd = (fieldId: string) => {
    setSelectedFieldIdForWizard(fieldId);
    setIsWizardOpen(true);
  };

  const handleWizardComplete = (newPlanData: any) => {
    const newPlan: CropPlan = {
      id: crypto.randomUUID(),
      fieldId: newPlanData.fieldId,
      cropName: newPlanData.cropName,
      plantingDate: newPlanData.plantingDate,
      expectedHarvestDate: newPlanData.estimatedHarvestDate || newPlanData.expectedHarvestDate,
      targetYield: newPlanData.targetYield,
      targetPrice: newPlanData.targetPrice,
      estimatedCost: newPlanData.estimatedCost,
      cultivationMethod: newPlanData.plantingMethod,
      includeSoilPrep: newPlanData.includeSoilPrep,
      status: 'planned',
      createdAt: new Date().toISOString(),
    } as any;

    PlanService.addPlan(newPlan);
    setIsWizardOpen(false);
    // React Query will auto-refresh via invalidation in PlanService logic if hooked up, 
    // but since we called Service directly, we rely on the hook's staleTime or manual invalidation if we were inside the component. 
    // NOTE: Ideally we should use usePlanMutation here, but for now we follow the existing pattern in this file. 
    // We will let the user refresh or rely on the hook's refetchInterval if set.
    // Better: use usePlanMutation in next refactor. For now, this works as fields align with hooks.
    window.location.reload(); // Temporary force refresh to ensure sync until mutation hook is fully adopted here
  };

  return (
    <div className="mx-auto max-w-[1400px] space-y-8 p-6 duration-500 animate-in fade-in slide-in-from-bottom-4">
      {/* Hero Header */}
      <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
        <div className="space-y-4">
          <h1 className="text-4xl font-extrabold tracking-tight text-stone-900">농지별 작기 관리</h1>
          <p className="max-w-xl text-lg text-stone-500">
            모든 농지의 재배 현황을 한눈에 파악하고<br className="hidden md:block" /> 
            수익 최적화 계획을 수립하세요.
          </p>
        </div>
        
        {/* Quick Stats - Resized & Revenue Moved */}
        <div className="flex flex-1 max-w-md gap-4">
          <div className="flex flex-1 flex-col justify-center rounded-2xl bg-white p-6 shadow-sm ring-1 ring-stone-900/5 transition-all hover:shadow-md">
            <span className="text-sm font-medium text-stone-400">등록된 농지</span>
            <div className="mt-2 flex items-baseline gap-1">
              <span className="text-4xl font-extrabold text-stone-700">{fields.length}</span>
              <span className="text-lg font-medium text-stone-500">개소</span>
            </div>
          </div>
          <div className="flex flex-1 flex-col justify-center rounded-2xl bg-white p-6 shadow-sm ring-1 ring-stone-900/5 transition-all hover:shadow-md">
            <span className="text-sm font-medium text-stone-400">진행 중 작기</span>
            <div className="mt-2 flex items-baseline gap-1">
              <span className="text-4xl font-extrabold text-green-600">{activePlansCount}</span>
              <span className="text-lg font-medium text-stone-500">건</span>
            </div>
          </div>
        </div>
      </div>

      <div className="h-px bg-stone-200" />

      {/* Grid Content */}
      {fields.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-1 xl:grid-cols-2">
          {fields.map((field) => (
            <FieldPlanningCard 
              key={field.id} 
              field={field} 
              activePlans={getFieldPlans(String(field.id))}
              onClick={() => navigate(`/dashboard/planning/${field.id}`)}
            />
          ))}
          
          {/* Add New Field Quick Link */}
          <button 
            onClick={() => navigate('/dashboard/farm-registration')}
            className="group flex min-h-[280px] flex-col items-center justify-center rounded-xl border-2 border-dashed border-stone-200 bg-stone-50/50 text-stone-400 transition-all hover:border-green-400 hover:bg-green-50/30 hover:text-green-600"
          >
            <div className="mb-4 rounded-full bg-white p-4 shadow-sm ring-1 ring-stone-900/5 transition-transform group-hover:scale-110">
              <Plus className="h-8 w-8" />
            </div>
            <span className="font-bold">새 농지 추가하기</span>
            <span className="text-xs opacity-70">새로운 시설이나 노지를 등록하세요</span>
          </button>
        </div>
      ) : (
        <div className="flex h-96 flex-col items-center justify-center rounded-3xl border border-dashed border-stone-300 bg-stone-50">
          <div className="mb-4 rounded-full bg-white p-6 shadow-sm">
            <LayoutGrid className="h-12 w-12 text-stone-300" />
          </div>
          <h3 className="text-xl font-bold text-stone-700">등록된 농지가 없습니다</h3>
          <p className="mb-6 mt-2 max-w-sm text-center text-stone-500">
            작기 계획을 수립하려면 먼저 농지를 등록해야 합니다.
          </p>
          <Button 
            size="lg" 
            className="rounded-full bg-green-600 font-bold hover:bg-green-700"
            onClick={() => navigate('/dashboard/farm-registration')}
          >
            <Plus className="mr-2 h-5 w-5" />
            첫 농지 등록하기
          </Button>
        </div>
      )}

      {/* Footer Financial Summary (New) */}
      {allPlans.length > 0 && (
        <div className="mt-12 rounded-2xl border border-stone-200 bg-stone-50 p-8">
          <div className="mb-6 flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-stone-900 text-white">
              <span className="text-lg">₩</span>
            </div>
            <h3 className="text-xl font-bold text-stone-800">전체 예상 재무 현황</h3>
          </div>
          
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            <div className="space-y-1">
              <span className="text-sm font-medium text-stone-500">예상 총 매출</span>
              <p className="text-3xl font-bold text-blue-600">
                {totalRevenue.toLocaleString()}<span className="text-base font-normal text-stone-500">원</span>
              </p>
            </div>
            
            <div className="space-y-1">
              <span className="text-sm font-medium text-stone-500">예상 총 비용</span>
              <p className="text-3xl font-bold text-red-500">
                {allPlans.reduce((sum, p) => sum + (p.estimatedCost || 0), 0).toLocaleString()}
                <span className="text-base font-normal text-stone-500">원</span>
              </p>
            </div>

            <div className="space-y-1">
              <span className="text-sm font-medium text-stone-500">예상 순수익</span>
              <p className="text-3xl font-bold text-green-600">
                {(totalRevenue - allPlans.reduce((sum, p) => sum + (p.estimatedCost || 0), 0)).toLocaleString()}
                <span className="text-base font-normal text-stone-500">원</span>
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Wizard Modal */}
      {isWizardOpen && (
        <PlanningWizard
          preSelectedFieldId={selectedFieldIdForWizard || (fields[0]?.id ? String(fields[0].id) : undefined)}
          existingPlans={allPlans}
          onComplete={handleWizardComplete}
          onCancel={() => setIsWizardOpen(false)}
        />
      )}
    </div>
  );
}
