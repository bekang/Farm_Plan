import * as React from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

const AccordionContext = React.createContext<{
  value?: string;
  onValueChange?: (value: string) => void;
} | null>(null);

const Accordion = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    type?: 'single' | 'multiple';
    value?: string;
    defaultValue?: string;
    onValueChange?: (value: string) => void;
    collapsible?: boolean;
  }
>(
  (
    {
      className,
      type = 'single',
      value: valueProp,
      defaultValue,
      onValueChange: onValueChangeProp,
      children,
      ...props
    },
    ref,
  ) => {
    const [value, setValue] = React.useState<string | undefined>(
      defaultValue || (type === 'single' ? undefined : ''),
    );

    const handleValueChange = React.useCallback(
      (itemValue: string) => {
        if (type === 'single') {
          const newValue = value === itemValue ? '' : itemValue;
          setValue(newValue);
          onValueChangeProp?.(newValue);
        }
        // Multiple not fully implemented for this lightweight version but logic would go here
      },
      [value, onValueChangeProp, type],
    );

    return (
      <AccordionContext.Provider
        value={{
          value: valueProp !== undefined ? valueProp : value,
          onValueChange: handleValueChange,
        }}
      >
        <div ref={ref} className={className} {...props}>
          {children}
        </div>
      </AccordionContext.Provider>
    );
  },
);
Accordion.displayName = 'Accordion';

const AccordionItem = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { value: string }
>(({ className, value, ...props }, ref) => {
  const context = React.useContext(AccordionContext);
  const isOpen = context?.value === value;

  return (
    <div
      ref={ref}
      className={cn('border-b', className)}
      data-state={isOpen ? 'open' : 'closed'}
      {...props}
    />
  );
});
AccordionItem.displayName = 'AccordionItem';

const AccordionTrigger = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement>
>(({ className, children, ...props }, ref) => {
  return (
    <div className="flex">
      <TriggerWithContext className={className} ref={ref} {...props}>
        {children}
      </TriggerWithContext>
    </div>
  );
});
AccordionTrigger.displayName = 'AccordionTrigger';

// Helper to access item value from parent Item
// Actually, standard radix way uses an ItemContext. Let's do that for correctness.
const AccordionItemContext = React.createContext<{ value: string } | null>(null);

// Re-implement Item with Context
const AccordionItemWithContext = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { value: string }
>(({ className, value, children, ...props }, ref) => {
  const rootContext = React.useContext(AccordionContext);
  const isOpen = rootContext?.value === value;

  return (
    <AccordionItemContext.Provider value={{ value }}>
      <div
        ref={ref}
        className={cn('border-b', className)}
        data-state={isOpen ? 'open' : 'closed'}
        {...props}
      >
        {children}
      </div>
    </AccordionItemContext.Provider>
  );
});
AccordionItemWithContext.displayName = 'AccordionItem';

const TriggerWithContext = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement>
>(({ className, children, ...props }, ref) => {
  const rootContext = React.useContext(AccordionContext);
  const itemContext = React.useContext(AccordionItemContext);

  if (!rootContext || !itemContext) return null;

  const isOpen = rootContext.value === itemContext.value;

  return (
    <button
      ref={ref}
      onClick={() => rootContext.onValueChange?.(itemContext.value)}
      className={cn(
        'flex flex-1 items-center justify-between py-4 font-medium transition-all hover:underline [&[data-state=open]>svg]:rotate-180',
        className,
      )}
      data-state={isOpen ? 'open' : 'closed'}
      {...props}
    >
      {children}
      <ChevronDown className="h-4 w-4 shrink-0 transition-transform duration-200" />
    </button>
  );
});

const AccordionContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, children, ...props }, ref) => {
    const rootContext = React.useContext(AccordionContext);
    const itemContext = React.useContext(AccordionItemContext);

    if (!rootContext || !itemContext) return null;

    const isOpen = rootContext.value === itemContext.value;

    if (!isOpen) return null;

    return (
      <div
        ref={ref}
        className={cn(
          'overflow-hidden text-sm transition-all data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down',
          className,
        )}
        data-state={isOpen ? 'open' : 'closed'}
        {...props}
      >
        <div className="pb-4 pt-0">{children}</div>
      </div>
    );
  },
);
AccordionContent.displayName = 'AccordionContent';

export { Accordion, AccordionItemWithContext as AccordionItem, AccordionTrigger, AccordionContent };
