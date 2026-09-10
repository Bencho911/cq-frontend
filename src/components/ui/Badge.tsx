import { cn } from '../../lib/cn';

type Tone = 'brand' | 'accent' | 'success' | 'danger' | 'neutral' | 'warning';

const toneClasses: Record<Tone, string> = {
  brand: 'bg-brand-soft text-brand-strong',
  accent: 'bg-accent-soft text-accent-deep',
  success: 'bg-success-soft text-success',
  danger: 'bg-danger-soft text-danger',
  neutral: 'bg-cream-deep text-muted-strong',
  warning: 'bg-warning-soft text-warning',
};

export function Badge({
  children,
  tone = 'neutral',
  className,
}: {
  children: React.ReactNode;
  tone?: Tone;
  className?: string;
}) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[12px] font-semibold',
        toneClasses[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}
