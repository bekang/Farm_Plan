import { FieldService } from './fieldService';
import { FertilizerCalculator } from '../lib/fertilizerCalculator';
import type { ChatMessage } from '../types';

export class QnaService {
  // FieldService is static, no instance needed

  async ask(question: string): Promise<ChatMessage> {

    const q = question.toLowerCase();

    // 1. Intent: Farm Summary
    if (
      (q.includes('농장') || q.includes('농지')) &&
      (q.includes('요약') || q.includes('상태') || q.includes('보여줘'))
    ) {
      return this.handleFarmStatus();
    }

    // 2. Intent: Fertilizer Recommendation
    if (q.includes('비료') || q.includes('시비')) {
      const fields = FieldService.getFields();
      if (fields.length === 0) {
        return this.createSystemMessage('등록된 농지가 없습니다. 먼저 농지를 등록해 주세요.');
      }
      // For now, assume the first field or match name
      const targetField = fields.find((f) => q.includes(f.name)) || fields[0];
      return this.handleFertilizer(targetField.id);
    }

    // Default
    return this.createSystemMessage(
      "죄송합니다. '비료 추천해줘' 또는 '내 농지 상태 보여줘' 같은 질문에 답할 수 있어요.",
    );
  }

  private createSystemMessage(text: string, data?: any): ChatMessage {
    return {
      id: Date.now().toString(),
      role: 'system',
      text,
      timestamp: new Date().toISOString(),
      data,
    };
  }

  private async handleFarmStatus(): Promise<ChatMessage> {
    const fields = FieldService.getFields();
    if (fields.length === 0) return this.createSystemMessage('등록된 농지가 없습니다.');

    const names = fields.map((f) => `${f.name}(${f.cultivationMethod || '방식미정'})`);
    return this.createSystemMessage(
      `현재 총 ${fields.length}개의 농지가 있습니다: ${names.join(', ')}`,
      { fields },
    );
  }

  private async handleFertilizer(fieldId: string | number): Promise<ChatMessage> {
    const field = FieldService.getField(String(fieldId));
    if (!field) {
      return this.createSystemMessage('농지 정보를 찾을 수 없습니다.');
    }
    
    // NOTE: FieldService doesn't have getSoilTests yet, using mock for now or reading from history if available
    // Assuming field.history.soil might exist or defaulting
    const latestTest: any = field.history?.soil?.[0] || { om: 20, p2o5: 450, k2o: 0.6 };
    
    // Adapter for legacy calculator which expects 'k' but new type has 'k2o'
    const adapterTest = {
         ...latestTest,
         k: latestTest.k2o || 0.5
    };

    if (!field.cultivationMethod) {
         return this.createSystemMessage('작물/재배방식 정보가 부족하여 계산할 수 없습니다.');
    }
    
    // Simple Mock Calculator Call as placeholder
    // In a real fixes, we would update FertilizerCalculator to match new Schema
    
    const msg =
      `${field.name} (${field.area}평)에 대한 비료 추천 기능은 현재 정비 중입니다. \n` +
      `토양 유기물: ${latestTest.om || '모름'}%, 유효인산: ${latestTest.p2o5 || '모름'}npm`;

    return this.createSystemMessage(msg, { field, soil: latestTest });
  }
}
