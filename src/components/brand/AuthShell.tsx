import { ChevronLeft } from 'lucide-react';
import { Facade, type FacadeTone } from './Facade';

interface AuthShellProps {
  tone: FacadeTone;
  image: string;
  title: string;
  subtitle?: React.ReactNode;
  onBack?: () => void;
  /** Acción fija inferior (botón primario). */
  footer?: React.ReactNode;
  children?: React.ReactNode;
}

/**
 * Estructura de las pantallas de acceso: fachada de color arriba con la
 * marca y una ilustración, formulario sobre blanco abajo.
 */
export function AuthShell({ tone, image, title, subtitle, onBack, footer, children }: AuthShellProps) {
  const light = tone === 'verde' || tone === 'ink';
  return (
    <div className="flex min-h-[100dvh] flex-col bg-white">
      <Facade tone={tone} image={image} imageClassName="h-[150px] w-auto -mb-1" className="shrink-0">
        <div className="flex items-center justify-between px-3 pt-[max(env(safe-area-inset-top),12px)]">
          {onBack ? (
            <button
              onClick={onBack}
              aria-label="Volver"
              className={`grid h-11 w-11 place-items-center ${light ? 'text-white' : 'text-ink'}`}
            >
              <ChevronLeft size={26} aria-hidden />
            </button>
          ) : (
            <span className="h-11 w-11" />
          )}
          <img
            src={light ? '/brand/logo-blanco.webp' : '/brand/logo-teal.webp'}
            alt="Café Quindío"
            className={`h-6 w-auto ${light ? '' : 'brightness-[0.45] saturate-[1.4]'}`}
          />
          <span className="h-11 w-11" />
        </div>
      </Facade>

      <main className="flex flex-1 flex-col px-5 pt-6">
        <h1 className="font-display text-[32px] font-extrabold leading-[1.02] text-ink">{title}</h1>
        {subtitle && <p className="mt-2 text-[16px] leading-relaxed text-muted">{subtitle}</p>}
        <div className="mt-6 flex flex-1 flex-col">{children}</div>
      </main>

      {footer && <div className="px-5 pb-[calc(env(safe-area-inset-bottom)+20px)] pt-3">{footer}</div>}
    </div>
  );
}
