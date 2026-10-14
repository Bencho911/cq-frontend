import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Facade, type FacadeTone } from '../components/brand/Facade';
import { Stamp } from '../components/brand/Stamp';
import { BIRDS } from '../lib/loyalty';

interface Step {
  tone: FacadeTone;
  title: string;
  description: string;
  image?: string;
}

const STEPS: Step[] = [
  {
    tone: 'verde',
    title: 'Pide antes de llegar.',
    description: 'Elige, paga y recoge en la barra, sin hacer fila.',
    image: '/brand/ventana-tucan.webp',
  },
  {
    tone: 'mostaza',
    title: 'Como te gusta.',
    description: 'Tamaño, leche, azúcar y adiciones: cada bebida a tu manera.',
    image: '/brand/tucan-flora.webp',
  },
  {
    tone: 'rosa',
    title: 'Cada 10 puntos, un ave.',
    description: 'Suma puntos en cada pedido y completa tu álbum. Con 50, tu bebida va por nuestra cuenta.',
  },
];

/**
 * Tres fachadas, una por idea. El cambio entre pasos es un fundido corto:
 * se ve una sola vez y no debe hacer esperar.
 */
const Onboarding = () => {
  const navigate = useNavigate();
  const [current, setCurrent] = useState(0);
  const step = STEPS[current];
  const isLast = current === STEPS.length - 1;
  const light = step.tone === 'verde';

  const next = () => (isLast ? navigate('/register') : setCurrent((c) => c + 1));

  return (
    <div className="flex h-[100dvh] flex-col bg-white">
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={current}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18 }}
          className="flex flex-1 flex-col"
        >
          <Facade tone={step.tone} image={step.image} imageClassName="h-[300px] w-auto max-w-[86%] -mb-1" className="flex-1">
            <div className="flex items-center justify-between px-6 pt-[max(env(safe-area-inset-top),20px)]">
              <img
                src={light ? '/brand/logo-blanco.webp' : '/brand/logo-teal.webp'}
                alt="Café Quindío"
                className={`h-6 w-auto ${light ? '' : 'brightness-[0.45] saturate-[1.4]'}`}
              />
              <button
                onClick={() => navigate('/login')}
                className={`-mr-3 min-h-[44px] px-3 text-[15px] font-semibold ${light ? 'text-white' : 'text-ink'}`}
              >
                Ya tengo cuenta
              </button>
            </div>
            <div className="px-6 pt-8">
              <h1 className="font-display text-[44px] font-extrabold leading-[0.95] tracking-[-0.04em]">{step.title}</h1>
              <p className={`mt-3 max-w-[320px] text-[17px] leading-snug ${light ? 'text-[#D7ECE9]' : 'text-ink'}`}>
                {step.description}
              </p>
            </div>
            {!step.image && (
              <div className="mt-auto flex items-end justify-center gap-2 px-6 pb-6" aria-hidden>
                {[BIRDS[1], BIRDS[4], BIRDS[2]].map((bird, i) => (
                  <Stamp
                    key={bird.id}
                    bird={bird}
                    className={`h-[170px] w-[118px] ${i === 1 ? '-translate-y-5' : ''}`}
                  />
                ))}
              </div>
            )}
          </Facade>
        </motion.div>
      </AnimatePresence>

      <div className="flex items-center justify-between px-6 pb-[calc(env(safe-area-inset-bottom)+20px)] pt-5">
        <div className="flex gap-1.5" role="tablist" aria-label="Pasos">
          {STEPS.map((s, i) => (
            <button
              key={s.title}
              role="tab"
              aria-selected={i === current}
              aria-label={`Paso ${i + 1} de ${STEPS.length}`}
              onClick={() => setCurrent(i)}
              className="grid h-11 place-items-center"
            >
              <span className={`block h-2 rounded-full transition-[width] duration-200 ${i === current ? 'w-6 bg-ink' : 'w-2 bg-line'}`} />
            </button>
          ))}
        </div>
        <button
          onClick={next}
          className="h-[54px] rounded-md bg-ink px-7 text-[17px] font-semibold text-white transition-transform duration-150 active:scale-[0.97]"
        >
          {isLast ? 'Crear mi cuenta' : 'Siguiente'}
        </button>
      </div>
    </div>
  );
};

export default Onboarding;
