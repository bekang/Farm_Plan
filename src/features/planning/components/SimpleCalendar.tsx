import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { 
  format, addMonths, subMonths, startOfMonth, endOfMonth, 
  startOfWeek, endOfWeek, eachDayOfInterval, isSameMonth, 
  isSameDay, isWithinInterval
} from 'date-fns';

interface BlockedRange {
  start: Date;
  end: Date;
  label?: string;
  color?: string; // hex or tailwind class
}

interface SimpleCalendarProps {
  selectedDate: Date | null;
  onSelect: (date: Date) => void;
  blockedRanges?: BlockedRange[];
  className?: string;
}

export function SimpleCalendar({ selectedDate, onSelect, blockedRanges = [], className = '' }: SimpleCalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const onPrevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));

  const renderHeader = () => {
    return (
      <div className="flex items-center justify-between p-2">
        <Button variant="ghost" size="icon" onClick={onPrevMonth} className="h-7 w-7">
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <div className="flex items-center gap-1">
            {/* Year Select */}
            <select 
                className="h-7 rounded border border-slate-200 bg-white text-xs font-bold focus:outline-none focus:ring-2 focus:ring-indigo-500"
                value={currentMonth.getFullYear()}
                onChange={(e) => setCurrentMonth(new Date(currentMonth.setFullYear(parseInt(e.target.value))))}
            >
                {Array.from({ length: 11 }, (_, i) => new Date().getFullYear() - 5 + i).map(year => (
                    <option key={year} value={year}>{year}년</option>
                ))}
            </select>
            {/* Month Select */}
            <select 
                className="h-7 rounded border border-slate-200 bg-white text-xs font-bold focus:outline-none focus:ring-2 focus:ring-indigo-500"
                value={currentMonth.getMonth()}
                onChange={(e) => setCurrentMonth(new Date(currentMonth.setMonth(parseInt(e.target.value))))}
            >
                {Array.from({ length: 12 }, (_, i) => i).map(month => (
                    <option key={month} value={month}>{month + 1}월</option>
                ))}
            </select>
        </div>
        <div className="flex items-center gap-1">
             <Button variant="ghost" size="icon" onClick={() => setCurrentMonth(addMonths(currentMonth, 1))} className="h-7 w-7">
              <ChevronRight className="h-4 w-4" />
            </Button>
        </div>
      </div>
    );
  };

  const renderDays = () => {
    const days = ['일', '월', '화', '수', '목', '금', '토'];
    return (
      <div className="grid grid-cols-7 mb-1 text-center">
        {days.map((day, i) => (
          <div key={i} className={`text-xs font-medium ${i === 0 ? 'text-red-500' : 'text-slate-500'}`}>
            {day}
          </div>
        ))}
      </div>
    );
  };

  const renderCells = () => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart);
    const endDate = endOfWeek(monthEnd);

    const dateFormat = "d";

    const dayList = eachDayOfInterval({ start: startDate, end: endDate });

    return (
        <div className="grid grid-cols-7 gap-1">
            {dayList.map((dayItem, idx) => {
                 const isBlocked = blockedRanges.some(range => 
                    isWithinInterval(dayItem, { start: range.start, end: range.end })
                 );
                 const isSelected = selectedDate ? isSameDay(dayItem, selectedDate) : false;
                 const isCurrentMonth = isSameMonth(dayItem, monthStart);
                 const isSunday = dayItem.getDay() === 0;

                 return (
                     <div 
                        key={dayItem.toString()} 
                        className={`
                            relative flex h-9 w-full cursor-pointer items-center justify-center rounded-md text-sm transition-all
                            ${!isCurrentMonth ? 'text-slate-300' : isSunday ? 'text-red-600' : 'text-slate-700'}
                            ${isBlocked ? 'cursor-not-allowed bg-slate-100 text-slate-400 opacity-70' : 'hover:bg-indigo-50 hover:text-indigo-600'}
                            ${isSelected ? 'bg-indigo-600 font-bold text-white hover:bg-indigo-700 hover:text-white' : ''}
                        `}
                        onClick={() => !isBlocked && onSelect(dayItem)}
                     >
                         {format(dayItem, dateFormat)}
                         {isBlocked && (
                             <div className="absolute bottom-1 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-red-400"></div>
                         )}
                     </div>
                 );
            })}
        </div>
    );
  };

  return (
    <div className={`w-full max-w-[300px] rounded-lg border border-slate-200 bg-white p-3 shadow-sm ${className}`}>
      {renderHeader()}
      {renderDays()}
      {renderCells()}
    </div>
  );
}
