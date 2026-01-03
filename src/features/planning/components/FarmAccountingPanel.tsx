import React from 'react';
import { Card } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Calculator } from 'lucide-react';
import type { CropPlan } from '@/types/planning';

interface FarmAccountingPanelProps {
  plans: CropPlan[];
}

export function FarmAccountingPanel({ plans }: FarmAccountingPanelProps) {
  // Sort plans by planting date (descending)
  const sortedPlans = [...plans].sort((a, b) => new Date(b.plantingDate).getTime() - new Date(a.plantingDate).getTime());

  const totalRevenue = plans.reduce((sum, p) => sum + (p.targetYield * p.targetPrice), 0);
  const totalCost = plans.reduce((sum, p) => sum + (p.estimatedCost || 0), 0);
  const totalProfit = totalRevenue - totalCost;

  return (
    <Card className="border-indigo-100 shadow-sm">
      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="accounting-history" className="border-none">
          <div className="flex items-center justify-between px-6 py-2">
             <div className="flex items-center gap-2">
                 <Calculator className="h-5 w-5 text-indigo-600" />
                 <h3 className="text-lg font-bold text-slate-800">농지 회계 내역 상세</h3>
             </div>
             <AccordionTrigger className="w-auto py-2 hover:no-underline">
                 <span className="text-sm font-medium text-slate-500 mr-2">
                    {plans.length}건의 기록 보기
                 </span>
             </AccordionTrigger>
          </div>
          
          <AccordionContent className="px-6 pb-6 pt-0">
             <Table>
                <TableHeader>
                    <TableRow className="bg-slate-50 hover:bg-slate-50">
                        <TableHead className="w-[150px]">작물</TableHead>
                        <TableHead className="w-[200px]">기간</TableHead>
                        <TableHead className="text-right">예상 매출</TableHead>
                        <TableHead className="text-right">예상 비용</TableHead>
                        <TableHead className="text-right font-bold text-slate-900">순수익</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {sortedPlans.map((plan) => {
                        const revenue = plan.revenueItems 
                            ? plan.revenueItems.reduce((acc, item) => acc + (item.amount * item.price), 0)
                            : (plan.targetYield * plan.targetPrice); // Fallback
                            
                        const totalCost = plan.costDetails 
                            ? Object.values(plan.costDetails).reduce((acc, val) => acc + (val || 0), 0)
                            : (plan.estimatedCost || 0);

                        const profit = revenue - totalCost;

                        return (
                            <React.Fragment key={plan.id}>
                                <TableRow className="cursor-pointer hover:bg-slate-100" onClick={(e) => {
                                    // Simple toggle logic can be added here or use a separate state to track expanded rows
                                    // For now, let's just show it expanded or make it cleaner.
                                    // Actually, we need state to toggle details.
                                    const detailsRow = document.getElementById(`details-${plan.id}`);
                                    if(detailsRow) detailsRow.classList.toggle('hidden');
                                }}>
                                    <TableCell className="font-medium">
                                        <div className="flex items-center gap-2">
                                            <div className="h-2 w-2 rounded-full bg-indigo-400"></div>
                                            {plan.cropName}
                                            {/* Badge for multi-product */}
                                            {plan.revenueItems && plan.revenueItems.length > 1 && (
                                                <span className="rounded bg-indigo-100 px-1.5 py-0.5 text-[10px] text-indigo-700">복합매출</span>
                                            )}
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-slate-500 text-xs">
                                        {plan.plantingDate} ~ {plan.expectedHarvestDate}
                                    </TableCell>
                                    <TableCell className="text-right text-blue-600">
                                        +{revenue.toLocaleString()}원
                                    </TableCell>
                                    <TableCell className="text-right text-red-500">
                                        -{totalCost.toLocaleString()}원
                                    </TableCell>
                                    <TableCell className={`text-right font-bold ${profit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                        {profit > 0 ? '+' : ''}{profit.toLocaleString()}원
                                    </TableCell>
                                </TableRow>
                                {/* Detailed Breakdown Row */}
                                <TableRow id={`details-${plan.id}`} className="bg-slate-50/50 hidden">
                                    <TableCell colSpan={5} className="p-0">
                                        <div className="flex gap-8 p-4 pl-12 text-xs">
                                            {/* Revenue Details */}
                                            <div className="flex-1 space-y-2">
                                                <p className="font-bold text-slate-700 mb-1 border-b pb-1">매출 상세</p>
                                                {plan.revenueItems ? (
                                                    plan.revenueItems.map((item, idx) => (
                                                        <div key={idx} className="flex justify-between">
                                                            <span>{item.name} ({item.amount}{item.unit})</span>
                                                            <span className="text-blue-600">+{ (item.amount * item.price).toLocaleString()}</span>
                                                        </div>
                                                    ))
                                                ) : (
                                                     <div className="flex justify-between">
                                                        <span>기본 매출 (수확량 x 단가)</span>
                                                        <span className="text-blue-600">+{revenue.toLocaleString()}</span>
                                                    </div>
                                                )}
                                            </div>
                                            
                                            {/* Cost Details */}
                                            <div className="flex-1 space-y-2">
                                                <p className="font-bold text-slate-700 mb-1 border-b pb-1">지출 상세</p>
                                                {plan.costDetails ? (
                                                    Object.entries(plan.costDetails).map(([key, value]) => (
                                                        <div key={key} className="flex justify-between">
                                                            <span className="capitalize">
                                                                {key === 'seeds' ? '종자' :
                                                                 key === 'fertilizer' ? '비료' :
                                                                 key === 'pesticide' ? '농약' :
                                                                 key === 'labor' ? '인건비' :
                                                                 key === 'equipment' ? '장비' : '기타'}
                                                            </span>
                                                            <span className="text-red-500">-{ (value as number).toLocaleString()}</span>
                                                        </div>
                                                    ))
                                                ) : (
                                                    <div className="flex justify-between">
                                                        <span>예상 비용 합계</span>
                                                        <span className="text-red-500">-{totalCost.toLocaleString()}</span>
                                                    </div>
                                                )}
                                            </div>

                                            {/* Insights/Calculator Placeholders */}
                                             <div className="w-48 space-y-2 border-l pl-4">
                                                <p className="font-bold text-slate-700 mb-1">인사이트</p>
                                                <div className="text-[10px] text-slate-500">
                                                    * 장비 사용 시 인건비 30% 절감 가능
                                                </div>
                                                 <div className="text-[10px] text-slate-500">
                                                    * 추천 비료: 맞춤 16호
                                                </div>
                                            </div>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            </React.Fragment>
                        );
                    })}
                    {/* Summary Row */}
                     <TableRow className="bg-slate-50/80 font-bold hover:bg-slate-50">
                        <TableCell colSpan={2} className="text-center text-slate-500">합계</TableCell>
                        <TableCell className="text-right text-blue-700">+{totalRevenue.toLocaleString()}원</TableCell>
                        <TableCell className="text-right text-red-700">-{totalCost.toLocaleString()}원</TableCell>
                        <TableCell className={`text-right text-lg ${totalProfit >= 0 ? 'text-green-700' : 'text-red-700'}`}>
                           {totalProfit > 0 ? '+' : ''}{totalProfit.toLocaleString()}원
                        </TableCell>
                    </TableRow>
                </TableBody>
             </Table>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </Card>
  );
}
