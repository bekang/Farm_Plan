import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import moment from 'moment';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Calendar as CalendarIcon,
  ArrowLeft,
  TrendingUp,
  DollarSign,
  Wallet,
  FileText,
  ClipboardList,
  Wrench,
  Lightbulb,
  PieChart,
  Trash2,
  Plus,
} from 'lucide-react';

import { SinglePagePlanForm } from '@/features/planning/components/SinglePagePlanForm';
import { TimelineScheduler } from '@/features/planning/components/TimelineScheduler';
import { FarmAccountingPanel } from '@/features/planning/components/FarmAccountingPanel';
import { useFields } from '@/hooks/useFarmQueries';
import { usePlans, usePlanMutation } from '@/hooks/usePlanQueries';
import type { CropPlan } from '@/types/planning';

// Helper for Dynamic Advice (Keep as is)
const getDynamicGuide = (plans: CropPlan[], fieldName: string) => {
  if (!plans || plans.length === 0) {
    return {
      financial: {
        title: '초기 작기 설계 제언',
        content: [
          `현재 ${fieldName}에 등록된 작기가 없습니다.`,
          '토양 검정 결과에 따라 기초 비료 비용이 달라질 수 있습니다.',
          '수익성이 높은 고추, 마늘 등을 주작물로 고려해보세요.',
        ],
      },
      consulting: {
        title: '기초 영농 가이드',
        content: [
          '농지 정비: 배수로 정비와 토양 산도 교정이 우선되어야 합니다.',
          '윤작 계획: 연작 피해를 막기 위해 과채류와 엽채류를 교대로 배치하세요.',
        ],
      },
      tasks: [
        {
          title: '🚜 토양 검정',
          badge: '준비단계',
          desc: '농업기술센터에 토양 시료를 의뢰하여 시비 처방서를 받으세요.',
        },
        {
          title: '💧 관수 시설',
          badge: '기반조성',
          desc: '작물에 따라 점적 관수 또는 스프링클러 설치를 검토하세요.',
        },
        {
          title: '🌱 품종 선택',
          badge: '작기계획',
          desc: '지역 기후와 판매처(공판장/직거래)에 맞는 품종을 선정하세요.',
        },
      ],
    };
  }

  const cropNames = [...new Set(plans.map((p) => p.cropName.split(' ')[0]))];
  const mainCrop = cropNames[0];

  return {
    financial: {
      title: `매출/지출/수익 최적화 (${mainCrop} 중심)`,
      content: [
        `• **수익성**: ${mainCrop}의 예상 단가는 7-8월에 가장 높습니다. 출하 시기를 조절하면 수익을 15% 이상 증대할 수 있습니다.`,
        `• **비용 절감**: ${cropNames.length > 1 ? '작기가 이어지므로' : ''} 관수 자재를 재활용하여 초기 시설비를 절감할 수 있습니다.`,
      ],
    },
    consulting: {
      title: '작부 체계 및 환경 관리',
      content: [
        `• **연작 관리**: ${cropNames.join(' -> ')} 순서의 작부 체계는 ${cropNames.includes('쪽파') ? '뿌리 썩음병 예방에 유리합니다.' : '토양 양분 활용도가 높습니다.'}`,
        `• **기후 대응**: 생육 초기 냉해 피해 방지를 위해 부직포 터널 재배를 권장합니다.`,
      ],
    },
    tasks: [
      {
        title: `${mainCrop} 정식`,
        badge: '핵심작업',
        desc: '재식 밀도를 준수하고 활착 비료를 관주하세요.',
      },
      {
        title: '병해충 방제',
        badge: '생육관리',
        desc: `${mainCrop} 주요 병해충 예찰 정보를 주기적으로 확인하세요.`,
      },
      {
        title: '수확 후 관리',
        badge: '수확/저장',
        desc: '수확 즉시 예냉 처리하여 신선도를 유지하세요.',
      },
    ],
  };
};

export function CropPlanningDetail() {
  const { fieldId } = useParams();
  const navigate = useNavigate();
  const { data: fields = [] } = useFields();

  const selectedField = fields.find((f) => String(f.id) === fieldId);
  // Refactored to React Query
  const { data: plans = [] } = usePlans(fieldId);
  const { addPlan, deletePlan, updatePlan } = usePlanMutation();

  // State for Add Soil Prep Modal
  const [isPrepModalOpen, setIsPrepModalOpen] = useState(false);
  const [isAddPrepSelectionOpen, setIsAddPrepSelectionOpen] = useState(false);
  
  // Inline Adding State
  const [addingPrepId, setAddingPrepId] = useState<string | null>(null);

  const [targetPlanId, setTargetPlanId] = useState<string | null>(null);
  const [prepDates, setPrepDates] = useState({ start: '', end: '' });

  const handleOpenPrepModal = (plan: CropPlan) => {
      // Default: 14 days before planting
      const planting = moment(plan.plantingDate);
      const defaultStart = moment(planting).subtract(14, 'days').format('YYYY-MM-DD');
      const defaultEnd = moment(planting).subtract(1, 'days').format('YYYY-MM-DD');

      // Use inline mode
      setAddingPrepId(plan.id);
      setPrepDates({ start: defaultStart, end: defaultEnd });
      
      // Close other modals if open
      setIsAddPrepSelectionOpen(false);
      setIsPrepModalOpen(false); // Legacy modal
  };

  const handleSaveInlinePrep = () => {
      if (!addingPrepId) return;
      const plan = plans.find(p => p.id === addingPrepId);
      if (!plan) return;

      const updatedPlan: CropPlan = {
          ...plan,
          includeSoilPrep: true,
          soilPrepStartDate: prepDates.start,
          soilPrepEndDate: prepDates.end
      };

      updatePlan.mutate(updatedPlan);
      setAddingPrepId(null);
  };
  
  // Legacy handler kept for compatibility if needed, but updated to use new logic if referenced
  const handleSavePrep = () => {
      if (!targetPlanId) return;
     // ... legacy implementation
      const plan = plans.find(p => p.id === targetPlanId);
      if (!plan) return;

      const updatedPlan: CropPlan = {
          ...plan,
          includeSoilPrep: true,
          soilPrepStartDate: prepDates.start,
          soilPrepEndDate: prepDates.end
      };

      updatePlan.mutate(updatedPlan);
      setIsPrepModalOpen(false);
      setTargetPlanId(null);
  };

  const handleDeletePrep = (plan: CropPlan) => {
      if (confirm('기초 작업(밭 만들기) 정보를 삭제하시겠습니까?')) {
          const updatedPlan: CropPlan = {
              ...plan,
              includeSoilPrep: false,
              soilPrepStartDate: undefined,
              soilPrepEndDate: undefined
          };
          updatePlan.mutate(updatedPlan);
      }
  };

  const handleAddPlan = (newPlanData: any) => {
    const newPlan: CropPlan = {
      id:
        typeof crypto !== 'undefined' && crypto.randomUUID
          ? crypto.randomUUID()
          : `plan-${Date.now()}-${Math.random().toString(36).slice(2)}`,
      fieldId: fieldId!,
      cropName: newPlanData.cropName,
      plantingDate: newPlanData.plantingDate,
      expectedHarvestDate: newPlanData.estimatedHarvestDate || newPlanData.expectedHarvestDate,
      targetYield: newPlanData.targetYield,
      targetPrice: newPlanData.targetPrice,
      estimatedCost: newPlanData.estimatedCost,
      cultivationMethod: newPlanData.plantingMethod,
      includeSoilPrep: newPlanData.includeSoilPrep,
      soilPrepStartDate: newPlanData.soilPrepStartDate,
      soilPrepEndDate: newPlanData.soilPrepEndDate,
      status: 'planned',
      createdAt: new Date().toISOString(),
    } as any;

    addPlan.mutate(newPlan, {
        onSuccess: () => {
            // Form reset or notification could go here if needed.
            // For now, React Query updates the list automatically.
        }
    });
  };

  const handleDeletePlan = (planId: string) => {
    if (window.confirm('정말로 이 작기 계획을 삭제하시겠습니까?')) {
      deletePlan.mutate({ id: planId, fieldId });
    }
  };

  // Calculate Totals
  const totalRevenue = plans.reduce((sum, p) => sum + p.targetYield * p.targetPrice, 0);
  const totalCost = plans.reduce((sum, p) => sum + (p.estimatedCost || 0), 0);
  const totalProfit = totalRevenue - totalCost;

  if (!selectedField) return <div className="p-8 text-center">농지를 찾을 수 없습니다.</div>;

  const dynamicGuide = getDynamicGuide(plans, selectedField.name);

  /* Helper for facility type localization */
  const getFacilityLabel = (type: string) => {
    const map: Record<string, string> = {
      'glass': '유리온실',
      'glass_greenhouse': '유리온실',
      'vinyl_single': '단동 비닐하우스',
      'vinyl_multi': '연동 비닐하우스',
      'vinyl_greenhouse': '비닐하우스',
      'noji': '노지',
      'open_field': '노지'
    };
    return map[type] || type;
  };

  return (
    <div className="mx-auto max-w-[1400px] space-y-8 p-6 pb-20 animate-in fade-in slide-in-from-bottom-2">
      {/* Header */}
      <div className="flex flex-col gap-2 border-b pb-4">
        <Button
          variant="ghost"
          className="mb-2 h-auto w-fit gap-1 p-0 text-slate-500 hover:text-slate-900"
          onClick={() => navigate('/dashboard/planning')}
        >
          <ArrowLeft className="h-4 w-4" /> 다른 농지 선택하기
        </Button>
        <div className="flex flex-col">
          <h1 className="flex items-center gap-3 text-3xl font-bold tracking-tight text-slate-900">
            {selectedField.name}
          </h1>
          <p className="mt-2 flex items-center gap-2 text-lg text-slate-500">
            <span className="font-medium text-slate-700">{selectedField.area}평</span>
            <span className="h-4 w-px bg-slate-300" />
            <span>{getFacilityLabel(selectedField.facilityType)}</span>
            <span className="h-4 w-px bg-slate-300" />
            <span className="text-sm text-slate-400">{selectedField.address.city} {selectedField.address.town}</span>
          </p>
        </div>
      </div>

      {/* Financial Summary */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <SummaryCard
          icon={TrendingUp}
          label="예상 총 매출"
          value={totalRevenue}
          color="text-blue-600"
          bg="bg-blue-50"
        />
        <SummaryCard
          icon={Wallet}
          label="예상 총 비용"
          value={totalCost}
          color="text-red-600"
          bg="bg-red-50"
        />
        <SummaryCard
          icon={DollarSign}
          label="예상 순수익"
          value={totalProfit}
          color="text-green-600"
          bg="bg-green-50"
          highlight
        />
      </div>

      {/* Accounting History (New Panel) */}
      <FarmAccountingPanel plans={plans} />

      {/* Scheduler */}
      <Card className="overflow-hidden border-indigo-100/50 shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between border-b bg-slate-50/50 pb-3">
          <div className="flex items-center gap-2">
            <CalendarIcon className="h-5 w-5 text-indigo-600" />
            <CardTitle className="text-lg">작기 타임라인 (Professional)</CardTitle>
          </div>
        </CardHeader>
        <div className="mb-6">
          <TimelineScheduler plans={plans} fieldName={selectedField?.name} />
          <p className="mt-2 text-right text-xs text-slate-400">
            * 마우스 드래그로 이동, Ctrl+휠로 줌인/아웃 가능
          </p>
        </div>
      </Card>

      {/* Inline Plan Form Section - Always Visible */}
      <div id="new-plan-section">
          <SinglePagePlanForm
            fieldId={fieldId!}
            existingPlans={plans}
            onComplete={handleAddPlan}
          />
      </div>

      {/* Plan Detail Cards */}
      <div className="space-y-4">
            <div className="flex items-center justify-between border-l-4 border-indigo-600 pl-3">
                <div className="flex items-center gap-2 text-lg font-bold text-slate-800">
                    <ClipboardList className="h-5 w-5 text-indigo-500" /> 작기별 상세 계획
                </div>
            </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {plans.map((plan) => (
            <div key={plan.id} className="flex h-full items-stretch gap-0">
               
               {/* 1. LEFT Attached Soil Prep Card (Always Before) */}
               {plan.includeSoilPrep && plan.soilPrepStartDate && (
                   <div className="flex w-14 flex-col items-center justify-between rounded-l-xl border border-r-0 border-amber-200 bg-amber-50 py-3 shadow-sm transition-all hover:bg-amber-100">
                       <div className="flex flex-col items-center gap-2">
                           <span className="rounded bg-amber-200 px-1 py-0.5 text-[10px] font-bold text-amber-800">기초</span>
                           <div className="h-px w-6 bg-amber-200"></div>
                           <span 
                               className="writing-vertical-rl text-xs font-bold text-amber-900" 
                               style={{ textOrientation: 'upright', letterSpacing: '2px' }}
                           >
                               밭만들기
                           </span>
                       </div>
                       
                       <div className="flex flex-col items-center gap-3">
                           <div className="flex flex-col items-center gap-1 text-[10px] font-medium text-amber-700">
                               <span className="writing-vertical-rl" style={{ textOrientation: 'sideways' }}>
                                   {moment(plan.soilPrepStartDate).format('MM.DD')}
                               </span>
                               <span className="h-2 w-px bg-amber-300"></span>
                               <span className="writing-vertical-rl" style={{ textOrientation: 'sideways' }}>
                                   {moment(plan.soilPrepEndDate).format('MM.DD')}
                               </span>
                           </div>
                           <button 
                               className="text-amber-400 hover:text-red-500" 
                               onClick={() => handleDeletePrep(plan)}
                           >
                               <Trash2 className="h-3 w-3" />
                           </button>
                       </div>
                   </div>
               )}

               {/* 2. Main Plan Card */}
               <Card className={`group relative flex-1 border-slate-200 shadow-sm transition-all hover:border-indigo-200 hover:shadow-md 
                   ${plan.includeSoilPrep ? 'rounded-l-none border-l-0' : ''}
               `}>
                 <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
                   <div>
                     <Badge
                       variant="outline"
                       className="mb-2 border-indigo-100 bg-indigo-50 text-indigo-700 hover:bg-indigo-100"
                     >
                       {plan.cropName.split(' ')[0]}
                     </Badge>
                     <CardTitle className="text-lg font-bold text-slate-800">{plan.cropName}</CardTitle>
                     <p className="mt-1 font-mono text-xs text-slate-400">
                       {plan.plantingDate} ~ {plan.expectedHarvestDate}
                     </p>
                   </div>
                   <Button
                     variant="ghost"
                     size="icon"
                     className="h-8 w-8 text-slate-300 hover:bg-red-50 hover:text-red-500"
                     onClick={() => handleDeletePlan(plan.id)}
                   >
                     <Trash2 className="h-4 w-4" />
                   </Button>
                 </CardHeader>
                 
                 <CardContent className="space-y-4 pt-2">
                   <div className="grid grid-cols-2 gap-4">
                     <div className="space-y-1">
                       <span className="text-xs text-slate-400">예상 매출</span>
                       <p className="text-base font-bold text-slate-700">{(plan.targetYield * plan.targetPrice).toLocaleString()}원</p>
                     </div>
                     <div className="space-y-1">
                       <span className="text-xs text-slate-400">예상 비용</span>
                       <p className="text-base font-bold text-slate-700">{plan.estimatedCost?.toLocaleString()}원</p>
                     </div>
                   </div>
                   
                   <div className="flex items-center justify-between rounded-lg bg-emerald-50 p-3 px-4">
                       <span className="text-xs font-bold text-emerald-700">순수익</span>
                       <span className="text-lg font-bold text-emerald-600">
                          {(plan.targetYield * plan.targetPrice - (plan.estimatedCost || 0)).toLocaleString()}원
                       </span>
                   </div>

                   <div className="flex flex-wrap gap-2 pt-1">
                      {plan.cultivationMethod === 'seeding' ? (
                        <Badge variant="secondary" className="bg-slate-100 text-[10px] text-slate-600">직파재배</Badge>
                      ) : (
                        <Badge variant="secondary" className="bg-slate-100 text-[10px] text-slate-600">모종정식</Badge>
                      )}
                      
                      {/* Inline Prep Adder */}
                      {!plan.includeSoilPrep && (
                          <div className="col-span-2 mt-2">
                              {addingPrepId === plan.id ? (
                                  <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 animate-in zoom-in-95">
                                      <div className="mb-3 flex items-center justify-between">
                                          <div className="flex items-center gap-2">
                                              <span className="text-lg">🚜</span>
                                              <div>
                                                  <Label className="font-bold text-slate-800">기초 작업 (밭 만들기)</Label>
                                                  <p className="text-[10px] text-slate-500">파종 전 퇴비 작업 등</p>
                                              </div>
                                          </div>
                                          <div className="flex items-center gap-2">
                                              <Label className="text-xs font-bold text-slate-600">일정 포함</Label>
                                              <Switch 
                                                  checked={true}
                                                  onCheckedChange={(c) => {
                                                      if (!c) setAddingPrepId(null);
                                                  }}
                                              />
                                          </div>
                                      </div>
                                      <div className="grid grid-cols-1 gap-4">
                                         <div className="space-y-1">
                                             <Label className="text-xs text-slate-600">작업 소요 기간 (일)</Label>
                                             <Input 
                                                 type="number" 
                                                 className="h-8 bg-white text-xs"
                                                 defaultValue={15}
                                                 onChange={(e) => {
                                                      const days = parseInt(e.target.value) || 0;
                                                      // Calculate dates
                                                      const planting = new Date(plan.plantingDate);
                                                      const end = new Date(planting);
                                                      end.setDate(end.getDate() - 1);
                                                      const start = new Date(end);
                                                      start.setDate(start.getDate() - days + 1);
                                                      
                                                      // Payload preparation logic
                                                  }}
                                             />
                                             <span className="text-xs text-slate-500 ml-2">일간</span>
                                         </div>
                                         <div className="rounded bg-amber-50 p-2 text-xs text-amber-700">
                                            * 정식(파종)일({plan.plantingDate}) 하루 전까지 마무리가 되도록 자동 계산됩니다.
                                         </div>
                                      </div>
                                      <div className="mt-4 flex justify-end gap-2">
                                          <Button 
                                              size="sm" variant="ghost" 
                                              onClick={() => setAddingPrepId(null)}
                                              className="h-8"
                                          >
                                              취소
                                          </Button>
                                          <Button 
                                              size="sm" 
                                              onClick={() => {
                                                  // Using state-based handler which relies on addingPrepId
                                                  handleSaveInlinePrep();
                                              }}
                                              className="h-8 bg-amber-500 hover:bg-amber-600"
                                          >
                                              저장
                                          </Button>
                                      </div>
                                  </div>
                              ) : (
                                  <Button 
                                      variant="outline" 
                                      size="sm" 
                                      className="h-7 border-amber-200 bg-amber-50 text-xs text-amber-700 hover:bg-amber-100 hover:text-amber-800"
                                      onClick={() => setAddingPrepId(plan.id)}
                                  >
                                      + 기초작업 추가
                                  </Button>
                              )}
                          </div>
                      )}
                   </div>
                 </CardContent>
               </Card>
            </div>
          ))}
          {plans.length === 0 && (
            <div className="col-span-full rounded-lg border border-dashed bg-slate-50 py-12 text-center text-slate-400">
              등록된 작기 계획이 없습니다.
            </div>
          )}
        </div>
      </div>

      {/* Whole Schedule List */}
      <div className="space-y-4 pt-4">
          <div className="flex items-center gap-2 border-l-4 border-slate-600 pl-3">
             <ClipboardList className="h-6 w-6 text-slate-600" />
             <h2 className="text-xl font-bold text-slate-800">전체 작업 스케줄 리스트</h2>
          </div>
          <Card>
              <CardContent className="p-0">
                  <div className="overflow-x-auto">
                      <table className="w-full text-sm text-left">
                          <thead className="bg-slate-50 text-xs uppercase text-slate-500 border-b">
                              <tr>
                                  <th className="px-6 py-3">날짜/기간</th>
                                  <th className="px-6 py-3">작물명</th>
                                  <th className="px-6 py-3">작업 구분</th>
                                  <th className="px-6 py-3">상세 내용</th>
                              </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100">
                              {plans.flatMap(plan => {
                                  const events = [];
                                  if (plan.includeSoilPrep && plan.soilPrepStartDate && plan.soilPrepEndDate) {
                                      events.push({
                                          date: `${plan.soilPrepStartDate} ~ ${plan.soilPrepEndDate}`,
                                          sortDate: plan.soilPrepStartDate,
                                          crop: plan.cropName,
                                          type: '기초작업',
                                          desc: '퇴비 살포 및 경운 작업'
                                      });
                                  }
                                  events.push({
                                      date: plan.plantingDate,
                                      sortDate: plan.plantingDate,
                                      crop: plan.cropName,
                                      type: plan.cultivationMethod === 'seeding' ? '파종' : '정식',
                                      desc: plan.cultivationMethod === 'seeding' ? '씨앗 파종 작업' : '모종 아주심기'
                                  });
                                  events.push({
                                      date: plan.expectedHarvestDate,
                                      sortDate: plan.expectedHarvestDate,
                                      crop: plan.cropName,
                                      type: '수확예정',
                                      desc: '예상 수확일'
                                  });
                                  return events;
                              })
                              .sort((a, b) => new Date(a.sortDate).getTime() - new Date(b.sortDate).getTime())
                              .map((ev, idx) => (
                                  <tr key={idx} className="hover:bg-slate-50/50">
                                      <td className="px-6 py-4 font-medium text-slate-900">{ev.date}</td>
                                      <td className="px-6 py-4">{ev.crop}</td>
                                      <td className="px-6 py-4">
                                          <Badge variant="outline" className={`
                                              ${ev.type === '기초작업' ? 'border-amber-200 bg-amber-50 text-amber-700' : ''}
                                              ${ev.type.includes('파종') || ev.type.includes('정식') ? 'border-emerald-200 bg-emerald-50 text-emerald-700' : ''}
                                              ${ev.type === '수확예정' ? 'border-indigo-200 bg-indigo-50 text-indigo-700' : ''}
                                          `}>
                                              {ev.type}
                                          </Badge>
                                      </td>
                                      <td className="px-6 py-4 text-slate-500">{ev.desc}</td>
                                  </tr>
                              ))}
                              {plans.length === 0 && (
                                  <tr>
                                      <td colSpan={4} className="px-6 py-8 text-center text-slate-400">
                                          등록된 일정이 없습니다.
                                      </td>
                                  </tr>
                              )}
                          </tbody>
                      </table>
                  </div>
              </CardContent>
          </Card>
      </div>

      {/* Add Soil Prep Dialog (Simple Overlay for now if Shadcn Dialog is complex to wire up without checking files) */}
       {isPrepModalOpen && (
           <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 animate-in fade-in">
               <div className="w-full max-w-sm rounded-lg bg-white p-6 shadow-xl animate-in zoom-in-95">
                   <h3 className="mb-4 text-lg font-bold text-slate-900">밭 만들기 기간 설정</h3>
                   <div className="space-y-4">
                       <div className="grid gap-2">
                           <label className="text-sm font-medium text-slate-700">시작일</label>
                           <input 
                              type="date" 
                              className="flex h-10 w-full rounded-md border border-slate-300 bg-transparent px-3 py-2 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                              value={prepDates.start}
                              onChange={(e) => setPrepDates(prev => ({ ...prev, start: e.target.value }))}
                           />
                       </div>
                       <div className="grid gap-2">
                           <label className="text-sm font-medium text-slate-700">종료일</label>
                           <input 
                              type="date" 
                              className="flex h-10 w-full rounded-md border border-slate-300 bg-transparent px-3 py-2 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                              value={prepDates.end}
                              onChange={(e) => setPrepDates(prev => ({ ...prev, end: e.target.value }))}
                           />
                       </div>
                   </div>
                   <div className="mt-6 flex justify-end gap-2">
                       <Button variant="outline" onClick={() => setIsPrepModalOpen(false)}>취소</Button>
                       <Button onClick={handleSavePrep} disabled={!prepDates.start || !prepDates.end}>저장</Button>
                   </div>
               </div>
           </div>
       )}

      {/* Consulting Sections ... (No change) */}
      <div className="grid grid-cols-1 gap-6 border-t pt-4 md:grid-cols-2">
        {/* Financial Advice */}
        <Card className="h-full">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-base text-slate-700">
              <PieChart className="h-4 w-4 text-emerald-600" /> {dynamicGuide.financial.title}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 pt-2 text-sm text-slate-600">
            {dynamicGuide.financial.content.map((txt, i) => (
              <div
                key={i}
                dangerouslySetInnerHTML={{
                  __html: txt.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>'),
                }}
              />
            ))}
          </CardContent>
        </Card>

        {/* Overall Consulting */}
        <Card className="h-full border-indigo-100 bg-indigo-50/30">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-base text-indigo-700">
              <Lightbulb className="h-4 w-4 fill-amber-500 text-amber-500" />{' '}
              {dynamicGuide.consulting.title}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 pt-2 text-sm text-slate-700">
            {dynamicGuide.consulting.content.map((txt, i) => (
              <div
                key={i}
                dangerouslySetInnerHTML={{
                  __html: txt.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>'),
                }}
              />
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Task Details ... (No change) */}
      <div className="border-t pt-4">
        <div className="mb-4 flex items-center gap-2 text-lg font-bold text-slate-800">
          <Wrench className="h-5 w-5 text-slate-500" /> 작업별 필수 가이드
        </div>
        <Card>
          <CardContent className="space-y-4 pt-6 text-sm text-slate-600">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              {dynamicGuide.tasks.map((task, i) => (
                <div key={i} className="space-y-1">
                  <div className="flex items-center gap-2 font-bold text-slate-800">
                    {task.title}{' '}
                    <Badge variant="outline" className="text-[10px]">
                      {task.badge}
                    </Badge>
                  </div>
                  <p className="text-xs leading-relaxed text-slate-500">{task.desc}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Report Button */}
      <div className="flex justify-center pt-8">
        <Button
          size="lg"
          variant="outline"
          className="h-14 gap-2 rounded-full border-2 border-indigo-100 px-8 text-lg text-slate-500 shadow-sm transition-all hover:border-indigo-500 hover:bg-white hover:text-indigo-700"
          onClick={() => navigate(`/dashboard/financial-evidence?fieldId=${fieldId}`)}
        >
          <FileText className="h-5 w-5" />
          {selectedField.name} 재배 리포트 및 계산 근거 보기
        </Button>
      </div>

       {/* Add Soil Prep Dialog */}
       {isPrepModalOpen && (
           <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 animate-in fade-in">
               <div className="w-full max-w-sm rounded-lg bg-white p-6 shadow-xl animate-in zoom-in-95">
                   <h3 className="mb-4 text-lg font-bold text-slate-900">밭 만들기 기간 설정</h3>
                   <div className="space-y-4">
                       <div className="grid gap-2">
                           <label className="text-sm font-medium text-slate-700">시작일</label>
                           <input 
                              type="date" 
                              className="flex h-10 w-full rounded-md border border-slate-300 bg-transparent px-3 py-2 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                              value={prepDates.start}
                              onChange={(e) => setPrepDates(prev => ({ ...prev, start: e.target.value }))}
                           />
                       </div>
                       <div className="grid gap-2">
                           <label className="text-sm font-medium text-slate-700">종료일</label>
                           <input 
                              type="date" 
                              className="flex h-10 w-full rounded-md border border-slate-300 bg-transparent px-3 py-2 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                              value={prepDates.end}
                              onChange={(e) => setPrepDates(prev => ({ ...prev, end: e.target.value }))}
                           />
                       </div>
                   </div>
                   <div className="mt-6 flex justify-end gap-2">
                       <Button variant="outline" onClick={() => setIsPrepModalOpen(false)}>취소</Button>
                       <Button onClick={handleSavePrep} disabled={!prepDates.start || !prepDates.end}>저장</Button>
                   </div>
               </div>
           </div>
       )}
       
       {/* Plan Selection Modal for Adding Prep */}
       {isAddPrepSelectionOpen && (
           <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 animate-in fade-in">
               <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl animate-in zoom-in-95">
                   <h3 className="mb-4 text-lg font-bold text-slate-900">기초작업을 추가할 작기를 선택하세요</h3>
                   <div className="space-y-2 max-h-[60vh] overflow-y-auto">
                       {plans.filter(p => !p.includeSoilPrep).length === 0 ? (
                           <div className="py-8 text-center text-slate-500">
                               모든 작기에 이미 기초작업 일정이 포함되어 있습니다.
                           </div>
                       ) : (
                           plans.filter(p => !p.includeSoilPrep).map(plan => (
                               <div 
                                  key={plan.id}
                                  className="flex cursor-pointer items-center justify-between rounded-lg border border-slate-200 p-3 hover:bg-slate-50 hover:border-indigo-300 transition-all"
                                  onClick={() => {
                                      setIsAddPrepSelectionOpen(false);
                                      handleOpenPrepModal(plan);
                                  }}
                               >
                                   <div>
                                       <span className="font-bold text-slate-800">{plan.cropName}</span>
                                       <span className="ml-2 text-xs text-slate-400">{plan.plantingDate} 파종</span>
                                   </div>
                                   <Plus className="h-4 w-4 text-indigo-500" />
                               </div>
                           ))
                       )}
                   </div>
                   <div className="mt-4 flex justify-end">
                       <Button variant="outline" onClick={() => setIsAddPrepSelectionOpen(false)}>닫기</Button>
                   </div>
               </div>
           </div>
       )}

    </div>
  );
}

function SummaryCard({ icon: Icon, label, value, color, bg, highlight }: any) {
  return (
    <Card
      className={`${bg} border-0 shadow-sm transition-all hover:scale-[1.02] ${highlight ? 'ring-2 ring-indigo-500/20' : ''}`}
    >
      <CardContent className="flex items-center gap-4 p-6">
        <div className={`rounded-full bg-white p-3 ${color} shadow-sm`}>
          <Icon className="h-6 w-6" />
        </div>
        <div>
          <p className="text-sm font-medium text-slate-500">{label}</p>
          <p className={`text-2xl font-bold ${color}`}>
            {value.toLocaleString()} <span className="text-sm font-normal text-slate-400">원</span>
          </p>
        </div>
      </CardContent>
    </Card>
  );
}


