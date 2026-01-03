import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Warehouse, 
  Sun, 
  CloudRain, 
  ArrowRight, 
  Sprout, 
  CalendarDays,
  Target
} from 'lucide-react';
import type { Field } from '@/types/farm';
import type { CropPlan } from '@/types/planning';
import { cn } from '@/lib/utils';

// Province Mapping for generic localization
const PROVINCE_MAP: Record<string, string> = {
  'seoul': '서울',
  'busan': '부산',
  'daegu': '대구',
  'incheon': '인천',
  'gwangju': '광주',
  'daejeon': '대전',
  'ulsan': '울산',
  'sejong': '세종',
  'gyeonggi': '경기',
  'gangwon': '강원',
  'chungbuk': '충북',
  'chungnam': '충남',
  'jeonbuk': '전북',
  'jeonnam': '전남',
  'gyeongbuk': '경북',
  'gyeongnam': '경남',
  'jeju': '제주'
};

const formatProvince = (prov: string) => {
  if (!prov) return '';
  const lower = prov.toLowerCase();
  return PROVINCE_MAP[lower] || prov;
};

interface FieldPlanningCardProps {
  field: Field;
  activePlans: CropPlan[];
  onClick: () => void;
}

// Visual Helpers
const getFacilityConfig = (type: string) => {
  if (type.includes('glass')) // Glasshouse
    return {
      icon: Warehouse,
      label: '유리온실',
      gradient: 'from-blue-500/10 to-transparent',
      border: 'border-blue-200',
      iconColor: 'text-blue-500',
      badge: 'bg-blue-100 text-blue-700 hover:bg-blue-200',
    };
  if (type.includes('vinyl')) // Vinyl
    return {
      icon: CloudRain, // Represents controlled environment
      label: '비닐하우스',
      gradient: 'from-emerald-500/10 to-transparent',
      border: 'border-emerald-200',
      iconColor: 'text-emerald-500',
      badge: 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200',
    };
  // Open Field (Noji)
  return {
    icon: Sun,
    label: '노지/밭',
    gradient: 'from-amber-500/10 to-transparent',
    border: 'border-amber-200',
    iconColor: 'text-amber-500',
    badge: 'bg-amber-100 text-amber-700 hover:bg-amber-200',
  };
};

export function FieldPlanningCard({ field, activePlans, onClick }: FieldPlanningCardProps) {
  const config = getFacilityConfig(field.facilityType);
  const Icon = config.icon;

  // Determine Primary Status
  const growingPlan = activePlans.find(updatedPlan => updatedPlan.status === 'growing');
  const upcomingPlan = activePlans.find(updatedPlan => updatedPlan.status === 'planned');
  const mainPlan = growingPlan || upcomingPlan;

  // Calculate Card Financials
  const cardRevenue = activePlans.reduce((sum, p) => sum + (p.targetYield * p.targetPrice), 0);
  const cardCost = activePlans.reduce((sum, p) => sum + (p.estimatedCost || 0), 0);
  const cardProfit = cardRevenue - cardCost;

  return (
    <Card 
      className={cn(
        "group relative flex flex-col overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1 cursor-pointer bg-white",
        config.border
      )}
      onClick={onClick}
    >
      {/* Decorative Background Gradient */}
      <div className={cn("absolute inset-0 h-24 bg-gradient-to-b opacity-50", config.gradient)} />

      <CardHeader className="relative z-10 flex flex-row items-start justify-between pb-2">
        <div>
          <Badge className={cn("mb-2 border-0", config.badge)}>
            <Icon className="mr-1 h-3 w-3" />
            {config.label}
          </Badge>
          <h3 className="text-2xl font-bold text-stone-800">{field.name}</h3>
          <p className="text-sm text-stone-500 flex items-center gap-1 mt-1">
            <MapPinIcon className="h-3 w-3" />
            {/* Show Full Address with Localization */}
            {field.addressStr || `${formatProvince(field.address.province)} ${field.address.city} ${field.address.town}`} • {field.area}평
          </p>
        </div>
        {/* Status indicator dot */}
        <div className={cn(
          "h-3 w-3 rounded-full shadow-sm ring-2 ring-white",
          mainPlan ? "bg-green-500" : "bg-stone-300"
        )} title={mainPlan ? "가동 중" : "대기 중"} />
      </CardHeader>

      <CardContent className="relative z-10 flex-1 space-y-4">
        {mainPlan ? (
          <div className="rounded-xl border border-stone-100 bg-stone-50 p-5 transition-colors group-hover:bg-blue-50/50 group-hover:border-blue-100">
            <div className="flex items-center justify-between mb-3">
              <span className="text-lg font-bold text-stone-700 flex items-center gap-2">
                <Sprout className="h-5 w-5 text-green-600" />
                {mainPlan.cropName}
              </span>
              <Badge variant={mainPlan.status === 'growing' ? 'default' : 'outline'} className={mainPlan.status === 'growing' ? 'bg-green-600' : 'text-stone-500'}>
                {mainPlan.status === 'growing' ? '재배중' : '계획됨'}
              </Badge>
            </div>
            
            {/* Mini Timeline Visualization */}
            <div className="mb-4 space-y-1">
                <div className="flex justify-between text-xs text-stone-500 font-medium">
                    <span>파종 {mainPlan.plantingDate}</span>
                    <span>수확 {mainPlan.expectedHarvestDate}</span>
                </div>
                <div className="h-2 w-full rounded-full bg-stone-200 overflow-hidden">
                    <div 
                        className="h-full bg-green-500 rounded-full opacity-80" 
                        style={{ width: '45%' }} // Mock progress for visualization, ideally calculate based on today
                    />
                </div>
            </div>

            {/* Financial Summary Line */}
            <div className="flex items-center justify-between border-t border-stone-200 pt-3 text-sm">
                <span className="text-stone-500">예상 순수익</span>
                <span className="font-bold text-green-700">+{cardProfit.toLocaleString()}원</span>
            </div>
          </div>
        ) : (
          <div className="flex h-32 flex-col items-center justify-center rounded-xl border border-dashed border-stone-200 bg-stone-50/50 text-stone-400 group-hover:border-blue-200 group-hover:bg-blue-50/30">
            <Sprout className="mb-2 h-8 w-8 opacity-20" />
            <span className="text-sm font-medium">등록된 작기 없음</span>
            <span className="text-xs opacity-70">클릭하여 계획 수립</span>
          </div>
        )}

        {/* Card Financial Totals (Always visible if plans exist, even if not main) */}
        {activePlans.length > 0 && (
            <div className="grid grid-cols-3 gap-2 text-center text-xs text-stone-500">
                <div className="rounded bg-stone-50 p-2">
                    <div className="mb-1">매출</div>
                    <div className="font-bold text-blue-600">{cardRevenue.toLocaleString()}</div>
                </div>
                <div className="rounded bg-stone-50 p-2">
                    <div className="mb-1">비용</div>
                    <div className="font-bold text-red-500">{cardCost.toLocaleString()}</div>
                </div>
                <div className="rounded bg-stone-50 p-2">
                    <div className="mb-1">수익</div>
                    <div className="font-bold text-green-600">{cardProfit.toLocaleString()}</div>
                </div>
            </div>
        )}
      </CardContent>

      <CardFooter className="relative z-10 border-t bg-stone-50/50 p-3">
        <Button 
          variant="ghost" 
          className="w-full justify-between text-stone-600 hover:text-blue-600 hover:bg-white"
        >
          <span className="text-sm font-medium">상세 계획 관리</span>
          <ArrowRight className="h-4 w-4 opacity-50 transition-transform group-hover:translate-x-1 group-hover:opacity-100" />
        </Button>
      </CardFooter>
    </Card>
  );
}

function MapPinIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  );
}
