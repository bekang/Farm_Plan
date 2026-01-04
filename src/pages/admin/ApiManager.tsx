import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Key, Save, RefreshCw, CheckCircle2, AlertCircle, Eye, EyeOff, Plus, Trash2, Power, BookOpen, FileText, ExternalLink } from 'lucide-react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Switch } from '@/components/ui/switch';

interface ApiDetails {
    id: string; 
    serviceName: string;
    note: string; // Used as Endpoint or short note
    active: boolean;
    // Granular Configuration
    baseUrl?: string; 
    apiKey?: string;
    description?: string;
    usageMethod?: string;
    manualPath?: string; // Path to local manual file
    sourceLink?: string; // Link to original data source
}

interface ApiConfig {
  id: string;
  name: string;
  description: string;
  baseUrl: string;
  apiKey: string;
  subKey?: string; 
  subKeyLabel?: string;
  status: 'active' | 'inactive' | 'error';
  details: ApiDetails[];
}

// Helper to generate IDs
const generateId = () => Math.random().toString(36).substr(2, 9);

const DEFAULT_APIS: ApiConfig[] = [
  {
    id: 'data-portal',
    name: '공공데이터포털 (기상청/농진청/AT)',
    description: '기상정보, 토양환경, 도매시장 경매정보 등',
    baseUrl: 'https://apis.data.go.kr',
    apiKey: 'b4d6ac2cedc8e95a0e1bdd0d0ac61aabf5734ca9bd51501c2a9015a87cfd2325',
    status: 'active',
    details: [
        { 
            id: 'dp-1', 
            serviceName: '농촌진흥청 국립농업과학원_토양환경_화학성 상세정보 V2', 
            note: '/1390802/SoilEnviron/SoilExam/V2', 
            active: true,
            description: '법정동/리 코드(PNU) 기반 농경지 토양 화학성(pH, 유기물 등) 정보 조회',
            usageMethod: 'GET /SoilExam/V2?PNU_Code={PNU}&ServiceKey={API_KEY}',
            manualPath: '/manuals/html/manual_soil_env.html',
            sourceLink: 'https://www.data.go.kr/data/15000000/openapi.do'
        },
        { 
            id: 'dp-2', 
            serviceName: '한국농촌경제연구원_농기계 임대사업소 조회 오픈API', 
            note: '/B090028/farmMachinOffice', 
            active: true,
            description: '전국 농기계 임대사업소 위치 및 보유 장비 현황 조회',
            usageMethod: 'GET /farmMachinOffice?siDo={시도명}&siGunGu={시군구명}',
            manualPath: '/manuals/html/manual_data_portal_others.html',
            sourceLink: 'https://www.data.go.kr/data/15000000/openapi.do'
        },
        { 
            id: 'dp-3', 
            serviceName: '기상청_단기예보 ((구)_동네예보) 조회서비스', 
            note: '/1360000/VilageFcstInfoService_2.0', 
            active: true,
            description: '격자(5km) 단위 단기 예보 조회 (최고/최저기온, 강수확률 등)',
            usageMethod: 'GET /getVilageFcst?base_date={YYYYMMDD}&base_time={HHMM}&nx={X}&ny={Y}&dataType=JSON',
            manualPath: '/manuals/html/manual_kma_village_forecast.html',
            sourceLink: 'https://www.data.go.kr/data/15000000/openapi.do'
        },
        { 
            id: 'dp-4', 
            serviceName: '농촌진흥청_국립원예특작과학원_원예특용작물 기술정보', 
            note: '/1390804/Nihhs_TechInfo', 
            active: true,
            description: '원예/특용작물 재배 기술 및 품종 정보 조회',
            usageMethod: 'GET /Nihhs_TechInfo?cntntsNo={콘텐츠번호}',
            manualPath: '/manuals/html/manual_data_portal_others.html',
            sourceLink: 'https://www.data.go.kr/data/15000000/openapi.do'
        },
        { 
            id: 'dp-5', 
            serviceName: '농촌진흥청 국립농업과학원_농업기상 주산지 농업기상분석정보', 
            note: '/1390802/AgriWeather/WeatherObsrInfo/frcPlpd', 
            active: true,
            description: '주요 작물 주산지의 기상 분석 정보 제공',
            usageMethod: 'GET /frcPlpd?obsr_Spot_Code={관측지점코드}',
            manualPath: '/manuals/html/manual_data_portal_others.html',
            sourceLink: 'https://www.data.go.kr/data/15000000/openapi.do'
        },
        { 
            id: 'dp-6', 
            serviceName: '농촌진흥청 국립농업과학원_농업기상 기본 관측데이터 조회', 
            note: '/1390802/AgriWeather/WeatherObsrInfo/V3/GnrlWeather', 
            active: true,
            description: 'ASOS/AWS 관측소의 일별 기상 관측 데이터',
            usageMethod: 'GET /GnrlWeather?obsr_Spot_Code={지점코드}&search_Date={YYYY-MM-DD}',
            manualPath: '/manuals/html/manual_kma_village_forecast.html',
            sourceLink: 'https://www.data.go.kr/data/15000000/openapi.do'
        },
        { 
            id: 'dp-7', 
            serviceName: '한국농수산식품유통공사_전국 공영도매시장 경매황전정보', 
            note: '/B552845/katiOrigin', 
            active: true,
            description: '전국 공영 도매시장의 경매 낙찰 정보 (부류/품목/법인별)',
            usageMethod: 'GET /katiOrigin?auc_date={YYYYMMDD}',
            manualPath: '/manuals/html/manual_garak_auction.html',
            sourceLink: 'https://www.kati.net'
        },
        { 
            id: 'dp-8', 
            serviceName: '농촌진흥청 국립농업과학원_농업기상 온량지수 정보 제공', 
            note: '/1390802/AgriWeather/WeatherObsrInfo/WarmExpnnt', 
            active: true,
            description: '농작물 재배 적지 판단을 위한 온량지수 조회',
            usageMethod: 'GET /WarmExpnnt?search_Year={YYYY}',
            manualPath: '/manuals/OPEN API기술명세서_농업기상 온량지수 정보_ver1.0.hwp'
        }
    ]
  },
  {
    id: 'nongsaro',
    name: '농사로 (농촌진흥청)',
    description: '농업기술, 농자재, 병해충 등 농업 종합 정보',
    baseUrl: 'http://api.nongsaro.go.kr/service',
    apiKey: '202512319DLUHQN9LGWIOK5EFVGKQ',
    status: 'active',
    details: [
        { 
            id: 'ns-1', 
            serviceName: '공공 데이터', 
            note: '-', 
            active: true,
            description: '농사로 공공데이터 목록 조회',
            usageMethod: 'GET /publicDataList?apiKey={KEY}',
            manualPath: '/manuals/html/manual_nongsaro_general.html',
            sourceLink: 'https://www.nongsaro.go.kr/portal/ps/psn/psnj/openApiLst.ps'
        },
        // ... (Skipping full detail for all 30+ items to save space, but updating key ones)
        { 
            id: 'ns-2', serviceName: '관련 사이트 정보', note: '-', active: true, 
            description: '농업 유관 기관 및 관련 사이트 목록', usageMethod: 'GET /siteInfo?apiKey={KEY}',
            manualPath: '/manuals/html/manual_nongsaro_general.html',
            sourceLink: 'https://www.nongsaro.go.kr/portal/ps/psn/psnj/openApiLst.ps'
        },
        { id: 'ns-3', serviceName: '국내외최신연구동향', note: '-', active: true, description: '농업 관련 최신 연구 논문 및 동향', usageMethod: 'GET /researchTrend?apiKey={KEY}', manualPath: '/manuals/html/manual_nongsaro_general.html', sourceLink: 'https://www.nongsaro.go.kr/portal/ps/psn/psnj/openApiLst.ps' },
        { id: 'ns-4', serviceName: '내재해형 시설규격', note: '-', active: true, description: '비닐하우스 등 농업 시설 내재해 규격 정보', usageMethod: 'GET /disasterSpec?apiKey={KEY}', manualPath: '/manuals/html/manual_nongsaro_general.html', sourceLink: 'https://www.nongsaro.go.kr/portal/ps/psn/psnj/openApiLst.ps' },
        { id: 'ns-6', serviceName: '농사로 공통코드', note: '-', active: true, description: '농사로 API에서 사용하는 공통 코드(작물코드 등) 조회', usageMethod: 'GET /commonCode?apiKey={KEY}', manualPath: '/manuals/CommonCode_Guide.docx', sourceLink: 'https://www.nongsaro.go.kr/portal/ps/psn/psnj/openApiLst.ps' },
        { 
            id: 'ns-37', serviceName: '품종 정보', note: '-', active: true, 
            description: '국내 육성 품종 상세 특성 정보', 
            usageMethod: 'GET /varietyInfo?apiKey={KEY}&serviceType=XML&sVarietyNm={품종명}',
            manualPath: '/manuals/html/manual_nongsaro_variety.html',
            sourceLink: 'https://www.nongsaro.go.kr/portal/ps/psn/psnj/openApiLst.ps?menuId=PS03954'
        },
        // Apply generic default to others
        { id: 'ns-5', serviceName: '농기계 구입정보', note: '-', active: true, description: '농기계 가격 및 구입처 정보', usageMethod: 'GET /farmMachinery?apiKey={KEY}', manualPath: '/manuals/html/manual_nongsaro_general.html', sourceLink: 'https://www.nongsaro.go.kr/portal/ps/psn/psnj/openApiLst.ps' },
        { id: 'ns-7', serviceName: '농식품부산물영양정보', note: '-', active: true, description: '-', usageMethod: 'apiKey={KEY}', manualPath: '/manuals/html/manual_nongsaro_general.html', sourceLink: 'https://www.nongsaro.go.kr/portal/ps/psn/psnj/openApiLst.ps' },
        { id: 'ns-8', serviceName: '농약 품질검사', note: '-', active: true, description: '-', usageMethod: 'apiKey={KEY}', manualPath: '/manuals/html/manual_nongsaro_general.html', sourceLink: 'https://www.nongsaro.go.kr/portal/ps/psn/psnj/openApiLst.ps' },
        { id: 'ns-9', serviceName: '농약등록현황', note: '-', active: true, description: '-', usageMethod: 'apiKey={KEY}', manualPath: '/manuals/html/manual_nongsaro_general.html', sourceLink: 'https://www.nongsaro.go.kr/portal/ps/psn/psnj/openApiLst.ps' },
        { id: 'ns-10', serviceName: '농약판매가격', note: '-', active: true, description: '-', usageMethod: 'apiKey={KEY}', manualPath: '/manuals/html/manual_nongsaro_general.html', sourceLink: 'https://www.nongsaro.go.kr/portal/ps/psn/psnj/openApiLst.ps' },
        { id: 'ns-11', serviceName: '농업과학기술 정책자료', note: '-', active: true, description: '-', usageMethod: 'apiKey={KEY}', manualPath: '/manuals/html/manual_nongsaro_general.html', sourceLink: 'https://www.nongsaro.go.kr/portal/ps/psn/psnj/openApiLst.ps' },
        { id: 'ns-12', serviceName: '농업기술 더하기 나누기', note: '-', active: true, description: '-', usageMethod: 'apiKey={KEY}', manualPath: '/manuals/html/manual_nongsaro_general.html', sourceLink: 'https://www.nongsaro.go.kr/portal/ps/psn/psnj/openApiLst.ps' },
        { id: 'ns-13', serviceName: '농자재관련법령', note: '-', active: true, description: '-', usageMethod: 'apiKey={KEY}', manualPath: '/manuals/html/manual_nongsaro_general.html', sourceLink: 'https://www.nongsaro.go.kr/portal/ps/psn/psnj/openApiLst.ps' },
        { id: 'ns-14', serviceName: '농작물재해예방정보', note: '-', active: true, description: '-', usageMethod: 'apiKey={KEY}', manualPath: '/manuals/html/manual_nongsaro_general.html', sourceLink: 'https://www.nongsaro.go.kr/portal/ps/psn/psnj/openApiLst.ps' },
        { id: 'ns-15', serviceName: '농작업일정 정보', note: '-', active: true, description: '-', usageMethod: 'apiKey={KEY}', manualPath: '/manuals/html/manual_nongsaro_general.html', sourceLink: 'https://www.nongsaro.go.kr/portal/ps/psn/psnj/openApiLst.ps' },
        { id: 'ns-16', serviceName: '농축산물소득정보', note: '-', active: true, description: '-', usageMethod: 'apiKey={KEY}', manualPath: '/manuals/html/manual_nongsaro_general.html', sourceLink: 'https://www.nongsaro.go.kr/portal/ps/psn/psnj/openApiLst.ps' },
        { id: 'ns-17', serviceName: '비료 품질검사', note: '-', active: true, description: '-', usageMethod: 'apiKey={KEY}', manualPath: '/manuals/html/manual_nongsaro_general.html', sourceLink: 'https://www.nongsaro.go.kr/portal/ps/psn/psnj/openApiLst.ps' },
        { id: 'ns-18', serviceName: '수출농업 동향자료', note: '-', active: true, description: '-', usageMethod: 'apiKey={KEY}', manualPath: '/manuals/html/manual_nongsaro_general.html', sourceLink: 'https://www.nongsaro.go.kr/portal/ps/psn/psnj/openApiLst.ps' },
        { id: 'ns-19', serviceName: '수출농업 발간도서', note: '-', active: true, description: '-', usageMethod: 'apiKey={KEY}', manualPath: '/manuals/html/manual_nongsaro_general.html', sourceLink: 'https://www.nongsaro.go.kr/portal/ps/psn/psnj/openApiLst.ps' },
        { id: 'ns-20', serviceName: '수출농업 종합컨설팅', note: '-', active: true, description: '-', usageMethod: 'apiKey={KEY}', manualPath: '/manuals/html/manual_nongsaro_general.html', sourceLink: 'https://www.nongsaro.go.kr/portal/ps/psn/psnj/openApiLst.ps' },
        { id: 'ns-21', serviceName: '시설설계도 참고용', note: '-', active: true, description: '-', usageMethod: 'apiKey={KEY}', manualPath: '/manuals/html/manual_nongsaro_general.html', sourceLink: 'https://www.nongsaro.go.kr/portal/ps/psn/psnj/openApiLst.ps' },
        { id: 'ns-22', serviceName: '시설표준설계도 설계지원프로그램 다운로드 이력', note: '-', active: true, description: '-', usageMethod: 'apiKey={KEY}', manualPath: '/manuals/html/manual_nongsaro_general.html', sourceLink: 'https://www.nongsaro.go.kr/portal/ps/psn/psnj/openApiLst.ps' },
        { id: 'ns-23', serviceName: '신기술 농업기계 지정현황', note: '-', active: true, description: '-', usageMethod: 'apiKey={KEY}', manualPath: '/manuals/html/manual_nongsaro_general.html', sourceLink: 'https://www.nongsaro.go.kr/portal/ps/psn/psnj/openApiLst.ps' },
        { id: 'ns-24', serviceName: '원클릭 농업기술', note: '-', active: true, description: '-', usageMethod: 'apiKey={KEY}', manualPath: '/manuals/html/manual_nongsaro_general.html', sourceLink: 'https://www.nongsaro.go.kr/portal/ps/psn/psnj/openApiLst.ps' },
        { id: 'ns-25', serviceName: '유관기관안내', note: '-', active: true, description: '-', usageMethod: 'apiKey={KEY}', manualPath: '/manuals/html/manual_nongsaro_general.html', sourceLink: 'https://www.nongsaro.go.kr/portal/ps/psn/psnj/openApiLst.ps' },
        { id: 'ns-26', serviceName: '이달의 농업기술', note: '-', active: true, description: '-', usageMethod: 'apiKey={KEY}', manualPath: '/manuals/html/manual_nongsaro_general.html', sourceLink: 'https://www.nongsaro.go.kr/portal/ps/psn/psnj/openApiLst.ps' },
        { id: 'ns-27', serviceName: '작목별농업기술정보', note: '-', active: true, description: '-', usageMethod: 'apiKey={KEY}', manualPath: '/manuals/html/manual_nongsaro_general.html', sourceLink: 'https://www.nongsaro.go.kr/portal/ps/psn/psnj/openApiLst.ps' },
        { id: 'ns-28', serviceName: '주간농사정보', note: '-', active: true, description: '-', usageMethod: 'apiKey={KEY}', manualPath: '/manuals/html/manual_nongsaro_general.html', sourceLink: 'https://www.nongsaro.go.kr/portal/ps/psn/psnj/openApiLst.ps' },
        { id: 'ns-29', serviceName: '지역 브랜드', note: '-', active: true, description: '-', usageMethod: 'apiKey={KEY}', manualPath: '/manuals/html/manual_nongsaro_general.html', sourceLink: 'https://www.nongsaro.go.kr/portal/ps/psn/psnj/openApiLst.ps' },
        { id: 'ns-30', serviceName: '지역특산물', note: '-', active: true, description: '-', usageMethod: 'apiKey={KEY}', manualPath: '/manuals/html/manual_nongsaro_general.html', sourceLink: 'https://www.nongsaro.go.kr/portal/ps/psn/psnj/openApiLst.ps' },
        { id: 'ns-31', serviceName: '전적활용기술', note: '-', active: true, description: '-', usageMethod: 'apiKey={KEY}', manualPath: '/manuals/html/manual_nongsaro_general.html', sourceLink: 'https://www.nongsaro.go.kr/portal/ps/psn/psnj/openApiLst.ps' },
        { id: 'ns-32', serviceName: '첨단농업기술', note: '-', active: true, description: '-', usageMethod: 'apiKey={KEY}', manualPath: '/manuals/html/manual_nongsaro_general.html', sourceLink: 'https://www.nongsaro.go.kr/portal/ps/psn/psnj/openApiLst.ps' },
        { id: 'ns-33', serviceName: '최신 생산 경영 기술', note: '-', active: true, description: '-', usageMethod: 'apiKey={KEY}', manualPath: '/manuals/html/manual_nongsaro_general.html', sourceLink: 'https://www.nongsaro.go.kr/portal/ps/psn/psnj/openApiLst.ps' },
        { id: 'ns-34', serviceName: '최신 유기농업 기술', note: '-', active: true, description: '-', usageMethod: 'apiKey={KEY}', manualPath: '/manuals/html/manual_nongsaro_general.html', sourceLink: 'https://www.nongsaro.go.kr/portal/ps/psn/psnj/openApiLst.ps' },
        { id: 'ns-35', serviceName: '토마토재배시설 평가하기', note: '-', active: true, description: '-', usageMethod: 'apiKey={KEY}', manualPath: '/manuals/html/manual_nongsaro_general.html', sourceLink: 'https://www.nongsaro.go.kr/portal/ps/psn/psnj/openApiLst.ps' },
        { id: 'ns-36', serviceName: '품목별 관리메뉴얼', note: '-', active: true, description: '-', usageMethod: 'apiKey={KEY}', manualPath: '/manuals/html/manual_nongsaro_general.html', sourceLink: 'https://www.nongsaro.go.kr/portal/ps/psn/psnj/openApiLst.ps' },
        { id: 'ns-38', serviceName: '품종정보출원 등록정보', note: '-', active: true, description: '-', usageMethod: 'apiKey={KEY}' }
    ]
  },
  {
    id: 'kamis',
    name: 'KAMIS (농산물유통정보)',
    description: '일일 도소매 가격 및 평년 가격 조회',
    baseUrl: 'https://www.kamis.co.kr/service',
    apiKey: 'e1649e0e-079c-40ca-acb3-aab69df21f7b',
    subKey: '7036',
    subKeyLabel: '인증 ID (Cert ID)',
    status: 'active',
    details: [
        { 
            id: 'km-1', 
            serviceName: '일별 부류별 도.소매가격정보', 
            note: '/price/d/periodProductList.do', 
            active: true,
            description: '최근 일자별 도/소매 가격 추이 조회 (최대 1개월)',
            usageMethod: 'GET /periodProductList.do?cert_key={KEY}&cert_id={ID}&p_product_cls_code=02(도매)',
            manualPath: '/manuals/html/manual_kamis_daily_price.html',
            sourceLink: 'https://www.kamis.or.kr/customer/reference/openapi_list.do'
        },
        { 
            id: 'km-2', 
            serviceName: '월별 부류별 도.소매가격정보', 
            note: '/price/d/monthlyProductList.do', 
            active: true,
            description: '월 단위 도/소매 가격 추이 조회',
            usageMethod: 'GET /monthlyProductList.do?cert_key={KEY}&cert_id={ID}&p_yyyy={YYYY}' 
        }
    ]
  },
  {
    id: 'garak',
    name: '서울시농수산식품공사 (가락시장)',
    description: '실시간 경락 가격 및 반입 물량 (ID: 5775)',
    baseUrl: 'http://www.garak.co.kr/homepage/publicdata',
    apiKey: '*suoho1004',
    subKey: '5775',
    subKeyLabel: '요청자 ID',
    status: 'active',
    details: [
        { 
            id: 'gr-1', 
            serviceName: '(신)유통정보 - 품목별등급별가격', 
            note: '/dataXmlOpen.do?id=5775', 
            active: true,
            description: '실시간 경매 낙찰 결과 (품목/등급별)',
            usageMethod: 'GET /dataXmlOpen.do?id={ID}&passwd={PW}&searchDate={YYYYMMDD}',
            manualPath: '/manuals/html/manual_garak_auction.html',
            sourceLink: 'http://www.garak.co.kr/homepage/publicdata/dataOpen.do'
        },
        { 
            id: 'gr-2', 
            serviceName: '전자경매 체결내역', 
            note: '/dataJsonOpen.do?id=5775', 
            active: true,
            description: '전자 경매를 통해 체결된 승인 내역 조회',
            usageMethod: 'GET /dataJsonOpen.do?id={ID}&passwd={PW}&searchDate={YYYYMMDD}&pageNo={N}' 
        }
    ]
  },
  {
    id: 'ncpms',
    name: 'NCPMS (국가농작물병해충관리시스템)',
    description: '병해충 예측/예찰 및 도감 정보',
    baseUrl: 'http://ncpms.rda.go.kr/npmsapi',
    apiKey: '20259f2e18caa7a96f5e0df70a4a6fc9b121',
    status: 'active',
    details: [
        { 
            id: 'nc-1', 
            serviceName: '병해충 검색/상세조회', 
            note: '/sicknsInfoList', 
            active: true,
            description: '병해충 도감 검색 및 상세 정보 (방제법 등)',
            usageMethod: 'GET /sicknsInfoList?apiKey={KEY}&sicknsNm={병해충명}',
            manualPath: '/manuals/html/manual_ncpms_pest.html' 
        },
        { 
            id: 'nc-2', 
            serviceName: '병해충 예측정보', 
            note: '/dbyhsForeList', 
            active: true,
            description: '기상 데이터 기반 병해충 발생 예측 정보',
            usageMethod: 'GET /dbyhsForeList?apiKey={KEY}&sidoCode={시도코드}' 
        }
    ]
  }
];

export function ApiManager() {
  const [configs, setConfigs] = useState<ApiConfig[]>([]);
  const [showKeys, setShowKeys] = useState<Record<string, boolean>>({});
  const [expandedService, setExpandedService] = useState<string | null>(null); // For detailed edit view

  // Load from Storage or Force Refresh with V5 (Schema Update)
  useEffect(() => {
    // Force reset to apply new manual paths
    const stored = localStorage.getItem('api_configs_v6'); 
    if (stored) {
      setConfigs(JSON.parse(stored));
    } else {
      setConfigs(DEFAULT_APIS);
    }
  }, []);

  const handleSave = () => {
    localStorage.setItem('api_configs_v6', JSON.stringify(configs));
    alert('API 설정(상세 정보 포함)이 안전하게 저장되었습니다.');
  };

  const handleChange = (id: string, field: keyof ApiConfig, value: string) => {
    setConfigs(prev => prev.map(c => c.id === id ? { ...c, [field]: value } : c));
  };

  const toggleShowKey = (id: string) => {
    setShowKeys(prev => ({ ...prev, [id]: !prev[id] }));
  };

  // --- Service Management Handlers ---
  const handleServiceChange = (configId: string, serviceId: string, field: keyof ApiDetails, value: string | boolean) => {
      setConfigs(prev => prev.map(c => {
          if (c.id !== configId) return c;
          return {
              ...c,
              details: c.details.map(d => d.id === serviceId ? { ...d, [field]: value } : d)
          };
      }));
  };

  const addService = (configId: string) => {
      setConfigs(prev => prev.map(c => {
          if (c.id !== configId) return c;
          return {
              ...c,
              details: [...c.details, { 
                  id: generateId(), 
                  serviceName: '신규 서비스', 
                  note: '', 
                  active: true 
              }]
          };
      }));
  };

  const deleteService = (configId: string, serviceId: string) => {
      if (!confirm('정말로 이 서비스 항목을 삭제하시겠습니까?')) return;
      setConfigs(prev => prev.map(c => {
          if (c.id !== configId) return c;
          return {
              ...c,
              details: c.details.filter(d => d.id !== serviceId)
          };
      }));
  };

  const toggleExpandService = (id: string) => {
      setExpandedService(prev => prev === id ? null : id);
  };
  // -----------------------------------

  const testConnection = (config: ApiConfig, service?: ApiDetails) => {
    // Determine which key/url to use
    const effectiveBaseUrl = service?.baseUrl || config.baseUrl;
    const effectiveKey = service?.apiKey || config.apiKey;

    // Mock Test Logic
    console.log(`Testing Connection to ${effectiveBaseUrl} with Key: ${effectiveKey?.substring(0, 5)}...`);
    
    setConfigs(prev => prev.map(c => {
        if (c.id === config.id) {
            const isSuccess = Math.random() > 0.1; 
            return { 
                ...c, 
                status: isSuccess ? 'active' : 'error' 
            };
        }
        return c;
    }));
    alert(`연결 테스트 완료 (Mock)\nTarget: ${effectiveBaseUrl}`);
  };

  // File Save Picker Implementation
  const handleDownload = async (url: string, defaultName: string) => {
      try {
          // 1. Fetch the file content
          const response = await fetch(url);
          if (!response.ok) throw new Error('파일을 불러오는데 실패했습니다.');
          const blob = await response.blob();

          // 2. Check for File System Access API support
          if ('showSaveFilePicker' in window) {
              const handle = await (window as any).showSaveFilePicker({
                  suggestedName: defaultName,
                  types: [{
                      description: 'HTML Document',
                      accept: { 'text/html': ['.html'] },
                  }],
              });
              const writable = await handle.createWritable();
              await writable.write(blob);
              await writable.close();
          } else {
              // Fallback for unsupported browsers
              const a = document.createElement('a');
              a.href = URL.createObjectURL(blob);
              a.download = defaultName;
              document.body.appendChild(a);
              a.click();
              document.body.removeChild(a);
              URL.revokeObjectURL(a.href);
          }
      } catch (error) {
          console.error('Download failed:', error);
          if ((error as Error).name !== 'AbortError') {
             alert('다운로드 중 오류가 발생했습니다: ' + error);
          }
      }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <Key className="h-6 w-6 text-indigo-600"/>
            API 키 및 서비스 정밀 관리
          </h1>
          <p className="text-slate-500 mt-1">
              서비스별 URL/인증키를 독립적으로 설정하고, 데이터 관리 방법과 상세 내용을 기록할 수 있습니다.
          </p>
        </div>
        <Button onClick={handleSave} className="bg-indigo-600 hover:bg-indigo-700">
            <Save className="mr-2 h-4 w-4"/> 변경사항 저장
        </Button>
      </div>

      <div className="grid gap-6">
        {configs.map((api) => (
          <Card key={api.id} className="border-l-4 border-l-slate-300 data-[status=active]:border-l-green-500 data-[status=error]:border-l-red-500" data-status={api.status}>
            <CardHeader className="pb-4">
              <div className="flex justify-between items-start">
                <div>
                   <CardTitle className="text-lg font-bold flex items-center gap-2">
                      {api.name}
                      {api.status === 'active' && <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800"><CheckCircle2 className="w-3 h-3 mr-1"/> 정상</span>}
                      {api.status === 'error' && <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-800"><AlertCircle className="w-3 h-3 mr-1"/> 오류</span>}
                   </CardTitle>
                   <CardDescription>{api.description}</CardDescription>
                </div>
                <Button variant="outline" size="sm" onClick={() => testConnection(api)}>
                    <RefreshCw className="mr-2 h-3.5 w-3.5"/> 공통 연결 테스트
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
               {/* Global Inputs */}
               <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-50 p-4 rounded-lg border">
                   <div className="space-y-2">
                       <Label className="text-xs font-semibold text-slate-500">기본 Base URL</Label>
                       <Input 
                            value={api.baseUrl} 
                            onChange={(e) => handleChange(api.id, 'baseUrl', e.target.value)}
                            className="font-mono text-sm bg-white"
                        />
                   </div>
                   
                   <div className="space-y-2">
                       <Label className="text-xs font-semibold text-slate-500">
                           {api.id === 'garak' ? '기본 비밀번호' : '기본 API 인증키'}
                       </Label>
                       <div className="relative">
                            <Input 
                                    type={showKeys[api.id] ? "text" : "password"}
                                    value={api.apiKey} 
                                    onChange={(e) => handleChange(api.id, 'apiKey', e.target.value)}
                                    className="font-mono text-sm pr-10 bg-white"
                                />
                            <button 
                                type="button" 
                                onClick={() => toggleShowKey(api.id)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                            >
                                {showKeys[api.id] ? <EyeOff className="h-4 w-4"/> : <Eye className="h-4 w-4"/>}
                            </button>
                       </div>
                   </div>
               </div>

               {/* Service Management Table */}
               <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="item-1" className="border-b-0">
                    <AccordionTrigger className="py-2 text-sm font-medium text-slate-600 hover:text-indigo-600 hover:no-underline">
                        <span className="flex items-center gap-2">
                            <Power className="h-4 w-4"/> 상세 서비스 목록 및 개별 설정 (Service Config)
                        </span>
                    </AccordionTrigger>
                    <AccordionContent>
                        <div className="rounded-md border bg-white overflow-hidden">
                            {api.details.map((detail) => (
                                <div key={detail.id} className={`border-b last:border-0 ${detail.active ? '' : 'bg-slate-50 opacity-80'}`}>
                                    {/* Summary Row */}
                                    <div className="flex items-center gap-2 p-3 hover:bg-slate-50 transition-colors">
                                        <Switch 
                                            checked={detail.active} 
                                            onCheckedChange={(checked) => handleServiceChange(api.id, detail.id, 'active', checked)}
                                        />
                                        <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-2">
                                            <Input 
                                                value={detail.serviceName} 
                                                onChange={(e) => handleServiceChange(api.id, detail.id, 'serviceName', e.target.value)}
                                                className={`h-8 text-sm border-transparent hover:border-slate-200 focus:border-indigo-500 ${detail.active ? 'font-bold text-slate-800' : 'text-slate-400'}`}
                                                placeholder="서비스명"
                                            />
                                            <div className="flex items-center gap-2">
                                                <Input 
                                                    value={detail.note} 
                                                    onChange={(e) => handleServiceChange(api.id, detail.id, 'note', e.target.value)}
                                                    className="h-8 text-xs font-mono text-slate-500 border-transparent hover:border-slate-200 focus:border-indigo-500"
                                                    placeholder="Endpoint (Overview)"
                                                />
                                                {detail.manualPath && (
                                                    <button 
                                                        onClick={() => handleDownload(detail.manualPath!, detail.manualPath!.split('/').pop() || 'manual.html')}
                                                        className="inline-flex items-center justify-center h-8 w-8 rounded-md hover:bg-slate-100 text-slate-400 hover:text-indigo-600 transition-colors"
                                                        title="매뉴얼 다운로드 (저장 위치 확인)"
                                                    >
                                                        <BookOpen className="h-4 w-4"/>
                                                    </button>
                                                )}
                                                <Button 
                                                    variant="ghost" 
                                                    size="sm" 
                                                    className="h-8 text-xs text-indigo-600"
                                                    onClick={() => toggleExpandService(detail.id)}
                                                >
                                                    {expandedService === detail.id ? '설정 닫기' : '상세 설정'}
                                                </Button>
                                                <Button 
                                                    variant="ghost" 
                                                    size="icon" 
                                                    className="h-8 w-8 text-slate-400 hover:text-red-600"
                                                    onClick={() => deleteService(api.id, detail.id)}
                                                >
                                                    <Trash2 className="h-4 w-4"/>
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    {/* Expanded Detail Config */}
                                    {expandedService === detail.id && (
                                        <div className="p-4 bg-indigo-50/50 space-y-3 border-t border-indigo-100 animate-in slide-in-from-top-2">
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div className="space-y-1">
                                                    <Label className="text-xs text-indigo-800">개별 Base URL (미입력 시 기본값 사용)</Label>
                                                    <Input 
                                                        value={detail.baseUrl || ''} 
                                                        onChange={(e) => handleServiceChange(api.id, detail.id, 'baseUrl', e.target.value)}
                                                        className="h-8 text-xs bg-white" 
                                                        placeholder={api.baseUrl}
                                                    />
                                                </div>
                                                <div className="space-y-1">
                                                    <Label className="text-xs text-indigo-800">개별 API Key (미입력 시 기본값 사용)</Label>
                                                    <Input 
                                                        value={detail.apiKey || ''} 
                                                        onChange={(e) => handleServiceChange(api.id, detail.id, 'apiKey', e.target.value)}
                                                        className="h-8 text-xs bg-white" 
                                                        placeholder={api.apiKey ? '기본값 사용 중' : '개별 키 입력'}
                                                    />
                                                </div>
                                            </div>
                                            <div className="space-y-1">
                                                <Label className="text-xs text-slate-600">서비스 상세 설명 (Content Description)</Label>
                                                <Input 
                                                    value={detail.description || ''} 
                                                    onChange={(e) => handleServiceChange(api.id, detail.id, 'description', e.target.value)}
                                                    className="h-8 text-xs bg-white" 
                                                    placeholder="서비스의 주요 내용이나 용도를 기록하세요."
                                                />
                                            </div>
                                            <div className="space-y-1">
                                                <Label className="text-xs text-slate-600">데이터 요청/관리 방법 (Methodology)</Label>
                                                <Input 
                                                    value={detail.usageMethod || ''} 
                                                    onChange={(e) => handleServiceChange(api.id, detail.id, 'usageMethod', e.target.value)}
                                                    className="h-8 text-xs bg-white" 
                                                    placeholder="예: 필수 파라미터(date, code), 응답 포맷(JSON) 등"
                                                />
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ))}
                            <div className="p-2 text-center bg-slate-50 border-t">
                                <Button variant="outline" size="sm" onClick={() => addService(api.id)} className="w-full border-dashed text-slate-500 hover:text-indigo-600 hover:border-indigo-300">
                                    <Plus className="mr-2 h-3.5 w-3.5"/> 신규 서비스 추가 (개별 설정 가능)
                                </Button>
                            </div>
                        </div>
                    </AccordionContent>
                </AccordionItem>
               </Accordion>

            </CardContent>
          </Card>
        ))}
      </div>


      {/* Comprehensive Manual Download - Fixed Floating Button */}
      <div className="fixed bottom-24 right-6 z-50 animate-in slide-in-from-bottom-5">
          <button 
              onClick={() => handleDownload('/manuals/html/comprehensive_api_manual.html', '통합_API_기술매뉴얼_kor_v1.0.html')}
              className="flex items-center gap-3 px-5 py-3 bg-slate-900/95 backdrop-blur-sm text-white rounded-full shadow-2xl hover:bg-indigo-600 transition-all border border-white/10 group cursor-pointer"
          >
              <div className="p-1 bg-white/10 rounded-full group-hover:bg-white/20 transition-colors">
                 <FileText className="h-5 w-5"/>
              </div>
              <div className="flex flex-col items-start">
                  <span className="text-sm font-bold">통합 기술 매뉴얼 다운로드 (Save As)</span>
                  <span className="text-[10px] text-slate-300">v1.0 (2026.01.04) Latest</span>
              </div>
          </button>
      </div>
    </div>
  );
}
