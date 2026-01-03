import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import type { Field } from '@/types/farm';

interface FieldListProps {
  fields: Field[];
  onSelectField: (field: Field) => void;
  onAddField: () => void;
  onDeleteField: (id: string) => void;
}

export function FieldList({ fields, onSelectField, onAddField, onDeleteField }: FieldListProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold tracking-tight">내 농지 목록</h2>
        <Button onClick={onAddField}>+ 새 농지 추가</Button>
      </div>

      {fields.length === 0 ? (
        <div className="rounded-lg border-2 border-dashed py-12 text-center text-gray-400">
          등록된 농지가 없습니다. 새로운 농지를 등록해보세요.
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {fields.map((field) => (
            <Card
              key={field.id}
              className="cursor-pointer transition-shadow hover:shadow-md"
              onClick={() => onSelectField(field)}
            >
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-lg font-bold">{field.name}</CardTitle>
                <span
                  className={`rounded-full px-2 py-1 text-xs bg-gray-100 text-gray-800`}
                >
                  {field.description || '작물 정보 없음'}
                </span>
              </CardHeader>
              <CardContent>
                <div className="space-y-1 text-sm text-gray-500">
                  <p>📍 {field.location || '위치 미지정'}</p>
                  <p>
                    {/* Access facilityType safely, assume string or use lookup */}
                    📐 {field.area}평 / {field.facilityType === 'open_field' ? '노지' : field.facilityType || '기타'}
                  </p>
                </div>
              </CardContent>
              <CardFooter className="flex justify-end pt-0">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-red-500 hover:bg-red-50 hover:text-red-700"
                  onClick={(e) => {
                    e.stopPropagation();
                    if (confirm('정말 삭제하시겠습니까?')) onDeleteField(String(field.id));
                  }}
                >
                  삭제
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
