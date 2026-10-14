import type { LucideIcon } from 'lucide-react';
import { ChevronRight } from 'lucide-react';
import { cn } from '../../lib/cn';

interface ListRowProps {
  label: string;
  description?: string;
  /** Ícono de línea, sin círculo de fondo. */
  icon?: LucideIcon;
  /** Texto a la derecha (estado, valor elegido). */
  value?: React.ReactNode;
  onClick?: () => void;
  /** Muestra la flecha cuando la fila navega. Por defecto, si hay `onClick`. */
  chevron?: boolean;
  danger?: boolean;
  className?: string;
}

/** Fila de lista plana con separador inferior. Mínimo 52px de alto. */
export function ListRow({ label, description, icon: Icon, value, onClick, chevron, danger, className }: ListRowProps) {
  const Comp = onClick ? 'button' : 'div';
  const showChevron = chevron ?? Boolean(onClick);
  return (
    <Comp
      onClick={onClick}
      className={cn('flex min-h-[52px] w-full items-center gap-3 border-b border-line py-2 text-left', className)}
    >
      {Icon && <Icon size={20} strokeWidth={1.8} className={danger ? 'text-danger' : 'text-ink'} aria-hidden />}
      <span className="min-w-0 flex-1">
        <span className={cn('block text-[16px]', danger ? 'text-danger' : 'text-ink')}>{label}</span>
        {description && <span className="block text-[14px] leading-snug text-muted">{description}</span>}
      </span>
      {value != null && <span className="shrink-0 text-[15px] text-muted">{value}</span>}
      {showChevron && <ChevronRight size={18} className="shrink-0 text-muted" aria-hidden />}
    </Comp>
  );
}
