import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Calculator, Plus, Trash2, Tractor, Sprout, Coins } from 'lucide-react';
import type { CostDetail, RevenueItem } from '@/types/planning';

interface FinancialCalculatorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (costDetails: CostDetail, revenueItems: RevenueItem[]) => void;
  initialCosts?: CostDetail;
  initialRevenues?: RevenueItem[];
  cropName: string;
  fieldArea?: number; // pyeong
}

export function FinancialCalculatorModal({ 
    isOpen, onClose, onSave, initialCosts, initialRevenues, cropName, fieldArea = 300 
}: FinancialCalculatorModalProps) {
  
  // -- State --
  const [activeTab, setActiveTab] = useState('cost');
  
  // Cost State
  const [costs, setCosts] = useState<CostDetail>(initialCosts || {
      seeds: 0, fertilizer: 0, pesticide: 0, labor: 0, equipment: 0, other: 0
  });

  // Revenue State
  const [revenues, setRevenues] = useState<RevenueItem[]>(initialRevenues || [
      { id: '1', name: cropName || '주산물', amount: 1000, unit: 'kg', price: 3000 }
  ]);

  // -- Calculators Logic --
  
  // 1. Labor & Equipment Calculator
  const [laborMode, setLaborMode] = useState<'manual' | 'machine'>('manual');
  const calculateLabor = () => {
      // Mock Logic: Machine is faster but has equipment cost
      if (laborMode === 'machine') {
          // Assume 1 hour per 300pyeong with tractor
          setCosts(prev => ({
              ...prev,
              labor: 50000, // Operator cost
              equipment: 150000 // Rental cost
          }));
      } else {
          // Assume 4 hours per 300pyeong manual
          setCosts(prev => ({
              ...prev,
              labor: 200000, // 4 * 50000
              equipment: 0
          }));
      }
  };

  // 2. Fertilizer Calculator
  const [fertilizerType, setFertilizerType] = useState('standard');
  const calculateFertilizer = () => {
      // Mock Logic based on area
      const amountNeeded = (fieldArea / 300) * 20; // 20kg per 300pyeong
      const pricePer20kg = 15000;
      const total = Math.ceil(amountNeeded / 20) * pricePer20kg;
      
      setCosts(prev => ({ ...prev, fertilizer: total }));
  };


  // -- Handlers --
  const handleCostChange = (key: keyof CostDetail, value: number) => {
      setCosts(prev => ({ ...prev, [key]: value }));
  };

  const handleRevenueChange = (id: string, field: keyof RevenueItem, value: any) => {
      setRevenues(prev => prev.map(item => item.id === id ? { ...item, [field]: value } : item));
  };

  const addRevenueItem = () => {
      setRevenues(prev => [...prev, { 
          id: Math.random().toString(36).substr(2, 9), 
          name: '', amount: 0, unit: 'kg', price: 0 
      }]);
  };

  const removeRevenueItem = (id: string) => {
      setRevenues(prev => prev.filter(item => item.id !== id));
  };

  const handleSave = () => {
      onSave(costs, revenues);
      onClose();
  };

  // Summary
  const totalCost = Object.values(costs).reduce((a, b) => a + b, 0);
  const totalRevenue = revenues.reduce((sum, item) => sum + (item.amount * item.price), 0);
  const profit = totalRevenue - totalCost;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Calculator className="h-5 w-5 text-indigo-600" />
            상세 견적 및 수익 분석
          </DialogTitle>
          <DialogDescription>
            {cropName} ({fieldArea}평) 기준 예상 비용과 매출을 상세히 산출합니다.
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto py-2">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full grid-cols-2 mb-4">
                    <TabsTrigger value="cost">비용 (지출)</TabsTrigger>
                    <TabsTrigger value="revenue">매출 (수익)</TabsTrigger>
                </TabsList>

                {/* --- COST TAB --- */}
                <TabsContent value="cost" className="space-y-6">
                    
                    {/* Calculator Helpers */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* A. Labor/Equip Calculator */}
                        <div className="rounded-xl bg-orange-50 p-4 border border-orange-100">
                             <div className="flex items-center gap-2 mb-3 font-bold text-orange-800">
                                <Tractor className="h-4 w-4" /> 인건비/장비 자동 산출
                             </div>
                             <div className="space-y-3">
                                 <div className="flex gap-2">
                                     <Button 
                                        variant={laborMode === 'manual' ? 'default' : 'outline'} 
                                        size="sm" onClick={() => setLaborMode('manual')}
                                        className={laborMode === 'manual' ? "bg-orange-500 hover:bg-orange-600" : ""}
                                     >인력 중심</Button>
                                     <Button 
                                        variant={laborMode === 'machine' ? 'default' : 'outline'} 
                                        size="sm" onClick={() => setLaborMode('machine')}
                                        className={laborMode === 'machine' ? "bg-orange-500 hover:bg-orange-600" : ""}
                                     >기계 중심</Button>
                                 </div>
                                 <p className="text-xs text-orange-700">
                                     {laborMode === 'manual' 
                                        ? '예상: 인부 2명 x 0.5일 (수작업)' 
                                        : '예상: 트랙터 1시간 + 오퍼레이터 (고효율)'}
                                 </p>
                                 <Button size="sm" variant="ghost" className="w-full border-orange-200 text-orange-600 hover:bg-orange-100" onClick={calculateLabor}>
                                     비용 자동 적용
                                 </Button>
                             </div>
                        </div>

                        {/* B. Fertilizer Calculator */}
                         <div className="rounded-xl bg-green-50 p-4 border border-green-100">
                             <div className="flex items-center gap-2 mb-3 font-bold text-green-800">
                                <Sprout className="h-4 w-4" /> 비료/자재 산출
                             </div>
                             <div className="space-y-3">
                                 <Input 
                                    className="h-8 bg-white" 
                                    value={fieldArea} 
                                    readOnly 
                                    placeholder="면적(평)" 
                                 />
                                 <p className="text-xs text-green-700">
                                     평준 시비량 기준 (맞춤비료 16호)
                                 </p>
                                 <Button size="sm" variant="ghost" className="w-full border-green-200 text-green-600 hover:bg-green-100" onClick={calculateFertilizer}>
                                     권장량 계산 및 적용
                                 </Button>
                             </div>
                        </div>
                    </div>

                    {/* Manual Input Form */}
                    <div className="grid grid-cols-2 gap-x-6 gap-y-4">
                        <div className="space-y-1">
                            <Label>🌱 종자/묘목대</Label>
                            <Input type="number" value={costs.seeds} onChange={(e) => handleCostChange('seeds', Number(e.target.value))} />
                        </div>
                         <div className="space-y-1">
                            <Label>💊 비료/퇴비</Label>
                            <Input type="number" value={costs.fertilizer} onChange={(e) => handleCostChange('fertilizer', Number(e.target.value))} />
                        </div>
                         <div className="space-y-1">
                            <Label>🧪 농약/방제비</Label>
                            <Input type="number" value={costs.pesticide} onChange={(e) => handleCostChange('pesticide', Number(e.target.value))} />
                        </div>
                         <div className="space-y-1">
                            <Label>👷 인건비</Label>
                            <Input type="number" value={costs.labor} onChange={(e) => handleCostChange('labor', Number(e.target.value))} />
                        </div>
                         <div className="space-y-1">
                            <Label>🚜 장비 사용료</Label>
                            <Input type="number" value={costs.equipment} onChange={(e) => handleCostChange('equipment', Number(e.target.value))} />
                        </div>
                         <div className="space-y-1">
                            <Label>🎸 기타 비용</Label>
                            <Input type="number" value={costs.other} onChange={(e) => handleCostChange('other', Number(e.target.value))} />
                        </div>
                    </div>

                    <div className="rounded-lg bg-slate-100 p-4 text-right">
                         <span className="text-sm text-slate-500 mr-4">총 예상 비용</span>
                         <span className="text-xl font-bold text-red-600">-{totalCost.toLocaleString()}원</span>
                    </div>

                </TabsContent>

                {/* --- REVENUE TAB --- */}
                <TabsContent value="revenue" className="space-y-4">
                    <div className="flex justify-between items-center">
                        <h4 className="font-bold text-slate-700">매출 항목 구성</h4>
                        <Button size="sm" onClick={addRevenueItem} variant="outline" className="gap-1">
                            <Plus className="h-4 w-4" /> 항목 추가
                        </Button>
                    </div>

                    <div className="space-y-3">
                        {revenues.map((item, idx) => (
                            <div key={item.id} className="flex items-end gap-3 rounded-lg border p-3 bg-white shadow-sm">
                                <div className="space-y-1 flex-1">
                                    <Label className="text-xs text-slate-500">항목명</Label>
                                    <Input 
                                        value={item.name} 
                                        onChange={(e) => handleRevenueChange(item.id, 'name', e.target.value)} 
                                        placeholder="예: 쌀, 볏짚"
                                    />
                                </div>
                                <div className="space-y-1 w-24">
                                    <Label className="text-xs text-slate-500">수량</Label>
                                    <Input 
                                        type="number"
                                        value={item.amount} 
                                        onChange={(e) => handleRevenueChange(item.id, 'amount', Number(e.target.value))} 
                                    />
                                </div>
                                <div className="space-y-1 w-20">
                                    <Label className="text-xs text-slate-500">단위</Label>
                                    <Input 
                                        value={item.unit} 
                                        onChange={(e) => handleRevenueChange(item.id, 'unit', e.target.value)} 
                                    />
                                </div>
                                <div className="space-y-1 w-32">
                                    <Label className="text-xs text-slate-500">단가(원)</Label>
                                    <Input 
                                        type="number"
                                        value={item.price} 
                                        onChange={(e) => handleRevenueChange(item.id, 'price', Number(e.target.value))} 
                                    />
                                </div>
                                <div className="pb-1 w-28 text-right font-bold text-blue-600">
                                    {(item.amount * item.price).toLocaleString()}
                                </div>
                                <Button size="icon" variant="ghost" onClick={() => removeRevenueItem(item.id)} className="text-red-400 hover:text-red-500">
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            </div>
                        ))}
                    </div>

                     <div className="rounded-lg bg-blue-50 p-4 text-right border border-blue-100">
                         <span className="text-sm text-slate-500 mr-4">총 예상 매출</span>
                         <span className="text-xl font-bold text-blue-600">+{totalRevenue.toLocaleString()}원</span>
                    </div>
                </TabsContent>
            </Tabs>
        </div>

        <DialogFooter className="flex items-center justify-between border-t pt-4">
             <div className="flex-1 flex gap-4 text-sm">
                 <div className={`font-bold ${profit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    예상 순수익: {profit > 0 ? '+' : ''}{profit.toLocaleString()}원
                 </div>
             </div>
             <div className="flex gap-2">
                <Button variant="outline" onClick={onClose}>취소</Button>
                <Button onClick={handleSave} className="bg-indigo-600 hover:bg-indigo-700">적용하기</Button>
             </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
