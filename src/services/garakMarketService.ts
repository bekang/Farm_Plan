import type { MarketCrop } from '@/types/market';

// Interface for prediction history
interface PriceHistoryRecord {
  year: number;
  price: number;
  date: string;
}

// 1. Hangul Choseong Helper
const CHOSEONG = [
  'ㄱ',
  'ㄲ',
  'ㄴ',
  'ㄷ',
  'ㄸ',
  'ㄹ',
  'ㅁ',
  'ㅂ',
  'ㅃ',
  'ㅅ',
  'ㅆ',
  'ㅇ',
  'ㅈ',
  'ㅉ',
  'ㅊ',
  'ㅋ',
  'ㅌ',
  'ㅍ',
  'ㅎ',
];

function getChoseong(str: string): string {
  let result = '';
  for (let i = 0; i < str.length; i++) {
    const code = str.charCodeAt(i);
    // Check if Hangul Syllable (AC00-D7A3)
    if (code >= 0xac00 && code <= 0xd7a3) {
      const choseongIndex = Math.floor((code - 0xac00) / 28 / 21);
      result += CHOSEONG[choseongIndex];
    } else {
      result += str[i]; // Keep non-Hangul chars as is
    }
  }
  return result;
}

// 2. Mock Data (Common Crops in Garak Market)
const MOCK_CROPS: MarketCrop[] = [
  {
    id: '1001',
    name: '감자(수미)',
    category: '식량작물',
    standardUnit: '20kg 상자',
    units: ['20kg 상자', '10kg 상자', 'kg'],
    keywords: [],
    defaultYield: 6000,
    defaultPrice: 1500,
    growingDays: 90,
  },
  {
    id: '1002',
    name: '감자(대서)',
    category: '식량작물',
    standardUnit: '20kg 상자',
    units: ['20kg 상자', '10kg 상자', 'kg'],
    keywords: [],
    defaultYield: 6500,
    defaultPrice: 1400,
    growingDays: 95,
  },
  {
    id: '1003',
    name: '감자(두백)',
    category: '식량작물',
    standardUnit: '20kg 상자',
    units: ['20kg 상자'],
    keywords: [],
    defaultYield: 5500,
    defaultPrice: 1800,
    growingDays: 100,
  },
  {
    id: '1004',
    name: '고구마(밤)',
    category: '식량작물',
    standardUnit: '10kg 상자',
    units: ['10kg 상자', 'kg'],
    keywords: [],
    defaultYield: 5000,
    defaultPrice: 2000,
    growingDays: 120,
  },
  {
    id: '1005',
    name: '고구마(호박)',
    category: '식량작물',
    standardUnit: '10kg 상자',
    units: ['10kg 상자'],
    keywords: [],
    defaultYield: 5500,
    defaultPrice: 2200,
    growingDays: 120,
  },
  {
    id: '2001',
    name: '배추(봄)',
    category: '채소류',
    standardUnit: '10kg 망',
    units: ['10kg 망', '3입 망'],
    keywords: [],
    defaultYield: 10000,
    defaultPrice: 800,
    growingDays: 70,
  },
  {
    id: '2002',
    name: '배추(가을)',
    category: '채소류',
    standardUnit: '10kg 망',
    units: ['10kg 망', '3입 망'],
    keywords: [],
    defaultYield: 12000,
    defaultPrice: 700,
    growingDays: 80,
  },
  {
    id: '2003',
    name: '무(여름)',
    category: '채소류',
    standardUnit: '20kg 상자',
    units: ['20kg 상자', '개'],
    keywords: [],
    defaultYield: 11000,
    defaultPrice: 600,
    growingDays: 60,
  },
  {
    id: '2004',
    name: '양파',
    category: '채소류',
    standardUnit: '20kg 망',
    units: ['20kg 망', '15kg 망', 'kg'],
    keywords: [],
    defaultYield: 8000,
    defaultPrice: 1000,
    growingDays: 240,
  },
  {
    id: '2005',
    name: '마늘(난지)',
    category: '채소류',
    standardUnit: '10kg 망',
    units: ['10kg 망', '접'],
    keywords: [],
    defaultYield: 4000,
    defaultPrice: 4000,
    growingDays: 240,
  },
  {
    id: '3001',
    name: '딸기(설향)',
    category: '과채류',
    standardUnit: '2kg 스티로폼',
    units: ['2kg 스티로폼', '1kg 팩'],
    keywords: [],
    defaultYield: 3000,
    defaultPrice: 8000,
    growingDays: 180,
  },
  {
    id: '3002',
    name: '토마토(완숙)',
    category: '과채류',
    standardUnit: '5kg 상자',
    units: ['5kg 상자', '10kg 상자'],
    keywords: [],
    defaultYield: 15000,
    defaultPrice: 2500,
    growingDays: 100,
  },
  {
    id: '3003',
    name: '고추(청양)',
    category: '과채류',
    standardUnit: '10kg 상자',
    units: ['10kg 상자', '근'],
    keywords: [],
    defaultYield: 3000,
    defaultPrice: 6000,
    growingDays: 150,
  },
  {
    id: '3004',
    name: '오이(백다다기)',
    category: '과채류',
    standardUnit: '100개 상자',
    units: ['100개 상자', '50개 상자'],
    keywords: [],
    defaultYield: 20000,
    defaultPrice: 500,
    growingDays: 60,
  },
  {
    id: '4001',
    name: '사과(후지)',
    category: '과일류',
    standardUnit: '10kg 상자',
    units: ['10kg 상자', '5kg 상자'],
    keywords: [],
    defaultYield: 5000,
    defaultPrice: 5000,
    growingDays: 365,
  },
  {
    id: '5001',
    name: '가지',
    category: '과채류',
    standardUnit: '5kg 상자',
    units: ['5kg 상자', '8kg 상자'],
    keywords: [],
    defaultYield: 8000,
    defaultPrice: 2000,
    growingDays: 90,
  },
  {
    id: '2006',
    name: '쪽파',
    category: '엽채류',
    standardUnit: '10kg 상자',
    units: ['10kg 상자', '1kg 단'],
    keywords: [],
    defaultYield: 3000,
    defaultPrice: 4000,
    growingDays: 45,
  },
  {
    id: '2007',
    name: '대파',
    category: '조미채소',
    standardUnit: '1kg 단',
    units: ['1kg 단', '10kg 상자'],
    keywords: [],
    defaultYield: 5000,
    defaultPrice: 2000,
    growingDays: 90,
  },
  {
    id: '2008',
    name: '얼갈이배추',
    category: '엽채류',
    standardUnit: '4kg 상자',
    units: ['4kg 상자', '1.5kg 단'],
    keywords: [],
    defaultYield: 4000,
    defaultPrice: 3000,
    growingDays: 40,
  },
  {
    id: '2009',
    name: '열무',
    category: '엽채류',
    standardUnit: '4kg 상자',
    units: ['4kg 상자', '1.5kg 단'],
    keywords: [],
    defaultYield: 4000,
    defaultPrice: 4000,
    growingDays: 40,
  },
  {
    id: '2010',
    name: '시금치(섬초)',
    category: '엽채류',
    standardUnit: '4kg 상자',
    units: ['4kg 상자', '500g 단'],
    keywords: [],
    defaultYield: 2500,
    defaultPrice: 5000,
    growingDays: 60,
  },
  {
    id: '2011',
    name: '쑥갓',
    category: '엽채류',
    standardUnit: '4kg 상자',
    units: ['4kg 상자', '200g 봉지'],
    keywords: [],
    defaultYield: 3000,
    defaultPrice: 3000,
    growingDays: 50,
  },
  {
    id: '2012',
    name: '아욱',
    category: '엽채류',
    standardUnit: '4kg 상자',
    units: ['4kg 상자'],
    keywords: [],
    defaultYield: 3000,
    defaultPrice: 2000,
    growingDays: 50,
  },
  {
    id: '2013',
    name: '근대',
    category: '엽채류',
    standardUnit: '4kg 상자',
    units: ['4kg 상자'],
    keywords: [],
    defaultYield: 3500,
    defaultPrice: 2000,
    growingDays: 60,
  },
  {
    id: '2014',
    name: '부추',
    category: '엽채류',
    standardUnit: '500g 단',
    units: ['500g 단', '2kg 단'],
    keywords: [],
    defaultYield: 4000,
    defaultPrice: 4000,
    growingDays: 30,
  },
  {
    id: '2021',
    name: '미나리',
    category: '엽채류',
    standardUnit: '10kg',
    units: ['10kg', '4kg'],
    keywords: [],
    defaultYield: 4000,
    defaultPrice: 30000,
    growingDays: 50,
  },
  {
    id: '2022',
    name: '청경채',
    category: '엽채류',
    standardUnit: '4kg 상자',
    units: ['4kg 상자'],
    keywords: [],
    defaultYield: 4000,
    defaultPrice: 8000,
    growingDays: 45,
  },
  {
    id: '2023',
    name: '치커리',
    category: '엽채류',
    standardUnit: '2kg',
    units: ['2kg'],
    keywords: [],
    defaultYield: 3000,
    defaultPrice: 10000,
    growingDays: 50,
  },
  {
    id: '2024',
    name: '셀러리',
    category: '엽채류',
    standardUnit: '10kg',
    units: ['10kg'],
    keywords: [],
    defaultYield: 5000,
    defaultPrice: 20000,
    growingDays: 80,
  },
  {
    id: '2025',
    name: '파슬리',
    category: '엽채류',
    standardUnit: '4kg',
    units: ['4kg'],
    keywords: [],
    defaultYield: 2000,
    defaultPrice: 30000,
    growingDays: 70,
  },
  {
    id: '2026',
    name: '봄동',
    category: '엽채류',
    standardUnit: '10kg',
    units: ['10kg'],
    keywords: [],
    defaultYield: 5000,
    defaultPrice: 15000,
    growingDays: 90,
  },

  // Fruits
  {
    id: '5001',
    name: '사과(부사)',
    category: '과일류',
    standardUnit: '10kg 상자',
    units: ['10kg 상자', '5kg 상자'],
    keywords: [],
    defaultYield: 3000,
    defaultPrice: 40000,
    growingDays: 365,
  },
  {
    id: '5002',
    name: '감',
    category: '과일류',
    standardUnit: '10kg 상자',
    units: ['10kg 상자', '5kg 상자'],
    keywords: [],
    defaultYield: 5000,
    defaultPrice: 3000,
    growingDays: 365,
  },
  {
    id: '5003',
    name: '배(신고)',
    category: '과일류',
    standardUnit: '15kg 상자',
    units: ['15kg 상자', '7.5kg 상자'],
    keywords: [],
    defaultYield: 3500,
    defaultPrice: 35000,
    growingDays: 365,
  },
  {
    id: '5004',
    name: '포도(샤인머스켓)',
    category: '과일류',
    standardUnit: '2kg 상자',
    units: ['2kg 상자', '4kg 상자'],
    keywords: [],
    defaultYield: 2500,
    defaultPrice: 35000,
    growingDays: 365,
  },
  {
    id: '5005',
    name: '포도(캠벨)',
    category: '과일류',
    standardUnit: '3kg 상자',
    units: ['3kg 상자', '5kg 상자'],
    keywords: [],
    defaultYield: 2500,
    defaultPrice: 20000,
    growingDays: 365,
  },
  {
    id: '5006',
    name: '복숭아(백도)',
    category: '과일류',
    standardUnit: '4kg 상자',
    units: ['4kg 상자', '2kg'],
    keywords: [],
    defaultYield: 2500,
    defaultPrice: 25000,
    growingDays: 365,
  },
  {
    id: '5007',
    name: '자두',
    category: '과일류',
    standardUnit: '5kg 상자',
    units: ['5kg 상자'],
    keywords: [],
    defaultYield: 2000,
    defaultPrice: 30000,
    growingDays: 365,
  },
  {
    id: '5008',
    name: '귤',
    category: '과일류',
    standardUnit: '10kg 상자',
    units: ['10kg 상자', '5kg 상자'],
    keywords: [],
    defaultYield: 4000,
    defaultPrice: 20000,
    growingDays: 365,
  },
  {
    id: '5009',
    name: '오렌지',
    category: '과일류',
    standardUnit: '18kg',
    units: ['18kg', 'kg'],
    keywords: [],
    defaultYield: 4000,
    defaultPrice: 50000,
    growingDays: 365,
  },
  {
    id: '5010',
    name: '딸기(설향)',
    category: '과채류',
    standardUnit: '2kg 스티로폼',
    units: ['2kg 스티로폼', '1kg'],
    keywords: [],
    defaultYield: 3000,
    defaultPrice: 25000,
    growingDays: 180,
  },
  {
    id: '5011',
    name: '토마토(완숙)',
    category: '과채류',
    standardUnit: '5kg 상자',
    units: ['5kg 상자', '10kg'],
    keywords: [],
    defaultYield: 10000,
    defaultPrice: 15000,
    growingDays: 90,
  },
  {
    id: '5012',
    name: '방울토마토',
    category: '과채류',
    standardUnit: '5kg 상자',
    units: ['5kg 상자', '3kg'],
    keywords: [],
    defaultYield: 8000,
    defaultPrice: 20000,
    growingDays: 80,
  },

  // Special & Grains
  {
    id: '6001',
    name: '참깨',
    category: '특용작물',
    standardUnit: '30kg 가마',
    units: ['30kg 가마', 'kg'],
    keywords: [],
    defaultYield: 80,
    defaultPrice: 400000,
    growingDays: 90,
  },
  {
    id: '6002',
    name: '들깨',
    category: '특용작물',
    standardUnit: '1kg',
    units: ['1kg', '45kg 가마'],
    keywords: [],
    defaultYield: 150,
    defaultPrice: 15000,
    growingDays: 120,
  },
  {
    id: '6003',
    name: '콩(백태)',
    category: '식량작물',
    standardUnit: '1kg',
    units: ['1kg', '1가마'],
    keywords: [],
    defaultYield: 200,
    defaultPrice: 6000,
    growingDays: 130,
  },
  {
    id: '6004',
    name: '콩(서리태)',
    category: '식량작물',
    standardUnit: '1kg',
    units: ['1kg', '1가마'],
    keywords: [],
    defaultYield: 180,
    defaultPrice: 10000,
    growingDays: 140,
  },
  {
    id: '6005',
    name: '팥',
    category: '식량작물',
    standardUnit: '1kg',
    units: ['1kg', '40kg'],
    keywords: [],
    defaultYield: 150,
    defaultPrice: 8000,
    growingDays: 110,
  },
  {
    id: '6006',
    name: '녹두',
    category: '식량작물',
    standardUnit: '1kg',
    units: ['1kg'],
    keywords: [],
    defaultYield: 120,
    defaultPrice: 12000,
    growingDays: 100,
  },
  {
    id: '6007',
    name: '쌀(일반)',
    category: '식량작물',
    standardUnit: '20kg 포대',
    units: ['20kg 포대', '80kg 가마'],
    keywords: [],
    defaultYield: 500,
    defaultPrice: 50000,
    growingDays: 150,
  },
  {
    id: '6008',
    name: '보리',
    category: '식량작물',
    standardUnit: '40kg 가마',
    units: ['40kg 가마'],
    keywords: [],
    defaultYield: 400,
    defaultPrice: 35000,
    growingDays: 180,
  },

  // Cucurbits & Solanaceae
  {
    id: '3005',
    name: '수박',
    category: '과채류',
    standardUnit: '1통',
    units: ['1통', 'kg'],
    keywords: [],
    defaultYield: 5000,
    defaultPrice: 18000,
    growingDays: 90,
  },
  {
    id: '3006',
    name: '참외',
    category: '과채류',
    standardUnit: '10kg 상자',
    units: ['10kg 상자', '5kg'],
    keywords: [],
    defaultYield: 4000,
    defaultPrice: 40000,
    growingDays: 85,
  },
  {
    id: '3007',
    name: '멜론',
    category: '과채류',
    standardUnit: '8kg 상자',
    units: ['8kg 상자', '수'],
    keywords: [],
    defaultYield: 4000,
    defaultPrice: 30000,
    growingDays: 90,
  },
  {
    id: '3008',
    name: '호박(애호박)',
    category: '과채류',
    standardUnit: '20개 상자',
    units: ['20개 상자'],
    keywords: [],
    defaultYield: 10000,
    defaultPrice: 18000,
    growingDays: 60,
  },
  {
    id: '3009',
    name: '호박(쥬키니)',
    category: '과채류',
    standardUnit: '10kg 상자',
    units: ['10kg 상자'],
    keywords: [],
    defaultYield: 12000,
    defaultPrice: 15000,
    growingDays: 60,
  },
  {
    id: '3010',
    name: '호박(단호박)',
    category: '과채류',
    standardUnit: '10kg 망',
    units: ['10kg 망'],
    keywords: [],
    defaultYield: 6000,
    defaultPrice: 12000,
    growingDays: 100,
  },
  {
    id: '3011',
    name: '호박(늙은호박)',
    category: '과채류',
    standardUnit: '1개',
    units: ['1개', 'kg'],
    keywords: [],
    defaultYield: 5000,
    defaultPrice: 8000,
    growingDays: 150,
  },

  // Root Vegetables
  {
    id: '7001',
    name: '당근',
    category: '근채류',
    standardUnit: '20kg 상자',
    units: ['20kg 상자'],
    keywords: [],
    defaultYield: 6000,
    defaultPrice: 35000,
    growingDays: 110,
  },
  {
    id: '7002',
    name: '우엉',
    category: '근채류',
    standardUnit: '4kg',
    units: ['4kg', 'kg'],
    keywords: [],
    defaultYield: 3000,
    defaultPrice: 15000,
    growingDays: 150,
  },
  {
    id: '7003',
    name: '연근',
    category: '근채류',
    standardUnit: '10kg',
    units: ['10kg', 'kg'],
    keywords: [],
    defaultYield: 4000,
    defaultPrice: 20000,
    growingDays: 180,
  },
  {
    id: '7004',
    name: '비트',
    category: '근채류',
    standardUnit: '10kg',
    units: ['10kg'],
    keywords: [],
    defaultYield: 5000,
    defaultPrice: 15000,
    growingDays: 90,
  },
  {
    id: '7005',
    name: '콜라비',
    category: '근채류',
    standardUnit: '10kg',
    units: ['10kg'],
    keywords: [],
    defaultYield: 6000,
    defaultPrice: 12000,
    growingDays: 70,
  },
  {
    id: '7006',
    name: '더덕',
    category: '특용작물',
    standardUnit: '1kg',
    units: ['1kg', '4kg'],
    keywords: [],
    defaultYield: 2000,
    defaultPrice: 25000,
    growingDays: 730,
  },
  {
    id: '7007',
    name: '도라지',
    category: '특용작물',
    standardUnit: '1kg',
    units: ['1kg', '4kg'],
    keywords: [],
    defaultYield: 2000,
    defaultPrice: 15000,
    growingDays: 365,
  },
  {
    id: '7008',
    name: '생강',
    category: '근채류',
    standardUnit: '10kg',
    units: ['10kg', 'kg'],
    keywords: [],
    defaultYield: 2000,
    defaultPrice: 60000,
    growingDays: 160,
  },
  {
    id: '7009',
    name: '마',
    category: '근채류',
    standardUnit: '10kg',
    units: ['10kg'],
    keywords: [],
    defaultYield: 3000,
    defaultPrice: 40000,
    growingDays: 180,
  },

  // Seasonings
  {
    id: '4005',
    name: '고추(홍고추)',
    category: '조미채소',
    standardUnit: '10kg 상자',
    units: ['10kg 상자'],
    keywords: [],
    defaultYield: 3000,
    defaultPrice: 40000,
    growingDays: 80,
  },
  {
    id: '4006',
    name: '고추(풋고추)',
    category: '조미채소',
    standardUnit: '10kg 상자',
    units: ['10kg 상자'],
    keywords: [],
    defaultYield: 4000,
    defaultPrice: 35000,
    growingDays: 70,
  },
  {
    id: '4007',
    name: '피망',
    category: '과채류',
    standardUnit: '10kg 상자',
    units: ['10kg 상자'],
    keywords: [],
    defaultYield: 5000,
    defaultPrice: 30000,
    growingDays: 80,
  },
  {
    id: '4008',
    name: '파프리카',
    category: '과채류',
    standardUnit: '5kg 상자',
    units: ['5kg 상자'],
    keywords: [],
    defaultYield: 8000,
    defaultPrice: 20000,
    growingDays: 90,
  },

  // Mushrooms
  {
    id: '9001',
    name: '표고버섯',
    category: '버섯류',
    standardUnit: '4kg 상자',
    units: ['4kg 상자'],
    keywords: [],
    defaultYield: 2000,
    defaultPrice: 30000,
    growingDays: 60,
  },
  {
    id: '9002',
    name: '느타리버섯',
    category: '버섯류',
    standardUnit: '2kg 상자',
    units: ['2kg 상자'],
    keywords: [],
    defaultYield: 3000,
    defaultPrice: 10000,
    growingDays: 40,
  },
  {
    id: '9003',
    name: '새송이버섯',
    category: '버섯류',
    standardUnit: '2kg 봉지',
    units: ['2kg 봉지'],
    keywords: [],
    defaultYield: 3000,
    defaultPrice: 8000,
    growingDays: 50,
  },
  {
    id: '9004',
    name: '팽이버섯',
    category: '버섯류',
    standardUnit: '5kg 상자',
    units: ['5kg 상자'],
    keywords: [],
    defaultYield: 4000,
    defaultPrice: 15000,
    growingDays: 40,
  },
  
  // Grains & Others (Expanded)
  {
    id: '8001',
    name: '옥수수',
    category: '식량작물',
    standardUnit: '30개 망',
    units: ['30개 망', 'kg'],
    keywords: ['대학찰', '초당'],
    defaultYield: 4000, // ea or kg? Assume 4000 something
    defaultPrice: 15000,
    growingDays: 100,
  },
  {
    id: '8002',
    name: '초당옥수수',
    category: '식량작물',
    standardUnit: '20개 상자',
    units: ['20개 상자'],
    keywords: [],
    defaultYield: 3000,
    defaultPrice: 20000,
    growingDays: 90,
  },
  {
    id: '8003',
    name: '찰옥수수',
    category: '식량작물',
    standardUnit: '30개 망',
    units: ['30개 망'],
    keywords: [],
    defaultYield: 3500,
    defaultPrice: 18000,
    growingDays: 110,
  }
];

export const GarakMarketService = {
  searchCrops: async (query: string): Promise<MarketCrop[]> => {
    if (!query) return [];

    const normalizedQuery = query.trim();
    // const apiKey = import.meta.env.VITE_GARAK_API_KEY; // Legacy API uses fixed ID/PW

    // 1. Try Real API (Legacy Garak Method)
    // User provided screenshot shows: id=5775, passwd=*suoho1004 (Fixed)
    // Endpoint: http://www.garak.co.kr/homepage/publicdata/dataJsonOpen.do
    // Params: dataid=data12 (or similar), pagesize=10, pageidx=1, portal.templet=false
    // Encoding: EUC-KR is required officially, but we will try UTF-8 first via standard fetch.

    try {
      // 1. Fetch Master List from processed data (Real Market Items)
      const masterRes = await fetch('/data/garak/aggregated/master_crop_list.json');
      
      // 2. Fetch Curated Info (Accurate Growing Days)
      const infoRes = await fetch('/data/crop_info.json');
      
      if (masterRes.ok) {
        const masterList = await masterRes.json();
        const cropInfoList = infoRes.ok ? await infoRes.json() : [];
        
        // Build Info Map
        const infoMap = new Map();
        cropInfoList.forEach((info: any) => {
            infoMap.set(info.name, info);
        });

        if (Array.isArray(masterList)) {
           // Filter client-side
           const results = masterList.filter((item: any) => 
               item.name.includes(normalizedQuery)
           ).map((item: any) => {
                // Check if we have curated info for this crop (Partial match allowed e.g. "감자 수미" matches "감자")
                let info = infoMap.get(item.name);
                
                // If exact match not found, try to find a base crop match (e.g. "쪽파(특)" -> "쪽파")
                if (!info) {
                    for (const key of infoMap.keys()) {
                        if (item.name.startsWith(key)) {
                            info = infoMap.get(key);
                            break;
                        }
                    }
                }

                return {
                    id: `real-${Math.random().toString(36).substr(2, 9)}`,
                    name: `${item.name}`,
                    category: item.category || '농산물',
                    standardUnit: item.units?.[0] || 'kg',
                    units: item.units && item.units.length > 0 ? item.units : ['kg'],
                    grades: item.grades || [],
                    keywords: [],
                    defaultYield: info?.defaultYield || 0,
                    defaultPrice: item.recentPrice || 0,
                    growingDays: info?.growingDays || 90, // Fallback to 90 if unknown
                    description: info?.description // Optional extra info
                };
           });
           
           if (results.length > 0) return results;
        }
      }
    } catch (e) {
      console.warn('Failed to load master crop list, falling back to mock.', e);
    }

    // 2. Fallback to Mock Data (Client-side filtering)
    const isChoseongQuery = /^[ㄱ-ㅎ]+$/.test(normalizedQuery);

    // Mock is sync, but we return a Promise to match async API signature
    const mockResults = MOCK_CROPS.filter((crop) => {
      // Direct match (Name)
      if (crop.name.includes(normalizedQuery)) return true;

      // Choseong match
      if (isChoseongQuery) {
        const cropChoseong = getChoseong(crop.name);
        return cropChoseong.includes(normalizedQuery);
      }

      return false;
    });

    return mockResults;
  },

  /**
   * Fetches historical price data to simulate future revenue.
   * Logic: 
   * 1. Calculate the 'reference date' (Target Date - 1 Year).
   * 2. Fetch Garak Market data for that period.
   * 3. Return the average price.
   */
  /**
   * Fetches historical price data to simulate future revenue.
   * Logic: 
   * 1. Calculate the 'reference date' (Target Date - 1 Year).
   * 2. Check local NAS Cache (market_history.json).
   * 3. Return the average price if found, else fallback.
   */
  /**
   * Fetches historical price data to simulate future revenue.
   * Logic: 
   * 1. Calculate the 'reference date' (Target Date - 1 Year).
   * 2. Try to fetch the specific daily file from NAS Cache: /data/market/{year}/{date}.json
   * 3. If not found, try +/- 3 days range.
   * 4. Return the average price if found, else fallback.
   */
  /**
   * Fetches historical price data to simulate future revenue.
   * Logic: 
   * 1. Calculate the 'reference date' (Target Date - 1 Year).
   * 2. Fetch the aggregated crop file: /data/processed/crops/{cropName}.json
   * 3. Find the closest record to the reference date.
   */
  getHistoricalPrice: async (cropName: string, targetDate: Date): Promise<number> => {
    // 1. Calculate Reference Date (1 Year Ago)
    const refDate = new Date(targetDate);
    refDate.setFullYear(refDate.getFullYear() - 1);
    
    // Safety
    const today = new Date();
    if (refDate > today) {
       refDate.setFullYear(today.getFullYear() - 1);
    }
    
    // Sanitize filename
    const safeName = cropName.replace(/[\/\\?%*:|"<>]/g, '_');
    const url = `/data/garak/aggregated/crops/${encodeURIComponent(safeName)}.json?t=${new Date().getTime()}`; // Bust cache for now

    console.log(`[MarketService] Fetching processed history for ${cropName}`);

    try {
      const res = await fetch(url);
      if (res.ok) {
        const json = await res.json();
        const records = json.data || [];
        
        if (records.length > 0) {
            // Find closest date
            // Records are sorted by date. We can use binary search or just linear (array size ~1500 for 5 years)
            const pad = (n: number) => n.toString().padStart(2, '0');
            const targetYMD = `${refDate.getFullYear()}-${pad(refDate.getMonth() + 1)}-${pad(refDate.getDate())}`;
            
            // Simple Linear Search for closest date
            let closest = records[0];
            let minDiff = Infinity;
            
            const targetTime = new Date(targetYMD).getTime();

            for (const rec of records) {
                const recTime = new Date(rec.date).getTime();
                const diff = Math.abs(recTime - targetTime);
                
                if (diff < minDiff) {
                    minDiff = diff;
                    closest = rec;
                }
            }
            
            // Allow if within reason (e.g. 7 days). If gap is too huge, maybe data is missing.
            const daysDiff = minDiff / (1000 * 60 * 60 * 24);
            if (daysDiff <= 7) {
                 return closest.price; 
            }
        }
      }
    } catch (e) {
      console.warn(`[MarketService] Failed to load processed data for ${cropName}`, e);
    }

    const fallbackCrop = MOCK_CROPS.find(c => c.name === cropName);
    return fallbackCrop ? fallbackCrop.defaultPrice : 0;
  },

  // Recommend Crops based on Environment
  getRecommendations: (
    location: string,
    facilityType: string,
    date: Date = new Date(),
  ): MarketCrop[] => {
    // Simple Mock Inference
    const month = date.getMonth() + 1;
    const recommendations: string[] = [];

    // Logic
    if (facilityType === 'open_field' || !facilityType) {
      // Noji (Open Field)
      if (month >= 3 && month <= 5) recommendations.push('감자', '배추(봄)', '무');
      if (month >= 8 && month <= 9) recommendations.push('배추(가을)', '무(가을)', '양파');
      if (month >= 10 || month <= 2) recommendations.push('마늘', '양파');
    } else {
      // Facilities (Vinyl/Glass)
      if (facilityType.includes('Smart')) {
        recommendations.push('딸기', '토마토', '파프리카');
      } else {
        recommendations.push('고추', '오이', '상추', '딸기');
      }
    }

    // Region Specific Boosts (Mock)
    if (location.includes('강원') && month >= 6) recommendations.push('배추', '감자');
    if (location.includes('전남')) recommendations.push('양파', '마늘');

    // Filter MOCK_CROPS to return full objects that match partial names
    // Use a Set to avoid duplicates if specific varieties match generic logic
    const results = new Map<string, MarketCrop>();

    MOCK_CROPS.forEach((crop) => {
      if (recommendations.some((rec) => crop.name.includes(rec))) {
        results.set(crop.name, crop);
      }
    });

    // Fallback if empty
    if (results.size === 0) {
      // Return top 3 common crops
      MOCK_CROPS.slice(0, 3).forEach((c) => results.set(c.name, c));
    }

    return Array.from(results.values());
  },

  /**
   * Price Prediction Logic
   * Uses historical data from Garak Market (or specific market if data available)
   * to predict price at harvest date by averaging past 3 years.
   */
  predictPrice: async (
    cropName: string,
    marketName: string,
    unitName: string,
    harvestDate: string // YYYY-MM-DD
  ): Promise<{ price: number; confidence: number; history: any[] }> => {
     console.log(`Predicting for ${cropName} at ${marketName} (${unitName}) on ${harvestDate}`);
     
     // 1. Calculate Target Month/Day for historical lookup
     const target = new Date(harvestDate);
     const requestMonth = target.getMonth() + 1;
     const requestDay = target.getDate();
     
     // 2. Fetch Historical Data (We use the Master List & Processed Crops for now)
     // Ideally we dig into specific market data, but we'll use the Aggregated Garak Data as proxy
     // since specific wholesale market data API is currently unauthorized.
     
     const safeName = cropName.replace(/[\/\\?%*:|"<>]/g, '_');
     const url = `/data/garak/aggregated/crops/${encodeURIComponent(safeName)}.json`;
     
     try {
         const res = await fetch(url);
         if (!res.ok) throw new Error('No historical data');
         const json = await res.json();
         const records = json.data || [];

         const history: PriceHistoryRecord[] = [];
         let totalSum = 0;
         let count = 0;
         
         // 3. Look back 3-5 years around the same date (+/- 5 days)
         for (let yearOffset = 1; yearOffset <= 5; yearOffset++) {
             const pastYear = target.getFullYear() - yearOffset;
             
             // Define window
             // Simple approach: check all records, calculate Day-of-Year match
             // Faster approach: String filter YYYY-MM-DD
             
             // Let's filter records that match the year and month
             const relevantRecords = records.filter((r: any) => {
                 const d = new Date(r.date);
                 return d.getFullYear() === pastYear && d.getMonth() + 1 === requestMonth;
             });
             
             // Find closest day
             let bestRecord: any = null;
             let minDiff = 100;
             
             relevantRecords.forEach((r: any) => {
                 const d = new Date(r.date);
                 const diff = Math.abs(d.getDate() - requestDay);
                 if (diff < minDiff) {
                     minDiff = diff;
                     bestRecord = r;
                 }
             });
             
             if (bestRecord && minDiff <= 7) {
                 history.push({ year: pastYear, price: bestRecord.price, date: bestRecord.date });
                 totalSum += bestRecord.price;
                 count++;
             }
         }
         
         if (count > 0) {
             const avg = Math.floor(totalSum / count);
             return { price: avg, confidence: 0.8, history };
         }
         
     } catch (e) {
         console.warn('Prediction failed', e);
     }
     
     // Fallback
     return { price: 0, confidence: 0, history: [] };
  },

  getMarkets: async (cropName: string): Promise<string[]> => {
      // Fetch metadata
      try {
          const res = await fetch('/data/market_metadata.json');
          const meta = await res.json();
          // Check specific mapping
          if (meta.crop_mapping && meta.crop_mapping[cropName]) {
              return meta.crop_mapping[cropName].markets;
          }
          return meta.markets; // Return all if no specific map
      } catch (e) {
          return ['서울가락도매시장', '구리도매시장'];
      }
  },
  
  getUnits: async (cropName: string): Promise<string[]> => {
      try {
          const res = await fetch('/data/market_metadata.json');
          const meta = await res.json();
          if (meta.crop_mapping && meta.crop_mapping[cropName]) {
              return meta.crop_mapping[cropName].units;
          }
          
          // Or fetch from Master List to see actual units?
          // We can use the service we already built
          const masterRes = await fetch('/data/garak/aggregated/master_crop_list.json');
          if (masterRes.ok) {
              const list = await masterRes.json();
              const item = list.find((c: any) => c.name === cropName);
              if (item && item.units && item.units.length > 0) return item.units;
          }
          
          return meta.units;
      } catch (e) {
          return ['1kg', '10kg'];
      }
  }
};
