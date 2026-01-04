import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { Database, Code2 } from 'lucide-react';

export function SystemDocumentation() {
  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-slate-900">시스템 로직 및 DB 구조 명세</h1>
        <p className="text-slate-500 mt-2">개발자가 설계한 데이터 구조와 핵심 비즈니스 로직을 시각화하여 제공합니다.</p>
      </div>

      {/* 1. Database Schema */}
      <section className="space-y-4">
        <h2 className="flex items-center gap-2 text-xl font-bold text-slate-800">
            <Database className="h-6 w-6 text-indigo-600"/>
            데이터베이스 구조 (DB Schema)
        </h2>
        
        <Card>
            <CardHeader className="bg-slate-50 border-b">
                <CardTitle className="text-base">1. 농지 (Fields) 테이블</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Field Name</TableHead>
                            <TableHead>Type</TableHead>
                            <TableHead>Description</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        <TableRow><TableCell className="font-mono font-bold">id</TableCell><TableCell className="font-mono text-blue-600">number (PK)</TableCell><TableCell>고유 식별자</TableCell></TableRow>
                        <TableRow><TableCell className="font-mono font-bold">name</TableCell><TableCell className="font-mono text-blue-600">string</TableCell><TableCell>농지 별칭 (예: 김천시 아포읍)</TableCell></TableRow>
                        <TableRow><TableCell className="font-mono font-bold">area</TableCell><TableCell className="font-mono text-blue-600">number</TableCell><TableCell>면적 (평 단위)</TableCell></TableRow>
                        <TableRow><TableCell className="font-mono font-bold">crops</TableCell><TableCell className="font-mono text-blue-600">Crop[]</TableCell><TableCell>현재 재배 중인 작물 목록 (JSON)</TableCell></TableRow>
                        <TableRow><TableCell className="font-mono font-bold">location</TableCell><TableCell className="font-mono text-blue-600">string</TableCell><TableCell>행정 구역 주소</TableCell></TableRow>
                    </TableBody>
                </Table>
            </CardContent>
        </Card>

        <Card>
            <CardHeader className="bg-slate-50 border-b">
                <CardTitle className="text-base">2. 재무 장부 (Financial_Ledger) 테이블</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Field Name</TableHead>
                            <TableHead>Type</TableHead>
                            <TableHead>Description</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        <TableRow><TableCell className="font-mono font-bold">id</TableCell><TableCell className="font-mono text-blue-600">string (UUID)</TableCell><TableCell>고유 식별자</TableCell></TableRow>
                        <TableRow><TableCell className="font-mono font-bold">date</TableCell><TableCell className="font-mono text-blue-600">string (YYYY-MM-DD)</TableCell><TableCell>거래 일자</TableCell></TableRow>
                        <TableRow><TableCell className="font-mono font-bold">type</TableCell><TableCell className="font-mono text-blue-600">'income' | 'expense'</TableCell><TableCell>수입/지출 구분</TableCell></TableRow>
                        <TableRow><TableCell className="font-mono font-bold">amount</TableCell><TableCell className="font-mono text-blue-600">number</TableCell><TableCell>금액 (원)</TableCell></TableRow>
                        <TableRow><TableCell className="font-mono font-bold">category</TableCell><TableCell className="font-mono text-blue-600">string</TableCell><TableCell>항목 (비료, 인건비, 판매 등)</TableCell></TableRow>
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
      </section>

      {/* 2. Calculation Logic */}
      <section className="space-y-4 pt-8">
        <h2 className="flex items-center gap-2 text-xl font-bold text-slate-800">
            <Code2 className="h-6 w-6 text-green-600"/>
            핵심 알고리즘 로직 (Core Logic)
        </h2>

        <Card>
            <CardContent className="p-6 space-y-4">
                <h3 className="font-bold text-lg">재무 요약 계산 (Financial Summary)</h3>
                <div className="bg-slate-900 text-slate-300 p-4 rounded-lg font-mono text-sm overflow-x-auto">
                    <pre>{`
function calculateSummary(transactions: Transaction[]) {
  // 1. 수입 합계
  const totalRevenue = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  // 2. 지출 합계
  const totalExpense = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  // 3. 순수익
  const profit = totalRevenue - totalExpense;

  return { totalRevenue, totalExpense, profit };
}
                    `}</pre>
                </div>
                <p className="text-sm text-slate-600">
                    * 위 로직은 <code>FinancialService.ts</code> 내부에서 실제로 동작하는 코드의 단순화 버전입니다.
                    모든 대시보드의 숫자는 이 로직을 통해 실시간으로 산출됩니다.
                </p>
            </CardContent>
        </Card>
      </section>
    </div>
  );
}
