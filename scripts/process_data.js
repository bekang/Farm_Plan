
import fs from 'fs-extra';
import path from 'path';
import { fileURLToPath } from 'url';
import { CONFIG } from './config.js';

console.log('Starting Data Processing Pipeline...');

const processData = async () => {
    // 1. Process Garak Market Data
    const marketDir = CONFIG.DIRS.GARAK_DAILY;
    const cropDataMap = new Map();
    let fileCount = 0;
    let validItems = 0;

    if (fs.existsSync(marketDir)) {
        const years = fs.readdirSync(marketDir);
        
        for (const year of years) {
            const yearDir = path.join(marketDir, year);
            if (!fs.statSync(yearDir).isDirectory()) continue;
            
            const files = fs.readdirSync(yearDir);
            console.log(`Scanning ${year} (${files.length} files)...`);
            
            for (const file of files) {
                if (!file.endsWith('.json')) continue;
                const filePath = path.join(yearDir, file);
                try {
                    const json = await fs.readJson(filePath);
                    const list = json.list || [];
                    
                    if (Array.isArray(list) && list.length > 0) {
                        const fileDate = file.replace('.json', '');

                        for (const item of list) {
                            // Normalize Item based on New API Schema (Korea Agro-Fisheries & Food Trade Corp)
                            // CORP_GDS_ITEM_NM (Name), UNIT_NM (Unit), SCSBD_PRC (Price), GRD_NM (Grade)
                            const name = item.CORP_GDS_ITEM_NM || item.PUM_NM; // Fallback to old just in case
                            const price = parseInt(item.SCSBD_PRC || item.AV_P || '0', 10);
                            
                            if (name && price > 0) {
                                if (!cropDataMap.has(name)) {
                                    cropDataMap.set(name, []);
                                }
                                cropDataMap.get(name).push({
                                    date: fileDate, 
                                    price: price,
                                    unit: item.UNIT_NM || item.U_NAME || '',
                                    grade: item.GRD_NM || item.G_NAME || ''
                                });
                                validItems++;
                            }
                        }
                    }
                    fileCount++;
                } catch (e) {
                    // Ignore
                }
            }
        }
    }

    // 2. Save Aggregated Files
    const cropsDir = path.join(CONFIG.DIRS.GARAK_AGGREGATED, 'crops');
    await fs.ensureDir(cropsDir);
    
    console.log(`Generating Crop Files for ${cropDataMap.size} crops...`);
    
    const masterList = [];

    for (const [cropName, data] of cropDataMap.entries()) {
        // Sort by date
        data.sort((a, b) => new Date(a.date) - new Date(b.date));
        
        // Get latest info for master list
        const latest = data[data.length - 1];
        masterList.push({
            name: cropName,
            category: '농산물', // Generic category
            recentPrice: latest.price,
            unit: latest.unit,
            lastUpdated: latest.date
        });

        const safeName = cropName.replace(/[\/\\?%*:|"<>]/g, '_');
        await fs.outputJson(path.join(cropsDir, `${safeName}.json`), {
            updatedAt: new Date().toISOString(),
            cropName: cropName,
            data: data
        }); 

    }

    console.log(`Processed ${fileCount} files, extracted ${validItems} price records.`);
};

processData().catch(console.error);
