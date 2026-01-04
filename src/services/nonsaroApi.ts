import type { Crop } from '../types';

// Using VITE_NONGSARO_KEY from .env (User needs to add this)
const API_KEY = import.meta.env.VITE_NONGSARO_KEY || ''; 

export const NonsaroApi = {
  async searchCrop(query: string): Promise<Crop[]> {
    try {
        // Example: Searching variety info to get crop list
        // Path: /service/varietyInfo/getVarietyList
        // Path: /service/varietyInfo/getVarietyList
        // Direct PHP Proxy call for NAS
        // Nongsaro uses 'apiKey' parameter
        const internalPath = 'service/varietyInfo/getVarietyList';
        const url = `/proxy.php?path=nongsaro/${internalPath}&apiKey=${API_KEY}&svcCode=SVC01&serviceType=AA001&subCategoryCode=CROP&cropName=${encodeURIComponent(query)}`;

        const response = await fetch(url);
        if (!response.ok) return [];

        const text = await response.text();
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(text, 'text/xml');
        
        const items = xmlDoc.getElementsByTagName('item');
        const crops: Crop[] = [];

        for (let i = 0; i < items.length; i++) {
            const item = items[i];
            const name = item.getElementsByTagName('cntntsSj')[0]?.textContent || ''; // Variety Name
            // Note: Nongsaro structure varies. This is a generic example mapping.
            // We might need to adjust based on specific API output (Garden vs Crop).
            
            if (name) {
                crops.push({
                    id: `nongsaro-${i}`,
                    name: name,
                    category: '일반' 
                });
            }
        }
        
        return crops;

    } catch (e) {
        console.error("Nongsaro fetch failed", e);
        return [];
    }
  },
};
