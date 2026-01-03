import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

import { Settings, Save, RotateCcw, ShieldAlert } from 'lucide-react';
import {
  SimulationConfigService,
  type SimulationCoefficients,
  DEFAULT_COEFFICIENTS,
} from '@/services/simulationConfigService';

export function SimulationSettings() {
  const [config, setConfig] = useState<SimulationCoefficients>(DEFAULT_COEFFICIENTS);
  const [isEditAllowed, setIsEditAllowed] = useState(false);
  const [showAdminPanel, setShowAdminPanel] = useState(false);

  useEffect(() => {
    refreshConfig();
  }, []);

  const refreshConfig = () => {
    setConfig(SimulationConfigService.getConfig());
    setIsEditAllowed(SimulationConfigService.isEditAllowed());
  };

  const handleChange = (section: keyof SimulationCoefficients, key: string, value: string) => {
    const numVal = parseFloat(value);
    if (isNaN(numVal)) return;

    setConfig((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [key]: numVal,
      },
    }));
  };

  const handleSave = () => {
    SimulationConfigService.saveConfig(config);
    alert('설정이 저장되었습니다. 시뮬레이션에 즉시 적용됩니다.');
  };

  const handleReset = () => {
    if (confirm('모든 값을 연구 기반 기본값으로 초기화하시겠습니까?')) {
      SimulationConfigService.resetToDefault();
      refreshConfig();
      alert('기본값으로 복원되었습니다.');
    }
  };

  const togglePermission = () => {
    const newState = !isEditAllowed;
    SimulationConfigService.setEditAllowed(newState);
    setIsEditAllowed(newState);
  };

  return (
    <Card className="mt-6 w-full border-slate-300">
      <CardHeader className="bg-slate-100/50 pb-4">
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="flex items-center gap-2 text-lg text-slate-800">
              <Settings className="h-5 w-5" />
              시뮬레이션 계수 설정
            </CardTitle>
            <CardDescription className="mt-1">
              연구 데이터를 기반으로 한 기본값을 제공합니다.
              <br />
              {isEditAllowed ? (
                <span className="font-bold text-blue-600">
                  현재 사용자 수정이 허용된 상태입니다.
                </span>
              ) : (
                '계수 수정은 관리자 권한이 필요합니다.'
              )}
            </CardDescription>
          </div>

          {/* Simulated Admin Access Button */}
          <div className="flex flex-col items-end gap-2">
            <Button
              variant="ghost"
              size="sm"
              className="text-xs text-slate-400 hover:text-slate-600"
              onClick={() => setShowAdminPanel(!showAdminPanel)}
            >
              <ShieldAlert className="mr-1 h-3 w-3" />
              관리자 패널 {showAdminPanel ? '숨기기' : '열기'}
            </Button>
          </div>
        </div>

        {/* Secure Admin Panel */}
        {showAdminPanel && (
          <div className="mt-4 flex items-center justify-between rounded-md border border-red-100 bg-red-50 p-3">
            <div className="flex items-center gap-2 text-sm font-medium text-red-800">
              <ShieldAlert className="h-4 w-4" />
              관리자 권한 설정
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-red-600">사용자 계수 수정 허용</span>
              <div
                className={`h-5 w-10 cursor-pointer rounded-full p-1 transition-colors ${isEditAllowed ? 'bg-red-500' : 'bg-slate-300'}`}
                onClick={togglePermission}
              >
                <div
                  className={`h-3 w-3 transform rounded-full bg-white shadow-sm transition-transform ${isEditAllowed ? 'translate-x-5' : 'translate-x-0'}`}
                />
              </div>
            </div>
          </div>
        )}
      </CardHeader>

      <CardContent className="relative pt-6">
        {!isEditAllowed && (
          <div className="pointer-events-none absolute inset-0 z-10 bg-slate-50/10" />
        )}

        <div
          className={`space-y-6 ${!isEditAllowed ? 'pointer-events-none opacity-90 grayscale-[0.3]' : ''}`}
        >
          {/* Facility Multipliers */}
          <div>
            <h4 className="mb-3 flex items-center gap-2 font-semibold text-slate-700">
              1. 시설 유형별 기본 생산성 지수
              <span className="text-xs font-normal text-slate-500">(기준: 노지 = 1.0)</span>
            </h4>
            <div className="grid grid-cols-2 gap-4 md:grid-cols-5">
              {Object.entries(config.facility).map(([key, val]) => (
                <div key={key} className="space-y-1">
                  <label className="text-xs font-medium capitalize text-slate-500">
                    {key.replace(/_/g, ' ')}
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    className="w-full rounded border bg-white p-2 text-right font-mono"
                    value={val}
                    onChange={(e) => handleChange('facility', key, e.target.value)}
                    readOnly={!isEditAllowed}
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="my-4 border-t border-slate-100"></div>

          {/* Detailed Specs Multipliers */}
          <div>
            <h4 className="mb-3 flex items-center gap-2 font-semibold text-slate-700">
              2. 상세 스펙 보정 계수
              <span className="text-xs font-normal text-slate-500">(적용 시 곱연산)</span>
            </h4>
            <div className="grid grid-cols-2 gap-4 md:grid-cols-5">
              <div className="space-y-1">
                <label className="text-xs font-medium text-slate-500">측고 중(4-5m)</label>
                <input
                  type="number"
                  step="0.05"
                  className="w-full rounded border bg-white p-2 text-right font-mono"
                  value={config.specs.height_medium}
                  onChange={(e) => handleChange('specs', 'height_medium', e.target.value)}
                  readOnly={!isEditAllowed}
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-medium text-slate-500">측고 고(6m+)</label>
                <input
                  type="number"
                  step="0.05"
                  className="w-full rounded border bg-white p-2 text-right font-mono"
                  value={config.specs.height_high}
                  onChange={(e) => handleChange('specs', 'height_high', e.target.value)}
                  readOnly={!isEditAllowed}
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-medium text-slate-500">양액 재배</label>
                <input
                  type="number"
                  step="0.1"
                  className="w-full rounded border bg-white p-2 text-right font-mono"
                  value={config.specs.hydroponics}
                  onChange={(e) => handleChange('specs', 'hydroponics', e.target.value)}
                  readOnly={!isEditAllowed}
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-medium text-slate-500">난방</label>
                <input
                  type="number"
                  step="0.1"
                  className="w-full rounded border bg-white p-2 text-right font-mono"
                  value={config.specs.heating}
                  onChange={(e) => handleChange('specs', 'heating', e.target.value)}
                  readOnly={!isEditAllowed}
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-medium text-slate-500">노지 터널</label>
                <input
                  type="number"
                  step="0.05"
                  className="w-full rounded border bg-white p-2 text-right font-mono"
                  value={config.specs.tunnel}
                  onChange={(e) => handleChange('specs', 'tunnel', e.target.value)}
                  readOnly={!isEditAllowed}
                />
              </div>
            </div>
          </div>

          <div className="my-4 border-t border-slate-100"></div>

          {/* Date Adjustments */}
          <div>
            <h4 className="mb-3 flex items-center gap-2 font-semibold text-slate-700">
              3. 수확일 단축 효과
            </h4>
            <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
              <div className="space-y-1">
                <label className="text-xs font-medium text-slate-500">일반 온실 (비율)</label>
                <input
                  type="number"
                  step="0.05"
                  className="w-full rounded border bg-white p-2 text-right font-mono"
                  value={config.date_reduction.greenhouse_factor}
                  onChange={(e) =>
                    handleChange('date_reduction', 'greenhouse_factor', e.target.value)
                  }
                  readOnly={!isEditAllowed}
                />
                <span className="text-[10px] text-slate-400">0.9 = 90% (10% 단축)</span>
              </div>
              <div className="space-y-1">
                <label className="text-xs font-medium text-slate-500">스마트팜 (비율)</label>
                <input
                  type="number"
                  step="0.05"
                  className="w-full rounded border bg-white p-2 text-right font-mono"
                  value={config.date_reduction.smart_farm_factor}
                  onChange={(e) =>
                    handleChange('date_reduction', 'smart_farm_factor', e.target.value)
                  }
                  readOnly={!isEditAllowed}
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-medium text-slate-500">난방 시 (일수)</label>
                <input
                  type="number"
                  step="1"
                  className="w-full rounded border bg-white p-2 text-right font-mono"
                  value={config.date_reduction.heating}
                  onChange={(e) => handleChange('date_reduction', 'heating', e.target.value)}
                  readOnly={!isEditAllowed}
                />
                <span className="text-[10px] text-slate-400">-일 (단축)</span>
              </div>
              <div className="space-y-1">
                <label className="text-xs font-medium text-slate-500">터널 시 (일수)</label>
                <input
                  type="number"
                  step="1"
                  className="w-full rounded border bg-white p-2 text-right font-mono"
                  value={config.date_reduction.tunnel}
                  onChange={(e) => handleChange('date_reduction', 'tunnel', e.target.value)}
                  readOnly={!isEditAllowed}
                />
              </div>
            </div>
          </div>
        </div>

        {isEditAllowed && (
          <div className="sticky bottom-0 mt-8 flex justify-end gap-3 border-t bg-white/95 p-2 pt-4 backdrop-blur">
            <Button
              variant="outline"
              onClick={handleReset}
              className="flex gap-2 border-red-200 hover:bg-red-50 hover:text-red-600"
            >
              <RotateCcw className="h-4 w-4" />
              초기값으로 복원
            </Button>
            <Button
              onClick={handleSave}
              className="flex gap-2 bg-blue-600 text-white hover:bg-blue-700"
            >
              <Save className="h-4 w-4" />
              설정 저장
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
