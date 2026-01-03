import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MapPin, Warehouse, Ruler, ArrowLeft, Calendar } from 'lucide-react'; // Restored Calendar
import type { Field } from '@/types/farm';

interface FieldDetailProps {
  field: Field;
  onBack: () => void;
  // onUpdate: (updatedField: Field) => void; // Unused for now
}

export function FieldDetail({ field, onBack }: FieldDetailProps) {
  // const [isEditing, setIsEditing] = useState(false); // Removed unused edit logic for now
  // const [editForm, setEditForm] = useState<Field>(field);

  /* Unused handlers... */

  /*
  const handleSave = () => {
      setIsEditing(false);
  };
  */

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Button variant="ghost" onClick={onBack} className="gap-2 pl-0 hover:bg-transparent">
          <ArrowLeft className="h-5 w-5" /> 목록으로 돌아가기
        </Button>
        <div className="flex gap-2">
            {/* Edit button temporarily removed until implementation */}
            <Button variant="outline" disabled>
                수정 모드 (준비중)
            </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Basic Info Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5 text-blue-500" /> 기본 정보
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
                <label className="text-sm font-medium text-gray-500">농지 이름</label>
                <div className="text-lg font-bold">{field.name}</div>
            </div>
            <div>
                <label className="text-sm font-medium text-gray-500">위치 (주소)</label>
                <div className="text-base">{field.location || '-'}</div>
                <div className="text-sm text-gray-400">
                    {field.address?.province} {field.address?.city} {field.address?.town}
                </div>
            </div>
            <div>
                 <label className="text-sm font-medium text-gray-500">설명</label>
                 <div className="text-base">{field.description || '-'}</div>
            </div>
          </CardContent>
        </Card>

        {/* Specs Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
               <Warehouse className="h-5 w-5 text-green-500" /> 시설 및 환경
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
             <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="flex items-center gap-1 text-sm font-medium text-gray-500">
                        <Ruler className="h-4 w-4" /> 면적
                    </label>
                    <div className="font-mono text-lg">{field.area?.toLocaleString()}평</div>
                </div>
                <div>
                     <label className="flex items-center gap-1 text-sm font-medium text-gray-500">
                        <Warehouse className="h-4 w-4" /> 시설 유형
                     </label>
                     <div className="text-lg">
                        {field.facilityType === 'open_field' ? '노지' :
                         field.facilityType === 'vinyl_single' ? '비닐하우스(단동)' :
                         field.facilityType === 'vinyl_multi' ? '비닐하우스(연동)' :  field.facilityType}
                     </div>
                </div>
             </div>

             <div className="border-t pt-4">
                 <label className="mb-2 block text-sm font-medium text-gray-500">보유 설비</label>
                 <div className="flex flex-wrap gap-2">
                     {field.equipment?.heating && (
                         <span className="rounded-full bg-red-100 px-3 py-1 text-xs text-red-700">난방기</span>
                     )}
                     {field.specs?.coolingType && field.specs.coolingType !== 'none' && (
                         <span className="rounded-full bg-blue-100 px-3 py-1 text-xs text-blue-700">냉방기 ({field.specs.coolingType})</span>
                     )}
                     {field.equipment?.controller && (
                         <span className="rounded-full bg-indigo-100 px-3 py-1 text-xs text-indigo-700">스마트 제어기</span>
                     )}
                     {!field.equipment && <span className="text-sm text-gray-400">등록된 설비 없음</span>}
                 </div>
             </div>
          </CardContent>
        </Card>
        
        {/* History / Status */}
        <Card className="md:col-span-2">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-orange-500" /> 최근 이력
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="text-center text-sm text-gray-500 py-8">
                    최근 작업 또는 분석 이력이 없습니다.
                </div>
            </CardContent>
        </Card>
      </div>

       {/* Suppress unused vars via void if needed, but here we just commented out logic */}
       <div className="hidden">
          {/* Use vars to suppress compiled unused warning if TS persists even with comments?? No, commented out code doesn't existing for TS */}
          {/* But editForm IS used in useState, but never read? setEditForm is used. editForm is passed to useState. */}
          {/* If editForm is never read, we should remove it. */}
          {/* We used editForm in handleSave? No, commented out onUpdate. */}
          {/* So editForm is unused. */}
       </div>
    </div>
  );
}
