import type { HTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

type Variant = 'primary' | 'accent' | 'neutral';

const variantClasses: Record<Variant, string> = {
  primary: 'bg-primary/10 text-primary',
  accent: 'bg-accent/10 text-accent',
  neutral: 'bg-surface-muted text-ink-muted',
};

export function Badge({
  variant = 'neutral',
  className,
  ...props
}: HTMLAttributes<HTMLSpanElement> & { variant?: Variant }) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-tag px-2 py-0.5 text-xs font-semibold uppercase tracking-wide',
        variantClasses[variant],
        className
      )}
      {...props}
    />
  );
}
