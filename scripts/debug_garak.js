
const KEYS = {
    GARAK_ID: '5775', 
    GARAK_PW: '*suoho1004'
};
const dateStr = '20240105'; // A random weekday in 2024 (Friday)

async function test() {
    console.log(`Testing Garak API for ${dateStr}...`);
    
    const params = new URLSearchParams();
    params.append('id', KEYS.GARAK_ID);
    params.append('passwd', KEYS.GARAK_PW);
    params.append('dataid', 'data36'); 
    params.append('pagesize', '10'); 
    params.append('s_date', dateStr);
    
    const url = `https://www.garak.co.kr/homepage/publicdata/dataJsonOpen.do?${params.toString()}`;
    console.log(`URL: ${url}`);
    
    try {
        const res = await fetch(url);
        const text = await res.text();
        console.log('Response Status:', res.status);
        console.log('Response Body Preview:', text.substring(0, 500));
        
    } catch (e) {
        console.error('Error:', e);
    }
}

test();
