import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { Field } from '../../types/farm';
import { FarmForm } from './FarmForm';
import { FarmWeatherCard } from './FarmWeatherCard';
import { FACILITY_LABELS, METHOD_LABELS, DETAIL_LABELS } from '@/constants/farmOptions';
import { Plus, Map, Wind, Droplets, Trash2, Edit, MapPin, Edit3, Factory, Bug, Siren } from 'lucide-react';
import { useFields, useFieldMutation } from '@/hooks/useFarmQueries';
import { DashboardMockService, PEST_DATA } from '@/services/dashboardMockService';

export const FieldDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [view, setView] = useState<'list' | 'detail'>('list');
  const [selectedField, setSelectedField] = useState<Field | undefined>(undefined);

  // Queries & Mutations
  const { data: fields = [] } = useFields();
  const { addField, deleteField } = useFieldMutation();

  const handleEdit = (field: Field) => {
    setSelectedField(field);
    setView('detail');
  };

  const handleSave = (updatedData: any) => {
     const final = { ...selectedField, ...updatedData };
     addField.mutate(final, {
        onSuccess: () => {
           alert('수정되었습니다.');
           handleBackToList();
        }
     });
  };

  const handleDelete = (id: string | number) => {
      // Confirmation is handled by the UI button before calling this
      deleteField.mutate(String(id), {
        onSuccess: () => {
           alert('농지가 삭제되었습니다.');
           // Query invalidation should handle UI update
        },
        onError: (err) => {
           alert('삭제 중 오류가 발생했습니다.');
           console.error(err);
        }
      });
  };

  const handleBackToList = () => {
    setSelectedField(undefined);
    setView('list');
  };

  if (view === 'detail' && selectedField) {
    return (
      <div className="mx-auto max-w-7xl p-4 duration-300 animate-in fade-in">
        <div className="mb-4">
           <button onClick={handleBackToList} className="text-sm text-stone-500 hover:underline">
             &larr; 목록으로 돌아가기
           </button>
        </div>
        <div className="rounded-2xl border bg-white p-6 shadow-sm">
           <h2 className="mb-6 border-b pb-4 text-2xl font-bold text-stone-800">농지 정보 수정</h2>
           <FarmForm 
              initialData={selectedField}
              existingFields={fields} 
              onSubmit={handleSave}
              onCancel={handleBackToList}
              submitLabel="수정사항 저장"
           />
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl space-y-6 p-4 duration-500 animate-in fade-in">
      {/* Header Section */}
      <div className="flex flex-col justify-between gap-4 rounded-2xl border border-stone-100 bg-white p-6 shadow-sm md:flex-row md:items-center">
        <div>
          <h1 className="text-2xl font-bold text-stone-800">내 농지 관리 (시스템 정상화 v2.1)</h1>
          <p className="mt-1 text-stone-500">등록된 농지의 상세 정보와 환경 데이터를 관리합니다.</p>
        </div>
        <button
          onClick={() => navigate('/dashboard/farm-registration')}
          className="flex transform items-center justify-center gap-2 rounded-xl bg-green-600 px-5 py-2.5 font-bold text-white shadow-lg shadow-green-200 transition-all hover:-translate-y-0.5 hover:bg-green-700 hover:shadow-green-300"
        >
          <Plus className="h-5 w-5" />새 농지 등록
        </button>
      </div>

      {/* Field Grid */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {fields.map((f) => {
          // Mock Logic using the province from address
          const provinceKey = f.address?.province ? Object.keys(PEST_DATA).find(k => f.address!.province.includes(k)) || '' : '';
          const alert = DashboardMockService.getWeatherAlert(provinceKey);
          const pestMsg = DashboardMockService.getPestForecast(provinceKey);
          
          const isWarning = alert?.type === 'warning';
          const isWatch = alert?.type === 'watch';
          const hasAlert = isWarning || isWatch;

          // Dynamic Styles based on Alert
          const cardBorder = isWarning ? 'border-red-300 ring-1 ring-red-100' : (isWatch ? 'border-amber-300 ring-1 ring-amber-100' : 'border-slate-200');
          const cardHover = isWarning ? 'hover:shadow-red-100 hover:border-red-400' : (isWatch ? 'hover:shadow-amber-100 hover:border-amber-400' : 'hover:border-green-300 hover:ring-1 hover:ring-emerald-400');
          const headerBg = isWarning ? 'bg-red-50' : (isWatch ? 'bg-amber-50' : 'bg-gradient-to-br from-emerald-50 to-teal-50/50');
          const headerBorder = isWarning ? 'border-red-100' : (isWatch ? 'border-amber-100' : 'border-emerald-100');

          return (
          <div
            key={f.id}
            className={`group relative flex flex-col justify-between overflow-hidden rounded-2xl border bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${cardBorder} ${cardHover}`}
          >
            {/* 1. Header Area - Relative for positioning actions */}
            <div className={`relative border-b p-5 ${headerBg} ${headerBorder}`}>
              
              {/* Clickable Header Content Wrapper */}
              <div onClick={() => handleEdit(f)} className="cursor-pointer">
                {/* Alert Banner / Overlay Content */}
                {hasAlert && (
                    <div className={`mb-3 flex items-center gap-2 rounded-lg p-3 ${isWarning ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'} animate-pulse`}>
                        <Siren className="h-5 w-5 flex-shrink-0" />
                        <span className="font-bold text-sm">
                            [기상특보] {alert?.title}
                        </span>
                    </div>
                )}

                {/* Top Row: Name/Pest + Weather */}
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0 pr-2">
                      {/* Farm Name */}
                      <h3 className="truncate text-xl font-bold text-slate-800 tracking-tight">
                          {f.name}
                      </h3>

                      {/* Pest Forecast */}
                      <div className="mt-1 flex items-center gap-1.5 text-xs font-medium text-slate-600">
                        <Bug className={`h-3.5 w-3.5 ${pestMsg.includes('경보') ? 'text-red-500' : 'text-green-600'}`} />
                        <span className="truncate">{pestMsg}</span>
                      </div>
                  </div>

                  {/* Weather Widget */}
                  <div className="flex-shrink-0 pl-2">
                      <FarmWeatherCard province={f.address?.province || ''} />
                  </div>
                </div>

                {/* Bottom Row: Address (Full Width) */}
                <div className="mt-3 flex items-center gap-1 text-sm font-medium text-slate-500">
                    <MapPin className="h-3.5 w-3.5 flex-shrink-0 text-slate-400" />
                    <span className="truncate">
                        {f.location || (f.address ? `${f.address.province} ${f.address.city} ${f.address.town}` : '위치 미지정')}
                    </span>
                </div>
              </div>

              {/* Hover Actions - Absolutely positioned, completely outside the clickable header content */}
              <div 
                className="absolute top-4 right-4 flex gap-2 opacity-0 transition-all duration-200 group-hover:opacity-100 translate-x-2 group-hover:translate-x-0 z-50 pointer-events-auto"
              >
                <button
                    type="button"
                    onClick={(e) => {
                        e.stopPropagation();
                        handleEdit(f);
                    }}
                    className="cursor-pointer rounded-lg bg-white p-2 text-slate-400 shadow-md ring-1 ring-slate-900/5 hover:text-emerald-600 hover:ring-emerald-500 transition-all"
                    title="복사/수정"
                >
                    <Edit3 className="h-4 w-4" />
                </button>
                <button
                    type="button"
                    onClick={(e) => {
                        e.stopPropagation();
                        console.log('Delete clicked for', f.id);
                        if (window.confirm('정말 이 농지를 삭제하시겠습니까? 복구할 수 없습니다.')) {
                            handleDelete(f.id);
                        }
                    }}
                    className="cursor-pointer rounded-lg bg-white p-2 text-slate-400 shadow-md ring-1 ring-slate-900/5 hover:text-red-500 hover:ring-red-500 transition-all"
                    title="삭제"
                >
                    <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* 2. Key Metrics Grid - Clickable */}
            <div 
                onClick={() => handleEdit(f)}
                className="grid grid-cols-2 divide-x divide-slate-100 border-b border-slate-100 cursor-pointer"
            >
                <div className="p-4 flex flex-col items-center justify-center text-center group-hover:bg-slate-50/30 transition-colors">
                    <span className="flex items-center gap-1.5 text-[10px] uppercase tracking-wider text-slate-400 font-bold mb-1">
                        <div className="p-1 rounded-md bg-blue-50 text-blue-500">
                           <Map className="h-3 w-3" />
                        </div>
                        총 면적
                    </span>
                    <span className="text-slate-700 font-bold text-lg mt-1">
                        {Number(f.area).toLocaleString()}<span className="text-sm font-normal text-slate-400 ml-0.5">평</span>
                    </span>
                </div>
                <div className="p-4 flex flex-col items-center justify-center text-center group-hover:bg-slate-50/30 transition-colors">
                     <span className="flex items-center gap-1.5 text-[10px] uppercase tracking-wider text-slate-400 font-bold mb-1">
                        <div className="p-1 rounded-md bg-purple-50 text-purple-500">
                           <Factory className="h-3 w-3" />
                        </div>
                        시설 형태
                    </span>
                    <span className="text-slate-700 font-bold block w-full truncate px-2 text-sm mt-1">
                        {FACILITY_LABELS[f.facilityType] || f.facilityType}
                    </span>
                </div>
            </div>

            {/* 3. Cultivation Details */}
            <div className="p-5">
                <div className="flex items-center justify-between mb-3">
                    <span className="flex items-center gap-1.5 text-xs font-bold text-slate-500 uppercase">
                        <Wind className="h-3.5 w-3.5 text-slate-400" /> 재배 방식
                    </span>
                    <span className="inline-flex items-center rounded-md bg-indigo-50 px-2.5 py-1 text-xs font-bold text-indigo-600 border border-indigo-100">
                        {METHOD_LABELS[f.cultivationMethod] || f.cultivationMethod}
                    </span>
                </div>
                
                <div className="space-y-3">
                     {f.cultivationDetail && (
                        <div className="flex items-center gap-2 text-sm text-slate-600 bg-slate-50/80 rounded-lg p-2.5 border border-slate-100">
                            <span className="h-1.5 w-1.5 flex-shrink-0 rounded-full bg-emerald-400"></span>
                            <span className="font-semibold text-xs text-slate-500 min-w-[30px]">상세:</span>
                            <span className="truncate font-medium text-slate-700">{DETAIL_LABELS[f.cultivationDetail] || f.cultivationDetail}</span>
                        </div>
                     )}
                     
                     <div className="flex flex-wrap gap-2">
                        {f.isMiniTunnel && (
                            <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-0.5 text-[11px] font-bold text-amber-600 border border-amber-100">
                                ✨ 미니 터널
                            </span>
                        )}
                        {f.hasGutter && (
                            <span className="inline-flex items-center gap-1 rounded-full bg-cyan-50 px-2.5 py-0.5 text-[11px] font-bold text-cyan-600 border border-cyan-100">
                                💧 거터 설치
                            </span>
                        )}
                     </div>
                </div>
            </div>
          </div>
          );
        })}

        {/* Empty State */}
        {fields.length === 0 && (
          <div className="col-span-full flex flex-col items-center justify-center rounded-3xl border-2 border-dashed border-stone-200 bg-stone-50 py-16 text-center">
            <div className="mb-4 rounded-full bg-white p-4 shadow-sm">
              <span className="text-4xl opacity-50 grayscale filter">🚜</span>
            </div>
            <h3 className="mb-2 text-lg font-bold text-stone-600">아직 등록된 농지가 없습니다</h3>
            <p className="mx-auto mb-6 max-w-sm text-sm text-stone-400">
              '새 농지 등록' 버튼을 눌러 나의 첫 농지를 등록해보세요.
              <br />
              맞춤형 영농 시뮬레이션을 시작할 수 있습니다.
            </p>
            <button
              onClick={() => navigate('/dashboard/farm-registration')}
              className="rounded-lg bg-green-50 px-4 py-2 text-sm font-bold text-green-600 transition-colors hover:bg-green-100"
            >
              + 첫 농지 등록하기
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
