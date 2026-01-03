export interface FinancialRecord {
  revenue: number;
  expense: number;
  net_profit: number;
  revenue_growth: number;
  expense_growth: number;
}

export interface FinancialSummary {
  fieldId: string;
  totalRevenue: number;
  totalExpense: number;
  netProfit: number;
  topExpenseCategories: {
    category: string;
    amount: number;
    percentage: number;
  }[];
}

export interface FinancialTransaction {
  id: string;
  field_id: string;
  date: string;
  type: 'income' | 'expense';
  category: string; // e.g., "Labor", "Sales", "Fertilizer"
  amount: number;
  description: string;
}

export interface CropCycle {
  id: string;
  field_id: string;
  crop_name: string;
  start_date: string;
  end_date: string;
  status: 'active' | 'planned' | 'completed';
  color: string;
}

export interface Task {
  id: string;
  field_id: string;
  crop_cycle_id: string;
  date: string;
  content: string;
  status: 'pending' | 'completed' | 'cancelled';
  type: 'fertilizer' | 'pesticide' | 'harvest' | 'planting' | 'general';
}

export interface MockField {
  id: string;
  name: string;
  location: string;
  area: number;
  facility_type: string;
  created_at: string;
  latitude?: number;
  longitude?: number;
}
