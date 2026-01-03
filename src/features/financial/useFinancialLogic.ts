import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { FinancialService } from '@/services/financialService';
import { FieldService } from '@/services/fieldService';
import type { FinancialTransaction } from '@/data/processed/farm_types';

export function useFinancialLogic() {
  const navigate = useNavigate();

  // State
  const [transactions, setTransactions] = useState<FinancialTransaction[]>([]);
  const [stats, setStats] = useState<any>(null); // Overall Stats
  const [fieldStats, setFieldStats] = useState<any[]>([]); // Per Field Breakdown
  const [isLoading, setIsLoading] = useState(true);
  const [filterType, setFilterType] = useState<'all' | 'income' | 'expense'>('all');

  // Load Data
  const [startDate, setStartDate] = useState<string>(`${new Date().getFullYear()}-01-01`);
  const [endDate, setEndDate] = useState<string>(`${new Date().getFullYear()}-12-31`);

  // Load Data
  useEffect(() => {
    const loadFinancials = async () => {
      setIsLoading(true);
      try {
        // 1. Get All Transactions
        const allTxs = await FinancialService.getAllTransactions();
        
        // 2. Filter by Date
        const filteredTxs = allTxs.filter(t => t.date >= startDate && t.date <= endDate);
        setTransactions(filteredTxs);

        // 3. Calculate Overall Stats (using filtered data)
        const loadedStats = await FinancialService.getOverallSummary(filteredTxs);
        setStats(loadedStats);

        // 4. Load Per-Field Stats (using filtered data)
        const fields = FieldService.getFields();
        const fieldStatPromises = fields.map(async (field) => {
             const summary = await FinancialService.getFieldSummary(String(field.id), filteredTxs);
             return {
                 ...summary.stats,
                 name: `${field.name} (${field.location})`,
                 simpleName: field.name
             };
        });
        
        const loadedFieldStats = await Promise.all(fieldStatPromises);
        setFieldStats(loadedFieldStats);
      } catch (error) {
        console.error('Financial load failed:', error);
      } finally {
        setIsLoading(false);
      }
    };
    loadFinancials();
  }, [startDate, endDate]);

  // Derived Logic for Table
  // Derived Logic for Table (Memoized to prevent infinite loops)
  const filteredTransactions = useMemo(() => {
    return transactions.filter((t) => {
      if (filterType === 'all') return true;
      return t.type === filterType;
    });
  }, [transactions, filterType]);

  const handleNavigate = (path: string) => navigate(path);

  // Excel Export Logic
  const handleExportToExcel = async () => {
    if (transactions.length === 0) {
      alert('내보낼 데이터가 없습니다.');
      return;
    }

    try {
      // 1. Prepare Data
      const excelData = transactions.map((t) => ({
        Date: t.date,
        'Field ID': t.field_id,
        Type: t.type === 'income' ? '수입' : '지출',
        Category: t.category,
        Description: t.description,
        Amount: t.amount,
      }));

      // 2. Create Workbook
      const worksheet = XLSX.utils.json_to_sheet(excelData);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Ledger');

      // 3. Save File
      const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
      const blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
      const defaultName = `Farm_Ledger_${new Date().toISOString().split('T')[0]}.xlsx`;

      // Modern Browsers: Show "Save As" Dialog
      // @ts-ignore
      if (window.showSaveFilePicker) {
        try {
          // @ts-ignore
          const fileHandle = await window.showSaveFilePicker({
            suggestedName: defaultName,
            types: [
              {
                description: 'Excel File',
                accept: {
                  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
                },
              },
            ],
          });
          const writable = await fileHandle.createWritable();
          await writable.write(blob);
          await writable.close();
          return;
        } catch (err: any) {
          if (err.name === 'AbortError') return; // User cancelled
          console.warn('File System Access API failed, falling back...', err);
        }
      }

      // Fallback: Prompt for filename
      const userInput = window.prompt(
        '저장할 파일 명을 입력해주세요:',
        defaultName.replace('.xlsx', ''),
      );
      if (userInput) {
        const fileName = userInput.endsWith('.xlsx') ? userInput : `${userInput}.xlsx`;
        saveAs(blob, fileName);
      }
    } catch (error) {
      console.error('Export failed:', error);
      alert('엑셀 내보내기 중 오류가 발생했습니다.');
    }
  };

  return {
    state: {
      transactions: filteredTransactions,
      allTransactions: transactions,
      stats,
      isLoading,
      filterType,
      startDate,
      endDate,
      fieldStats,
      // Create a map using the detailed names from fieldStats, but we need simple names.
      // Since fieldStats has combined names, let's fix the root cause:
      // We should separate Name and Location in fieldStats or store the map separately.
      // Let's rely on the fact that we can fetch fields again or just assume we want to split by '(' if we are lazy,
      // but better to just use the fields if we had them.
      // Actually, I'll modify the `useEffect` to set a separate state for the map, or just `fieldStats` to have `simpleName`.
      fieldMap: fieldStats.reduce((acc, curr) => ({ ...acc, [String(curr.fieldId)]: curr.simpleName || curr.name.split(' (')[0] }), {} as Record<string, string>),
    },
    actions: {
      setFilterType,
      setStartDate,
      setEndDate,
      onNavigate: handleNavigate,
      exportToExcel: handleExportToExcel,
    },
  };
}
