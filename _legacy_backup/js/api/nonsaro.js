import { API_KEYS } from './config.js';
import { ApiClient } from './apiClient.js';

const BASE_URL = 'http://api.nongsaro.go.kr/service'; // Check correct base URL
// Note: Actual Nonsaro URL often differs by service (garden, variety, etc.)
// For now using a placeholder common base.

export default {
    /**
     * Search for crops
     * @param {string} query 
     */
    async searchCrop(query) {
        // Example: Variety Info Service
        // http://api.nongsaro.go.kr/service/varietyInfo/varietyList
        const url = `${BASE_URL}/varietyInfo/varietyList`;
        
        try {
            // Nonsaro mostly returns XML
            const xmlDoc = await ApiClient.getXml(url, {
                apiKey: API_KEYS.NONSARO,
                subCategory: query // Adjust based on actual API spec
            });
            
            // Parse XML to Object (simplified)
            return this._parseXmlList(xmlDoc);
        } catch (e) {
            console.error('Nonsaro Search Failed', e);
            return [];
        }
    },

    _parseXmlList(xmlDoc) {
        const items = xmlDoc.querySelectorAll('item');
        return Array.from(items).map(item => {
            return {
                name: item.querySelector('cntntsSj')?.textContent || 'Unknown',
                id: item.querySelector('cntntsNo')?.textContent
            };
        });
    }
};
