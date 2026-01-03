/**
 * Fertilizer Calculator Utility
 * 토양 검정 결과와 작물별 표준 시비량을 기반으로 필요한 비료량을 계산합니다.
 */

export const FertilizerCalculator = {
    /**
     * 표준 시비량 (Standard Fertilizer Requirement) - 임시 데이터
     * 실제로는 농사로 API 등에서 가져와야 함.
     * 단위: kg/10a (1000m²)
     */
    STANDARD_REQ: {
        '고추': { n: 19.0, p: 11.2, k: 14.9 }, // 노지 고추 표준
        '마늘': { n: 22.0, p: 10.0, k: 15.0 },
        '양파': { n: 24.0, p: 11.0, k: 18.0 },
        '배추': { n: 32.0, p: 10.0, k: 20.0 }
    },

    /**
     * 면적 단위 변환 (평 -> m²)
     * @param {number} pyeong 
     * @returns {number} square meters
     */
    pyeongToM2(pyeong) {
        return pyeong * 3.30578;
    },

    /**
     * 필요 시비량 계산
     * @param {string} cropName - 작물명
     * @param {number} areaPyeong - 재배 면적 (평)
     * @param {Object} soilAnalysis - 토양 검정 결과 { om, p2o5, k, ... }
     * @returns {Object} { n, p, k } (kg)
     */
    calculate(cropName, areaPyeong, soilAnalysis) {
        const standard = this.STANDARD_REQ[cropName];
        if (!standard) {
            console.warn(`Standard for ${cropName} not found.`);
            return null;
        }

        const m2 = this.pyeongToM2(areaPyeong);
        const areaRatio = m2 / 1000.0; // 10a 기준 비율

        // --- 간이 계산 로직 (Formula Placeholder) ---
        // 실제로는 흙토람의 복잡한 회귀식을 사용해야 함.
        // 여기서는 검정치가 없을 경우 표준량 100%, 
        // 검정치가 적정 범위보다 높으면 감비, 낮으면 증비하는 간단한 로직 적용.

        // 1. 질소(N): 유기물(OM) 함량에 따라 조절
        // 유기물 적정: 25~35 g/kg. 
        let nFactor = 1.0;
        if (soilAnalysis.om > 35) nFactor = 0.8; // 과다 -> 20% 감비
        else if (soilAnalysis.om < 25) nFactor = 1.2; // 부족 -> 20% 증비

        // 2. 인산(P): 유효인산(P2O5) 함량에 따라 조절
        // 적정: 300~500 mg/kg (채소류)
        let pFactor = 1.0;
        if (soilAnalysis.p2o5 > 500) pFactor = 0.5;
        else if (soilAnalysis.p2o5 < 300) pFactor = 1.3;

        // 3. 칼륨(K): 치환성 칼륨(K) 함량에 따라 조절
        // 적정: 0.5~0.8 cmol+/kg
        let kFactor = 1.0;
        if (soilAnalysis.k > 0.8) kFactor = 0.6;
        else if (soilAnalysis.k < 0.5) kFactor = 1.2;

        return {
            n: parseFloat((standard.n * nFactor * areaRatio).toFixed(2)),
            p: parseFloat((standard.p * pFactor * areaRatio).toFixed(2)),
            k: parseFloat((standard.k * kFactor * areaRatio).toFixed(2)),
            unit: 'kg',
            details: {
                area_m2: Math.round(m2),
                factors: { n: nFactor, p: pFactor, k: kFactor }
            }
        };
    }
};
