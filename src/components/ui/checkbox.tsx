import * as React from 'react';


import { cn } from '@/lib/utils';

const Checkbox = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className, ...props }, ref) => (
    <div className="flex items-center space-x-2">
      <input
        type="checkbox"
        ref={ref}
        className={cn(
          'peer h-4 w-4 shrink-0 rounded-sm border border-slate-200 border-slate-900 accent-indigo-600 ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-slate-900 data-[state=checked]:text-slate-50',
          className,
        )}
        {...props}
      />
    </div>
  ),
);
Checkbox.displayName = 'Checkbox';

export { Checkbox };
