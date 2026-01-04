import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { FileJson, Database, Key, LayoutDashboard, Users, UserCog } from 'lucide-react';

const TABLE_DOCS = [
  {
    tableName: '사용자 정보 (Users)',
    description: '시스템 사용자 계정 및 권한 관리 (현재 Mock Data 사용)',
    icon: Users,
    fields: ['id (UUID)', 'username (ID)', 'password (Hash)', 'role (Admin/User)', 'name (실명)'],
    relatedPages: [
      { page: '로그인 페이지', function: '로그인 인증', method: 'checkUserCredentials()' },
      { page: '사용자 관리 (Admin)', function: '계정 조회/생성/삭제', method: 'getUsers(), addUser(), deleteUser()' },
      { page: '사이드바/헤더', function: '권한별 메뉴 노출', method: 'useRole()' }
    ]
  },
  {
    tableName: '농장/필지 (Fields)',
    description: '사용자가 소유한 농장 및 세부 필지 정보',
    icon: LayoutDashboard,
    fields: ['id (UUID)', 'name (필지명)', 'address (주소)', 'area (면적)', 'soilType (토양)', 'ownerId (소유자)'],
    relatedPages: [
      { page: '내 농장 관리 (FarmDashboard)', function: '보유 필지 목록 조회 및 상태 요약', method: 'FieldService.getFields()' },
      { page: '농장 등록 (FarmRegistration)', function: '신규 필지 등록', method: 'FieldService.registerField()' },
      { page: '영농 계획 (CropPlanning)', function: '계획 수립 대상 필지 선택', method: 'FieldService.getFieldById()' }
    ]
  },
  {
    tableName: '재배 계획 (CropPlans)',
    description: '필지별 작물 재배 일정 및 예상 성과',
    icon: Database,
    fields: ['id', 'fieldId (FK)', 'cropName (작물)', 'startDate', 'endDate', 'expectedYield', 'status (예정/진행/완료)'],
    relatedPages: [
      { page: '영농 계획 (CropPlanning)', function: '연간 재배 일정 수립 (Gantt)', method: 'PlanService.addPlan(), updatePlan()' },
      { page: '메인 대시보드 (Dashboard)', function: '전체 예상 수익/비용 집계', method: 'PlanService.getAllPlans()' },
      { page: '상세 일정 (Timeline)', function: '특정 필지의 작물 이력 조회', method: 'PlanService.getPlansByField()' }
    ]
  },
  {
    tableName: '작업 일지 (WorkLogs)',
    description: '재배 계획에 따른 일별 상세 농작업 기록',
    icon: FileJson,
    fields: ['id', 'planId (FK)', 'date', 'taskType (작업종류)', 'content', 'worker', 'status'],
    relatedPages: [
      { page: '상세 일정 (CropPlanningDetail)', function: '일자별 작업 추가/수정', method: 'WorkLogService.addLog()' },
      { page: '메인 대시보드', function: '금일 예정 작업 알림', method: 'WorkLogService.getTodayLogs()' }
    ]
  },
  {
    tableName: '재무 원장 (FinancialLedger)',
    description: '농장 운영 관련 모든 수입/지출 거래 내역',
    icon: Key,
    fields: ['id', 'date', 'type (수입/지출)', 'amount', 'category (비료/인건비 등)', 'description', 'evidenceId'],
    relatedPages: [
      { page: '간편 장부 (FinancialLedger)', function: '거래 내역 기장 및 조회', method: 'FinancialService.addTransaction()' },
      { page: '경영 리포트 (FinancialReport)', function: '월별/항목별 손익 분석', method: 'FinancialService.getMonthlyDesign()' },
      { page: '재무 증빙 관리', function: '영수증 이미지 매핑', method: 'EvidenceService.upload()' }
    ]
  },
  {
    tableName: 'API 설정 (ApiConfigs)',
    description: '공공데이터포털 등 외부 연계 API 키 및 엔드포인트 설정',
    icon: UserCog,
    fields: ['id (ServiceID)', 'apiKey', 'active (사용여부)', 'manualPath (매뉴얼 경로)', 'sourceLink (출처)'],
    relatedPages: [
      { page: 'API 키 관리 (ApiManager)', function: '키 입력 및 서비스 On/Off', method: 'localStorage.setItem("api_configs")' },
      { page: '통합 매뉴얼', function: '매뉴얼 다운로드 경로 참조', method: 'config.manualPath' },
      { page: '데이터 수집 스크립트', function: '기상/경매 데이터 호출 시 참조', method: 'useApiConfig()' }
    ]
  }
];

export const ProgramTableManager: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold text-slate-900">프로그램 테이블 키 관리</h1>
        <p className="text-slate-600">
          본 시스템 내부에서 사용되는 데이터 테이블(Mock Store)의 구조와 각 페이지별 호출 관계를 정리한 명세서입니다.
        </p>
      </div>

      <div className="grid gap-6">
        {TABLE_DOCS.map((table) => (
          <Card key={table.tableName} className="overflow-hidden border-slate-200 shadow-sm">
            <CardHeader className="bg-slate-50 pb-4">
              <div className="flex items-center gap-2">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white shadow-sm ring-1 ring-slate-200">
                  <table.icon className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <CardTitle className="text-lg text-slate-800">{table.tableName}</CardTitle>
                  <CardDescription>{table.description}</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              {/* Fields List */}
              <div className="border-b border-slate-100 px-6 py-4">
                <h4 className="mb-2 text-xs font-bold uppercase text-slate-400">Data Fields</h4>
                <div className="flex flex-wrap gap-2">
                  {table.fields.map(field => (
                    <Badge key={field} variant="secondary" className="bg-slate-100 font-mono text-slate-600 text-[10px]">
                      {field}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Related Pages Table */}
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-transparent">
                    <TableHead className="w-[200px]">사용 페이지</TableHead>
                    <TableHead className="w-[200px]">주요 기능</TableHead>
                    <TableHead>호출 방식 / Method</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {table.relatedPages.map((page, idx) => (
                    <TableRow key={idx} className="hover:bg-slate-50/50">
                      <TableCell className="font-medium text-slate-700">{page.page}</TableCell>
                      <TableCell className="text-slate-600">{page.function}</TableCell>
                      <TableCell>
                        <code className="rounded bg-slate-100 px-2 py-1 font-mono text-xs text-blue-600">
                          {page.method}
                        </code>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
