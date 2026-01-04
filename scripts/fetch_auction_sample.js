
import fs from 'fs-extra';
import path from 'path';
import dayjs from 'dayjs';
import { CONFIG } from './config.js';

async function fetchAuctionSample() {
    console.log('Fetching Wholesale Auction Sample...');
    // API: https://apis.data.go.kr/B552845/katOrigin/trades
    const API_URL = 'https://apis.data.go.kr/B552845/katOrigin/trades';
    const KEY = decodeURIComponent(CONFIG.KEYS.PUBLIC_DATA_PORTAL); 

    const params = new URLSearchParams({
        serviceKey: KEY,
        numOfRows: '100', // Small sample
        pageNo: '1',
        delngDe: '20241120', // Known good date
        returnType: 'json'
    });

    // The key in CONFIG might differ from what URLSearchParams expects if it needs encoding/decoding.
    // Usually Config has the Decoded key.
    // Try constructing URL manually to be safe with serviceKey.
    
    // Note: The previous fetch_data.js used this URL construction:
    // `${baseUrl}/${api.operation}?serviceKey=${api.key}&${params.toString()}`
    
    const url = `${API_URL}?serviceKey=${CONFIG.KEYS.PUBLIC_DATA_PORTAL}&delngDe=20241120&numOfRows=100&pageNo=1&returnType=json`;
    
    console.log(`URL: ${url}`);

    try {
        const res = await fetch(url);
        const text = await res.text();
        
        console.log('Response Snippet:', text.substring(0, 500));
        
        let json;
        try { json = JSON.parse(text); } catch(e) {}
        
        if (json) {
            await fs.outputJson('public/data/raw/auction/sample.json', json, { spaces: 2 });
            console.log('Saved sample.json');
        }
    } catch (e) {
        console.error(e);
    }
}

fetchAuctionSample();
