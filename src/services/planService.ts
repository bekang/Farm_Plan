import type { CropPlan } from '@/types/planning';

const STORAGE_KEY = 'dream_farm_plans';

const loadPlans = (): CropPlan[] => {
  if (typeof window === 'undefined') return [];
  const stored = localStorage.getItem(STORAGE_KEY);
  return stored ? JSON.parse(stored) : [];
};

const savePlans = (plans: CropPlan[]) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(plans));
  }
};

let plansStore: CropPlan[] = loadPlans();

export const PlanService = {
  getPlans: (): CropPlan[] => {
    plansStore = loadPlans(); // Always fresh
    return plansStore;
  },

  getPlansByFieldId: (fieldId: string): CropPlan[] => {
    plansStore = loadPlans();
    return plansStore.filter((p) => String(p.fieldId) === String(fieldId));
  },

  addPlan: (plan: CropPlan) => {
    plansStore = loadPlans();
    const newPlans = [...plansStore, plan];
    savePlans(newPlans);
    return plan;
  },

  deletePlan: (planId: string) => {
    const plans = PlanService.getPlans();
    const filtered = plans.filter((p) => p.id !== planId);
    PlanService.setPlans(filtered);
  },

  updatePlan: (updatedPlan: CropPlan) => {
    const plans = PlanService.getPlans();
    const index = plans.findIndex((p) => p.id === updatedPlan.id);
    if (index !== -1) {
      plans[index] = updatedPlan;
      PlanService.setPlans(plans);
    }
  },

  // For initialization/simulation
  setPlans: (plans: CropPlan[]) => {
    plansStore = plans;
    savePlans(plans);
  },
};
