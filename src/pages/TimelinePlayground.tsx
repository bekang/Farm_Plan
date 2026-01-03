import { useState } from 'react';
import moment from 'moment';
import Timeline, {
  TimelineHeaders,
  SidebarHeader,
  DateHeader,
} from 'react-calendar-timeline';
import 'react-calendar-timeline/dist/style.css';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ZoomIn, ZoomOut, ChevronLeft, ChevronRight } from 'lucide-react';
import '../features/planning/components/TimelineOverride.css';

// --- Mock Data ---
const GROUPS = [{ id: 1, title: '밭 A' }, { id: 2, title: '밭 B' }];
const ITEMS = [
  {
    id: 1,
    group: 1,
    title: '고추 (Pepper)',
    start_time: moment().add(-10, 'days'),
    end_time: moment().add(60, 'days'),
    bgColor: '#ef4444',
  },
  {
    id: 2,
    group: 1,
    title: '마늘 (Garlic)',
    start_time: moment().add(70, 'days'),
    end_time: moment().add(150, 'days'),
    bgColor: '#3b82f6',
  },
  {
    id: 3,
    group: 2,
    title: '양파 (Onion)',
    start_time: moment().add(-30, 'days'),
    end_time: moment().add(90, 'days'),
    bgColor: '#10b981',
  },
];

// --- Common Controls Hook ---
function useTimelineControls() {
  const [visibleTimeStart, setVisibleTimeStart] = useState(moment().add(-1, 'month').valueOf());
  const [visibleTimeEnd, setVisibleTimeEnd] = useState(moment().add(3, 'month').valueOf());

  const handleTimeChange = (start: number, end: number, updateScrollCanvas: (start: number, end: number) => void) => {
    setVisibleTimeStart(start);
    setVisibleTimeEnd(end);
    updateScrollCanvas(start, end);
  };

  const handleZoom = (delta: number) => {
     const duration = visibleTimeEnd - visibleTimeStart;
     const newDuration = duration * delta;
     const center = visibleTimeStart + duration / 2;
     setVisibleTimeStart(center - newDuration / 2);
     setVisibleTimeEnd(center + newDuration / 2);
  };

   const handleMove = (days: number) => {
     const moveMs = days * 24 * 60 * 60 * 1000;
     setVisibleTimeStart(visibleTimeStart + moveMs);
     setVisibleTimeEnd(visibleTimeEnd + moveMs);
  };

  return { visibleTimeStart, visibleTimeEnd, handleTimeChange, handleZoom, handleMove, setVisibleTimeStart, setVisibleTimeEnd };
}


export default function TimelinePlayground() {
  return (
    <div className="container mx-auto space-y-12 p-10">
      <div className="space-y-4">
        <h1 className="text-3xl font-bold">Timeline Design Playground</h1>
        <p className="text-slate-500">
           다양한 타임라인 스타일을 비교해보세요. 각 섹션은 서로 다른 디자인 컨셉을 적용했습니다.
        </p>
      </div>

      <VariationCurrent />
      <VariationCompact />
      <VariationCard />
      <VariationSeasonal />
      <VariationInfographic />
      <VariationHierarchy />
    </div>
  );
}

// ... (Previous Variations kept as is) ...
// --- Variation 6: Field Hierarchy View ---
function VariationHierarchy() {
    const { visibleTimeStart, visibleTimeEnd, handleTimeChange } = useTimelineControls();

    // Groups: Field A (Parent) -> Phases (Children)
    const HIERARCHY_GROUPS = [
        { id: 'f1', title: '밭 A (고추)', isMain: true },
        { id: 'f1-p1', title: 'Phase 1: 농지 정리', parent: 'f1' },
        { id: 'f1-p2', title: 'Phase 2: 정식/파종', parent: 'f1' },
        { id: 'f1-p3', title: 'Phase 3: 관리', parent: 'f1' },
        { id: 'f1-p4', title: 'Phase 4: 수확', parent: 'f1' },
    ];

    const HIERARCHY_ITEMS = [
        // Main Summary Item
        { id: 999, group: 'f1', title: '2026 고추 작기 (전체)', start_time: moment().add(-10, 'days'), end_time: moment().add(80, 'days'), bgColor: '#4f46e5', isMain: true },
        
        // Phase Items
        { id: 601, group: 'f1-p1', title: '토양 검정', start_time: moment().add(-10, 'days'), end_time: moment().add(-5, 'days'), bgColor: '#db2777' },
        { id: 602, group: 'f1-p1', title: '퇴비 살포', start_time: moment().add(-4, 'days'), end_time: moment().add(0, 'days'), bgColor: '#db2777' },
        { id: 701, group: 'f1-p2', title: '모종 정식', start_time: moment().add(5, 'days'), end_time: moment().add(15, 'days'), bgColor: '#e11d48' },
        { id: 801, group: 'f1-p3', title: '1차 웃거름', start_time: moment().add(30, 'days'), end_time: moment().add(35, 'days'), bgColor: '#ea580c' },
        { id: 901, group: 'f1-p4', title: '첫물 수확', start_time: moment().add(70, 'days'), end_time: moment().add(80, 'days'), bgColor: '#ca8a04' },
    ];

    // Group Renderer with Hierarchy Indentation
    const groupRenderer = ({ group }: any) => {
        const isMain = group.isMain;
        return (
            <div className={`flex h-full items-center ${isMain ? 'pl-4' : 'pl-8'} border-r border-slate-100`}>
                {!isMain && <span className="mr-2 text-slate-400">↳</span>}
                <div className="flex flex-col">
                    <span className={`${isMain ? 'text-sm font-bold text-slate-800' : 'text-xs font-medium text-slate-500'}`}>
                        {group.title}
                    </span>
                </div>
            </div>
        );
    };

    // Item Renderer (Differentiate Main vs Child)
    const itemRenderer = ({ item, getItemProps }: any) => {
        const isMain = item.isMain;
        
        // Style for Main Summary Item
        if (isMain) {
            return (
                <div {...getItemProps({ style: { background: 'transparent', border: 'none' } })}>
                     <div className="flex h-full items-center">
                        <div className="flex h-6 w-full items-center justify-center rounded-full bg-indigo-100 px-3 text-xs font-bold text-indigo-700 shadow-sm border border-indigo-200">
                             {item.title}
                        </div>
                     </div>
                </div>
            );
        }

        // Style for Child Items (Card Style from V5)
        const borderColor = item.bgColor;
        const backgroundColor = item.bgColor + '20'; 

        return (
           <div {...getItemProps({ style: { background: 'transparent', border: 'none' } })}>
              <div className="h-full pr-1 py-1">
                  <div 
                     className="flex h-full flex-col justify-center rounded-md border shadow-sm hover:shadow-md transition-all px-2"
                     style={{ 
                         backgroundColor: backgroundColor, 
                         borderColor: borderColor,
                         borderLeftWidth: '4px' 
                     }}
                 >
                     <span className="truncate text-xs font-bold text-slate-800">{item.title}</span>
                     <span className="truncate text-[10px] font-bold text-slate-600">
                         {moment(item.start_time).format('M/D')} - {moment(item.end_time).format('M/D')}
                     </span>
                 </div>
              </div>
           </div>
         );
    };

    return (
      <section className="space-y-4">
        <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-slate-800">6. Field Hierarchy (계층형 뷰)</h2>
            <Badge variant="outline" className="bg-slate-100 text-slate-700">Detailed Structure</Badge>
        </div>
  
         <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
            <Timeline
              groups={HIERARCHY_GROUPS}
              items={HIERARCHY_ITEMS}
              visibleTimeStart={visibleTimeStart}
              visibleTimeEnd={visibleTimeEnd}
              onTimeChange={handleTimeChange}
              sidebarWidth={200} // Wider sidebar for hierarchy text
              lineHeight={50}
              itemHeightRatio={0.8}
              canMove={false}
              canResize={false}
              stackItems
              groupRenderer={groupRenderer}
              itemRenderer={itemRenderer}
            >
               <TimelineHeaders className="sticky top-0 z-10 bg-white">
                <SidebarHeader>
                  {({ getRootProps }) => <div {...getRootProps()} className="flex items-center justify-center border-r border-slate-100 bg-slate-50 p-3 text-sm font-bold text-slate-600">구조 (Structure)</div>}
                </SidebarHeader>
                <DateHeader unit="month" labelFormat={"M월" as any} className="h-10 bg-white text-sm font-bold text-slate-600" />
              </TimelineHeaders>
            </Timeline>
         </div>
      </section>
    );
}

// --- Variation 5: Infographic/Roadmap Style (Phase View) ---
function VariationInfographic() {
    const { visibleTimeStart, visibleTimeEnd, handleTimeChange } = useTimelineControls();

    // Custom Data for Phase View
    const PHASE_GROUPS = [
        { id: 'p1', title: 'Phase 1', subTitle: '농지 정리' },
        { id: 'p2', title: 'Phase 2', subTitle: '정식/파종' },
        { id: 'p3', title: 'Phase 3', subTitle: '멀칭/관리' },
        { id: 'p4', title: 'Phase 4', subTitle: '방제/추비' },
        { id: 'p5', title: 'Phase 5', subTitle: '수확' },
    ];

    const PHASE_ITEMS = [
        { id: 101, group: 'p1', title: '토양 검정', start_time: moment().add(-10, 'days'), end_time: moment().add(-5, 'days'), bgColor: '#db2777' },
        { id: 102, group: 'p1', title: '퇴비 살포 (200평)', start_time: moment().add(-4, 'days'), end_time: moment().add(0, 'days'), bgColor: '#db2777' },
        { id: 201, group: 'p2', title: '고추 모종 정식', start_time: moment().add(5, 'days'), end_time: moment().add(15, 'days'), bgColor: '#e11d48' },
        { id: 301, group: 'p3', title: '관수 시설 점검', start_time: moment().add(10, 'days'), end_time: moment().add(20, 'days'), bgColor: '#ea580c' },
        { id: 302, group: 'p3', title: '비닐 멀칭 작업', start_time: moment().add(22, 'days'), end_time: moment().add(30, 'days'), bgColor: '#ea580c' },
        { id: 401, group: 'p4', title: '탄저병 예방 방제', start_time: moment().add(40, 'days'), end_time: moment().add(45, 'days'), bgColor: '#d97706' },
        { id: 402, group: 'p4', title: '1차 웃거름 주기', start_time: moment().add(50, 'days'), end_time: moment().add(55, 'days'), bgColor: '#d97706' },
        { id: 501, group: 'p5', title: '첫물 수확', start_time: moment().add(70, 'days'), end_time: moment().add(80, 'days'), bgColor: '#ca8a04' },
    ];

    // Month Colors (Rainbow-ish)
    const MONTH_COLORS: Record<number, string> = {
        1: '#db2777', 2: '#e11d48', 3: '#ea580c', 4: '#d97706',
        5: '#ca8a04', 6: '#65a30d', 7: '#16a34a', 8: '#059669',
        9: '#0d9488', 10: '#0891b2', 11: '#0284c7', 12: '#4f46e5',
    };

    const headerRenderer = ({ getIntervalProps, intervalContext }: any) => {
        const month = parseInt(moment(intervalContext.interval.startTime).format('M'));
        const color = MONTH_COLORS[month] || '#64748b';
        return (
            <div 
                {...getIntervalProps()} 
                className="flex items-center justify-center text-lg font-black text-white shadow-md z-10"
                style={{ backgroundColor: color, borderLeft: '1px solid rgba(255,255,255,0.2)' }}
            >
                {intervalContext.intervalText}
            </div>
        );
    };

    // Card Style Item Renderer
    const itemRenderer = ({ item, getItemProps }: any) => {
       const borderColor = item.bgColor;
       const backgroundColor = item.bgColor + '20'; // 12% opacity roughly

       return (
          <div {...getItemProps({ style: { background: 'transparent', border: 'none' } })}>
             <div className="h-full pr-1">
                 <div 
                    className="flex h-full flex-col justify-center rounded-md border p-1.5 shadow-sm hover:shadow-md transition-all"
                    style={{ 
                        backgroundColor: backgroundColor, 
                        borderColor: borderColor,
                        borderLeftWidth: '4px' 
                    }}
                >
                    <span className="truncate text-xs font-bold text-slate-800">{item.title}</span>
                    <span className="truncate text-[10px] font-bold text-slate-600">
                        {moment(item.start_time).format('M/D')} - {moment(item.end_time).format('M/D')}
                        <span className="ml-1 opacity-70">({moment.duration(moment(item.end_time).diff(moment(item.start_time))).asDays().toFixed(0)}일)</span>
                    </span>
                </div>
             </div>
          </div>
        );
    };

    // Phase Tab Group Renderer
    const groupRenderer = ({ group }: any) => {
      // Determine color based on ID roughly
      const colors: Record<string, string> = { p1: '#db2777', p2: '#e11d48', p3: '#ea580c', p4: '#d97706', p5: '#ca8a04' };
      const bg = colors[group.id] || '#475569';

      return (
        <div className="flex h-full items-center pl-2">
           <div 
             className="flex h-16 w-full flex-col items-center justify-center rounded-l-2xl shadow-lg transition-transform hover:scale-105"
             style={{ backgroundColor: bg }}
            >
             <span className="text-xs font-black text-white/90">{group.title}</span>
             <span className="text-[10px] font-bold text-white">{group.subTitle}</span>
           </div>
        </div>
      );
    };

    return (
      <section className="space-y-4">
        <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-slate-800">5. Infographic (Phase View)</h2>
            <Badge variant="outline" className="bg-purple-50 text-purple-600">Roadmap / Phases</Badge>
        </div>
  
         <div className="rounded-xl border border-slate-200 bg-white shadow-xl overflow-hidden">
            <Timeline
              groups={PHASE_GROUPS}
              items={PHASE_ITEMS}
              visibleTimeStart={visibleTimeStart}
              visibleTimeEnd={visibleTimeEnd}
              onTimeChange={handleTimeChange}
              sidebarWidth={130}
              lineHeight={80} 
              itemHeightRatio={0.8}
              canMove={false}
              canResize={false}
              stackItems
              itemRenderer={itemRenderer}
              groupRenderer={groupRenderer}
            >
               <TimelineHeaders className="sticky top-0 z-10 bg-white">
                <SidebarHeader>
                  {({ getRootProps }) => <div {...getRootProps()} className="bg-white"></div>}
                </SidebarHeader>
                <DateHeader 
                    unit="month" 
                    labelFormat={"MMM" as any}
                    className="h-14" 
                    intervalRenderer={headerRenderer}
                />
              </TimelineHeaders>
            </Timeline>
         </div>
      </section>
    );
}

// --- Variation 1: Current Style (Refined) ---
function VariationCurrent() {
  const { visibleTimeStart, visibleTimeEnd, handleTimeChange, handleZoom, handleMove } = useTimelineControls();
  
  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-slate-800">1. Current Refined (현재 스타일)</h2>
          <Badge variant="outline">Clean & Standard</Badge>
      </div>

       <div className="rounded-xl border border-indigo-100 bg-white shadow-sm overflow-hidden">
         {/* Controls */}
          <div className="flex items-center justify-between border-b border-indigo-50 bg-indigo-50/30 p-2 px-4">
             <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={() => handleMove(-7)}><ChevronLeft className="h-4 w-4" /></Button>
                <Button variant="outline" size="sm" onClick={() => {}} className="gap-1 text-xs font-bold text-indigo-700">오늘</Button>
                <Button variant="outline" size="sm" onClick={() => handleMove(7)}><ChevronRight className="h-4 w-4" /></Button>
             </div>
             <div className="flex gap-1">
                 <Button variant="ghost" size="sm" onClick={() => handleZoom(1.2)}><ZoomOut className="h-4 w-4" /></Button>
                 <Button variant="ghost" size="sm" onClick={() => handleZoom(0.8)}><ZoomIn className="h-4 w-4" /></Button>
             </div>
          </div>
          
          <Timeline
            groups={GROUPS}
            items={ITEMS}
            visibleTimeStart={visibleTimeStart}
            visibleTimeEnd={visibleTimeEnd}
            onTimeChange={handleTimeChange}
            sidebarWidth={150}
            lineHeight={60}
            itemHeightRatio={0.7}
            canMove={false}
            canResize={false}
            stackItems
          >
             <TimelineHeaders className="sticky top-0 z-10 bg-white">
              <SidebarHeader>
                {({ getRootProps }) => <div {...getRootProps()} className="flex items-center justify-center border-r border-indigo-100 bg-white p-3 text-sm font-bold text-indigo-900">작물 리스트</div>}
              </SidebarHeader>
              <DateHeader unit="year" labelFormat={"YYYY년" as any} className="h-8 bg-indigo-50/50 text-xs font-bold text-indigo-400" />
              <DateHeader unit="month" labelFormat={"M월" as any} className="h-10 bg-white text-sm font-bold text-slate-600" />
            </TimelineHeaders>
          </Timeline>
       </div>
    </section>
  );
}

// --- Variation 2: Compact/Minimal ---
function VariationCompact() {
    const { visibleTimeStart, visibleTimeEnd, handleTimeChange } = useTimelineControls();

    return (
      <section className="space-y-4">
        <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-slate-800">2. Compact & Minimal (초소형)</h2>
            <Badge variant="outline" className="bg-slate-100">High Density</Badge>
        </div>
  
         <div className="rounded-lg border border-slate-200 bg-white shadow-sm overflow-hidden">
            <Timeline
              groups={GROUPS}
              items={ITEMS}
              visibleTimeStart={visibleTimeStart}
              visibleTimeEnd={visibleTimeEnd}
              onTimeChange={handleTimeChange}
              sidebarWidth={100}
              lineHeight={40} // Reduced height
              itemHeightRatio={0.8}
              canMove={false}
              canResize={false}
              stackItems
            >
               <TimelineHeaders className="sticky top-0 z-10 bg-white">
                <SidebarHeader>
                  {({ getRootProps }) => <div {...getRootProps()} className="flex items-center justify-center border-r border-slate-100 bg-slate-50 p-2 text-xs font-medium text-slate-500">List</div>}
                </SidebarHeader>
                 {/* Only Month Header used for minimalism */}
                <DateHeader unit="month" labelFormat={"M월" as any} className="h-8 bg-slate-50 text-xs font-medium text-slate-500" />
              </TimelineHeaders>
            </Timeline>
         </div>
      </section>
    );
}

// --- Variation 3: Rich/Card Style ---
function VariationCard() {
    const { visibleTimeStart, visibleTimeEnd, handleTimeChange } = useTimelineControls();

    const itemRenderer = ({ item, getItemProps }: any) => {
        return (
          <div {...getItemProps({ style: { background: 'transparent', border: 'none' } })}>
             <div className="h-full rounded-lg bg-white p-1 shadow-md border hover:border-indigo-400 transition-colors" style={{ borderLeft: `4px solid ${item.bgColor}` }}>
                <div className="text-xs font-bold text-slate-800 truncate">{item.title}</div>
                <div className="text-[10px] text-slate-400 truncate">{moment(item.start_time).format('MM/DD')} ~ {moment(item.end_time).format('MM/DD')}</div>
             </div>
          </div>
        );
    };

    return (
      <section className="space-y-4">
        <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-slate-800">3. Rich Card (카드형)</h2>
            <Badge variant="outline" className="bg-blue-50 text-blue-600">Detailed</Badge>
        </div>
  
         <div className="rounded-xl border border-slate-200 bg-slate-50/50 p-4 shadow-inner overflow-hidden">
            <Timeline
              groups={GROUPS}
              items={ITEMS}
              visibleTimeStart={visibleTimeStart}
              visibleTimeEnd={visibleTimeEnd}
              onTimeChange={handleTimeChange}
              sidebarWidth={140}
              lineHeight={80} // Increased height for card content
              itemHeightRatio={0.9}
              canMove={false}
              canResize={false}
              stackItems
              itemRenderer={itemRenderer}
            >
               <TimelineHeaders className="sticky top-0 z-10 bg-transparent">
                <SidebarHeader>
                  {({ getRootProps }) => <div {...getRootProps()} className="flex items-center pl-4 text-sm font-bold text-slate-700">Fields</div>}
                </SidebarHeader>
                <DateHeader unit="month" labelFormat={"YYYY.MM" as any} className="h-10 bg-transparent text-sm font-bold text-slate-500" />
              </TimelineHeaders>
            </Timeline>
         </div>
      </section>
    );
}

// --- Variation 4: Seasonal Focus ---
function VariationSeasonal() {
    const { visibleTimeStart, visibleTimeEnd, handleTimeChange } = useTimelineControls();

    // Custom interval renderer to colorize seasons (Rough approximation)
    const intervalRenderer = ({ getIntervalProps, intervalContext }: any) => {
        const month = parseInt(moment(intervalContext.interval.startTime).format('M'));
        let bg = '#ffffff';
        let seasonName = '';
        
        // Simple Season Logic
        if (month >= 3 && month <= 5) { bg = '#ecfdf5'; seasonName='봄'; } // Spring - Green
        else if (month >= 6 && month <= 8) { bg = '#fef2f2'; seasonName='여름'; } // Summer - Red
        else if (month >= 9 && month <= 11) { bg = '#fff7ed'; seasonName='가을'; } // Autumn - Orange
        else { bg = '#f8fafc'; seasonName='겨울'; } // Winter - Slate

        return (
            <div {...getIntervalProps()} className="flex flex-col justify-center items-center border-l border-slate-100 text-xs h-full" style={{ backgroundColor: bg }}>
                <span className="font-bold text-slate-600">{intervalContext.intervalText}</span>
                <span className="text-[10px] text-slate-400 opacity-70">{seasonName}</span>
            </div>
        );
    };

    return (
      <section className="space-y-4">
        <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-slate-800">4. Seasonal (계절 강조형)</h2>
            <Badge variant="outline" className="bg-green-50 text-green-600">Seasonal Context</Badge>
        </div>
  
         <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
            <Timeline
              groups={GROUPS}
              items={ITEMS}
              visibleTimeStart={visibleTimeStart}
              visibleTimeEnd={visibleTimeEnd}
              onTimeChange={handleTimeChange}
              sidebarWidth={150}
              lineHeight={60}
              itemHeightRatio={0.75}
              canMove={false}
              canResize={false}
              stackItems
            >
               <TimelineHeaders className="sticky top-0 z-10 bg-white">
                <SidebarHeader>
                  {({ getRootProps }) => <div {...getRootProps()} className="flex items-center justify-center border-r border-slate-100 bg-white p-3 font-bold text-slate-600">Season View</div>}
                </SidebarHeader>
                <DateHeader 
                    unit="month" 
                    labelFormat={"M월" as any} 
                    className="h-14 bg-white" 
                    intervalRenderer={intervalRenderer}
                />
              </TimelineHeaders>
            </Timeline>
         </div>
      </section>
    );
}
