import {
  RAW_FINANCIAL_SUMMARY,
  RAW_FIELDS,
  RAW_CROP_CYCLES,
  RAW_TASKS,
  RAW_FINANCIAL_TRANSACTIONS,
} from '@/data/origin/mock_farm_data';

export const MockDataService = {
  getFinancialSummary: (): any => {
    return RAW_FINANCIAL_SUMMARY;
  },
  // ... existing methods
  getMockFields: () => RAW_FIELDS,
  getCropCycles: () => RAW_CROP_CYCLES,
  getTasks: () => RAW_TASKS,

  getFinancialTransactions: (): any[] => {
    return RAW_FINANCIAL_TRANSACTIONS;
  },

  getActivityLogs: (): any[] => {
    // Add placeholder for log
    return [];
  },
};
