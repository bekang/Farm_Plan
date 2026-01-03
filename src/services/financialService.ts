import type { FinancialTransaction } from '@/data/processed/farm_types';
import { PlanService } from '@/services/planService';

export const FinancialService = {
  // 1. Get All Transactions
  // 1. Get All Transactions
  getAllTransactions: async (): Promise<FinancialTransaction[]> => {
    // Fetch real plans
    const plans = PlanService.getPlans();
    
    const transactions: FinancialTransaction[] = [];

    plans.forEach((plan: import('@/types/planning').CropPlan) => {
        // 1. Revenue (Income)
        if (plan.revenueItems && plan.revenueItems.length > 0) {
             plan.revenueItems.forEach((item: { name: string; amount: number; price: number; unit: string }, idx: number) => {
                 transactions.push({
                     id: `${plan.id}-inc-${idx}`,
                     date: plan.expectedHarvestDate || new Date().toISOString().split('T')[0],
                     type: 'income',
                     amount: item.amount * item.price,
                     category: '판매수익', // or item.name ?
                     description: `${plan.cropName} - ${item.name}`,
                     field_id: plan.fieldId
                 });
             });
        } else if (plan.targetYield && plan.targetPrice) {
            // Fallback Revenue
            transactions.push({
                id: `${plan.id}-inc-Est`,
                date: plan.expectedHarvestDate || new Date().toISOString().split('T')[0],
                type: 'income',
                amount: plan.targetYield * plan.targetPrice,
                category: '판매수익',
                description: `${plan.cropName} 예상 매출`,
                field_id: plan.fieldId
            });
        }

        // 2. Expenses (Outcome)
        if (plan.costDetails) {
            Object.entries(plan.costDetails).forEach(([key, val]) => {
                const value = Number(val);
                if (value && value > 0) {
                    const catMap: Record<string, string> = {
                        seeds: '종자/묘목',
                        fertilizer: '비료/자재',
                        pesticide: '농약/방제',
                        labor: '인건비',
                        equipment: '장비임대',
                        utility: '수도광열', // if exists
                        other: '기타'
                    };
                    transactions.push({
                        id: `${plan.id}-exp-${key}`,
                        date: plan.plantingDate || new Date().toISOString().split('T')[0],
                        type: 'expense',
                        amount: value,
                        category: catMap[key] || '기타',
                        description: `${plan.cropName} ${catMap[key] || key}`,
                        field_id: plan.fieldId
                    });
                }
            });
        } else if (plan.estimatedCost) {
             // Fallback Expense
             transactions.push({
                id: `${plan.id}-exp-Est`,
                date: plan.plantingDate || new Date().toISOString().split('T')[0],
                type: 'expense',
                amount: plan.estimatedCost,
                category: '운영비',
                description: `${plan.cropName} 예상 지출`,
                field_id: plan.fieldId
            });
        }
    });

    return transactions.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  },

  // 2. Get Aggregated Stats (Overall)
  getOverallSummary: async (providedTransactions?: FinancialTransaction[]) => {
    const transactions = providedTransactions || await FinancialService.getAllTransactions();

    const summary = {
      totalRevenue: 0,
      totalExpense: 0,
      netProfit: 0,
      categoryBreakdown: {
        income: {} as Record<string, number>,
        expense: {} as Record<string, number>,
      },
    };

    transactions.forEach((t) => {
      if (t.type === 'income') {
        summary.totalRevenue += t.amount;
        summary.categoryBreakdown.income[t.category] =
          (summary.categoryBreakdown.income[t.category] || 0) + t.amount;
      } else {
        summary.totalExpense += t.amount;
        summary.categoryBreakdown.expense[t.category] =
          (summary.categoryBreakdown.expense[t.category] || 0) + t.amount;
      }
    });

    summary.netProfit = summary.totalRevenue - summary.totalExpense;
    return summary;
  },

  // 3. Get Field Specific Stats
  getFieldSummary: async (fieldId: string, providedTransactions?: FinancialTransaction[]) => {
    const all = providedTransactions || await FinancialService.getAllTransactions();
    const fieldTx = all.filter((t) => t.field_id === fieldId);

    const summary = {
      fieldId,
      totalRevenue: 0,
      totalExpense: 0,
      netProfit: 0,
      topExpenseCategories: [] as { category: string; amount: number; percentage: number }[],
    };

    const expenses: Record<string, number> = {};

    fieldTx.forEach((t) => {
      if (t.type === 'income') {
        summary.totalRevenue += t.amount;
      } else {
        summary.totalExpense += t.amount;
        expenses[t.category] = (expenses[t.category] || 0) + t.amount;
      }
    });

    summary.netProfit = summary.totalRevenue - summary.totalExpense;

    // Calculate Top Expenses
    summary.topExpenseCategories = Object.entries(expenses)
      .map(([cat, amount]) => ({
        category: cat,
        amount,
        percentage: summary.totalExpense > 0 ? (amount / summary.totalExpense) * 100 : 0,
      }))
      .sort((a, b) => b.amount - a.amount)
      .slice(0, 3); // Top 3

    return { stats: summary, transactions: fieldTx };
  },

  // 4. Get Chart Data for Dashboard (The 4 Circular Graphs)
  getChartData: async (providedTransactions?: FinancialTransaction[]) => {
    const transactions = providedTransactions || await FinancialService.getAllTransactions();
    // Fetch fields for name resolution
    const fields = await import('@/services/fieldService').then(m => m.FieldService.getFields());

    // 1. Profit by Farm
    const profitByFarm: Record<string, number> = {};
    // 2. Profit by Crop
    const profitByCrop: Record<string, number> = {};
    // 3. Expense by Farm
    const expenseByFarm: Record<string, number> = {};
    // 4. Expense by Category
    const expenseByCategory: Record<string, number> = {};

    // Helper to get crop name
    const getCropName = (desc: string) => {
        // Simple extraction logic: "CropName - Detail" or "CropName Expense"
        const parts = desc.split(' ');
        return parts[0] || '기타';
    };

    transactions.forEach((t) => {
      const field = fields.find(f => String(f.id) === String(t.field_id));
      const fieldName = field ? field.name : `미지정 농지 (${t.field_id})`;
      const cropName = getCropName(t.description);

      if (t.type === 'income') {
        profitByFarm[fieldName] = (profitByFarm[fieldName] || 0) + t.amount;
        profitByCrop[cropName] = (profitByCrop[cropName] || 0) + t.amount;
      } else {
        expenseByFarm[fieldName] = (expenseByFarm[fieldName] || 0) + t.amount;
        expenseByCategory[t.category] = (expenseByCategory[t.category] || 0) + t.amount;

        // For 'Profit' charts, we are essentially showing where the profit (or revenue) came from.
        // If we want purely Net Profit, we'd need to subtract.
        // But for a Pie chart, negative values don't make sense.
        // Let's assume the user wants 'Revenue Source' for the 'Profit' charts,
        // OR 'Net Profit contribution' (ignoring losses).
        // Let's stick with Revenue for positive contribution for now, as it ensures the chart always renders.
        // If we strictly want 'Profit', we should probably pre-calculate net profit per unit and only show profitable ones.
        // Given the visual reference, 'Profit' usually implies positive cash flow.
        // Let's enable subtraction but filter out negatives in formatting.
        profitByFarm[fieldName] = (profitByFarm[fieldName] || 0) - t.amount;
        profitByCrop[cropName] = (profitByCrop[cropName] || 0) - t.amount;
      }
    });

    // Transform to array format for Recharts
    const formatForChart = (obj: Record<string, number>) => {
      return Object.entries(obj)
        .map(([name, value]) => ({ name, value }))
        .filter((item) => item.value > 0) // Only positive values for Pie Chart
        .sort((a, b) => b.value - a.value);
    };

    return {
      profitByFarm: formatForChart(profitByFarm),
      profitByCrop: formatForChart(profitByCrop),
      expenseByFarm: formatForChart(expenseByFarm),
      expenseByCategory: formatForChart(expenseByCategory),
    };
  },
};
