import * as React from 'react';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';

const Dialog = React.forwardRef<
  React.ElementRef<'div'>,
  React.ComponentPropsWithoutRef<'div'> & { open?: boolean; onOpenChange?: (open: boolean) => void }
>(({ className, children, open, onOpenChange, ...props }, ref) => {
  const [isOpen, setIsOpen] = React.useState(open || false);

  React.useEffect(() => {
    if (open !== undefined) setIsOpen(open);
  }, [open]);

  const handleOpenChange = (newOpen: boolean) => {
    setIsOpen(newOpen);
    onOpenChange?.(newOpen);
  };

  return (
    <DialogContext.Provider value={{ isOpen, setIsOpen: handleOpenChange }}>
      <div ref={ref} className={className} {...props}>
          {children}
      </div>
    </DialogContext.Provider>
  );
});
Dialog.displayName = 'Dialog';

const DialogContext = React.createContext<{
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
} | null>(null);

const DialogTrigger = React.forwardRef<
  React.ElementRef<'button'>,
  React.ComponentPropsWithoutRef<'button'> & { asChild?: boolean }
>(({ className, children, onClick, asChild, ...props }, ref) => {
  const context = React.useContext(DialogContext);

  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(children as React.ReactElement<{ onClick?: (e: any) => void }>, {
      onClick: (e: any) => {
        // @ts-ignore
        children.props.onClick?.(e);
        context?.setIsOpen(true);
      },
    });
  }

  return (
    <button
      ref={ref}
      className={cn(className)}
      onClick={(e) => {
        onClick?.(e);
        context?.setIsOpen(true);
      }}
      {...props}
    >
      {children}
    </button>
  );
});
DialogTrigger.displayName = 'DialogTrigger';

const DialogContent = React.forwardRef<
  React.ElementRef<'div'>,
  React.ComponentPropsWithoutRef<'div'>
>(({ className, children, ...props }, ref) => {
  const context = React.useContext(DialogContext);

  if (!context?.isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
        onClick={() => context.setIsOpen(false)}
      />
      <div
        ref={ref}
        className={cn(
          'relative z-50 grid w-full max-w-lg gap-4 border bg-background p-6 shadow-lg duration-200 sm:rounded-lg md:w-full',
          className,
        )}
        {...props}
      >
        {children}
        <button
          className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground"
          onClick={() => context.setIsOpen(false)}
        >
          <X className="h-4 w-4" />
          <span className="sr-only">Close</span>
        </button>
      </div>
    </div>
  );
});
DialogContent.displayName = 'DialogContent';

const DialogHeader = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn('flex flex-col space-y-1.5 text-center sm:text-left', className)} {...props} />
);
DialogHeader.displayName = 'DialogHeader';

const DialogTitle = React.forwardRef<React.ElementRef<'h2'>, React.ComponentPropsWithoutRef<'h2'>>(
  ({ className, ...props }, ref) => (
    <h2
      ref={ref}
      className={cn('text-lg font-semibold leading-none tracking-tight', className)}
      {...props}
    />
  ),
);
DialogTitle.displayName = 'DialogTitle';

const DialogDescription = React.forwardRef<
  React.ElementRef<'p'>,
  React.ComponentPropsWithoutRef<'p'>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn('text-sm text-muted-foreground', className)}
    {...props}
  />
));
DialogDescription.displayName = 'DialogDescription';

const DialogFooter = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      'flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2',
      className
    )}
    {...props}
  />
);
DialogFooter.displayName = 'DialogFooter';

export { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogFooter, DialogTitle, DialogDescription };
