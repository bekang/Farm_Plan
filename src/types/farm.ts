// Force update
export interface Field {
  id: string | number;
  name: string;
  location: string; // Legacy string, keep for compatibility or auto-generate from address
  addressStr?: string; // Full address string
  latitude?: number;
  longitude?: number;
  area: number; // in pyeong

  // Detailed Location
  address: {
    province: string;
    city: string;
    town: string;
  };

  // Facility & Environment Specs
  facilityType:
    | 'open_field'
    | 'vinyl_single'
    | 'vinyl_multi'
    | 'vinyl_greenhouse'
    | 'glass_greenhouse'
    | 'noji'
    | 'glass';
  cultivationMethod: 'soil' | 'hydroponics' | 'pot' | 'dft' | 'substrate' | 'nft' | 'aeroponics';
  cultivationDetail?: string; // e.g. "sandy_loam", "cocopeat"

  waterSource?: string;
  hasGutter?: boolean;
  isDisasterResilient?: boolean;
  isMiniTunnel?: boolean; // Added per user request

  // Detailed Specs (Expanded)
  specs: {
    // Dimensions for Heating Load
    width?: number;        // m
    length?: number;       // m
    eaveHeight?: number;   // m (측고)
    ridgeHeight?: number;  // m (동고)
    
    // Coverings & Insulation
    roofCovering?: string; // e.g. 'po_0_1', 'glass_4mm'
    sideCovering?: string;
    roofInsulation?: string;
    sideInsulation?: string;
    floorType?: 'soil' | 'concrete' | 'mulching'; // 바닥 피복

    // Automation & Vents
    ventType?: 'rack_pinion' | 'roll_up' | 'none';
    isSideVentAutomatic?: boolean;
    isRoofVentAutomatic?: boolean;
    
    // Efficiency
    aisleWidth?: number;   // cm or m
    hasPipeRail?: boolean; // 파이프 레일 유무
    height?: string; // UI binding (low/medium/high)
    coolingType?: string; // e.g. 'pad_fan', 'fog', 'none'
  };

  // Equipment Assets
  equipment: {
    controller?: boolean;
    irrigation?: boolean;
    cctv?: boolean;
    heating?: boolean;
    autoCurtain?: boolean; // Motorized
    co2?: boolean; // Generator/Supply
    flowFan?: boolean; 
    mist?: boolean;
  };

  // Sensors & Measuring Devices
  sensors?: {
    weatherStation?: boolean; // 외부 기상대
    tempHum?: boolean;        // 온습도 센서
    co2?: boolean;            // CO2 센서
    soilMoisture?: boolean;   // 토양/배지 수분 센서
    substrateScale?: boolean; // 배지 중량 센서 (Substrate Scale)
    nutrient?: boolean;       // 배양액(EC/pH) 센서
    drainage?: boolean;       // 배액량/배액EC/pH 센서
  };

  // Scientific History Data (Expanded Analysis)
  history?: {
    soil: Array<{
      id: string;
      date: string;
      ph: number;
      ec: number;
      om?: number; // Organic Matter
      // Macros
      no3_n?: number;
      nh4_n?: number;
      p2o5?: number; // P
      k2o?: number;  // K
      cao?: number;  // Ca
      mgo?: number;  // Mg
      // Micros
      fe?: number;
      mn?: number;
      zn?: number;
      cu?: number;
      b?: number;
      mo?: number;
    }>;
    water: Array<{
      id: string;
      date: string;
      ph: number;
      ec: number;
      // Detailed Ions
      no3_n?: number;
      nh4_n?: number;
      h2po4?: number; // P
      k?: number;
      ca?: number;
      mg?: number;
      so4?: number; // S
      fe?: number;
      mn?: number;
      zn?: number;
      cu?: number;
      b?: number;
      mo?: number;
      na?: number;
      cl?: number;
      hco3?: number;
    }>;
  };

  description?: string;
  registeredAt: string;
}

export interface CropPlan {
  id: string;
  fieldId: string;
  cropName: string;
  variety?: string; // e.g. "Seolhyang" for Strawberry

  plantingDate: string;
  expectedHarvestDate: string;

  status: 'planned' | 'growing' | 'harvested' | 'cancelled';

  // Expected Financials (Snapshot at planning)
  targetYield: number; // Wizard output (kg) - mapped to expectedYield
  targetPrice: number; // Wizard output (won/kg)

  expectedYield: number; // Calculated or same as target
  expectedRevenue: number;
  expectedCost: number;

  // Advanced Planning Details
  cultivationMethod?: 'seeding' | 'transplanting';
  includeSoilPrep?: boolean; // 14 days pre-work
}

export interface FinancialLog {
  id: string;
  fieldId: string;
  planId?: string; // Optional (Expense can be field-general)

  date: string;
  type: 'income' | 'expense';
  category: string; // e.g. "Seed", "Fertilizer", "Labor", "Sales"
  amount: number;
  memo?: string;
}

export interface UserMachine {
  id: string;
  name: string; // "Tractor 50HP"
  type: string; // "tractor", "transplanter"
  purchaseDate: string;
  purchasePrice: number;
  description?: string;
}
