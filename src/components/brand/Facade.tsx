import { cn } from '../../lib/cn';

export type FacadeTone = 'verde' | 'teal' | 'mostaza' | 'rosa' | 'ink';

const WALL: Record<FacadeTone, string> = {
  verde: 'bg-verde text-white',
  teal: 'bg-teal text-ink',
  mostaza: 'bg-mostaza text-ink',
  rosa: 'bg-rosa text-ink',
  ink: 'bg-ink text-white',
};

interface FacadeProps {
  tone: FacadeTone;
  /** Ilustración corporativa apoyada sobre el zócalo. */
  image?: string;
  imageClassName?: string;
  /** Color del suelo bajo el zócalo; `none` termina la fachada en el zócalo. */
  ground?: 'mostaza' | 'white' | 'none';
  className?: string;
  children?: React.ReactNode;
}

/**
 * Fachada: muro de color plano con una ilustración y el zócalo rojo y
 * azul tinta. Se usa en momentos de bienvenida, espera y confirmación.
 */
export function Facade({ tone, image, imageClassName, ground = 'none', className, children }: FacadeProps) {
  return (
    <div className={cn('relative flex flex-col overflow-hidden', WALL[tone], className)}>
      <div className="relative z-10">{children}</div>
      {image && (
        <img
          src={image}
          alt=""
          aria-hidden
          className={cn('pointer-events-none relative mx-auto mt-auto w-[220px] object-contain', imageClassName)}
        />
      )}
      <div className="zocalo relative shrink-0" aria-hidden />
      {ground !== 'none' && <div className={cn('h-6 shrink-0', ground === 'mostaza' ? 'bg-mostaza' : 'bg-white')} aria-hidden />}
    </div>
  );
}
