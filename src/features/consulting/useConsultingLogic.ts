import { useState, useCallback } from 'react';
import { ConsultingService, type ConsultingReport } from '@/services/consultingService';

export function useConsultingLogic() {
  const [report, setReport] = useState<ConsultingReport | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateReport = useCallback(async (fieldId?: string) => {
    setIsLoading(true);
    setError(null);
    try {
      // Check if we are in field-specific mode or overall
      const targetId = fieldId || 'FARM-001';
      const data = await ConsultingService.generateReport(targetId);
      setReport(data);
    } catch (err) {
      console.error(err);
      setError('리포트 생성 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const exportReport = useCallback(async () => {
    if (!report) return;

    const jsonString = JSON.stringify(report, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const defaultName = `consulting_report_${new Date().toISOString().split('T')[0]}.json`;

    // Modern Browser: showSaveFilePicker
    // @ts-ignore
    if (window.showSaveFilePicker) {
      try {
        // @ts-ignore
        const fileHandle = await window.showSaveFilePicker({
          suggestedName: defaultName,
          types: [
            {
              description: 'JSON Report',
              accept: { 'application/json': ['.json'] },
            },
          ],
        });
        const writable = await fileHandle.createWritable();
        await writable.write(blob);
        await writable.close();
        return;
      } catch (err: any) {
        if (err.name === 'AbortError') return;
        console.warn('Save cancelled or failed', err);
      }
    }

    // Fallback
    const userInput = window.prompt(
      '저장할 파일 명을 입력해주세요:',
      defaultName.replace('.json', ''),
    );
    if (userInput) {
      const fileName = userInput.endsWith('.json') ? userInput : `${userInput}.json`;
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  }, [report]);

  return {
    state: {
      report,
      isLoading,
      error,
    },
    actions: {
      generateReport,
      exportReport,
    },
  };
}
