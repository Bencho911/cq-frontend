import { useEffect, useRef, useState } from 'react';
import { animate, motion, useMotionValue, useMotionValueEvent, useReducedMotion, useTransform, type MotionValue } from 'framer-motion';
import {
  BIRDS_PER_CARD,
  MOCK_ACCOUNT,
  POINTS_PER_BIRD,
  POINTS_PER_REWARD,
  summarize,
} from '../lib/loyalty';
import { Stamp } from '../components/brand/Stamp';
import { pointsFrom, readSeen, writeSeen } from '../lib/loyaltySeen';

// MOCK: beneficios e historial (el backend aún no expone el programa).
const BENEFITS = [
  { title: 'Bebida gratis', desc: `Cada ${POINTS_PER_REWARD} puntos.` },
  { title: 'Prioridad en tienda', desc: 'Tus pedidos pasan primero en la barra.' },
  { title: 'Regalo de cumpleaños', desc: 'Un postre gratis en tu mes.' },
];

const HISTORY = [
  { id: 1, action: 'Compra en Tienda Centro', points: 12, date: 'Hoy, 2:15 p. m.' },
  { id: 2, action: 'Bebida gratis canjeada', points: -50, date: '4 sep, 10:00 a. m.' },
  { id: 3, action: 'Compra en Tienda Norte', points: 15, date: '28 ago, 4:30 p. m.' },
];

const EASE_OUT = [0.23, 1, 0.32, 1] as const;

/** Sello de las aves nuevas; se crea al primer uso. */
let stampSound: HTMLAudioElement | null = null;
function playStamp() {
  try {
    stampSound ??= new Audio('/sfx/stamp.wav');
    const s = stampSound.cloneNode() as HTMLAudioElement;
    s.volume = 0.5;
    void s.play().catch(() => {});
  } catch {
    /* sin audio */
  }
}

/** Un tramo de la barra: se llena con el mismo valor que mueve el contador. */
function Segment({ progress, index }: { progress: MotionValue<number>; index: number }) {
  const scaleX = useTransform(progress, (v) => Math.min(1, Math.max(0, (v - index * POINTS_PER_BIRD) / POINTS_PER_BIRD)));
  return (
    <span className="relative h-2.5 overflow-hidden rounded-sm bg-line">
      <motion.span className="absolute inset-0 origin-left bg-ink" style={{ scaleX }} />
    </span>
  );
}

/** El ave nueva cae sobre su silueta como un sello: algo grande y ladeada, con un rebote corto. */
function SealedStamp({ children, reduced }: { children: React.ReactNode; reduced: boolean }) {
  return (
    <motion.div
      className="absolute inset-0"
      initial={reduced ? { opacity: 0 } : { opacity: 0, scale: 1.18, rotate: -8 }}
      animate={reduced ? { opacity: 1 } : { opacity: 1, scale: 1, rotate: 0 }}
      transition={
        reduced
          ? { duration: 0.2 }
          : { type: 'spring', duration: 0.45, bounce: 0.25, opacity: { duration: 0.12 } }
      }
    >
      {children}
    </motion.div>
  );
}

/**
 * Lealtad: los puntos son el sistema oficial y el álbum los ilustra.
 * Cada 10 puntos se gana un ave; 5 aves (50 puntos) = bebida gratis.
 */
const LoyaltyProgram = () => {
  const s = summarize(MOCK_ACCOUNT);
  const reduced = useReducedMotion() ?? false;

  // Los puntos suben desde lo que se vio la última vez y cada ave nueva se
  // sella justo cuando el contador cruza su decena.
  const [from] = useState(() => (reduced ? s.points : pointsFrom(readSeen(), MOCK_ACCOUNT)));
  const progress = useMotionValue(from);
  const shown = useTransform(progress, (v) => Math.round(v));
  const birdsAtStart = Math.floor(from / POINTS_PER_BIRD);
  const [birdsShown, setBirdsShown] = useState(birdsAtStart);
  const lastBirds = useRef(birdsAtStart);

  useMotionValueEvent(progress, 'change', (v) => {
    const birds = Math.min(s.birdsEarned, Math.floor(v / POINTS_PER_BIRD));
    if (birds > lastBirds.current) {
      lastBirds.current = birds;
      setBirdsShown(birds);
      playStamp();
    }
  });

  useEffect(() => {
    writeSeen(MOCK_ACCOUNT);
    const delta = s.points - from;
    if (delta <= 0) return;
    const controls = animate(progress, s.points, {
      duration: Math.min(1.1, 0.6 + delta * 0.012),
      ease: EASE_OUT,
      delay: 0.25,
    });
    return () => controls.stop();
  }, [from, progress, s.points]);

  const nextIndex = birdsShown < BIRDS_PER_CARD ? birdsShown : -1;

  return (
    <div className="flex min-h-[100dvh] flex-col bg-cream pb-28">
      <header className="px-5 pt-[max(env(safe-area-inset-top),20px)]">
        <h1 className="font-display text-[34px] font-extrabold leading-none text-ink">Tu álbum</h1>

        <div className="mt-4 flex items-center gap-3">
          <span className="font-display text-[56px] font-extrabold leading-[0.9] text-ink">
            <motion.span aria-hidden>{shown}</motion.span>
            <span className="sr-only">{s.points}</span>
          </span>
          <span>
            <span className="block text-[17px] font-bold text-ink">puntos</span>
            <span className="block text-[14px] text-muted">
              {s.pointsToReward > 0
                ? `Te faltan ${s.pointsToReward} para tu bebida gratis`
                : 'Tienes una bebida gratis para canjear'}
            </span>
          </span>
        </div>

        {/* Un tramo por ave: 5 tramos de 10 puntos */}
        <div
          className="mt-4 grid grid-cols-5 gap-1"
          role="progressbar"
          aria-valuemin={0}
          aria-valuemax={POINTS_PER_REWARD}
          aria-valuenow={s.points}
          aria-label={`${s.points} de ${POINTS_PER_REWARD} puntos`}
        >
          {s.slots.map((slot, i) => (
            <Segment key={slot.at} progress={progress} index={i} />
          ))}
        </div>
        <div className="num mt-1 grid grid-cols-5 gap-1 text-right text-[12px] text-muted" aria-hidden>
          {s.slots.map((slot, i) => (
            <span key={slot.at} className={i === BIRDS_PER_CARD - 1 ? 'whitespace-nowrap text-ink' : ''}>
              {i === BIRDS_PER_CARD - 1 ? `${slot.at} = bebida` : slot.at}
            </span>
          ))}
        </div>
      </header>

      <section className="px-5 pt-6">
        <div className="flex items-baseline justify-between">
          <h2 className="font-display text-[20px] font-extrabold text-ink">Tarjeta actual</h2>
          <span className="text-[14px] text-muted">Cada {POINTS_PER_BIRD} puntos, un ave</span>
        </div>
        <ul className="mt-3 grid grid-cols-3 gap-x-2.5 gap-y-3">
          {s.slots.map((slot, i) => {
            const earned = i < birdsShown;
            const state = earned ? 'earned' : i === nextIndex ? 'next' : 'locked';
            const sealing = earned && i >= birdsAtStart;
            return (
              <li key={slot.at}>
                {sealing ? (
                  <div className="relative h-[128px]">
                    <Stamp bird={slot.bird} state="next" className="h-full" />
                    <SealedStamp reduced={reduced}>
                      <Stamp bird={slot.bird} state="earned" className="h-full" />
                    </SealedStamp>
                  </div>
                ) : (
                  <Stamp bird={slot.bird} state={state} className="h-[128px]" />
                )}
                <span className="mt-1.5 block text-[14px] font-bold text-ink">
                  {state === 'locked' ? 'Por descubrir' : slot.bird.name}
                </span>
                {!earned && <span className="block text-[12px] text-muted">A los {slot.at} puntos</span>}
              </li>
            );
          })}
        </ul>
        {s.completedCards > 0 && (
          <p className="mt-4 rounded-md border-[1.5px] border-line px-3.5 py-3 text-[15px] text-ink">
            <b>{s.completedCards} {s.completedCards === 1 ? 'tarjeta completa' : 'tarjetas completas'}.</b>{' '}
            <span className="text-muted">
              {s.completedCards} {s.completedCards === 1 ? 'bebida canjeada' : 'bebidas canjeadas'}.
            </span>
          </p>
        )}
      </section>

      <section className="px-5 pt-7">
        <h2 className="font-display text-[20px] font-extrabold text-ink">Movimientos de puntos</h2>
        <ul className="mt-1">
          {HISTORY.map((h) => (
            <li key={h.id} className="flex items-center justify-between border-b border-line py-3">
              <span>
                <span className="block text-[16px] text-ink">{h.action}</span>
                <span className="block text-[13px] text-muted">{h.date}</span>
              </span>
              <span className={`num text-[16px] ${h.points > 0 ? 'text-success' : 'text-ink'}`}>
                {h.points > 0 ? `+${h.points}` : h.points}
              </span>
            </li>
          ))}
        </ul>
      </section>

      <section className="px-5 pt-7">
        <h2 className="font-display text-[20px] font-extrabold text-ink">Beneficios</h2>
        <ul className="mt-1">
          {BENEFITS.map((b) => (
            <li key={b.title} className="border-b border-line py-3">
              <span className="block text-[16px] font-bold text-ink">{b.title}</span>
              <span className="block text-[14px] text-muted">{b.desc}</span>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
};

export default LoyaltyProgram;
