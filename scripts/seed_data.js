
import fs from 'fs-extra';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.join(__dirname, '..');

const OUTPUT_DIR = path.join(ROOT_DIR, 'public/data/garak/aggregated');
const OUTPUT_FILE = path.join(OUTPUT_DIR, 'master_crop_list.json');

const SEED_DATA = [
  // Grains
  { name: '쌀(일반)', category: '식량작물', unit: '20kg', recentPrice: 50000 },
  { name: '찹쌀', category: '식량작물', unit: '20kg', recentPrice: 55000 },
  { name: '콩(백태)', category: '식량작물', unit: '1kg', recentPrice: 6000 },
  { name: '콩(서리태)', category: '식량작물', unit: '1kg', recentPrice: 10000 },
  { name: '팥', category: '식량작물', unit: '1kg', recentPrice: 8000 },
  { name: '녹두', category: '식량작물', unit: '1kg', recentPrice: 12000 },
  { name: '참깨', category: '특용작물', unit: 'kg', recentPrice: 20000 },
  { name: '들깨', category: '특용작물', unit: 'kg', recentPrice: 15000 },
  { name: '땅콩', category: '특용작물', unit: 'kg', recentPrice: 12000 },

  // Vegetables
  { name: '배추(봄)', category: '엽채류', unit: '10kg 망', recentPrice: 8000 },
  { name: '배추(여름)', category: '엽채류', unit: '10kg 망', recentPrice: 12000 },
  { name: '배추(가을)', category: '엽채류', unit: '10kg 망', recentPrice: 7000 },
  { name: '배추(겨울)', category: '엽채류', unit: '10kg 망', recentPrice: 9000 },
  { name: '무(봄)', category: '근채류', unit: '20kg 상자', recentPrice: 12000 },
  { name: '무(여름)', category: '근채류', unit: '20kg 상자', recentPrice: 15000 },
  { name: '무(가을)', category: '근채류', unit: '20kg 상자', recentPrice: 10000 },
  { name: '무(겨울)', category: '근채류', unit: '20kg 상자', recentPrice: 11000 },
  { name: '열무', category: '엽채류', unit: '4kg 상자', recentPrice: 4000 },
  { name: '얼갈이배추', category: '엽채류', unit: '4kg 상자', recentPrice: 3500 },
  { name: '상추(적)', category: '엽채류', unit: '4kg 상자', recentPrice: 15000 },
  { name: '상추(청)', category: '엽채류', unit: '4kg 상자', recentPrice: 12000 },
  { name: '양배추', category: '엽채류', unit: '8kg 망', recentPrice: 6000 },
  { name: '시금치', category: '엽채류', unit: '4kg 상자', recentPrice: 8000 },
  { name: '깻잎', category: '엽채류', unit: '100속 상자', recentPrice: 20000 },
  { name: '미나리', category: '엽채류', unit: '10kg', recentPrice: 30000 },
  { name: '부추', category: '엽채류', unit: '500g 단', recentPrice: 4000 },
  { name: '파(대파)', category: '조미채소', unit: '10kg', recentPrice: 20000 },
  { name: '파(쪽파)', category: '조미채소', unit: '10kg', recentPrice: 30000 },
  { name: '생강', category: '조미채소', unit: '10kg', recentPrice: 60000 },
  { name: '마늘(한지)', category: '조미채소', unit: '10kg', recentPrice: 60000 },
  { name: '마늘(난지)', category: '조미채소', unit: '10kg', recentPrice: 40000 },
  { name: '양파', category: '조미채소', unit: '20kg', recentPrice: 15000 },
  { name: '고추(건)', category: '조미채소', unit: '30kg', recentPrice: 600000 },
  { name: '고추(풋)', category: '조미채소', unit: '10kg', recentPrice: 40000 },
  { name: '고추(청양)', category: '조미채소', unit: '10kg', recentPrice: 50000 },
  { name: '오이(가시)', category: '과채류', unit: '50개 상자', recentPrice: 25000 },
  { name: '오이(다다기)', category: '과채류', unit: '100개 상자', recentPrice: 40000 },
  { name: '호박(애호박)', category: '과채류', unit: '20개 상자', recentPrice: 15000 },
  { name: '호박(쥬키니)', category: '과채류', unit: '10kg', recentPrice: 12000 },
  { name: '토마토', category: '과채류', unit: '5kg', recentPrice: 15000 },
  { name: '방울토마토', category: '과채류', unit: '5kg', recentPrice: 20000 },
  { name: '딸기', category: '과채류', unit: '2kg', recentPrice: 25000 },
  { name: '가지', category: '과채류', unit: '5kg', recentPrice: 10000 },
  { name: '피망', category: '과채류', unit: '10kg', recentPrice: 35000 },
  { name: '파프리카', category: '과채류', unit: '5kg', recentPrice: 25000 },
  { name: '멜론', category: '과채류', unit: '8kg', recentPrice: 30000 },
  { name: '수박', category: '과채류', unit: '1통', recentPrice: 18000 },
  { name: '참외', category: '과채류', unit: '10kg', recentPrice: 40000 },

  // Roots
  { name: '감자(수미)', category: '서류', unit: '20kg', recentPrice: 35000 },
  { name: '감자(대서)', category: '서류', unit: '20kg', recentPrice: 30000 },
  { name: '고구마(밤)', category: '서류', unit: '10kg', recentPrice: 25000 },
  { name: '고구마(호박)', category: '서류', unit: '10kg', recentPrice: 30000 },
  { name: '당근', category: '근채류', unit: '20kg', recentPrice: 30000 },
  { name: '우엉', category: '근채류', unit: '4kg', recentPrice: 15000 },
  { name: '연근', category: '근채류', unit: '10kg', recentPrice: 20000 },
  { name: '도라지', category: '특용작물', unit: '4kg', recentPrice: 30000 },
  { name: '더덕', category: '특용작물', unit: '4kg', recentPrice: 50000 },

  // Mushrooms
  { name: '표고버섯', category: '버섯류', unit: '4kg', recentPrice: 30000 },
  { name: '느타리버섯', category: '버섯류', unit: '2kg', recentPrice: 12000 },
  { name: '팽이버섯', category: '버섯류', unit: '5kg', recentPrice: 15000 },
  { name: '새송이버섯', category: '버섯류', unit: '2kg', recentPrice: 10000 },

  // Fruits
  { name: '사과(후지)', category: '과일류', unit: '10kg', recentPrice: 45000 },
  { name: '사과(홍로)', category: '과일류', unit: '10kg', recentPrice: 40000 },
  { name: '배(신고)', category: '과일류', unit: '15kg', recentPrice: 40000 },
  { name: '포도(캠벨)', category: '과일류', unit: '3kg', recentPrice: 20000 },
  { name: '포도(거봉)', category: '과일류', unit: '2kg', recentPrice: 25000 },
  { name: '포도(샤인머스켓)', category: '과일류', unit: '2kg', recentPrice: 30000 },
  { name: '복숭아', category: '과일류', unit: '4kg', recentPrice: 25000 },
  { name: '자두', category: '과일류', unit: '5kg', recentPrice: 30000 },
  { name: '귤', category: '과일류', unit: '5kg', recentPrice: 12000 },
  { name: '단감', category: '과일류', unit: '10kg', recentPrice: 25000 },
];

(async () => {
    await fs.ensureDir(OUTPUT_DIR);
    console.log(`Seeding ${SEED_DATA.length} crops to ${OUTPUT_FILE}...`);
    await fs.outputJson(OUTPUT_FILE, SEED_DATA, { spaces: 2 });
    console.log('Done.');
})();
