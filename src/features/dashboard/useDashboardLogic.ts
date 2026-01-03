import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFields } from '@/hooks/useFarmQueries';
import { usePlans } from '@/hooks/usePlanQueries';
import type { CropCycle } from '@/types';
import type { CropPlan } from '@/types/planning';
import { aggregateTasksFromPlans } from '@/services/taskAggregationService';

export function useDashboardLogic() {
  const navigate = useNavigate();
  
  // 1. Data Source (React Query)
  const { data: fields = [], isLoading: isFieldsLoading } = useFields();
  const { data: allPlans = [], isLoading: isPlansLoading } = usePlans();
  

  // 2. Local View State
  const [selectedFieldId, setSelectedFieldId] = useState<number | null>(null);
  const [recentLogs, setRecentLogs] = useState<any[]>([]);

  // 3. Auto-Select Default Field
  useEffect(() => {
    if (fields.length > 0 && selectedFieldId === null) {
        setSelectedFieldId(Number(fields[0].id));
    }
  }, [fields, selectedFieldId]);

  // 4. Derived Data Calculation
  const currentField = fields.find((f) => Number(f.id) === selectedFieldId);
  const relevantPlans = currentField
      ? allPlans.filter(p => String(p.fieldId) === String(currentField.id))
      : allPlans;

  const schedules: CropCycle[] = relevantPlans.map((p: CropPlan) => ({
      id: p.id,
      field_id: p.fieldId,
      crop_name: p.cropName,
      start_date: p.plantingDate,
      end_date: p.expectedHarvestDate,
      status: p.status === 'planned' ? 'planned' : 'active',
      color: 'bg-green-200 text-green-900',
      expected_revenue: p.targetYield * p.targetPrice,
      expected_cost: p.estimatedCost
  }));

  // 5. Calculate Real Stats
  const totalRevenue = relevantPlans.reduce((sum, p) => sum + (p.targetYield * p.targetPrice), 0);
  const totalCost = relevantPlans.reduce((sum, p) => sum + (p.estimatedCost || 0), 0);
  const totalProfit = totalRevenue - totalCost;

  // 6. Aggregate Real Tasks
  const tasks = aggregateTasksFromPlans(allPlans, fields as any);

  const realStats = {
      financial: {
          revenue: totalRevenue,
          revenue_growth: 0, 
          expense: totalCost,
          expense_growth: 0,
          net_profit: totalProfit,
          profit_growth: 0 // Note: FinancialSummary might not use profit growth or uses a different key, but usually it's calculated or separate. 
          // Checking Dashboard.tsx usage: <FinancialSummary data={stats.financial} ... />
      },
      production: {
          totalVolume: 0, 
          activeFields: fields.length,
          harvestProgress: 0
      }
  };
  
  const isLoading = isFieldsLoading || isPlansLoading;

  // Handlers (Simple passthrough)
  const handleFieldChange = (id: number) => setSelectedFieldId(id);
  const handleNavigate = (path: string) => navigate(path);

  return {
    state: {
      fields,
      selectedFieldId,
      currentField,
      isLoading,
      stats: realStats,
      recentLogs,
      schedules,
      tasks,
    },
    actions: {
      onFieldChange: handleFieldChange,
      onNavigate: handleNavigate,
    },
  };
}
