import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { PlanService } from '@/services/planService';
import type { CropPlan } from '@/types/planning';

export const QUERY_KEYS = {
  PLANS: ['plans'],
  PLANS_BY_FIELD: (fieldId: string) => ['plans', fieldId],
};

// --- Queries ---

export function usePlans(fieldId?: string) {
  return useQuery({
    queryKey: fieldId ? QUERY_KEYS.PLANS_BY_FIELD(fieldId) : QUERY_KEYS.PLANS,
    queryFn: () => {
        if (fieldId) return PlanService.getPlansByFieldId(fieldId);
        return PlanService.getPlans();
    },
    // Plans update frequently when editing, but stable otherwise.
    staleTime: 1000 * 60 * 5, 
    initialData: () => {
        if (fieldId) return PlanService.getPlansByFieldId(fieldId);
        return PlanService.getPlans();
    }, 
  });
}

// --- Mutations ---

export function usePlanMutation() {
  const queryClient = useQueryClient();

  const addPlan = useMutation({
    mutationFn: async (plan: CropPlan) => {
      PlanService.addPlan(plan);
      return plan;
    },
    onSuccess: (_, variables) => {
       // Invalidate global list AND specific field list
       queryClient.invalidateQueries({ queryKey: QUERY_KEYS.PLANS });
       if(variables.fieldId) {
          queryClient.invalidateQueries({ queryKey: QUERY_KEYS.PLANS_BY_FIELD(variables.fieldId) });
       }
    },
  });

  const deletePlan = useMutation({
    mutationFn: async ({ id, fieldId }: { id: string, fieldId?: string }) => {
      PlanService.deletePlan(id);
      return id;
    },
    onSuccess: (_, variables) => {
       queryClient.invalidateQueries({ queryKey: QUERY_KEYS.PLANS });
       if(variables.fieldId) {
           queryClient.invalidateQueries({ queryKey: QUERY_KEYS.PLANS_BY_FIELD(variables.fieldId) });
       }
    },
  });

  const updatePlan = useMutation({
    mutationFn: async (plan: CropPlan) => {
      PlanService.updatePlan(plan);
      return plan;
    },
    onSuccess: (_, variables) => {
       queryClient.invalidateQueries({ queryKey: QUERY_KEYS.PLANS });
       if(variables.fieldId) {
           queryClient.invalidateQueries({ queryKey: QUERY_KEYS.PLANS_BY_FIELD(variables.fieldId) });
       }
    },
  });

  return { addPlan, deletePlan, updatePlan };
}
