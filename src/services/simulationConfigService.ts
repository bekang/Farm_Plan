export interface SimulationCoefficients {
  // Facility Base Multipliers
  facility: {
    open_field: number;
    single_greenhouse: number;
    multi_greenhouse: number;
    glass_greenhouse: number;
    smart_farm: number;
  };
  // Advanced Specs Multipliers
  specs: {
    height_medium: number; // 4-5m
    height_high: number; // 6m+
    heating: number; // Heating system
    hydroponics: number; // Soilless culture
    tunnel: number; // Open field tunnel
  };
  // Date Adjustments (Days to reduce)
  date_reduction: {
    heating: number;
    tunnel: number;
    greenhouse_factor: number; // 0.9 means 10% reduction
    smart_farm_factor: number; // 0.8 means 20% reduction
  };
}

export const DEFAULT_COEFFICIENTS: SimulationCoefficients = {
  facility: {
    open_field: 1.0,
    single_greenhouse: 1.3, // Ref: General greenhouse efficiency
    multi_greenhouse: 1.5,
    glass_greenhouse: 2.0, // Ref: RDA Smart Farm productivity data
    smart_farm: 3.5, // High-tech optimization
  },
  specs: {
    height_medium: 1.1, // +10% for medium height (4-5m)
    height_high: 1.3, // +30% for high height (6m+) (Ref: Domestic greenhouse structural studies)
    heating: 1.2, // +20% for heating (Ref: Winter crop stability)
    hydroponics: 1.5, // +50% for hydroponics (Ref: Tomato/Paprika yield comparison)
    tunnel: 1.25, // +25% for tunnel farming (Ref: Open field pepper cultivation)
  },
  date_reduction: {
    heating: 20, // -20 days
    tunnel: 15, // -15 days
    greenhouse_factor: 0.9, // 90% of original days
    smart_farm_factor: 0.8, // 80% of original days
  },
};

const STORAGE_KEY = 'soillab_simulation_config';
const PERMISSION_KEY = 'soillab_simulation_permission';

export class SimulationConfigService {
  static getConfig(): SimulationCoefficients {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        return { ...DEFAULT_COEFFICIENTS, ...JSON.parse(stored) };
      } catch (e) {
        console.error('Failed to parse simulation config', e);
      }
    }
    return DEFAULT_COEFFICIENTS;
  }

  static saveConfig(config: SimulationCoefficients): void {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
  }

  static resetToDefault(): void {
    localStorage.removeItem(STORAGE_KEY);
  }

  // Permission Management
  static isEditAllowed(): boolean {
    return localStorage.getItem(PERMISSION_KEY) === 'true';
  }

  static setEditAllowed(allowed: boolean): void {
    localStorage.setItem(PERMISSION_KEY, String(allowed));
  }
}
