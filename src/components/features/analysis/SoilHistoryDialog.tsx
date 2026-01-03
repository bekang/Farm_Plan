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
import { Trash2, Plus, FlaskConical } from 'lucide-react';

interface SoilHistory {
  id: string;
  date: string;
  ph: string;
  ec: string;
  om: string;
  p: string;
  k: string;
  ca: string;
  mg: string;
}

interface SoilHistoryDialogProps {
  history: SoilHistory[];
  onUpdate: (history: SoilHistory[]) => void;
}

export function SoilHistoryDialog({ history, onUpdate }: SoilHistoryDialogProps) {
  const [open, setOpen] = useState(false);
  const [newRecord, setNewRecord] = useState<Partial<SoilHistory>>({
    date: new Date().toISOString().split('T')[0],
    ph: '',
    ec: '',
    om: '',
    p: '',
    k: '',
    ca: '',
    mg: '',
  });

  const handleAdd = () => {
    if (!newRecord.date) return;
    const record: SoilHistory = {
      id: crypto.randomUUID(),
      date: newRecord.date,
      ph: newRecord.ph || '0',
      ec: newRecord.ec || '0',
      om: newRecord.om || '0',
      p: newRecord.p || '0',
      k: newRecord.k || '0',
      ca: newRecord.ca || '0',
      mg: newRecord.mg || '0',
    };
    onUpdate([...history, record]);
    setNewRecord({
      date: new Date().toISOString().split('T')[0],
      ph: '',
      ec: '',
      om: '',
      p: '',
      k: '',
      ca: '',
      mg: '',
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
          <FlaskConical className="h-5 w-5" />
          토양 분석 이력 관리 ({history.length}건)
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[80vh] max-w-4xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle>토양 분석 이력 관리</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* 입력 폼 */}
          <div className="rounded-lg border bg-slate-50 p-4">
            <h4 className="mb-4 text-sm font-bold text-slate-700">새 분석 결과 입력</h4>
            <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
              <div className="space-y-1">
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
                <label className="text-xs font-medium">전기전도도(EC)</label>
                <Input
                  type="number"
                  step="0.1"
                  value={newRecord.ec}
                  onChange={(e) => setNewRecord({ ...newRecord, ec: e.target.value })}
                  placeholder="dS/m"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-medium">유기물(OM)</label>
                <Input
                  type="number"
                  step="0.1"
                  value={newRecord.om}
                  onChange={(e) => setNewRecord({ ...newRecord, om: e.target.value })}
                  placeholder="g/kg"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-medium">유효인산(P2O5)</label>
                <Input
                  type="number"
                  value={newRecord.p}
                  onChange={(e) => setNewRecord({ ...newRecord, p: e.target.value })}
                  placeholder="mg/kg"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-medium">칼륨(K)</label>
                <Input
                  type="number"
                  step="0.1"
                  value={newRecord.k}
                  onChange={(e) => setNewRecord({ ...newRecord, k: e.target.value })}
                  placeholder="cmol+/kg"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-medium">칼슘(Ca)</label>
                <Input
                  type="number"
                  step="0.1"
                  value={newRecord.ca}
                  onChange={(e) => setNewRecord({ ...newRecord, ca: e.target.value })}
                  placeholder="cmol+/kg"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-medium">마그네슘(Mg)</label>
                <Input
                  type="number"
                  step="0.1"
                  value={newRecord.mg}
                  onChange={(e) => setNewRecord({ ...newRecord, mg: e.target.value })}
                  placeholder="cmol+/kg"
                />
              </div>
            </div>
            <Button className="mt-4 w-full" onClick={handleAdd}>
              <Plus className="mr-2 h-4 w-4" />
              추가하기
            </Button>
          </div>

          {/* 목록 테이블 */}
          <div className="overflow-hidden rounded-lg border">
            <Table>
              <TableHeader>
                <TableRow className="bg-slate-100">
                  <TableHead>날짜</TableHead>
                  <TableHead>pH</TableHead>
                  <TableHead>EC</TableHead>
                  <TableHead>OM</TableHead>
                  <TableHead>P2O5</TableHead>
                  <TableHead>K</TableHead>
                  <TableHead>Ca</TableHead>
                  <TableHead>Mg</TableHead>
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
                      <TableCell>{h.date}</TableCell>
                      <TableCell>{h.ph}</TableCell>
                      <TableCell>{h.ec}</TableCell>
                      <TableCell>{h.om}</TableCell>
                      <TableCell>{h.p}</TableCell>
                      <TableCell>{h.k}</TableCell>
                      <TableCell>{h.ca}</TableCell>
                      <TableCell>{h.mg}</TableCell>
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
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
