import { useState, useEffect } from 'react';
import { EFFECTS } from '@/design/effects/animations';
import { TrendingUp, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { cn, matchHangul } from '@/lib/utils';
import { type KamisPriceItem } from '@/services/kamisService';
import { useMarketPrices } from '@/hooks/useFarmQueries';
import { usePlans } from '@/hooks/usePlanQueries';

interface MarketWidgetProps {
  isActive: boolean;
  onToggle: () => void;
  onClose: () => void;
}

// Sub-component for individual item row
function MarketPriceItem({ crop }: { crop: KamisPriceItem }) {
  const p1 = parseInt(crop.dpr1?.replace(/,/g, '') || '0');
  const p2 = parseInt(crop.dpr2?.replace(/,/g, '') || '0');
  // Check for drop (e.g. 10% drop, but safeguard against divide by zero)
  const isDrop = p2 > 0 && (p2 - p1) / p2 > 0.1;

  return (
    <div className="flex items-center justify-between border-b py-1.5 text-sm last:border-0">
      <div className="flex items-center gap-2">
        <span className="text-xs text-slate-700">
          {crop.item_name}
          <span className="ml-1 text-[10px] text-slate-400">({crop.kind_name})</span>
        </span>
        {isDrop && (
          <Badge variant="outline" className="h-4 border-blue-200 px-1 text-[10px] text-blue-600">
            ▼ 폭락
          </Badge>
        )}
      </div>
      <div className="text-right">
        <span className="block text-xs font-bold text-slate-800">{crop.dpr1}원</span>
        <span className="text-[10px] text-slate-400">/{crop.unit}</span>
      </div>
    </div>
  );
}

export function MarketWidget({ isActive, onToggle, onClose }: MarketWidgetProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // Queries
  const { data: marketPrices = [], isLoading: isLoadingMarket } = useMarketPrices();
  const { data: plans = [] } = usePlans();

  // State for Interested Crops (Persisted in LocalStorage)
  const [interestedCrops, setInterestedCrops] = useState<Set<string>>(() => {
    const saved = localStorage.getItem('interestedCrops');
    return saved ? new Set(JSON.parse(saved)) : new Set();
  });

  // Close settings when widget closes
  useEffect(() => {
    if (!isActive) {
      setIsSettingsOpen(false);
    }
  }, [isActive]);

  // Persist Interested Crops
  useEffect(() => {
    localStorage.setItem('interestedCrops', JSON.stringify(Array.from(interestedCrops)));
  }, [interestedCrops]);

  // Compute Active Crops Set from Real Plans
  const activeCropNames = new Set(
    plans
      .map((p) => p.cropName)
  );

  // Helper to map KAMIS name to Active Crop name
  const matchesCrop = (cropName: string, targetCrops: Set<string>) => {
    const mapping: Record<string, string> = {
      '노지 고추': '건고추',
      '한지형 마늘': '피마늘',
      '배추 (가을)': '배추',
      '봄 감자': '감자',
      '콩 (서리태)': '콩',
    };

    if (targetCrops.size === 0) return false;

    // Check precise mapping first
    const matchesMapping = Array.from(targetCrops).some((ac) => mapping[ac] === cropName);
    if (matchesMapping) return true;

    // Fallback to fuzzy match
    return Array.from(targetCrops).some(
      (ac) => ac.includes(cropName) || cropName.includes(ac.split(' ')[0]),
    );
  };

  // Filtered Lists
  const myCropsList = marketPrices
    .filter((c) => matchesCrop(c.item_name, activeCropNames))
    // Deduplicate somewhat if multiple kinds exist, just pick top 5 for "My Crops" area
    .slice(0, 5);
    
  // Filter Interested Crops (Exact match on "ItemName (KindName)")
  const interestedCropsList = marketPrices.filter((c) =>
    interestedCrops.has(`${c.item_name} (${c.kind_name})`),
  );

  // Get Unique Item Names for Selection List (Name + Kind)
  // Cache this if expensive, but typically < 100 items so fine.
  const allCropOptions = Array.from(
    new Set(marketPrices.map((c) => `${c.item_name} (${c.kind_name})`)),
  ).sort();

  // Toggle Interested Crop
  const toggleInterestedIds = (option: string) => {
    const next = new Set(interestedCrops);
    if (next.has(option)) {
      next.delete(option);
    } else {
      next.add(option);
    }
    setInterestedCrops(next);
  };

  // Price Drop Logic
  const hasPriceDrop = [...myCropsList, ...interestedCropsList].some((c) => {
    const p1 = parseInt(c.dpr1?.replace(/,/g, '') || '0');
    const p2 = parseInt(c.dpr2?.replace(/,/g, '') || '0');
    return p2 > 0 && (p2 - p1) / p2 > 0.1; // > 10% drop
  });

  return (
    <div className="relative">
      <Button
        variant="ghost"
        className={cn(
          'flex h-9 items-center gap-2 rounded-full border px-3',
          EFFECTS.TRANSITION.DEFAULT,
          isActive
            ? 'border-blue-200 bg-blue-50 text-blue-700'
            : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50',
          hasPriceDrop && EFFECTS.ANIMATION.PULSE_BLUE,
        )}
        onClick={onToggle}
      >
        <TrendingUp className="h-4 w-4 text-blue-500" />
        <span className="hidden text-xs font-medium md:inline">주요 시세</span>
        {hasPriceDrop && (
          <span
            className={cn(
              'absolute -right-1 -top-1 h-2 w-2 rounded-full',
              EFFECTS.ANIMATION.PING_BLUE,
            )}
          />
        )}
      </Button>

      {isActive && (
        <div
          className={cn('absolute right-0 top-full z-50 mt-2 w-72', EFFECTS.ANIMATION.FADE_IN_DOWN)}
        >
          <Card className="border-slate-200 p-4 shadow-xl">
            {/* Header */}
            <div className="mb-3 flex items-center justify-between">
              <h4 className="flex items-center gap-1 text-sm font-bold text-slate-700">
                <TrendingUp className="h-4 w-4 text-blue-500" /> 농산물 시세
              </h4>
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 px-2 text-xs text-slate-500 hover:text-blue-600"
                  onClick={() => setIsSettingsOpen(!isSettingsOpen)}
                >
                  {isSettingsOpen ? '완료' : '설정'}
                </Button>
                <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Content */}
            {isSettingsOpen ? (
              <div className="mb-2 max-h-[250px] space-y-2 overflow-y-auto">
                <p className="mb-2 px-1 text-xs text-slate-400">
                  관심 작물을 선택하면 시세를 모니터링할 수 있습니다.
                </p>

                {/* Search Input */}
                <div className="relative mb-2 px-1">
                  <input
                    type="text"
                    placeholder="작물 검색 (예: ㄱ, 감자)"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full rounded border bg-slate-50 p-1.5 pl-2 text-xs focus:border-blue-300 focus:outline-none"
                    autoFocus
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  {allCropOptions
                    .filter((option) => matchHangul(option, searchTerm))
                    .map((option) => (
                      <div key={option} className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id={`crop-${option}`}
                          checked={interestedCrops.has(option)}
                          onChange={() => toggleInterestedIds(option)}
                          className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                        />
                        <label
                          htmlFor={`crop-${option}`}
                          className="cursor-pointer select-none text-xs text-slate-700"
                        >
                          {option}
                        </label>
                      </div>
                    ))}
                </div>
                {allCropOptions.filter((option) => matchHangul(option, searchTerm)).length ===
                  0 && (
                  <div className="py-4 text-center text-xs text-slate-400">
                    검색 결과가 없습니다.
                  </div>
                )}
              </div>
            ) : (
              <div className="mb-2 max-h-[300px] space-y-3 overflow-y-auto">
                {isLoadingMarket && (
                  <div className="py-4 text-center text-xs text-slate-400">
                    시세를 불러오는 중입니다...
                  </div>
                )}
                {!isLoadingMarket && (
                  <>
                    {/* Section 1: My Active Crops */}
                    {myCropsList.length > 0 && (
                      <div>
                        <h5 className="mb-1 px-1 text-xs font-bold text-slate-500">
                          내 작물 (재배중)
                        </h5>
                        {myCropsList.map((crop, idx) => (
                          <MarketPriceItem key={`my-${idx}`} crop={crop} />
                        ))}
                      </div>
                    )}

                    {/* Section 2: Interested Crops */}
                    {interestedCropsList.length > 0 && (
                      <div className={cn(myCropsList.length > 0 && 'mt-3')}>
                        <h5 className="mb-1 px-1 text-xs font-bold text-slate-500">관심 작물</h5>
                        {interestedCropsList.map((crop, idx) => (
                          <MarketPriceItem key={`int-${idx}`} crop={crop} />
                        ))}
                      </div>
                    )}

                    {myCropsList.length === 0 && interestedCropsList.length === 0 && (
                      <div className="py-6 text-center text-xs text-slate-400">
                        표시할 작물이 없습니다.
                        <br />
                        [설정]을 눌러 관심 작물을 추가해보세요.
                      </div>
                    )}
                  </>
                )}
              </div>
            )}

            <div className="flex items-center justify-between border-t pt-2 text-[10px] text-slate-400">
              <span>KAMIS (최근 기준)</span>
              <a
                href="https://www.kamis.or.kr"
                target="_blank"
                rel="noreferrer"
                className="text-blue-500 hover:underline"
              >
                상세보기 &gt;
              </a>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
