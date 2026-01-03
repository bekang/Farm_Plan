import { FertilizerCalculator } from '../utils/fertilizerCalculator.js';
import { FarmService } from './farmService.js';
// import { Nonsaro } from '../api/nonsaro.js'; 

export class QnaService {
    constructor() {
        this.farmService = new FarmService();
    }

    /**
     * 사용자 질문을 처리하여 답변을 반환합니다.
     * @param {string} question 
     * @returns {Promise<Object>} { type, text, data }
     */
    async ask(question) {
        console.log(`[QnA] User asks: ${question}`);
        
        // 1. 의도 파악 (Intent Recognition) - Simple Keyword Matching
        if (question.includes('전체') && question.includes('농장')) {
            return this.handleFarmStatus();
        }
        
        if (question.includes('비료') || question.includes('시비')) {
            // 특정 작물/농지 언급 확인 (여기서는 단순히 첫 번째 농지로 가정)
            const fields = this.farmService.getFields();
            if (fields.length === 0) {
                return { 
                    type: 'error', 
                    text: "등록된 농지가 없습니다. 농지를 먼저 등록해주세요." 
                };
            }
            return this.handleFertilizerRecommendation(fields[0]);
        }

        // Default Fallback
        return {
            type: 'chat',
            text: "죄송합니다. 아직 배우고 있는 중이라 '비료 추천'이나 '농장 상태' 같은 질문에만 답할 수 있어요."
        };
    }

    /**
     * 농장 전체 상태 요약 핸들러
     */
    async handleFarmStatus() {
        const fields = this.farmService.getFields();
        const summary = fields.map(f => `${f.name}(${f.crop || '작물미정'})`).join(', ');
        
        return {
            type: 'summary',
            text: `현재 등록된 농장은 총 ${fields.length}곳 입니다: ${summary}`,
            data: fields
        };
    }

    /**
     * 비료 추천 핸들러
     * @param {Object} field 
     */
    async handleFertilizerRecommendation(field) {
        if (!field.crop) {
            return {
                type: 'error',
                text: `${field.name}에 심겨진 작물 정보가 없습니다. 작물을 먼저 설정해주세요.`
            };
        }

        console.log(`[QnA] Calculating fertilizer for ${field.name} (${field.crop})`);

        // 1. 토양 검사 결과 가져오기 (Mock Data: 실제로는 DB/LocalStorage에서 field.id로 조회)
        // 만약 데이터가 없으면 '표준 데이터'를 사용한다고 가정.
        const soilData = { 
            om: 20,    // 유기물 부족 가정
            p2o5: 400, // 인산 적정
            k: 0.3     // 칼륨 부족 가정
        }; 

        // 2. 계산기 호출
        const required = FertilizerCalculator.calculate(field.crop, field.area, soilData);

        if (!required) {
             return {
                type: 'error',
                text: `${field.crop}에 대한 표준 시비량 데이터를 찾을 수 없습니다.`
            };
        }

        // 3. 답변 생성
        const msg = `
            🌱 <strong>${field.name} (${field.crop}, ${field.area}평)</strong> 비료 추천안입니다.<br>
            질소(N): <strong>${required.n}kg</strong><br>
            인산(P): <strong>${required.p}kg</strong><br>
            칼륨(K): <strong>${required.k}kg</strong><br>
            <br>
            <small>* 토양 유기물 함량(${soilData.om}g/kg)이 낮아 질소를 증비하고, 칼륨을 충분히 공급하는 것이 좋습니다.</small>
        `.trim();

        return {
            type: 'recommendation',
            text: msg,
            data: { field, soilData, required }
        };
    }
}
