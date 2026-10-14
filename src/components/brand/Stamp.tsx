import { cn } from '../../lib/cn';
import type { Bird, StampTone } from '../../lib/loyalty';

const TONES: Record<StampTone | 'empty', string> = {
  rosa: 'var(--color-rosa)',
  teal: 'var(--color-teal)',
  mostaza: 'var(--color-mostaza)',
  'rosa-soft': 'var(--color-rosa-soft)',
  'mostaza-soft': 'var(--color-mostaza-soft)',
  empty: 'var(--color-cream-mid)',
};

interface StampProps {
  bird: Bird;
  /** `earned`: a color. `next`: silueta sobre mostaza. `locked`: silueta gris con "?". */
  state?: 'earned' | 'next' | 'locked';
  className?: string;
  imgClassName?: string;
}

/** Estampilla perforada con un ave. Forma reservada para la lealtad. */
export function Stamp({ bird, state = 'earned', className, imgClassName }: StampProps) {
  const tone = state === 'earned' ? bird.tone : state === 'next' ? 'mostaza' : 'empty';
  return (
    <div className={cn('stamp', className)} style={{ ['--stamp-color' as string]: TONES[tone] }}>
      <div className="relative grid h-full place-items-center overflow-hidden">
        <img
          src={bird.image}
          alt={state === 'earned' ? bird.name : ''}
          className={cn(
            'h-[86%] w-auto object-contain',
            state !== 'earned' && 'brightness-0',
            state === 'next' && 'opacity-[0.16]',
            state === 'locked' && 'opacity-[0.07]',
            imgClassName,
          )}
          loading="lazy"
        />
        {state === 'locked' && (
          <span className="absolute font-display text-[40px] font-extrabold text-muted opacity-50" aria-hidden>
            ?
          </span>
        )}
      </div>
    </div>
  );
}
