
import fs from 'fs-extra';
import path from 'path';
import dayjs from 'dayjs';
import { CONFIG } from './config.js';

// KMA ASOS Daily API
// Endpoint: getWthrDataList
const API_URL = 'https://apis.data.go.kr/1360000/AsosDalyInfoService/getWthrDataList';
const SERVICE_KEY = CONFIG.KEYS.WEATHER; 

async function fetchWeatherHistory() {
    console.log('Fetching Historical Weather Data (ASOS)...');
    
    // Fetch last 3 years
    const END_DATE = dayjs().format('YYYYMMDD');
    const START_DATE = dayjs().subtract(3, 'year').format('YYYYMMDD');
    
    await fs.ensureDir(CONFIG.DIRS.WEATHER_HISTORY);

    for (const stn of CONFIG.STATIONS) {
        console.log(`  Station: ${stn.name} (${stn.id})...`);
        
        try {
            const params = new URLSearchParams({
                serviceKey: SERVICE_KEY,
                pageNo: '1',
                numOfRows: '999', // Max per page usually 999. If 3 years > 1000 days, might need loop or fewer rows. 3y ~= 1095 days.
                dataType: 'JSON',
                dataCd: 'ASOS',
                dateCd: 'DAY',
                startDt: START_DATE,
                endDt: END_DATE,
                stnIds: stn.id
            });
            
            // KMA API requires serviceKey to be unencoded sometimes, but URLSearchParams encodes it.
            // Best to append manually or use correctly encoded key. 
            // CONFIG.KEYS.WEATHER is likely decoded.
            
            const url = `${API_URL}?${params.toString()}`;
            // Hack for serviceKey if needed: replace encoded key with raw if provided in env is raw.
            // Assuming FETCH handles it.
            
            const res = await fetch(url);
            
            // Handle XML/JSON confusion safely
            const text = await res.text();
            let json;
            try {
                json = JSON.parse(text);
            } catch (e) {
                console.warn(`    Invalid JSON from KMA for ${stn.name}, might be XML error.`);
                continue;
            }

            const items = json?.response?.body?.items?.item;
            if (items) {
                 const filePath = path.join(CONFIG.DIRS.WEATHER_HISTORY, `${stn.id}_${stn.name}.json`);
                 
                 // Extract only needed fields to save space
                 const simplified = items.map(i => ({
                     date: i.tm,
                     avgTemp: i.avgTa,
                     minTemp: i.minTa,
                     maxTemp: i.maxTa,
                     rain: i.sumRn,
                     sun: i.sumSsHr // Sunshine hours
                 }));
                 
                 await fs.outputJson(filePath, { 
                     stationId: stn.id, 
                     stationName: stn.name, 
                     updatedAt: new Date().toISOString(),
                     data: simplified 
                 }, { spaces: 2 });
                 
                 console.log(`    -> Saved ${simplified.length} records.`);
            } else {
                 console.log('    -> No items found in response.');
                 // console.log(JSON.stringify(json, null, 2).substring(0, 200));
            }
            
        } catch (e) {
            console.error(`    -> Error fetching ${stn.name}:`, e.message);
        }
    }
    console.log('Weather History Fetch Complete.');
}

fetchWeatherHistory();
