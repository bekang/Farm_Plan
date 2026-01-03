import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FarmForm } from '@/components/farm/FarmForm';
import { useFieldMutation, useFields } from '@/hooks/useFarmQueries';

export function FarmRegistrationPage() {
  const navigate = useNavigate();
  const { data: fields = [] } = useFields();
  const { addField } = useFieldMutation();

  const handleSubmit = (formData: any) => {
    // Generate ID safely
    const newId = Date.now();
    const newField = {
      ...formData, // Spread first to allow defaults
      id: newId, // OVERWRITE any id from form with the generated one
      created_at: new Date().toISOString(),
    };

    console.log('[Registration] Attempting to save field:', newField);

    try {
        addField.mutate(newField, {
            onSuccess: () => {
                console.log('[Registration] Success!');
                // Using a small timeout to ensure alert is seen before nav
                setTimeout(() => {
                    alert('농지가 성공적으로 등록되었습니다! (ID: ' + newId + ')');
                    navigate('/dashboard/farm-dashboard');
                }, 100);
            },
            onError: (err) => {
                console.error('[Registration] Mutation Failed:', err);
                alert('저장 중 오류가 발생했습니다: ' + err.message);
            }
        });
    } catch (e: any) {
        console.error('[Registration] Critical Error:', e);
        alert('예기치 않은 오류: ' + e.message);
    }
  };

  return (
    <div className="mx-auto max-w-3xl space-y-6 duration-500 animate-in fade-in">
      <Card className="border-stone-200 shadow-md">
        <CardHeader className="border-b border-stone-100 bg-stone-50 pb-4">
          <CardTitle className="flex items-center gap-2 text-xl text-stone-700">
            🌱 새 농지 등록 (시스템 정상화 v2.1)
          </CardTitle>
          <p className="mt-1 text-sm text-stone-500">
            새로운 농지의 기본 정보와 환경 데이터를 입력해주세요. (단일 페이지)
          </p>
        </CardHeader>
        <CardContent className="pt-6">
          <FarmForm
            existingFields={fields}
            onSubmit={handleSubmit}
            onCancel={() => navigate('/dashboard/farm-dashboard')}
            submitLabel="농지 등록 완료"
          />
        </CardContent>
      </Card>
    </div>
  );
}
