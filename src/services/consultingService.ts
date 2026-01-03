// import { MockDataService } from '@/services/mockDataService';

export interface AIAnalysis {
  summary: string;
  details: string[];
  sentiment: 'positive' | 'neutral' | 'negative';
}

export interface ImprovementItem {
  id: string;
  category: 'soil' | 'water' | 'pest' | 'market';
  priority: 'high' | 'medium' | 'low';
  action: string;
  expectedOutcome: string;
  status: 'pending' | 'in_progress' | 'completed';
}

export interface ConsultingReport {
  reportId: string;
  generatedAt: string;
  farmName: string;
  overallScore: number; // 0-100
  scoreGrade: 'A' | 'B' | 'C' | 'D' | 'F';

  analysis: {
    soil: AIAnalysis;
    weather: AIAnalysis;
    pest: AIAnalysis;
    efficiency: AIAnalysis;
  };

  improvementPlan: ImprovementItem[];
}

export class ConsultingService {
  /**
   * Generate a Mock Consulting Report
   */
  // @ts-ignore
  static async generateReport(farmId: string): Promise<ConsultingReport> {
    // Simulate API Delay
    await new Promise((resolve) => setTimeout(resolve, 2000));

    return {
      reportId: `RPT-${new Date().getTime()}`,
      generatedAt: new Date().toISOString(),
      farmName: '꿈을 그리는 농장',
      overallScore: 85,
      scoreGrade: 'B',
      analysis: {
        soil: {
          summary: '토양 비옥도가 전반적으로 양호하나, 질소 함량이 다소 높습니다.',
          details: [
            'pH 6.5로 작물 생육에 적정 수준 유지 중',
            '유기물 함량이 3.2%로 전년 대비 0.5% 증가',
            '질소 과다 시비 주의 필요',
          ],
          sentiment: 'positive',
        },
        weather: {
          summary: '최근 강수량 부족으로 인한 건조 스트레스가 우려됩니다.',
          details: ['지난 2주간 강수량 5mm 미만', '다음 주 기온 상승 예상으로 관수 주기 단축 필요'],
          sentiment: 'neutral',
        },
        pest: {
          summary: '병해충 발생 위험은 낮으나, 진딧물 예찰이 필요합니다.',
          details: ['인접 농가 진딧물 발생 보고 2건', '방충망 상태 점검 권장'],
          sentiment: 'positive',
        },
        efficiency: {
          summary: '작업 효율성이 매우 높습니다. 자동화 시스템이 잘 작동하고 있습니다.',
          details: ['스마트 관수 시스템 가동률 98%', '노동력 투입 시간 전년 대비 15% 감소'],
          sentiment: 'positive',
        },
      },
      improvementPlan: [
        {
          id: 'IMP-01',
          category: 'water',
          priority: 'high',
          action: '관수 주기 2일 1회 -> 1일 1회로 변경',
          expectedOutcome: '토양 수분 스트레스 해소 및 수확량 5% 증대 예상',
          status: 'pending',
        },
        {
          id: 'IMP-02',
          category: 'soil',
          priority: 'medium',
          action: '질소 비료 시비량 20% 감축',
          expectedOutcome: '비료 비용 절감 및 토양 염류 집적 예방',
          status: 'pending',
        },
        {
          id: 'IMP-03',
          category: 'pest',
          priority: 'low',
          action: '친환경 진딧물 방제제 구비',
          expectedOutcome: '초기 발병 시 즉각 대응 체계 구축',
          status: 'completed',
        },
      ],
    };
  }

  static getGradeColor(grade: string): string {
    switch (grade) {
      case 'A':
        return 'text-blue-600 bg-blue-100';
      case 'B':
        return 'text-green-600 bg-green-100';
      case 'C':
        return 'text-yellow-600 bg-yellow-100';
      case 'D':
        return 'text-orange-600 bg-orange-100';
      default:
        return 'text-red-600 bg-red-100';
    }
  }
}
