import { cn } from '@/lib/utils';

interface PageContainerProps {
  children: React.ReactNode;
  className?: string;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full';
}

export function PageContainer({ children, className, maxWidth = '2xl' }: PageContainerProps) {
  const maxWidthClass = {
    sm: 'max-w-screen-sm',
    md: 'max-w-screen-md',
    lg: 'max-w-screen-lg',
    xl: 'max-w-screen-xl',
    '2xl': 'max-w-[1400px]',
    full: 'max-w-full',
  }[maxWidth];

  return (
    <div className={cn('min-h-screen bg-slate-50/50 p-6 pt-6 md:p-8', className)}>
      <div className={cn('mx-auto space-y-6', maxWidthClass)}>{children}</div>
    </div>
  );
}
