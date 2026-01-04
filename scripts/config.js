
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs-extra';

// Load .env
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.join(__dirname, '..');

// Load .env from root
dotenv.config({ path: path.join(ROOT_DIR, '.env') });

export const CONFIG = {
    KEYS: {
        WEATHER: process.env.KMA_SERVICE_KEY || '',
        GARAK_ID: process.env.GARAK_ID || '',
        GARAK_PW: process.env.GARAK_PW || '',
        KAMIS_CERT_KEY: process.env.KAMIS_CERT_KEY || '',
        KAMIS_CERT_ID: process.env.KAMIS_CERT_ID || '',
        PUBLIC_DATA_PORTAL: 'b4d6ac2cedc8e95a0e1bdd0d0ac51aabf5734ca9bd51501c2e9015a87cfd2325',
        NONGSARO: '202512319DLUHQN9LGWIOK5EFVGKQ'
    },
    DIRS: {
        ROOT: ROOT_DIR,
        // Local Processed Data (For Web App)
        DATA: path.join(ROOT_DIR, 'public/data'), 
        GARAK_AGGREGATED: path.join(ROOT_DIR, 'public/data/garak/aggregated'),
        
        // Local Raw Data Storage (Changed from NAS for reliability)
        RAW_ROOT: path.join(ROOT_DIR, 'public/data/raw'),
        
        // Mapped Local Paths
        KMA: path.join(ROOT_DIR, 'public/data/raw/kma'),
        KAMIS: path.join(ROOT_DIR, 'public/data/raw/kamis'),
        GARAK_DAILY: path.join(ROOT_DIR, 'public/data/raw/garak/daily'),
        GARAK_DIRECT: path.join(ROOT_DIR, 'public/data/raw/garak/direct'),
        
        NCPMS: path.join(ROOT_DIR, 'public/data/raw/ncpms'),
        SOIL: path.join(ROOT_DIR, 'public/data/raw/soil'),
        MACHINE: path.join(ROOT_DIR, 'public/data/raw/machine'),
        TECH: path.join(ROOT_DIR, 'public/data/raw/tech'),
        AUCTION: path.join(ROOT_DIR, 'public/data/raw/auction'),
        
        WEATHER_GEN: path.join(ROOT_DIR, 'public/data/raw/kma/gen'),
        WEATHER_ANALYSIS: path.join(ROOT_DIR, 'public/data/raw/kma/analysis'),
        WEATHER_HISTORY: path.join(ROOT_DIR, 'public/data/weather/history')
    },
    STATIONS: [
        { id: '108', name: '서울' },
        { id: '105', name: '강릉' }, // User's likely region
        { id: '101', name: '춘천' },
        { id: '133', name: '대전' },
        { id: '143', name: '대구' },
        { id: '159', name: '부산' },
        { id: '156', name: '광주' },
        { id: '184', name: '제주' }
    ],
    LOCATION: { nx: 58, ny: 74 }
};

// Ensure Dirs
Object.values(CONFIG.DIRS).forEach(dir => {
    // Skip if it's a file path or root which implies existing, but here all are dirs except ROOT
    if (dir !== ROOT_DIR) {
        fs.ensureDirSync(dir);
    }
});
