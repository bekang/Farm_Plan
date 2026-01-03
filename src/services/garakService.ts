import { format } from 'date-fns';

export interface GarakPriceItem {
  PUM_NM: string; // 품목명 (감자)
  G_NAME: string; // 등급명 (특)
  U_NAME: string; // 거래단위 (20kg, kg 등)
  MI_P: string; // 최저가
  MA_P: string; // 최고가
  AV_P: string; // 평균가
  FLUC: string; // 등락
  D_MARK_P: string; // 전일 평균가
  // Add other fields as needed based on XML response
}

const API_BASE_URL = '/api/garak'; // Using Proxy
const API_ID = '5775';
const API_PASS = '*suoho1004';

export class GarakService {
  /**
   * Fetch daily wholesale prices
   * @param cropName Crop name
   * @param date Date string YYYYMMDD
   * @param marketCode '1': Garak, '2': Gangseo (Check actual codes, commonly 1=Garak)
   */
  static async getDailyPrices(
    cropName: string,
    date?: string,
    marketCode: string = '1',
  ): Promise<GarakPriceItem[]> {
    const targetDate = date || format(new Date(), 'yyyyMMdd');

    const params = new URLSearchParams({
      id: API_ID,
      passwd: API_PASS,
      dataid: 'data36', // Daily grade price
      pagesize: '50', // Increase size to get all units
      pageidx: '1',
      'portal.templet': 'false',
      s_date: targetDate,
      s_pummok: cropName,
      s_date_p: targetDate,
      s_date_p7: targetDate,
      p_pos_gubun: marketCode, // Market Code
      s_pum_nm: '2',
    });

    try {
      const response = await fetch(
        `${API_BASE_URL}/homepage/publicdata/dataJsonOpen.do?${params.toString()}`,
      );
      if (!response.ok) {
        throw new Error(`Garak API Error: ${response.status}`);
      }

      const data = await response.json();

      if (data && data.list) {
        return data.list as GarakPriceItem[];
      }

      return [];
    } catch (error) {
      console.error('Failed to fetch Garak market data:', error);
      return [];
    }
  }
}
