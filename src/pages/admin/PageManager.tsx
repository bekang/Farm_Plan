import { useState, useEffect } from 'react';
import { USER_MENU_ITEMS, type MenuItem } from '@/config/menuConfig';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Eye, EyeOff, Save, RotateCcw } from 'lucide-react';

export function PageManager() {
  // Store IDs of hidden items
  const [hiddenItems, setHiddenItems] = useState<string[]>([]);
  const [isDirty, setIsDirty] = useState(false);

  // Load from Storage
  useEffect(() => {
    const stored = localStorage.getItem('hidden_menu_items');
    if (stored) {
      setHiddenItems(JSON.parse(stored));
    }
  }, []);

  const toggleItem = (id: string, currentHidden: boolean) => {
    if (currentHidden) {
      // Unhide (Remove from hidden list)
      setHiddenItems((prev) => prev.filter((i) => i !== id));
    } else {
      // Hide (Add to hidden list)
      setHiddenItems((prev) => [...prev, id]);
    }
    setIsDirty(true);
  };

  const handleSave = () => {
    localStorage.setItem('hidden_menu_items', JSON.stringify(hiddenItems));
    // Trigger an event so RootLayout can react (simple way: reload, or use context. For now, reload is safest for pure persistent check)
    alert('저장되었습니다. 변경 사항을 적용하기 위해 페이지가 새로고침됩니다.');
    window.location.reload();
  };

  const handleReset = () => {
    if (confirm('모든 메뉴를 초기 상태(보임)로 되돌리시겠습니까?')) {
        setHiddenItems([]);
        localStorage.removeItem('hidden_menu_items');
        window.location.reload();
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">사용자 메뉴(페이지) 관리</h1>
          <p className="text-slate-500">사용자 모드 사이드바에 표시될 메뉴를 관리합니다.</p>
        </div>
        <div className="flex gap-2">
            <Button variant="outline" onClick={handleReset} className="text-slate-600">
                <RotateCcw className="mr-2 h-4 w-4"/> 초기화
            </Button>
            <Button onClick={handleSave} disabled={!isDirty} className={isDirty ? 'bg-blue-600' : ''}>
                <Save className="mr-2 h-4 w-4"/> {isDirty ? '저장 필요' : '저장됨'}
            </Button>
        </div>
      </div>

      <div className="grid gap-4">
        {USER_MENU_ITEMS.map((item: MenuItem) => {
          const isHidden = hiddenItems.includes(item.id);
          const isVisible = !isHidden;

          return (
            <Card key={item.id} className={`transition-all ${isHidden ? 'opacity-60 bg-slate-50 border-dashed' : 'border-indigo-100'}`}>
              <CardContent className="flex items-center justify-between p-4">
                <div className="flex items-center gap-4">
                  <div className={`p-2 rounded-lg ${isVisible ? 'bg-indigo-50 text-indigo-600' : 'bg-slate-200 text-slate-500'}`}>
                    <item.icon className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className={`font-bold text-lg ${isVisible ? 'text-slate-800' : 'text-slate-500 line-through'}`}>
                        {item.name}
                    </h3>
                    <p className="text-xs text-slate-400 font-mono">{item.path}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className={`text-sm font-medium ${isVisible ? 'text-green-600' : 'text-slate-400'}`}>
                    {isVisible ? '표시됨 (Visible)' : '숨김 (Hidden)'}
                  </span>
                  <Switch
                    checked={isVisible}
                    onCheckedChange={() => toggleItem(item.id, isHidden)}
                  />
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
