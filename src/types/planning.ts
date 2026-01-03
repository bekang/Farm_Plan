export interface PlanTask {
  id: string;
  dayOffset: number; // 파종일 기준 며칠 뒤?
  taskName: string; // 예: "기비 살포", "1차 추비"
  category: 'fertilizer' | 'pesticide' | 'water' | 'harvest' | 'management';
  resourceId?: string; // 투입 자재 ID
  amount?: number; // 투입량
  unit?: string; // 단위 (kg, L)
  cost: number; // 예상 비용
  status: 'planned' | 'completed';
}

export interface RevenueItem {
  id: string;
  name: string; // 예: "쌀", "볏짚", "부산물"
  amount: number; // 수량
  unit: string; // 단위
  price: number; // 단가
}

export interface CostDetail {
  seeds: number; // 종자
  fertilizer: number; // 비료
  pesticide: number; // 농약
  labor: number; // 인건비
  equipment: number; // 장비
  other: number; // 기타
}

export interface CropPlan {
  id: string;
  fieldId: string; // 대상 농지
  cropName: string; // 작물명
  variety?: string; // 품종

  plantingDate: string; // 파종/정식일 (Unified from startDate)
  expectedHarvestDate: string; // 수확 예정일 (Unified from targetHarvestDate)

  targetYield: number; // 목표 수확량 (kg)
  targetPrice: number; // 목표 단가 (원/kg)

  // New Detailed Financials
  revenueItems?: RevenueItem[]; 
  costDetails?: CostDetail;

  tasks: PlanTask[];

  estimatedCost: number; // 총 예상 비용 (should be sum of costDetails)
  estimatedRevenue: number; // 총 예상 매출 (should be sum of revenueItems)

  // Advanced Planning Logic
  cultivationMethod?: 'seeding' | 'transplanting';
  includeSoilPrep?: boolean; // 토양 만들기 기간 포함 여부
  soilPrepStartDate?: string; // 기초 작업 시작일 (Optional)
  soilPrepEndDate?: string; // 기초 작업 종료일 (Optional)

  status?: 'planned' | 'growing' | 'harvested' | 'cancelled';
  createdAt: string;
}

export interface ResourceItem {
  id: string;
  name: string;
  category: 'fertilizer' | 'pesticide' | 'material' | 'labor';
  defaultCost: number; // 표준 단가
  unit: string;
  description?: string;
}
