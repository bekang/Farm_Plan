import fs from 'fs-extra';
import path from 'path';
import { fileURLToPath } from 'url';

// Config (Mirrors fetch_data.js)
const GARAK_ENDPOINT = 'http://www.garak.co.kr/homepage/publicdata/dataJsonOpen.do';
const ID = '5775';
const PASS = '*suoho1004';
const DATA_ID = 'data36'; // Price by Item/Grade

// Use a known good date (from fetch_data.js)
const TARGET_DATE = '20241120'; 

async function fetchAllItems() {
    console.log(`Fetching ALL items from Garak (Date: ${TARGET_DATE})...`);

    // Params WITHOUT 's_pummok' (Item Name)
    const params = new URLSearchParams({
        id: ID,
        passwd: PASS,
        dataid: DATA_ID,
        pagesize: '3000', // Request a large page
        pageidx: '1',
        'portal.templet': 'false',
        s_date: TARGET_DATE,
        s_date_p: TARGET_DATE, 
        s_date_p7: '20241113', // -7 days
        p_pos_gubun: '1', 
        s_pum_nm: '2' 
        // s_pummok removed
    });

    const url = `${GARAK_ENDPOINT}?${params.toString()}`;
    console.log(`URL: ${url}`);

    try {
        const res = await fetch(url);
        const text = await res.text();

        // Parse Logic (Mirrors fetch_data.js HTML cleanup)
        let data;
        const match = text.match(/<body>\s*([\s\S]*?)\s*<\/html>/i);
        if (match && match[1]) {
            const rawJson = match[1].trim();
            const fixedJson = rawJson.replace(/([a-zA-Z0-9_]+)\s*:/g, '"$1":');
            try {
                data = JSON.parse(fixedJson);
            } catch (e) {
                console.error('JSON Parse Error (Fixed):', e);
                console.log('Snippet:', fixedJson.substring(0, 200));
            }
        } else {
            // Try direct parse
            try {
                data = JSON.parse(text);
            } catch (e) {
                console.error('JSON Parse Error (Direct):', e);
                // console.log('Response text:', text.substring(0, 500));
            }
        }

        const list = data.list || data.resultData || [];
        
        if (Array.isArray(list) && list.length > 0) {
            console.log(`Success! Fetched ${list.length} items.`);
            
            // Extract unique items and format for Master List
            // Struct: PUM_NM (Name), U_NAME (Unit), AV_P (Price)
            const uniqueMap = new Map();
            
            for (const item of list) {
                const name = item.PUM_NM;
                if (!name) continue;
                
                // Price cleanup ' 41,909' -> 41909
                const priceStr = (item.AV_P || '0').replace(/,/g, '').trim();
                const price = parseInt(priceStr, 10);
                
                // If exists, average/update? Or just keep first?
                // The list might have different grades/units for same item.
                // We want a representative entry for "Search".
                // Let's store the one with the highest price (usually best grade) or just overwrite.
                // Or better: keep distinct by Name + Unit? 
                // The frontend search just shows Name + Unit.
                // But let's simplify: 1 entry per Name for now to avoid duplicate "Onion" entries if possible, 
                // OR allow duplicates if unit differs significantly.
                // User asked for "Entire Item Names".
                
                if (!uniqueMap.has(name) || price > uniqueMap.get(name).recentPrice) {
                     uniqueMap.set(name, {
                         name: item.PUM_NM,
                         category: '농산물', // API doesn't provide category, default to generic
                         unit: item.U_NAME || '',
                         recentPrice: price,
                         lastUpdated: TARGET_DATE
                     });
                }
            }

            console.log(`Found ${uniqueMap.size} unique crop names.`);
            
            // Save to Master List used by App
            const outputPath = 'public/data/garak/aggregated/master_crop_list.json';
            const masterList = Array.from(uniqueMap.values());
            
            await fs.ensureDir(path.dirname(outputPath));
            await fs.outputJson(outputPath, masterList, { spaces: 2 });
            console.log(`Saved ${masterList.length} items to ${outputPath}`);
            
            if (masterList.length > 0) {
                 console.log('Top 10 Items found:');
                 console.log(masterList.slice(0, 10).map(i => i.name));
            }

        } else {
            console.log('No data found or structure is different.');
            console.log('Result Data Type:', typeof data.resultData);
        }

    } catch (e) {
        console.error('Fetch Failed:', e);
    }
}

fetchAllItems();
