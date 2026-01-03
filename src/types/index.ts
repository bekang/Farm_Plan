export interface LegacyField {
  id: number;
  user_id?: string;
  name: string;
  area: number;
  location: string;
  latitude?: number;
  longitude?: number;
  facility_type?: string;
  crop_id?: string;
  crop?: string; // Display name
  created_at: string;
}

export interface Crop {
  id: string;
  name: string;
  variety?: string;
  category?: string;
  standard_fertilizer?: {
    n: number;
    p: number;
    k: number;
  };
}

export interface SoilTestResult {
  id: string;
  field_id: number;
  test_date: string;
  ph: number;
  om: number; // organic matter
  p2o5: number;
  k: number;
  ca: number;
  mg: number;
  ec: number;
  no3_n?: number;
  nh4_n?: number;
}

export interface WaterTestResult {
  id: string;
  field_id: number;
  test_date: string;
  ph: number;
  ec: number;
  no3_n?: number;
  nh4_n?: number;
  p?: number;
  k?: number;
  ca?: number;
  mg?: number;
  s?: number;
  cl?: number;
  na?: number;
  hco3?: number;
  fe?: number;
  mn?: number;
  b?: number;
  zn?: number;
  cu?: number;
  mo?: number;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'system';
  text: string;
  timestamp: string;
  data?: any; // For evidence cards
}

export interface FinancialRecord {
  id: string;
  field_id?: number;
  date: string;
  type: 'income' | 'expense';
  category: string; // e.g., '비료구입', '판매수익'
  amount: number;
  description?: string;
}

export interface Task {
  id: string;
  field_id: number;
  crop_cycle_id?: string;
  date: string; // 예정일 or 수행일
  content: string; // 작업 내용
  status: 'pending' | 'completed';
  type: 'general' | 'fertilizer' | 'pest_control' | 'harvest' | 'planting';
}

export interface CropCycle {
  id: string;
  field_id: number | string;
  crop_name: string;
  start_date: string; // 파종/정식일
  end_date: string; // 수확 종료일
  status: 'planned' | 'active' | 'completed';
  color?: string; // 간트차트 표시 색상
  expected_revenue?: number;
  expected_cost?: number;
}
