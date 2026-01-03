// KAMIS API Configuration
const API_BASE_URL = '/api/kamis';
const CERT_KEY = import.meta.env.VITE_KAMIS_API_KEY || 'e1649e0e-079c-40ca-acb3-aab69df21f7b'; // Needs to be set in .env
const CERT_ID = import.meta.env.VITE_KAMIS_CERT_ID; // Needs to be set in .env


export interface KamisPriceItem {
  product_cls_code: string; // 01: Retail, 02: Wholesale
  product_cls_name: string;
  category_code: string;
  category_name: string;
  productno: string;
  last_latest_day: string; // Listing date
  kamis_product_name: string; // Converted from productno if needed, or mapped

  item_name: string;
  item_code: string;
  kind_name: string;
  kind_code: string;
  rank: string;
  rank_code: string;
  unit: string;
  day1: string; // Latest date
  dpr1: string; // Latest price
  day2: string; // 1 day ago
  dpr2: string; // 1 day ago price
}

export interface KamisResponse {
  condition: any[];
  data:
    | {
        error_code?: string;
        item: KamisPriceItem[] | KamisPriceItem;
      }
    | KamisPriceItem[];
}

export class KamisService {
  /**
   * Get Daily Price List by Category
   * @param productClsCode '01' (Retail) or '02' (Wholesale). Default '02'.
   * @param categoryCode Optional category code (100: Food crops, 200: Vegetables, etc.)
   * @returns Promise<KamisPriceItem[]>
   */
  static async getDailyPriceList(
    productClsCode: string = '02',
    categoryCode?: string,
  ): Promise<KamisPriceItem[]> {
    // If no credentials, force fallback immediately
    // Credentials are now handled by the server-side proxy (api/kamis.js)
    // We proceed to call the API even if client-side keys are missing.

    try {
      const attempts = 3;
      let targetDate = new Date();

      // Ensure we don't look into the future (server time sync issues)
      const now = new Date();
      if (targetDate > now) targetDate = now;

      // If it's weekend, KAMIS might not have data.
      // Simple heuristic: adjust to Friday if Sat/Sun? 
      // API usually handles past dates, but let's just loop.

      for (let i = 0; i < attempts; i++) {
        const yyyy = targetDate.getFullYear();
        const mm = String(targetDate.getMonth() + 1).padStart(2, '0');
        const dd = String(targetDate.getDate()).padStart(2, '0');
        const dateStr = `${yyyy}-${mm}-${dd}`;

        const params = new URLSearchParams({
          action: 'dailyPriceByCategoryList',
          p_cert_key: CERT_KEY,
          p_cert_id: CERT_ID,
          p_returntype: 'json',
          p_product_cls_code: productClsCode,
          p_country_code: '1101',
          p_regday: dateStr,
        });

        if (categoryCode) {
          params.append('p_item_category_code', categoryCode);
        }

        try {
          // Use Vercel Serverless Function
          const response = await fetch(`/api/kamis?${params.toString()}`);
          
          if (!response.ok) {
             // Server error, try previous day
             targetDate.setDate(targetDate.getDate() - 1);
             continue; 
          }

          const data = await response.json();

          // Check if valid data
          let items: KamisPriceItem[] = [];
          
          // Internal API Structure Parsing - it varies wildly
          if (data.data && Array.isArray(data.data.item)) {
            items = data.data.item;
          } else if (data.data && data.data.item) {
             // Single item object
            items = [data.data.item];
          } else if (Array.isArray(data.item)) {
             // Some endpoints return root item array
            items = data.item;
          } else if (data.document && data.document.data && data.document.data.item) {
             // XML to JSON sometimes creates this structure
             const d = data.document.data.item;
             items = Array.isArray(d) ? d : [d];
          }

          // Filter invalid prices
          if (items.length > 0) {
            const validItems = items.filter(
              (item) =>
                item.dpr1 &&
                item.dpr1.replace(/,/g, '').trim() !== '-' &&
                item.dpr1.replace(/,/g, '').trim() !== '0'
            );

            if (validItems.length > 0) {
              return validItems;
            }
          }
          
          // If we are here, means we got a 200 OK but "No Data" content (common in KAMIS for holidays)
          
        } catch (e) {
           // JSON parse error or Network disconnect
           console.debug(`KAMIS fetch failed for ${dateStr}:`, e);
        }

        // Go back 1 day
        targetDate.setDate(targetDate.getDate() - 1);
      }

      // If all attempts failed
      return this.getFallbackData(categoryCode);

    } catch (error) {
      console.error('CRITICAL: Failed to fetch KAMIS data:', error);
      return this.getFallbackData(categoryCode);
    }
  }

  private static getFallbackData(categoryCode?: string): KamisPriceItem[] {
    return [];
  }

  /**
   * Fetch all major categories to get a good coverage of crops
   */
  static async fetchAllMajorCrops(): Promise<KamisPriceItem[]> {
    // Categories: 100 (Food crops), 200 (Vegetables), 300 (Special crops), 400 (Fruits)
    const targetCategories = ['100', '200', '400'];

    try {
      const results = await Promise.all(
        targetCategories.map((cat) => this.getDailyPriceList('02', cat)),
      );
      return results.flat();
    } catch (e) {
      console.error("Partial failure in fetching all crops", e);
      return this.getFallbackData();
    }
  }
}
