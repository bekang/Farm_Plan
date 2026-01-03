import { type LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PageHeaderProps {
  title: string;
  description?: string;
  icon?: LucideIcon;
  children?: React.ReactNode; // For actions buttons
  className?: string;
}

export function PageHeader({
  title,
  description,
  icon: Icon,
  children,
  className,
}: PageHeaderProps) {
  return (
    <div
      className={cn(
        'flex flex-col justify-between gap-4 border-b border-slate-200 pb-6 md:flex-row md:items-center',
        className,
      )}
    >
      <div className="space-y-1">
        <h1 className="flex items-center gap-3 text-2xl font-bold tracking-tight text-slate-900 md:text-3xl">
          {Icon && <Icon className="h-8 w-8 text-indigo-600" />}
          {title}
        </h1>
        {description && (
          <p className="max-w-2xl text-sm text-slate-500 md:text-base">{description}</p>
        )}
      </div>
      {children && <div className="flex items-center gap-2">{children}</div>}
    </div>
  );
}
