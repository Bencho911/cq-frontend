import { cn } from '../../lib/cn';

export type ArchTone = 'teal' | 'rosa' | 'mostaza';

const TONES: Record<ArchTone, string> = {
  teal: 'bg-teal-soft',
  rosa: 'bg-rosa-soft',
  mostaza: 'bg-mostaza-soft',
};

/** Tono estable por producto, para que el mismo producto conserve su color. */
export function archToneFor(id: number): ArchTone {
  return (['teal', 'mostaza', 'rosa'] as const)[Math.abs(id) % 3];
}

interface ArchProps {
  tone: ArchTone;
  className?: string;
  children?: React.ReactNode;
}

/** Arco de ventana colonial. Forma reservada para armar el pedido. */
export function Arch({ tone, className, children }: ArchProps) {
  return (
    <div className={cn('flex items-end justify-center overflow-hidden rounded-t-full', TONES[tone], className)}>
      {children}
    </div>
  );
}
