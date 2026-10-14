import { cn } from '../../lib/cn';

export type DoorTone = 'teal' | 'rosa' | 'verde' | 'mostaza';

const TONE_CLASSES: Record<DoorTone, string> = {
  teal: 'bg-teal text-ink',
  rosa: 'bg-rosa text-ink',
  verde: 'bg-verde text-white',
  mostaza: 'bg-mostaza text-ink',
};

interface DoorProps {
  title: string;
  subtitle?: string;
  image?: string;
  tone: DoorTone;
  onClick?: () => void;
  className?: string;
}

/** Puerta pintada de fachada: entrada a una categoría. */
export function Door({ title, subtitle, image, tone, onClick, className }: DoorProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'relative flex h-[150px] flex-col justify-end overflow-hidden rounded-t-[52px] rounded-b-md px-3 pb-3 text-left transition-transform duration-150 active:scale-[0.97]',
        TONE_CLASSES[tone],
        className,
      )}
    >
      {image && (
        <img src={image} alt="" aria-hidden className="absolute left-1/2 top-3 h-[64px] w-auto -translate-x-1/2 object-contain" />
      )}
      <span className="relative font-display text-[18px] font-extrabold leading-none">{title}</span>
      {subtitle && <span className="relative mt-1 text-[13px] leading-tight">{subtitle}</span>}
    </button>
  );
}
