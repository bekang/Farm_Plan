// Using VITE_NCPMS_KEY from .env
const API_KEY = import.meta.env.VITE_NCPMS_KEY;

export interface PestAlert {
  pestName: string;
  cropName: string;
  alertLevel: string; // 주의, 경보
  forecastDate: string;
}

export const PestService = {
  async getPestAlerts(): Promise<PestAlert[]> {
    try {
      // NAS Caching Strategy
      const response = await fetch(`/data/ncpms/pest_alert.json?t=${new Date().getTime()}`);
      if (!response.ok) return [];

      const json = await response.json();
      return json.data || [];
    } catch (error) {
      console.warn('Failed to fetch pest data from NAS:', error);
      return [];
    }
  },
};
