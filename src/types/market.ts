export interface MarketCrop {
  id: string; // e.g., '1001'
  name: string; // e.g., '감자(수미)'
  category: string; // e.g., '식량작물'
  standardUnit: string; // e.g., '20kg 상자'
  units: string[]; // e.g., ['20kg 상자', '10kg 상자', 'kg']

  // Mock properties for search/filtering
  keywords: string[]; // e.g., ['potato', 'gamja']

  // Default data for simulation
  defaultYield: number; // kg per 1000 pyeong
  defaultPrice: number; // won per kg
  growingDays: number; // seeding to harvest
}

export interface MarketPrice {
  cropId: string;
  date: string;
  avgPrice: number;
  maxPrice: number;
  minPrice: number;
  volume: number;
}
