import { format, addDays } from 'date-fns';
import { SimulationConfigService } from './simulationConfigService';
import { ClimateService } from './climateService';

export interface CropGrowthData {
  name: string;
  daysToMaturity: number;
  baseYieldPerPyeong: number;
  standardCostPerPyeong: number; // Standard management cost (excluding energy)
  laborHoursPerPyeong: number;
  optimalTemp: { min: number; max: number }; // Growth optimal temp range
  criticalLowTemp: number; // Temp below which heating is mandatory or damage occurs
  optimalPH?: { min: number; max: number }; // Added pH range
  relatedMachines?: string[]; // Added specific machines
}

// Mock Database of Crop Info (Ref: RDA Agricultural Guide)
const CROP_DATA: Record<string, CropGrowthData> = {
  '한지형 마늘': {
    name: '한지형 마늘',
    daysToMaturity: 240,
    baseYieldPerPyeong: 4.5,
    standardCostPerPyeong: 15000,
    laborHoursPerPyeong: 0.6,
    optimalTemp: { min: 15, max: 20 },
    criticalLowTemp: -7,
    optimalPH: { min: 6.0, max: 7.0 },
    relatedMachines: ['tractor', 'rotary', 'mulcher'],
  },
  '배추 (가을)': {
    name: '배추 (가을)',
    daysToMaturity: 80,
    baseYieldPerPyeong: 35,
    standardCostPerPyeong: 8000,
    laborHoursPerPyeong: 0.3,
    optimalTemp: { min: 18, max: 21 },
    criticalLowTemp: 4,
    optimalPH: { min: 6.0, max: 6.8 },
    relatedMachines: ['tractor', 'transplanter'],
  },
  '노지 고추': {
    name: '노지 고추',
    daysToMaturity: 150,
    baseYieldPerPyeong: 8,
    standardCostPerPyeong: 12000,
    laborHoursPerPyeong: 0.8,
    optimalTemp: { min: 25, max: 28 },
    criticalLowTemp: 10,
    optimalPH: { min: 6.0, max: 6.5 },
    relatedMachines: ['tractor', 'transplanter', 'dryer'],
  },
  '봄 감자': {
    name: '봄 감자',
    daysToMaturity: 100,
    baseYieldPerPyeong: 25,
    standardCostPerPyeong: 10000,
    laborHoursPerPyeong: 0.4,
    optimalTemp: { min: 18, max: 23 },
    criticalLowTemp: 5,
    optimalPH: { min: 5.0, max: 6.0 }, // Acidic soil preferred for potato (scab prevention)
    relatedMachines: ['tractor', 'potato_planter', 'potato_harvester'],
  },
  '콩 (서리태)': {
    name: '콩 (서리태)',
    daysToMaturity: 130,
    baseYieldPerPyeong: 0.8,
    standardCostPerPyeong: 5000,
    laborHoursPerPyeong: 0.2,
    optimalTemp: { min: 20, max: 25 },
    criticalLowTemp: 10,
    optimalPH: { min: 6.0, max: 7.0 },
    relatedMachines: ['tractor', 'seeder', 'combine_harvester', 'thresher'],
  },
  고구마: {
    name: '고구마',
    daysToMaturity: 120,
    baseYieldPerPyeong: 15,
    standardCostPerPyeong: 9000,
    laborHoursPerPyeong: 0.4,
    optimalTemp: { min: 22, max: 28 },
    criticalLowTemp: 15,
    relatedMachines: ['tractor', 'sweet_potato_harvester'],
  },
  양파: {
    name: '양파',
    daysToMaturity: 230,
    baseYieldPerPyeong: 22,
    standardCostPerPyeong: 14000,
    laborHoursPerPyeong: 0.5,
    optimalTemp: { min: 15, max: 20 },
    criticalLowTemp: -5,
    relatedMachines: ['tractor', 'onion_transplanter', 'onion_harvester'],
  },
  대파: {
    name: '대파',
    daysToMaturity: 180,
    baseYieldPerPyeong: 12,
    standardCostPerPyeong: 11000,
    laborHoursPerPyeong: 0.5,
    optimalTemp: { min: 15, max: 20 },
    criticalLowTemp: 0,
    relatedMachines: ['tractor', 'transplanter'],
  },
  토마토: {
    name: '토마토',
    daysToMaturity: 100,
    baseYieldPerPyeong: 20,
    standardCostPerPyeong: 18000,
    laborHoursPerPyeong: 1.5,
    optimalTemp: { min: 21, max: 25 },
    criticalLowTemp: 10,
    optimalPH: { min: 6.0, max: 6.5 },
  },
  딸기: {
    name: '딸기',
    daysToMaturity: 150,
    baseYieldPerPyeong: 12,
    standardCostPerPyeong: 20000,
    laborHoursPerPyeong: 2.0,
    optimalTemp: { min: 17, max: 23 },
    criticalLowTemp: 5,
    optimalPH: { min: 5.5, max: 6.5 },
  },
  감귤: {
    name: '감귤',
    daysToMaturity: 180,
    baseYieldPerPyeong: 15,
    standardCostPerPyeong: 15000,
    laborHoursPerPyeong: 1.0,
    optimalTemp: { min: 20, max: 25 },
    criticalLowTemp: 3,
  },
};

export class YieldService {
  /**
   * Get crop growth info
   */
  static getCropInfo(cropName: string): CropGrowthData | undefined {
    // Simple fuzzy match or exact match
    return CROP_DATA[cropName] || Object.values(CROP_DATA).find((c) => cropName.includes(c.name));
  }

  /**
   * Get available machines for a crop
   */
  static getCropMachines(cropName: string): string[] {
    const crop = this.getCropInfo(cropName);
    return crop?.relatedMachines || ['tractor'];
  }

  /**
   * Calculate expected harvest date
   */
  static calculateHarvestDate(
    plantingDate: string,
    cropName: string,
    facilityType: string,
    location: string,
    specs?: any,
  ): string {
    const crop = this.getCropInfo(cropName);
    if (!crop) return '';

    const config = SimulationConfigService.getConfig();
    let days = crop.daysToMaturity;

    // 1. Facility Factor
    if (facilityType === 'greenhouse' || facilityType === 'single_greenhouse') {
      days = days * config.date_reduction.greenhouse_factor;
    } else if (facilityType === 'smart_farm' || facilityType === 'glass_greenhouse') {
      days = days * config.date_reduction.smart_farm_factor;
    }

    // 2. Detailed Specs Adjustment
    if (specs) {
      if (specs.heating) {
        days = days - config.date_reduction.heating;
      }
      if (facilityType === 'open_field' && specs.tunnel) {
        days = days - config.date_reduction.tunnel;
      }
    }

    // 3. Location/Temperature Factor (Mock)
    if (
      location.includes('경북') ||
      location.includes('전남') ||
      location.includes('경남') ||
      location.includes('제주')
    ) {
      days -= 5;
    } else if (location.includes('강원') || location.includes('경기 북부')) {
      days += 10;
    }

    return format(addDays(new Date(plantingDate), Math.floor(days)), 'yyyy-MM-dd');
  }

  /**
   * Get Quality Ratio based on Facility Type
   */
  static getQualityRatio(facilityType: string): {
    tuk: number;
    sang: number;
    jung: number;
    ha: number;
  } {
    // Could also move these to ConfigService later
    switch (facilityType) {
      case 'glass_greenhouse':
        return { tuk: 0.6, sang: 0.3, jung: 0.1, ha: 0.0 };
      case 'multi_greenhouse':
        return { tuk: 0.45, sang: 0.35, jung: 0.15, ha: 0.05 };
      case 'single_greenhouse':
      case 'greenhouse':
        return { tuk: 0.35, sang: 0.35, jung: 0.2, ha: 0.1 };
      case 'open_field':
      default:
        return { tuk: 0.2, sang: 0.3, jung: 0.3, ha: 0.2 };
    }
  }

  /**
   * Calculate Expected Yield with detailed facility specs
   */
  static calculateExpectedYield(
    cropName: string,
    areaPyung: number,
    facilityType: string,
    specs?: any,
  ): number {
    const crop = this.getCropInfo(cropName);
    if (!crop) return 0;

    const config = SimulationConfigService.getConfig();
    let baseYield = crop.baseYieldPerPyeong * areaPyung;

    // 1. Basic Facility Multiplier
    let multiplier = 1.0;
    switch (facilityType) {
      case 'open_field':
        multiplier = config.facility.open_field;
        break;
      case 'single_greenhouse':
        multiplier = config.facility.single_greenhouse;
        break;
      case 'multi_greenhouse':
        multiplier = config.facility.multi_greenhouse;
        break;
      case 'glass_greenhouse':
        multiplier = config.facility.glass_greenhouse;
        break;
      case 'smart_farm':
        multiplier = config.facility.smart_farm;
        break;
      default:
        multiplier = 1.0;
    }

    // 2. Detailed Specs Multipliers
    if (specs) {
      if (facilityType.includes('greenhouse') || facilityType === 'smart_farm') {
        if (specs.height === 'high') multiplier *= config.specs.height_high;
        else if (specs.height === 'medium') multiplier *= config.specs.height_medium;
      }

      if (specs.cultivation === 'hydroponics') multiplier *= config.specs.hydroponics;
      if (specs.heating) multiplier *= config.specs.heating;

      if (facilityType === 'open_field' && specs.tunnel) {
        multiplier *= config.specs.tunnel;
      }
    }

    return Math.round(baseYield * multiplier);
  }

  /**
   * Calculate cost with scientific analysis
   */
  static calculateTotalCost(
    cropName: string,
    areaPyung: number,
    facilityType: string,
    plantingDate: string,
    specs: any = {},
    targetTemp?: number,
  ): { total: number; energy: number; base: number; breakdown: string[] } {
    const crop = this.getCropInfo(cropName);
    if (!crop) return { total: 0, energy: 0, base: 0, breakdown: [] };

    const breakdown: string[] = [];

    // --- 1. Base Management Cost ---
    let baseCostPerPyung = crop.standardCostPerPyeong;

    // Cultivation Corrections
    if (specs.cultivation === 'hydroponics') {
      baseCostPerPyung *= 1.3;
      breakdown.push(`양액 재배 자재비 증가 (+30%)`);
      // ... (Water/Filter logic existing)
      // Water Source Cost
      if (specs.waterSource === 'tap') {
        baseCostPerPyung += 2000;
        breakdown.push(`수돗물 사용 수도요금 추가`);
      } else if (specs.waterSource === 'river') {
        if (specs.hasFilter) {
          baseCostPerPyung += 500;
          breakdown.push(`강물 여과기 유지보수비`);
        }
      } else if (specs.waterSource === 'ground') {
        baseCostPerPyung += 300;
      }

      // [Scientific] Hydroponics pH/EC Correction
      // If source water pH is too high/low, acid/base needed
      if (specs.ph && (specs.ph > 7.5 || specs.ph < 5.5)) {
        baseCostPerPyung += 500; // pH adjustment cost
        breakdown.push(`원수 pH(${specs.ph}) 교정제 비용 발생`);
      }
    } else {
      // ** Soil Cultivation Scientific Correction **
      // 1. pH Correction
      if (specs.ph !== undefined && crop.optimalPH) {
        if (specs.ph < crop.optimalPH.min) {
          // Acidic soil -> Lime needed
          // const limeCost = 1500; // Approx 1500 won per pyung for labor + material? Maybe too high.
          // Lime is cheap (subsidy). Labor is key.
          baseCostPerPyung += 500;
          breakdown.push(`산성 토양(pH ${specs.ph}) 개량: 석회 시비 비용 추가`);
        } else if (specs.ph > crop.optimalPH.max) {
          // Alkaline soil -> Sulfur/Peat moss
          baseCostPerPyung += 800;
          breakdown.push(`알칼리성 토양(pH ${specs.ph}) 개량: 유황/피트모스 비용 추가`);
        }
      }

      // 2. OM (Organic Matter) Correction
      if (specs.om !== undefined) {
        if (specs.om < 20) {
          // Less than 20g/kg is poor
          baseCostPerPyung += 1000; // Compost needed
          breakdown.push(`유기물 부족(${specs.om}g/kg): 퇴비 추가 시비`);
        }
      }
    }

    // B. Facility Maintenance
    if (facilityType === 'smart_farm' || facilityType === 'glass_greenhouse') {
      baseCostPerPyung *= 1.2;
      breakdown.push(`스마트팜 유지보수비 증가 (+20%)`);
    }

    let totalBaseCost = baseCostPerPyung * areaPyung;

    // --- 2. Labor & Machinery Cost (Advanced) ---
    let laborHours = crop.laborHoursPerPyeong * areaPyung;

    if (specs.cultivation !== 'hydroponics') {
      // Check specs.machines (List of { name: 'tractor', type: 'own' | 'rent' })
      // If simple string array, treat as 'own' for backward compatibility, but we prefer object.

      const usedMachines = specs.machines || [];

      usedMachines.forEach((machine: any) => {
        let machineName = typeof machine === 'string' ? machine : machine.name;
        let ownerType = typeof machine === 'string' ? 'own' : machine.type; // 'own' | 'rent'

        let laborReduction = 0;
        let machineCost = 0; // Depreciation or Rental Fee

        // Savings Logic
        if (machineName.includes('tractor')) laborReduction = 0.4;
        else if (machineName.includes('planter') || machineName.includes('transplanter'))
          laborReduction = 0.25;
        else if (machineName.includes('harvester')) laborReduction = 0.25;
        else if (machineName.includes('dryer')) laborReduction = 0.05; // Post-process

        // Apply Savings
        laborHours *= 1 - laborReduction;

        // Cost Logic
        if (ownerType === 'rent') {
          // Rental Fee: Approx 50,000 KRW per day
          // Estimate days needed: 1 day per 500 pyung?
          const daysNeeded = Math.max(1, Math.ceil(areaPyung / 500));
          const rentalFee = 50000 * daysNeeded;
          machineCost = rentalFee;
          breakdown.push(
            `${machineName} 임대 (${daysNeeded}일): 노동력 절감 & 임대료 ${rentalFee.toLocaleString()}원`,
          );
        } else {
          // Own: Depreciation + Fuel + Maintenance
          // Tractors are expensive.
          // Simple assumption: 1000 won per pyung for Tractor, 500 for others
          const unitCost = machineName.includes('tractor') ? 1000 : 500;
          machineCost = unitCost * areaPyung;
          breakdown.push(
            `${machineName} 보유: 노동력 절감 & 감가상각/유지비 ${machineCost.toLocaleString()}원`,
          );
        }

        totalBaseCost += machineCost;
      });
    } else {
      laborHours *= 0.5;
      breakdown.push(`양액/스마트팜 자동화: 노동력 50% 절감`);
    }

    // Labor Cost Calculation
    const standardLaborCost = crop.laborHoursPerPyeong * areaPyung * 20000;
    const actualLaborCost = laborHours * 20000;
    const laborSaving = standardLaborCost - actualLaborCost;

    if (laborSaving > 0) {
      totalBaseCost -= laborSaving;
      breakdown.push(`기계화/자동화 인건비 절감: -${Math.round(laborSaving).toLocaleString()}원`);
    }

    // --- 3. Energy Cost Calculation (Heating) ---
    let energyCost = 0;
    if (specs.heating && targetTemp !== undefined) {
      const location = specs.location || '서울/경기';
      const pDate = new Date(plantingDate);
      const duration = crop.daysToMaturity;

      const hdd = ClimateService.calculateHeatingDegreeDays(location, pDate, duration, targetTemp);

      if (hdd > 0) {
        let uValue = 6.0;
        switch (facilityType) {
          case 'open_field':
            uValue = 10.0;
            break;
          case 'single_greenhouse':
            uValue = 6.0;
            break;
          case 'multi_greenhouse':
            uValue = 4.5;
            break;
          case 'glass_greenhouse':
            uValue = 3.5;
            break;
          case 'smart_farm':
            uValue = 2.0;
            break;
        }
        if (specs.tunnel) uValue *= 0.8;

        const surfaceArea = areaPyung * 3.3 * 1.5;
        const requiredWh = uValue * surfaceArea * 24 * hdd;
        const requiredKWh = requiredWh / 1000;
        const costPerKWh = 80;

        energyCost = requiredKWh * costPerKWh;

        breakdown.push(`예상 난방 에너지: ${Math.round(requiredKWh).toLocaleString()} kWh`);
        breakdown.push(`난방비 (@80원): ${Math.round(energyCost).toLocaleString()}원`);
      }
    }

    return {
      base: Math.round(totalBaseCost),
      energy: Math.round(energyCost),
      total: Math.round(totalBaseCost + energyCost),
      breakdown,
    };
  }

  /**
   * Legacy Cost Method (Keep for compatibility)
   */
  static calculateExpectedCost(cropName: string, area: number): number {
    const info = this.getCropInfo(cropName);
    if (!info) return 0;
    return info.standardCostPerPyeong * area;
  }
}
