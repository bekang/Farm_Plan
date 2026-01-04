
import dayjs from 'dayjs';
import fs from 'fs-extra';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.join(__dirname, '..');

const GARAK_CONFIG = {
    BASE_URL: 'http://www.garak.co.kr/homepage/publicdata/dataJsonOpen.do',
    ID: '5775',
    PASS: '*suoho1004',
    DATA_ID: 'data36', // JSON format
    CROPS: ['양파', '마늘'], 
};

async function testFetchAndSave() {
    console.log('Seeding Garak Data manually...');
    const dateStr = '20241120'; 
    const nowStr = dayjs().format('YYYYMMDD'); // 20260104 (System Date)

    for (const crop of GARAK_CONFIG.CROPS) {
        const params = new URLSearchParams({
            id: GARAK_CONFIG.ID,
            passwd: GARAK_CONFIG.PASS,
            dataid: GARAK_CONFIG.DATA_ID,
            pagesize: '10',
            pageidx: '1',
            'portal.templet': 'false',
            s_date: dateStr, 
            s_date_p: dateStr, 
            s_date_p7: '20241113', 
            p_pos_gubun: '1', 
            s_pum_nm: '2', 
            s_pummok: crop
        });

        const url = `${GARAK_CONFIG.BASE_URL}?${params.toString()}`;
        console.log(`Fetching ${crop}...`);
        
        try {
            const res = await fetch(url);
            const text = await res.text();
            
            const match = text.match(/<body>\s*([\s\S]*?)\s*<\/html>/i);
            if (match && match[1]) {
                const rawJson = match[1].trim();
                const fixedJson = rawJson.replace(/([a-zA-Z0-9_]+)\s*:/g, '"$1":');
                
                try {
                     const data = JSON.parse(fixedJson);
                     
                     if (data.list && data.list.length > 0) {
                         // 1. Save Raw Daily (2026)
                         const year = nowStr.substring(0, 4);
                         const dateDash = `${nowStr.substring(0, 4)}-${nowStr.substring(4, 6)}-${nowStr.substring(6, 8)}`;
                         // Fix Path: public/data/garak/daily/2026
                         const dailyDir = path.join(ROOT_DIR, 'public/data/garak/daily', year);
                         await fs.ensureDir(dailyDir);
                         await fs.outputJson(path.join(dailyDir, `${dateDash}_${crop}.json`), data, { spaces: 2 });
                         console.log(`Saved Raw: ${dailyDir}/${dateDash}_${crop}.json`);
                         
                         // 2. Save Aggregated (Mocking process_data.js)
                         // process_data.js usually runs to do this, but let's just make the file exist for frontend
                         const aggDir = path.join(ROOT_DIR, 'public/data/garak/aggregated/crops');
                         await fs.ensureDir(aggDir);
                         
                         // Transform to Aggregated Format
                         const processedData = data.list.map(item => ({
                             date: dateDash,
                             price: parseInt(item.SCSBD_PRC || item.AV_P || '0', 10),
                             unit: item.UNIT_NM || item.U_NAME || '',
                             grade: item.GRD_NM || item.G_NAME || ''
                         }));
                         
                         await fs.outputJson(path.join(aggDir, `${crop}.json`), {
                             updatedAt: new Date().toISOString(),
                             cropName: crop,
                             data: processedData
                         }, { spaces: 2 });
                         console.log(`Saved Aggregated: ${aggDir}/${crop}.json`);
                     }
                } catch (jsonErr) {
                     console.log('JSON Parse Failed:', jsonErr.message);
                }
            }
        } catch (e) {
            console.error('Fetch Error:', e);
        }
    }
}

testFetchAndSave();
