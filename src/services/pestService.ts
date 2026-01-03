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
      // NCPMS API - Month Forecast
      // Use Vercel Serverless Function
      const url = `/api/pest?apiKey=${API_KEY}&serviceCode=SVC01&serviceType=AA001`;

      const response = await fetch(url);
      if (!response.ok) return [];

      const text = await response.text();
      // Only parse if XML (NCPMS usually returns XML)
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(text, 'text/xml');

      const pests: PestAlert[] = [];
      const items = xmlDoc.getElementsByTagName('item');

      for (let i = 0; i < items.length; i++) {
        const item = items[i];
        pests.push({
          pestName: item.getElementsByTagName('pestName')[0]?.textContent || '',
          cropName: item.getElementsByTagName('cropName')[0]?.textContent || '',
          alertLevel: item.getElementsByTagName('forecastLevel')[0]?.textContent || '',
          forecastDate: item.getElementsByTagName('forecastDate')[0]?.textContent || '',
        });
      }

      return pests.slice(0, 5); // Return top 5
    } catch (error) {
      console.error('Failed to fetch pest config:', error);
      return [];
    }
  },
};
