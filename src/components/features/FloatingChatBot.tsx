import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { QnaChat } from '@/components/features/QnaChat';
import { MessageCircle, X } from 'lucide-react';
import { cn } from '@/lib/utils';

export function FloatingChatBot() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-4">
      {/* Chat Window Popup */}
      <div
        className={cn(
          'origin-bottom-right overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl transition-all duration-300',
          isOpen
            ? 'h-[600px] w-[380px] translate-y-0 scale-100 opacity-100'
            : 'pointer-events-none h-0 w-0 translate-y-4 scale-95 opacity-0',
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between bg-green-600 bg-gradient-to-r from-green-600 to-emerald-600 p-4 text-white">
          <div className="flex items-center gap-2">
            <span className="rounded-full bg-white/20 p-1.5 text-lg">🤖</span>
            <div>
              <h3 className="text-sm font-bold">농부의 비서</h3>
              <p className="text-[10px] text-green-100 opacity-90">무엇이든 물어보세요!</p>
            </div>
          </div>
        </div>

        {/* Chat Content */}
        <div className="h-[calc(100%-60px)] bg-slate-50">
          <QnaChat hideHeader className="border-0 bg-slate-50" />
        </div>
      </div>

      {/* Floating Toggle Button */}
      <Button
        onClick={() => setIsOpen(!isOpen)}
        size="icon"
        className={cn(
          'h-14 w-14 rounded-full shadow-lg transition-all duration-300 hover:scale-105',
          isOpen
            ? 'rotate-90 bg-slate-700 hover:bg-slate-800'
            : 'bg-gradient-to-tr from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700',
        )}
      >
        {isOpen ? (
          <X className="h-6 w-6 text-white" />
        ) : (
          <MessageCircle className="h-7 w-7 animate-pulse text-white" />
        )}
      </Button>
    </div>
  );
}
