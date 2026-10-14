import { Loader2 } from 'lucide-react';
import { Facade, type FacadeTone } from './Facade';

interface WaitScreenProps {
  tone: FacadeTone;
  image: string;
  title: string;
  description?: string;
}

/** Espera breve a pantalla completa: dice qué está pasando, sin adornos. */
export function WaitScreen({ tone, image, title, description }: WaitScreenProps) {
  const light = tone === 'verde' || tone === 'ink';
  return (
    <Facade tone={tone} image={image} imageClassName="w-[240px]" className="h-[100dvh]">
      <div className="px-6 pt-[max(env(safe-area-inset-top),28px)]" role="status" aria-live="polite">
        <img
          src={light ? '/brand/logo-blanco.webp' : '/brand/logo-teal.webp'}
          alt="Café Quindío"
          className={`h-6 w-auto ${light ? '' : 'brightness-[0.45] saturate-[1.4]'}`}
        />
        <Loader2 size={28} className="mt-10 animate-spin" aria-hidden />
        <h1 className="mt-4 font-display text-[40px] font-extrabold leading-[0.95] tracking-[-0.04em]">{title}</h1>
        {description && <p className={`mt-3 text-[17px] leading-snug ${light ? 'text-[#D7ECE9]' : 'text-ink'}`}>{description}</p>}
      </div>
    </Facade>
  );
}
