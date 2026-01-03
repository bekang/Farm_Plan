import { useState } from 'react';
import moment from 'moment';
import { Button } from '@/components/ui/button';
import { Calendar, ZoomIn, ZoomOut, ChevronLeft, ChevronRight } from 'lucide-react';
import Timeline, {
  TimelineHeaders,
  SidebarHeader,
  DateHeader,
  TimelineMarkers,
  TodayMarker,
} from 'react-calendar-timeline';
import 'react-calendar-timeline/dist/style.css';
import './TimelineOverride.css';

export function TimelineScheduler({ plans, fieldName }: { plans: any[], fieldName?: string }) {
  const [visibleTimeStart, setVisibleTimeStart] = useState(moment().add(-1, 'month').valueOf());
  const [visibleTimeEnd, setVisibleTimeEnd] = useState(moment().add(2, 'month').valueOf());

  const handleTimeChange = (visibleTimeStart: number, visibleTimeEnd: number, updateScrollCanvas: (start: number, end: number) => void) => {
    setVisibleTimeStart(visibleTimeStart);
    setVisibleTimeEnd(visibleTimeEnd);
    updateScrollCanvas(visibleTimeStart, visibleTimeEnd);
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

  const handleToday = () => {
    setVisibleTimeStart(moment().add(-15, 'days').valueOf());
    setVisibleTimeEnd(moment().add(45, 'days').valueOf());
  };

  // --- Data Transformation for Hierarchy View (Horizontal Stacking) ---
  const groups: any[] = [];
  const items: any[] = [];

  // Define Fixed Groups for the Field
  const MAIN_GROUP_ID = 'field-main';
  const P1_GROUP_ID = 'field-p1';
  const P2_GROUP_ID = 'field-p2';
  const P3_GROUP_ID = 'field-p3';
  const P4_GROUP_ID = 'field-p4';

  if (plans.length > 0) {
      // 1. Fixed Layout Groups
      groups.push({ id: MAIN_GROUP_ID, title: `${fieldName || '작기'} 전체 일정`, isMain: true, height: 70 }); 
      groups.push({ id: P1_GROUP_ID, title: 'Phase 1: 파종/정식', parent: MAIN_GROUP_ID });
      groups.push({ id: P2_GROUP_ID, title: 'Phase 2: 재배 관리 (초기)', parent: MAIN_GROUP_ID });
      groups.push({ id: P3_GROUP_ID, title: 'Phase 3: 재배 관리 (후기)', parent: MAIN_GROUP_ID });
      groups.push({ id: P4_GROUP_ID, title: 'Phase 4: 수확', parent: MAIN_GROUP_ID });

      // 2. Map All Plans
      plans.forEach((p, index) => {
        const planId = p.id;
        const cropName = p.cropName;
        
        const start = moment(p.plantingDate);
        const end = moment(p.expectedHarvestDate);

        // A. Main Item (Card Style)
        items.push({
            id: `${planId}-summary`,
            group: MAIN_GROUP_ID,
            title: cropName,
            subtitle: `${start.format('YY.MM.DD')} ~ ${end.format('YY.MM.DD')}`,
            start_time: start, 
            end_time: end,
            canMove: false,
            canResize: false,
            isMain: true,
            bgColor: index % 2 === 0 ? '#ef4444' : '#10b981', // Red / Emerald
            borderColor: index % 2 === 0 ? '#b91c1c' : '#047857'
        });

        // B. Soil Prep (Vertical Bar on Main and P1-P4)
        if (p.includeSoilPrep) {
             const prepEnd = p.soilPrepEndDate ? moment(p.soilPrepEndDate) : moment(start).subtract(1, 'days');
             const prepStart = p.soilPrepStartDate ? moment(p.soilPrepStartDate) : moment(start).subtract(1, 'days'); // Fallback to 1 day instead of 14
             
             [MAIN_GROUP_ID, P1_GROUP_ID, P2_GROUP_ID, P3_GROUP_ID, P4_GROUP_ID].forEach((gid, idx) => {
                 items.push({
                    id: `${planId}-prep-block-${gid}`,
                    group: gid,
                    title: idx === 0 ? '기초작업' : '', 
                    start_time: prepStart,
                    end_time: prepEnd, 
                    bgColor: '#fbbf24', // Amber-400
                    isPrep: true,
                    isTop: idx === 0,
                    isBottom: idx === 4,
                 });
             });
        }

        // C. Phase Items (Simpler Colors)
        items.push({
            id: `${planId}-item-planting`,
            group: P1_GROUP_ID,
            title: `${cropName} 파종`,
            start_time: moment(start),
            end_time: moment(start).add(2, 'days'), 
            bgColor: '#f43f5e', // Rose
            canMove: false, canResize: false,
        });

         const midPoint = moment(start).add(moment(end).diff(start) / 2);
         items.push({
             id: `${planId}-item-care-early`,
             group: P2_GROUP_ID,
             title: `초기 관리`,
             start_time: moment(start).add(3, 'days'),
             end_time: midPoint,
             bgColor: '#f97316', // Orange
             canMove: false, canResize: false,
         });

         items.push({
             id: `${planId}-item-care-late`,
             group: P3_GROUP_ID,
             title: `후기 관리`,
             start_time: midPoint,
             end_time: moment(end).subtract(7, 'days'),
             bgColor: '#eab308', // Yellow
             canMove: false, canResize: false,
         });

         items.push({
             id: `${planId}-item-harvest`,
             group: P4_GROUP_ID,
             title: `수확`,
             start_time: moment(end).subtract(7, 'days'), 
             end_time: end,
             bgColor: '#84cc16', // Lime
             canMove: false, canResize: false,
         });
      });
  }

  // Group Renderer
  const groupRenderer = ({ group }: any) => {
    const isMain = group.isMain;
    return (
        <div className={`flex h-full items-center ${isMain ? 'pl-4 bg-slate-50' : 'pl-8'} border-r border-slate-200 transition-colors`}>
            {!isMain && <span className="mr-2 text-slate-300">↳</span>}
            <div className="flex flex-col">
                <span className={`${isMain ? 'text-sm font-bold text-slate-800' : 'text-xs text-slate-500'}`}>
                    {group.title}
                </span>
            </div>
        </div>
    );
  };

  // Item Renderer
  const itemRenderer = ({ item, getItemProps }: any) => {
    const isMain = item.isMain;
    const isPrep = item.isPrep;
    
    // 1. Vertical Prep Bar
    if (isPrep) {
         return (
            <div {...getItemProps({ style: { background: 'transparent', border: 'none' } })}>
                 <div className="flex h-full w-full justify-center px-[1px]">
                    <div 
                        className={`flex h-full w-full items-center justify-center bg-amber-200/50 hover:bg-amber-300/50 transition-colors ${item.isTop ? 'rounded-t' : ''} ${item.isBottom ? 'rounded-b' : ''}`}
                    >
                        {item.isTop && (
                            <span className="writing-vertical-rl text-[10px] font-bold text-amber-700 tracking-widest py-1" style={{ textOrientation: 'upright' }}>
                                 {item.title}
                            </span>
                        )}
                    </div>
                 </div>
            </div>
        );
    }

    // 2. Main Summary Card (New Style)
    if (isMain) {
        return (
            <div {...getItemProps({ style: { background: 'transparent', border: 'none' } })}>
                 <div className="flex h-full items-center px-1">
                    <div className="flex h-[40px] w-full flex-col justify-center rounded-lg border border-slate-200 bg-white pl-3 text-xs shadow-sm transition-all hover:shadow-md"
                         style={{ borderLeft: `6px solid ${item.bgColor}` }}
                    >
                         <span className="font-bold text-slate-800 text-[13px]">{item.title}</span>
                         <span className="text-[10px] text-slate-400">{item.subtitle}</span>
                    </div>
                 </div>
            </div>
        );
    }

    // 3. Normal Phase Items (Pill Style)
    const durationDays = moment.duration(moment(item.end_time).diff(moment(item.start_time))).asDays();
    return (
       <div {...getItemProps({ style: { background: 'transparent', border: 'none' } })}>
          <div className="h-full py-1.5 px-0.5">
              <div 
                 className="flex h-full items-center justify-center rounded-md text-white shadow-sm hover:shadow-md transition-opacity opacity-90 hover:opacity-100"
                 style={{ backgroundColor: item.bgColor }}
             >
                 {durationDays > 10 && <span className="truncate px-2 text-[10px] font-medium">{item.title}</span>}
             </div>
          </div>
       </div>
     );
  };

  // Zoom Threshold for Day Header
  const showDayHeader = (visibleTimeEnd - visibleTimeStart) < (45 * 24 * 60 * 60 * 1000); // approx 45 days

  if (plans.length === 0) { /* ... same ... */
      return (
      <div className="rounded border bg-slate-50 p-10 text-center text-slate-400">
        등록된 작기가 없습니다.
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
      {/* Controls Header */}
      <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50/50 p-2 px-4">
         {/* ... Controls same ... */}
         <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => handleMove(-7)} className="h-8 w-8 p-0"><ChevronLeft className="h-4 w-4" /></Button>
            <Button variant="outline" size="sm" onClick={handleToday} className="h-8 gap-1 px-3 text-xs font-bold text-slate-700 hover:bg-slate-100">
                <Calendar className="h-3 w-3" /> 오늘
            </Button>
            <Button variant="outline" size="sm" onClick={() => handleMove(7)} className="h-8 w-8 p-0"><ChevronRight className="h-4 w-4" /></Button>
         </div>
         {fieldName && <div className="text-sm font-bold text-slate-800">{fieldName}</div>}
         <div className="flex items-center gap-1">
             <Button variant="ghost" size="sm" onClick={() => handleZoom(1.5)} className="h-8 w-8 p-0 text-slate-400 hover:text-indigo-600"><ZoomOut className="h-4 w-4" /></Button>
             <Button variant="ghost" size="sm" onClick={() => handleZoom(0.5)} className="h-8 w-8 p-0 text-slate-400 hover:text-indigo-600"><ZoomIn className="h-4 w-4" /></Button>
         </div>
      </div>

      <Timeline
        groups={groups}
        items={items}
        visibleTimeStart={visibleTimeStart}
        visibleTimeEnd={visibleTimeEnd}
        onTimeChange={handleTimeChange}
        sidebarWidth={180}
        lineHeight={50}
        itemHeightRatio={0.9}
        canMove={false}
        canResize={false}
        stackItems
        groupRenderer={groupRenderer}
        itemRenderer={itemRenderer}
      >
        <TimelineHeaders className="sticky top-0 z-10 bg-white shadow-sm">
          <SidebarHeader>
            {({ getRootProps }) => {
              return (
                <div
                  {...getRootProps()}
                  className="flex items-center justify-center border-r border-slate-200 bg-slate-50 p-3 text-xs font-bold text-slate-600"
                >
                  일정 구조
                </div>
              );
            }}
          </SidebarHeader>
          
          <DateHeader 
            unit="year" 
            labelFormat={(date: any) => moment(date).format("YYYY")}
            className="h-6 bg-slate-100 text-xs text-slate-500 border-b border-slate-200"
            intervalRenderer={({ getIntervalProps, intervalContext }) => {
                return (
                    <div {...getIntervalProps()} className="flex items-center justify-center border-l border-slate-300 text-xs font-medium text-slate-600 bg-slate-50">
                       {intervalContext.intervalText}
                    </div>
                );
            }}
          />

          <DateHeader 
            unit="month" 
            labelFormat={(date: any) => moment(date).format("M월")}
            className="h-7 text-xs font-medium"
            intervalRenderer={({ getIntervalProps, intervalContext }) => {
                const isEven = intervalContext.interval.startTime.month() % 2 === 0;
                return (
                    <div {...getIntervalProps()} className={`flex items-center justify-center border-l border-slate-100 text-xs text-slate-600 ${isEven ? 'bg-white' : 'bg-slate-50/50'}`}>
                       {intervalContext.intervalText}
                    </div>
                );
            }}
          />

          {showDayHeader && (
              <DateHeader 
                  unit="day" 
                  labelFormat={(date: any) => moment(date).format("D")}
                  className="h-5 text-[10px] text-slate-400 bg-white border-b border-slate-100"
              />
          )}

        </TimelineHeaders>
        <TimelineMarkers>
            <TodayMarker>
                {({ styles }) => <div style={{ ...styles, backgroundColor: '#ef4444', width: '2px', zIndex: 100 }} />}
            </TodayMarker>
        </TimelineMarkers>
      </Timeline>
    </div>
  );
}
