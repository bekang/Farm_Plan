import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Calculator } from 'lucide-react';

export function FinancialEvidenceButton() {
  const navigate = useNavigate();

  return (
    <Button
      variant="outline"
      className="h-12 w-full border-slate-300 text-slate-600 hover:bg-slate-50"
      onClick={() => navigate('/dashboard/financial-evidence')}
    >
      <Calculator className="mr-2 h-5 w-5" />
      수입/지출 산출 근거 확인하기
    </Button>
  );
}
