import { ChevronLeft } from 'lucide-react';
import { cn } from '../../lib/cn';

interface PageHeaderProps {
  title: string;
  /** Sin `onBack` el título se alinea al borde (pantallas de pestaña). */
  onBack?: () => void;
  /** Acción opcional a la derecha (un botón de 44px). */
  action?: React.ReactNode;
  className?: string;
}

/** Cabecera de pantalla: título en Bricolage, sin logo ni sombra. */
export function PageHeader({ title, onBack, action, className }: PageHeaderProps) {
  return (
    <header
      className={cn(
        'sticky top-0 z-40 flex items-center gap-1 bg-white/95 pb-2 pt-[max(env(safe-area-inset-top),12px)] backdrop-blur-xl',
        onBack ? 'px-2' : 'px-5',
        className,
      )}
    >
      {onBack && (
        <button onClick={onBack} aria-label="Volver" className="grid h-11 w-11 shrink-0 place-items-center text-ink">
          <ChevronLeft size={26} aria-hidden />
        </button>
      )}
      <h1 className="min-w-0 flex-1 truncate font-display text-[26px] font-extrabold text-ink">{title}</h1>
      {action}
    </header>
  );
}
