const https = require('https');

const CERT_KEY = 'e1649e0e-079c-40ca-acb3-aab69df21f7b';
const CERT_ID = 'bekang85@naver.com';
const CLS_CODE = '02'; // Wholesale

// Get YYYY-MM-DD for yesterday (to be safe)
const yesterday = new Date();
yesterday.setDate(yesterday.getDate() - 1); // Yesterday
// const yesterday = new Date(); // Today
const yyyy = yesterday.getFullYear();
// Try Dec 31 2025 (Business Day)
const REG_DAY = '2025-12-31';

console.log(`Using Date: ${REG_DAY}`);

function fetchData(catCode) {
    const url = `https://www.kamis.or.kr/service/price/xml.do?action=dailyPriceByCategoryList&p_cert_key=${CERT_KEY}&p_cert_id=${CERT_ID}&p_returntype=json&p_product_cls_code=${CLS_CODE}&p_item_category_code=${catCode}&p_country_code=1101&p_regday=${REG_DAY}`;
    
    console.log(`Fetching category ${catCode}...`);
    
    https.get(url, (res) => {
        let data = '';
        res.on('data', (chunk) => { data += chunk; });
        res.on('end', () => {
            try {
                const json = JSON.parse(data);
                console.log(`\n--- Category ${catCode} Data ---`);
                
                // Inspect raw data for debugging
                // console.log('Raw JSON:', JSON.stringify(json).substring(0, 200));

                if (json.data && (Array.isArray(json.data.item) || json.data.item)) {
                    const items = Array.isArray(json.data.item) ? json.data.item : [json.data.item];
                    const itemNames = new Set();
                     items.forEach(i => {
                         const key = `${i.item_name} (${i.kind_name})`;
                         if (!itemNames.has(key)) {
                             console.log(`Item: ${i.item_name}, Kind: ${i.kind_name}, Price: ${i.dpr1}`);
                             itemNames.add(key);
                         }
                    });
                } else {
                    console.log('No data or error:', JSON.stringify(json).substring(0, 500));
                }
            } catch (e) {
                console.error(`Error parsing JSON for ${catCode}. Raw Start: ${data.substring(0, 100)}...`);
            }
        });
    }).on('error', (err) => {
        console.error('Error:', err.message);
    });
}

fetchData('100'); // Food Crops
fetchData('200'); // Vegetables
