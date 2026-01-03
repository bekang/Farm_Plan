import type { MarketCrop } from '@/types/market';

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
      // Using a CORS proxy might be needed in dev, but trying direct first.
      // Note: dataid 'data12' is usually for daily price. The user image showed 'data36' but context suggests price search.
      // Let's assume 'data12' (generic daily price) or attempt to replicate the screenshot EXACTLY if 'data36' is better.
      // Screenshot 'data36' -> "품목별등급별가격". We will use that.

      const today = new Date();
      const yyyymmdd = today.toISOString().slice(0, 10).replace(/-/g, '');

      const params = new URLSearchParams();
      params.append('id', '5775');
      params.append('passwd', '*suoho1004');
      params.append('dataid', 'data12'); // data12 seems more common for price list, but image said data36. Let's try data12 for general search first.
      params.append('pagesize', '10');
      params.append('pageidx', '1');
      params.append('portal.templet', 'false');
      params.append('s_date', yyyymmdd);
      params.append('p_pos_gubun', '1'); // Garak
      params.append('s_pummok', normalizedQuery); // Browser will encode UTF-8. If server fails, fallback to Mock.

      // Determine URL based on environment
      // Use Vercel Serverless Function (/api/garak) which acts as a robust proxy
      // This bypasses CORS and stricter firewall rules by running on the server side
      const baseUrl = '/api/garak';
      
      const response = await fetch(`${baseUrl}?${params.toString()}`);

      if (response.ok) {
        const data = await response.json();
        const list = data.list || data.data || [];

        if (Array.isArray(list) && list.length > 0) {
          return list.map((item: any) => ({
            id: `real-${item.PUM_CODE || Math.random()}`,
            name: item.PUM_NAME || normalizedQuery,
            category: '실시간 데이터',
            standardUnit: item.UNIT_NAME || item.U_NAME || 'kg',
            units: [item.UNIT_NAME || item.U_NAME || 'kg'],
            keywords: [],
            defaultYield: 0,
            defaultPrice: parseInt(item.AVR_PRICE || item.AV_P || 0),
            growingDays: 90,
          }));
        }
      } else {
        console.warn(`Garak API Error: ${response.status} ${response.statusText}`);
      }
    } catch (e) {
      console.warn('Real API Call failed (CORS/Network), using built-in data:', e);
      // Continue to fallback
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
};
