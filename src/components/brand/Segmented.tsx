import { cn } from '../../lib/cn';

interface SegmentedProps<T extends string> {
  options: { value: T; label: React.ReactNode }[];
  value: T;
  onChange: (value: T) => void;
  label: string;
  className?: string;
}

/** Selector de 2–3 opciones sobre fondo teal suave (mismo del carrito). */
export function Segmented<T extends string>({ options, value, onChange, label, className }: SegmentedProps<T>) {
  return (
    <div
      role="group"
      aria-label={label}
      className={cn('grid gap-1 rounded-md bg-teal-soft p-1', className)}
      style={{ gridTemplateColumns: `repeat(${options.length}, minmax(0, 1fr))` }}
    >
      {options.map((o) => (
        <button
          key={o.value}
          onClick={() => onChange(o.value)}
          aria-pressed={value === o.value}
          className={cn(
            'h-11 rounded-md text-[15px] font-semibold transition-colors',
            value === o.value ? 'bg-white text-ink shadow-xs' : 'text-muted',
          )}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}
