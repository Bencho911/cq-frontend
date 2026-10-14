import { RotateCcw } from 'lucide-react';
import { Button } from './Button';

/** Error con dirección: qué pasó y cómo seguir. */
export function ErrorState({
  title = 'No pudimos cargar esto',
  description = 'Revisa tu conexión e inténtalo de nuevo.',
  onRetry,
}: {
  title?: string;
  description?: string;
  onRetry?: () => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 px-6 py-14 text-center">
      <img src="/brand/ave-mirla.webp" alt="" aria-hidden className="mb-1 h-[110px] w-auto object-contain" />
      <h3 className="font-display text-[22px] font-extrabold text-ink">{title}</h3>
      <p className="max-w-[290px] text-[15px] leading-relaxed text-muted">{description}</p>
      {onRetry && (
        <Button variant="secondary" size="sm" onClick={onRetry} className="mt-1">
          <RotateCcw size={16} aria-hidden />
          Reintentar
        </Button>
      )}
    </div>
  );
}
