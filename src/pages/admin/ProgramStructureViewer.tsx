import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  LayoutDashboard, 
  Map, 
  Calendar, 
  BookOpen, 
  ArrowRight, 
  Database, 
  FunctionSquare,
  FileSpreadsheet
} from 'lucide-react';

interface PageStructure {
  pageName: string;
  description: string;
  icon: React.ElementType;
  route: string;
  tablesUsed: string[];
  keyLogic: {
    feature: string;
    description: string;
    flow: string; // A -> B -> C
  }[];
}

const PAGE_STRUCTURES: PageStructure[] = [
  {
    pageName: '내 농장 관리 (Farm Dashboard)',
    description: '보유한 농장(필지)의 목록을 조회하고, 각 필지의 토양/환경 상태를 모니터링하는 페이지',
    icon: Map,
    route: '/dashboard/farm-dashboard',
    tablesUsed: ['Fields (필지 정보)', 'ApiConfigs (환경 API)'],
    keyLogic: [
      {
        feature: '필지 목록 로딩',
        description: '등록된 전체 필지를 카드 형태로 시각화',
        flow: 'Page Load -> FieldService.getFields() -> State Update -> Render Cards'
      },
      {
        feature: '토양 정보 연동',
        description: '공공데이터포털 API를 통해 실시간 토양 특성 조회',
        flow: 'Card Expand -> API Call (SoilEnv) -> Parsing XML -> Display Data'
      }
    ]
  },
  {
    pageName: '영농 계획 (Crop Planning)',
    description: '연간 작물 재배 일정을 수립하고, Gantt 차트로 시각화하여 관리하는 페이지',
    icon: Calendar,
    route: '/dashboard/planning',
    tablesUsed: ['Fields (대상 필지)', 'CropPlans (재배 계획)', 'WorkLogs (작업 상세)'],
    keyLogic: [
      {
        feature: 'Gantt 차트 렌더링',
        description: '필지별/기간별 재배 계획을 타임라인 바(Bar)로 표현',
        flow: 'Load Plans -> Calculate Date Ranges -> Map to Timeline Grid -> Render Bars'
      },
      {
        feature: '예상 수익 계산',
        description: '계획된 모든 작물의 예상 매출/비용 합계 실시간 집계',
        flow: 'Plans Change -> Aggregation Service -> Sum(Revenue - Cost) -> Update Footer UI'
      }
    ]
  },
  {
    pageName: '간편 장부 (Financial Ledger)',
    description: '농장 운영 수입/지출 내역을 기록하고, 차트와 리포트로 재무 상태를 분석하는 페이지',
    icon: FileSpreadsheet,
    route: '/dashboard/financial-ledger',
    tablesUsed: ['FinancialLedger (거래 내역)', 'CropPlans (연결 작물)'],
    keyLogic: [
      {
        feature: '손익 요약 대시보드',
        description: '월별 수입/지출 추이 및 카테고리별 비중 차트 제공',
        flow: 'Transactions -> GroupBy Month/Category -> Chart.js Data Formatting -> Render Graphs'
      },
      {
        feature: '거래 내역 기장',
        description: '날짜, 항목, 금액 입력 및 증빙 자료 연결',
        flow: 'Form Submit -> Validation -> FinancialService.add() -> Refresh List'
      }
    ]
  },
  {
    pageName: '메인 대시보드 (Main Dashboard)',
    description: '모든 서비스의 핵심 지표(날씨, 병해충, 일정, 재무)를 한눈에 요약해 보여주는 관제 페이지',
    icon: LayoutDashboard,
    route: '/dashboard',
    tablesUsed: ['All Tables (Aggregated View)'],
    keyLogic: [
      {
        feature: '오늘의 할 일',
        description: '모든 계획의 작업 일지 중 오늘 날짜 해당 항목 필터링',
        flow: 'WorkLogService.getAll() -> Filter by Today -> Sort by Priority -> List View'
      },
      {
        feature: '위젯 통합 데이터',
        description: '날씨, 병해충, 경매가 등 외부 API 데이터와 내부 데이터를 결합',
        flow: 'Parallel Fetch (Weather, Pest, Plans) -> Combine Results -> Widget Grid'
      }
    ]
  }
];

export const ProgramStructureViewer: React.FC = () => {
  return (
    <div className="space-y-8 pb-10">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold text-slate-900">프로그램 테이블 관리 (페이지별 구조)</h1>
        <p className="text-slate-600">
          사용자 페이지별로 사용되는 <strong>데이터 테이블</strong>, <strong>핵심 비즈니스 로직</strong>, 그리고 <strong>데이터 흐름(Flow)</strong>을 정리한 구조도입니다.
        </p>
      </div>

      <div className="grid gap-8">
        {PAGE_STRUCTURES.map((page) => (
          <Card key={page.pageName} className="border-l-4 border-l-green-600 shadow-md">
            <CardHeader className="bg-slate-50/50 pb-4">
              <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                <div className="flex items-start gap-3">
                  <div className="mt-1 flex h-12 w-12 items-center justify-center rounded-xl bg-green-100 text-green-700">
                    <page.icon className="h-6 w-6" />
                  </div>
                  <div>
                    <CardTitle className="text-xl text-slate-800">{page.pageName}</CardTitle>
                    <CardDescription className="mt-1 text-base text-slate-600">
                      {page.description}
                    </CardDescription>
                    <code className="mt-2 inline-block rounded bg-slate-200 px-2 py-0.5 text-xs text-slate-600">
                      Route: {page.route}
                    </code>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6 pt-6">
              {/* Used Tables Section */}
              <div>
                <h3 className="mb-3 flex items-center gap-2 text-sm font-bold uppercase text-slate-500">
                  <Database className="h-4 w-4" />
                  사용 데이터 테이블 (Tables)
                </h3>
                <div className="flex flex-wrap gap-2">
                  {page.tablesUsed.map((table) => (
                    <Badge key={table} variant="outline" className="border-slate-300 bg-slate-50 px-3 py-1 text-sm font-medium text-slate-700">
                      {table}
                    </Badge>
                  ))}
                </div>
              </div>

              <Separator />

              {/* Logic Flow Section */}
              <div>
                <h3 className="mb-3 flex items-center gap-2 text-sm font-bold uppercase text-slate-500">
                  <FunctionSquare className="h-4 w-4" />
                  핵심 로직 및 데이터 흐름 (Logic Flow)
                </h3>
                <div className="grid gap-4 md:grid-cols-2">
                  {page.keyLogic.map((logic, idx) => (
                    <div key={idx} className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm transition-shadow hover:shadow-md">
                      <div className="mb-2 flex items-center gap-2">
                        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-100 text-xs font-bold text-blue-600">
                          {idx + 1}
                        </span>
                        <h4 className="font-bold text-slate-800">{logic.feature}</h4>
                      </div>
                      <p className="mb-3 text-sm text-slate-600">{logic.description}</p>
                      
                      <div className="rounded bg-slate-50 p-2">
                        <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
                          <ArrowRight className="h-3 w-3" />
                          <span>Flow:</span>
                        </div>
                        <code className="block mt-1 text-xs text-blue-600 break-words">
                          {logic.flow}
                        </code>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
