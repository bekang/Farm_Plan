const https = require('http'); // KAMIS uses http usually for APIs, typically provided as http in docs. redirect might happen. user used http in proxy.

const CERT_KEY = 'e1649e0e-079c-40ca-acb3-aab69df21f7b';
const CERT_ID = 'bekang85@naver.com';
const CLS_CODE = '02'; // Wholesale

function fetchData(catCode) {
    // Note: User proxy config uses http://www.kamis.or.kr
    const url = `http://www.kamis.or.kr/service/price/xml.do?action=dailyPriceByCategoryList&p_cert_key=${CERT_KEY}&p_cert_id=${CERT_ID}&p_returntype=json&p_product_cls_code=${CLS_CODE}&p_item_category_code=${catCode}&p_country_code=1101`;
    
    console.log(`Fetching category ${catCode}...`);
    
    https.get(url, (res) => {
        let data = '';
        res.on('data', (chunk) => { data += chunk; });
        res.on('end', () => {
            try {
                // Sometimes KAMIS returns XML even if json requested if there's an error, or BOM.
                const json = JSON.parse(data);
                console.log(`\n--- Category ${catCode} Data ---`);
                if (json.data && json.data.item) {
                    const items = Array.isArray(json.data.item) ? json.data.item : [json.data.item];
                    items.forEach(i => {
                        console.log(`Item: ${i.item_name}, Kind: ${i.kind_name}, Price: ${i.dpr1}`);
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

// 100: Food crops, 200: Vegetables
fetchData('100');
fetchData('200');
