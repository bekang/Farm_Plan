import type { SoilTestResult } from '../types';

export const FertilizerCalculator = {
  /**
   * Standard Fertilizer Requirement (kg/10a)
   * Placeholder: In production, fetch from Nonsaro API
   */
  STANDARD_REQ: {
    고추: { n: 19.0, p: 11.2, k: 14.9 },
    마늘: { n: 22.0, p: 10.0, k: 15.0 },
    양파: { n: 24.0, p: 11.0, k: 18.0 },
    배추: { n: 32.0, p: 10.0, k: 20.0 },
  } as Record<string, { n: number; p: number; k: number }>,

  pyeongToM2(pyeong: number): number {
    return pyeong * 3.30578;
  },

  calculate(cropName: string, areaPyeong: number, soilAnalysis: Partial<SoilTestResult>) {
    const standard = this.STANDARD_REQ[cropName];
    if (!standard) {
      console.warn(`Standard for ${cropName} not found.`);
      return null;
    }

    const m2 = this.pyeongToM2(areaPyeong);
    const areaRatio = m2 / 1000.0; // Ratio based on 10a (1000m2)

    // Factor Logic (Simplified)
    // 1. Nitrogen (N) based on Organic Matter (OM)
    let nFactor = 1.0;
    if (soilAnalysis.om && soilAnalysis.om > 35) nFactor = 0.8;
    else if (soilAnalysis.om && soilAnalysis.om < 25) nFactor = 1.2;

    // 2. Phosphate (P) based on Available Phosphate (P2O5)
    let pFactor = 1.0;
    if (soilAnalysis.p2o5 && soilAnalysis.p2o5 > 500) pFactor = 0.5;
    else if (soilAnalysis.p2o5 && soilAnalysis.p2o5 < 300) pFactor = 1.3;

    // 3. Potassium (K) based on Exchangeable Potassium (K)
    let kFactor = 1.0;
    if (soilAnalysis.k && soilAnalysis.k > 0.8) kFactor = 0.6;
    else if (soilAnalysis.k && soilAnalysis.k < 0.5) kFactor = 1.2;

    return {
      n: parseFloat((standard.n * nFactor * areaRatio).toFixed(2)),
      p: parseFloat((standard.p * pFactor * areaRatio).toFixed(2)),
      k: parseFloat((standard.k * kFactor * areaRatio).toFixed(2)),
      unit: 'kg',
      details: {
        area_m2: Math.round(m2),
        factors: { n: nFactor, p: pFactor, k: kFactor },
      },
    };
  },
};
