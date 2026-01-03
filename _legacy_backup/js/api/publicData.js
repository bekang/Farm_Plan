import { API_KEYS, API_URLS } from './config.js';
import { ApiClient } from './apiClient.js';

export default {
    /**
     * Get Weather Data (Short-term forecast)
     * Note: Uses mock data initially to avoid immediate CORS/Auth issues during dev.
     * @param {number} nx 
     * @param {number} ny 
     */
    async getWeather(nx, ny) {
        // Real implementation would be:
        /*
        const params = {
            serviceKey: API_KEYS.PUBLIC_DATA_PORTAL,
            pageNo: 1,
            numOfRows: 10,
            dataType: 'JSON',
            base_date: '20250101', // Dynamic date
            base_time: '0600',    // Dynamic time
            nx: nx,
            ny: ny
        };
        return ApiClient.get(API_URLS.WEATHER, params);
        */
        
        console.log(`[PublicData] Fetching weather for ${nx}, ${ny}`);
        
        // Mock Return
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve({
                    location: "서울(가상)",
                    temperature: "22",
                    sky: "구름 많음",
                    rain: "0"
                });
            }, 300);
        });
    },

    /**
     * Get Agricultural Market Prices
     */
    async getMarketPrices() {
        console.log("[PublicData] Fetching market prices");
        
        // Mock Return
        return [
            { name: "쌀 (20kg)", price: "48,000", change: "▲ 1,000", isUp: true },
            { name: "배추 (10kg)", price: "11,500", change: "▼ 500", isUp: false },
            { name: "양파 (15kg)", price: "18,000", change: "-", isUp: false }
        ];
    }
};
