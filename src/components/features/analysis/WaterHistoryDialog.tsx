import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Trash2, Plus, Droplets } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';

interface WaterHistory {
  id: string;
  date: string;
  ph: string;
  ec: string;
  no3_n: string;
  nh4_n: string;
  p: string;
  k: string;
  ca: string;
  mg: string;
  s: string;
  fe: string;

  // Additional mineral fields
  mn?: string;
  b?: string;
  zn?: string;
  cu?: string;
  mo?: string;
  cl?: string;
  na?: string;
  hco3?: string;
}

interface WaterHistoryDialogProps {
  history: WaterHistory[];
  onUpdate: (history: WaterHistory[]) => void;
}

export function WaterHistoryDialog({ history, onUpdate }: WaterHistoryDialogProps) {
  const [open, setOpen] = useState(false);
  const [newRecord, setNewRecord] = useState<Partial<WaterHistory>>({
    date: new Date().toISOString().split('T')[0],
    ph: '',
    ec: '',
    no3_n: '',
    nh4_n: '',
    p: '',
    k: '',
    ca: '',
    mg: '',
    s: '',
    fe: '',
    mn: '',
    b: '',
    zn: '',
    cu: '',
    mo: '',
    cl: '',
    na: '',
    hco3: '',
  });

  const handleAdd = () => {
    if (!newRecord.date) return;
    const record: WaterHistory = {
      id: crypto.randomUUID(),
      date: newRecord.date,
      ph: newRecord.ph || '0',
      ec: newRecord.ec || '0',
      no3_n: newRecord.no3_n || '0',
      nh4_n: newRecord.nh4_n || '0',
      p: newRecord.p || '0',
      k: newRecord.k || '0',
      ca: newRecord.ca || '0',
      mg: newRecord.mg || '0',
      s: newRecord.s || '0',
      fe: newRecord.fe || '0',
      mn: newRecord.mn || '0',
      b: newRecord.b || '0',
      zn: newRecord.zn || '0',
      cu: newRecord.cu || '0',
      mo: newRecord.mo || '0',
      cl: newRecord.cl || '0',
      na: newRecord.na || '0',
      hco3: newRecord.hco3 || '0',
    };
    onUpdate([...history, record]);
    setNewRecord({
      date: new Date().toISOString().split('T')[0],
      ph: '',
      ec: '',
      no3_n: '',
      nh4_n: '',
      p: '',
      k: '',
      ca: '',
      mg: '',
      s: '',
      fe: '',
      mn: '',
      b: '',
      zn: '',
      cu: '',
      mo: '',
      cl: '',
      na: '',
      hco3: '',
    });
  };

  const handleRemove = (id: string) => {
    onUpdate(history.filter((h) => h.id !== id));
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="flex h-12 w-full items-center justify-center gap-2 text-lg"
        >
          <Droplets className="h-5 w-5" />
          수질 분석 이력 관리 ({history.length}건)
        </Button>
      </DialogTrigger>
      <DialogContent className="flex max-h-[90vh] max-w-5xl flex-col p-0">
        <div className="p-6 pb-2">
          <DialogHeader>
            <DialogTitle>수질 분석 이력 관리</DialogTitle>
          </DialogHeader>
        </div>

        <div className="flex flex-1 flex-col gap-6 overflow-hidden p-6 pt-2">
          {/* 입력 폼 (Scrollable if needed) */}
          <div className="shrink-0 rounded-lg border bg-slate-50 p-4">
            <h4 className="mb-4 text-sm font-bold text-slate-700">새 분석 결과 입력</h4>
            <div className="grid grid-cols-2 gap-3 lg:grid-cols-6">
              <div className="col-span-2 space-y-1">
                <label className="text-xs font-medium">검사일자</label>
                <Input
                  type="date"
                  value={newRecord.date}
                  onChange={(e) => setNewRecord({ ...newRecord, date: e.target.value })}
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-medium">산도(pH)</label>
                <Input
                  type="number"
                  step="0.1"
                  value={newRecord.ph}
                  onChange={(e) => setNewRecord({ ...newRecord, ph: e.target.value })}
                  placeholder="pH"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-medium">전도도(EC)</label>
                <Input
                  type="number"
                  step="0.1"
                  value={newRecord.ec}
                  onChange={(e) => setNewRecord({ ...newRecord, ec: e.target.value })}
                  placeholder="dS/m"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-medium">질산태(NO3)</label>
                <Input
                  type="number"
                  step="0.1"
                  value={newRecord.no3_n}
                  onChange={(e) => setNewRecord({ ...newRecord, no3_n: e.target.value })}
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-medium">암모니아(NH4)</label>
                <Input
                  type="number"
                  step="0.1"
                  value={newRecord.nh4_n}
                  onChange={(e) => setNewRecord({ ...newRecord, nh4_n: e.target.value })}
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium">다량-P</label>
                <Input
                  type="number"
                  step="0.1"
                  value={newRecord.p}
                  onChange={(e) => setNewRecord({ ...newRecord, p: e.target.value })}
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-medium">다량-K</label>
                <Input
                  type="number"
                  step="0.1"
                  value={newRecord.k}
                  onChange={(e) => setNewRecord({ ...newRecord, k: e.target.value })}
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-medium">다량-Ca</label>
                <Input
                  type="number"
                  step="0.1"
                  value={newRecord.ca}
                  onChange={(e) => setNewRecord({ ...newRecord, ca: e.target.value })}
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-medium">다량-Mg</label>
                <Input
                  type="number"
                  step="0.1"
                  value={newRecord.mg}
                  onChange={(e) => setNewRecord({ ...newRecord, mg: e.target.value })}
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-medium">다량-S</label>
                <Input
                  type="number"
                  step="0.1"
                  value={newRecord.s}
                  onChange={(e) => setNewRecord({ ...newRecord, s: e.target.value })}
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-medium">미량-Fe</label>
                <Input
                  type="number"
                  step="0.01"
                  value={newRecord.fe}
                  onChange={(e) => setNewRecord({ ...newRecord, fe: e.target.value })}
                />
              </div>

              {/* Additional Fields requested by user */}
              <div className="space-y-1">
                <label className="text-xs font-medium">미량-Mn</label>
                <Input
                  type="number"
                  step="0.01"
                  value={newRecord.mn}
                  onChange={(e) => setNewRecord({ ...newRecord, mn: e.target.value })}
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-medium">미량-B</label>
                <Input
                  type="number"
                  step="0.01"
                  value={newRecord.b}
                  onChange={(e) => setNewRecord({ ...newRecord, b: e.target.value })}
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-medium">미량-Zn</label>
                <Input
                  type="number"
                  step="0.01"
                  value={newRecord.zn}
                  onChange={(e) => setNewRecord({ ...newRecord, zn: e.target.value })}
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-medium">미량-Cu</label>
                <Input
                  type="number"
                  step="0.01"
                  value={newRecord.cu}
                  onChange={(e) => setNewRecord({ ...newRecord, cu: e.target.value })}
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-medium">미량-Mo</label>
                <Input
                  type="number"
                  step="0.01"
                  value={newRecord.mo}
                  onChange={(e) => setNewRecord({ ...newRecord, mo: e.target.value })}
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium">이온-Cl</label>
                <Input
                  type="number"
                  step="0.1"
                  value={newRecord.cl}
                  onChange={(e) => setNewRecord({ ...newRecord, cl: e.target.value })}
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-medium">이온-Na</label>
                <Input
                  type="number"
                  step="0.1"
                  value={newRecord.na}
                  onChange={(e) => setNewRecord({ ...newRecord, na: e.target.value })}
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-medium">HCO3</label>
                <Input
                  type="number"
                  step="0.1"
                  value={newRecord.hco3}
                  onChange={(e) => setNewRecord({ ...newRecord, hco3: e.target.value })}
                />
              </div>
            </div>
            <Button className="mt-4 w-full" onClick={handleAdd}>
              <Plus className="mr-2 h-4 w-4" />
              추가하기
            </Button>
          </div>

          {/* 목록 테이블 (Scrollable) */}
          <div className="relative flex-1 overflow-hidden rounded-lg border">
            <ScrollArea className="h-full max-h-[400px]">
              <Table>
                <TableHeader className="sticky top-0 z-10 bg-slate-100">
                  <TableRow>
                    <TableHead className="w-[100px]">날짜</TableHead>
                    <TableHead>pH</TableHead>
                    <TableHead>EC</TableHead>
                    <TableHead>NO3</TableHead>
                    <TableHead>Ca</TableHead>
                    <TableHead>Mg</TableHead>
                    <TableHead>Fe</TableHead>
                    <TableHead>Mn</TableHead>
                    <TableHead className="w-[50px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {history.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={9} className="py-8 text-center text-slate-400">
                        등록된 이력이 없습니다.
                      </TableCell>
                    </TableRow>
                  ) : (
                    history.map((h) => (
                      <TableRow key={h.id}>
                        <TableCell className="font-medium">{h.date}</TableCell>
                        <TableCell>{h.ph}</TableCell>
                        <TableCell>{h.ec}</TableCell>
                        <TableCell>{h.no3_n}</TableCell>
                        <TableCell>{h.ca}</TableCell>
                        <TableCell>{h.mg}</TableCell>
                        <TableCell>{h.fe}</TableCell>
                        <TableCell>{h.mn || '-'}</TableCell>
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleRemove(h.id)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </ScrollArea>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
