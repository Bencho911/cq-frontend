import { AlertTriangle, RotateCcw } from 'lucide-react';
import { Button } from './Button';

export function ErrorState({
  title = 'No pudimos cargar esto',
  description = 'Ocurrió un error al comunicarnos con el servidor.',
  onRetry,
}: {
  title?: string;
  description?: string;
  onRetry?: () => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 px-6 py-16 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-danger-soft text-danger">
        <AlertTriangle size={28} strokeWidth={1.75} aria-hidden />
      </div>
      <h3 className="text-[16px] font-semibold text-ink">{title}</h3>
      <p className="max-w-[280px] text-[13px] leading-relaxed text-muted">{description}</p>
      {onRetry && (
        <Button variant="secondary" size="sm" onClick={onRetry} className="mt-1">
          <RotateCcw size={16} aria-hidden />
          Reintentar
        </Button>
      )}
    </div>
  );
}
