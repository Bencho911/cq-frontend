import { cn } from '../../lib/cn';

type Tone = 'brand' | 'accent' | 'success' | 'danger' | 'neutral' | 'warning';

const toneClasses: Record<Tone, string> = {
  brand: 'bg-teal-soft text-ink',
  accent: 'bg-mostaza text-ink',
  success: 'bg-success-soft text-success',
  danger: 'bg-danger-soft text-danger',
  neutral: 'bg-cream-deep text-ink',
  warning: 'bg-mostaza-soft text-ink',
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
        'inline-flex items-center gap-1 rounded-sm px-2 py-0.5 text-[13px] font-semibold',
        toneClasses[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}
