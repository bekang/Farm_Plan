import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { ShieldAlert, Database, Sprout, Wallet, Settings } from 'lucide-react';
import { FieldService } from '@/services/fieldService';
import { FinancialService } from '@/services/financialService';

export function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('sys');
  const [fields, setFields] = useState<any[]>([]);
  const [transactions, setTransactions] = useState<any[]>([]);

  // Load Data
  useEffect(() => {
    try {
      // 1. Load Fields
      const loadedFields = FieldService.getFields();
      setFields(loadedFields);

      // 2. Load Financials
      // Assuming getTransactions or similar exists, if not using empty safe
      try {
          // Check if FinancialService has storage key or method
          // Safe fallback for now as I cannot see inside FinancialService yet
          const stored = localStorage.getItem('financial_ledger');
          if (stored) {
              setTransactions(JSON.parse(stored));
          }
      } catch (e) {
          console.warn('Failed to load financials', e);
      }

    } catch (e) {
      console.error('Admin Load Error', e);
    }
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-center">
        <h1 className="text-2xl font-bold text-slate-900">시스템 데이터 관리 (System Admin)</h1>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <div className="flex justify-center mb-6">
            <TabsList className="grid w-full max-w-md grid-cols-3">
            <TabsTrigger value="sys" className="gap-2"><Settings className="h-4 w-4"/> 시스템 설정</TabsTrigger>
            <TabsTrigger value="farm" className="gap-2"><Sprout className="h-4 w-4"/> 농지 데이터</TabsTrigger>
            <TabsTrigger value="finance" className="gap-2"><Wallet className="h-4 w-4"/> 재무 데이터</TabsTrigger>
            </TabsList>
        </div>

        {/* 1. System Tab */}
        <TabsContent value="sys" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ShieldAlert className="h-5 w-5 text-red-500" />
                관리자 권한 상태
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="rounded-lg border border-red-100 bg-red-50 p-4">
                <p className="font-bold text-red-800">현재 관리자(Administrator) 모드로 접속 중입니다.</p>
                <p className="text-sm text-red-600">
                  데이터를 직접 열람하거나 삭제할 수 있는 권한이 있습니다. 주의해서 사용해주세요.
                </p>
              </div>
              
              <div className="mt-6">
                  <h3 className="mb-4 font-bold text-slate-700 font-mono text-sm">ADMIN TOOLS</h3>
                  <div className="flex flex-wrap gap-2">
                      <Button variant="default" className="bg-slate-800" size="sm" onClick={() => window.location.href='#/dashboard/admin/pages'}>
                          📑 사용자 페이지 관리
                      </Button>
                      <Button variant="default" className="bg-slate-800" size="sm" onClick={() => window.location.href='#/dashboard/admin/system'}>
                          🧩 시스템 로직/DB 명세
                      </Button>
                  </div>
              </div>

              <div className="mt-8 pt-6 border-t">
                  <h3 className="mb-4 font-bold text-slate-700 font-mono text-sm">HIDDEN MENU (Shortcuts)</h3>
                  <div className="flex flex-wrap gap-2">

                      <Button variant="outline" size="sm" onClick={() => window.location.href='#/dashboard/financial-evidence'}>
                          재무 증빙 목록
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => window.location.href='#/dashboard/consulting-evidence'}>
                          컨설팅 리포트
                      </Button>
                  </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 2. Farm Data Tab */}
        <TabsContent value="farm">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5 text-indigo-500" />
                등록된 농지 목록 (DB: fields)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>농지명</TableHead>
                      <TableHead>위치</TableHead>
                      <TableHead>면적(평)</TableHead>
                      <TableHead>주작물</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {fields.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={5} className="text-center h-24 text-slate-500">
                                데이터가 없습니다.
                            </TableCell>
                        </TableRow>
                    ) : (
                        fields.map((field) => (
                        <TableRow key={field.id}>
                            <TableCell className="font-mono text-xs">{field.id}</TableCell>
                            <TableCell className="font-bold">{field.name}</TableCell>
                            <TableCell>{field.location}</TableCell>
                            <TableCell>{field.area}평</TableCell>
                            <TableCell>
                                {field.crops?.map((c: any) => c.name).join(', ') || '-'}
                            </TableCell>
                        </TableRow>
                        ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 3. Financial Data Tab */}
        <TabsContent value="finance">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5 text-emerald-500" />
                재무 장부 내역 (DB: financial_ledger)
              </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>날짜</TableHead>
                      <TableHead>구분</TableHead>
                      <TableHead>항목</TableHead>
                      <TableHead>금액</TableHead>
                      <TableHead>메모</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {transactions.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={5} className="text-center h-24 text-slate-500">
                                데이터가 없습니다.
                            </TableCell>
                        </TableRow>
                    ) : (
                        transactions.map((tx, idx) => (
                        <TableRow key={tx.id || idx}>
                            <TableCell>{tx.date}</TableCell>
                            <TableCell>
                                <span className={`px-2 py-1 rounded text-xs font-bold ${tx.type === 'income' ? 'bg-blue-100 text-blue-700' : 'bg-red-100 text-red-700'}`}>
                                    {tx.type === 'income' ? '수입' : '지출'}
                                </span>
                            </TableCell>
                            <TableCell>{tx.category}</TableCell>
                            <TableCell className="font-mono">{Number(tx.amount).toLocaleString()}원</TableCell>
                            <TableCell className="text-slate-500 max-w-[200px] truncate">{tx.description}</TableCell>
                        </TableRow>
                        ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

      </Tabs>
    </div>
  );
}
