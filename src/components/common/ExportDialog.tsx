import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { X, FileSpreadsheet, FileImage, FileText, Calendar } from 'lucide-react';
import type { ExportFormat } from '@/services/exportService';

interface ExportDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onExport: (filename: string, format: ExportFormat) => void;
  defaultFilename: string;
  title?: string;
}

export function ExportDialog({
  isOpen,
  onClose,
  onExport,
  defaultFilename,
  title = '내보내기',
}: ExportDialogProps) {
  const [filename, setFilename] = useState(defaultFilename);
  const [format, setFormat] = useState<ExportFormat>('excel');

  if (!isOpen) return null;

  const handleExport = () => {
    onExport(filename, format);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 duration-200 animate-in fade-in">
      <Card className="w-full max-w-md border-slate-200 shadow-xl duration-200 animate-in zoom-in-95">
        <CardHeader className="flex flex-row items-center justify-between border-b pb-2">
          <CardTitle className="text-lg font-bold text-slate-800">{title}</CardTitle>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <X className="h-5 w-5" />
          </button>
        </CardHeader>
        <CardContent className="space-y-4 pt-4">
          {/* Filename Input */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">파일 이름</label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={filename}
                onChange={(e) => setFilename(e.target.value)}
                className="flex-1 rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="파일 이름을 입력하세요"
              />
              <span className="font-mono text-sm text-slate-500">
                .{format === 'image' ? 'png' : format === 'word' ? 'docx' : 'xlsx'}
              </span>
            </div>
          </div>

          {/* Format Selection */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">파일 형식</label>
            <div className="grid grid-cols-4 gap-2">
              <button
                onClick={() => setFormat('excel')}
                className={`flex flex-col items-center gap-2 rounded-lg border p-3 transition-all ${
                  format === 'excel'
                    ? 'border-green-500 bg-green-50 text-green-700 ring-1 ring-green-500'
                    : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                }`}
              >
                <FileSpreadsheet className="h-6 w-6" />
                <span className="text-xs font-medium">Excel</span>
              </button>
              <button
                onClick={() => setFormat('word')}
                className={`flex flex-col items-center gap-2 rounded-lg border p-3 transition-all ${
                  format === 'word'
                    ? 'border-blue-500 bg-blue-50 text-blue-700 ring-1 ring-blue-500'
                    : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                }`}
              >
                <FileText className="h-6 w-6" />
                <span className="text-xs font-medium">Word</span>
              </button>
              <button
                onClick={() => setFormat('image')}
                className={`flex flex-col items-center gap-2 rounded-lg border p-3 transition-all ${
                  format === 'image'
                    ? 'border-purple-500 bg-purple-50 text-purple-700 ring-1 ring-purple-500'
                    : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                }`}
              >
                <FileImage className="h-6 w-6" />
                <span className="text-xs font-medium">Image</span>
              </button>
              <button
                onClick={() => setFormat('calendar')}
                className={`flex flex-col items-center gap-2 rounded-lg border p-3 transition-all ${
                  format === 'calendar'
                    ? 'border-orange-500 bg-orange-50 text-orange-700 ring-1 ring-orange-500'
                    : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                }`}
              >
                <Calendar className="h-6 w-6" />
                <span className="text-xs font-medium">Calendar</span>
              </button>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="flex justify-end gap-2 pt-2">
            <Button variant="outline" onClick={onClose}>
              취소
            </Button>
            <Button
              onClick={handleExport}
              className="gap-2 bg-green-600 text-white hover:bg-green-700"
            >
              내보내기
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
