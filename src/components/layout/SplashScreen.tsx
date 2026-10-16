import { motion, useReducedMotion } from 'framer-motion';

const EASE_OUT = [0.23, 1, 0.32, 1] as const;
const EASE_IN_OUT = [0.77, 0, 0.175, 1] as const;

/** Duración total de la apertura antes de ceder el paso a la app. */
export const SPLASH_MS = 1100;

const DOOR_W = 200;
const DOOR_H = 290;

/** Hoja de la puerta: mitad del arco, con dos tableros pintados. */
function Leaf({ side, reduced }: { side: 'left' | 'right'; reduced: boolean }) {
  const left = side === 'left';
  return (
    <motion.div
      className="absolute top-0 h-full bg-mostaza"
      style={{
        width: DOOR_W / 2,
        [left ? 'left' : 'right']: 0,
        transformOrigin: left ? 'left center' : 'right center',
        transformPerspective: 700,
        [left ? 'borderTopLeftRadius' : 'borderTopRightRadius']: DOOR_W / 2,
        [left ? 'borderRight' : 'borderLeft']: '2px solid var(--color-ink)',
      }}
      initial={{ rotateY: 0 }}
      animate={reduced ? { rotateY: 0 } : { rotateY: left ? 80 : -80 }}
      transition={{ duration: 0.55, ease: EASE_IN_OUT, delay: 0.2 }}
    >
      <span
        className="absolute inset-x-3 top-14 h-[92px] border-2 border-ink/80"
        style={{ [left ? 'borderTopLeftRadius' : 'borderTopRightRadius']: 60 }}
      />
      <span className="absolute inset-x-3 bottom-4 h-[96px] border-2 border-ink/80" />
      <span className={`absolute top-[150px] h-3 w-3 rounded-full bg-ink ${left ? 'right-2' : 'left-2'}`} />
    </motion.div>
  );
}

/**
 * Apertura de la app: la fachada se arma (zócalo de izquierda a derecha),
 * la puerta se abre y adentro espera un ave. Solo en el arranque en frío.
 */
const SplashScreen = () => {
  const reduced = useReducedMotion() ?? false;

  return (
    <motion.div
      className="fixed inset-0 z-[100] flex flex-col overflow-hidden bg-verde"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25, ease: EASE_OUT }}
      role="status"
      aria-label="Café Quindío"
    >
      <motion.div
        className="flex flex-1 flex-col items-center justify-end gap-2 pb-12 pt-[max(env(safe-area-inset-top),28px)]"
        initial={reduced ? { opacity: 0 } : { opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: EASE_OUT, delay: reduced ? 0 : 0.5 }}
      >
        <img src="/brand/logo-blanco.webp" alt="Café Quindío" className="h-9 w-auto" />
        <p className="text-[15px] text-[#D7ECE9]">El café del corazón de Colombia</p>
      </motion.div>

      {/* Puerta en arco: marco teal, interior en tinta y el ave adentro */}
      <div
        className="relative mx-auto shrink-0 overflow-hidden border-[8px] border-b-0 border-teal bg-ink"
        style={{ width: DOOR_W + 16, height: DOOR_H + 8, borderTopLeftRadius: DOOR_W, borderTopRightRadius: DOOR_W }}
      >
        <motion.img
          src="/brand/ave-toche.webp"
          alt=""
          aria-hidden
          className="absolute bottom-0 left-1/2 h-[200px] w-auto -translate-x-1/2"
          initial={reduced ? { opacity: 1 } : { opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: EASE_OUT, delay: reduced ? 0 : 0.45 }}
        />
        <Leaf side="left" reduced={reduced} />
        <Leaf side="right" reduced={reduced} />
      </div>

      <motion.div
        className="zocalo relative shrink-0 origin-left"
        initial={{ scaleX: reduced ? 1 : 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 0.4, ease: EASE_OUT }}
        aria-hidden
      />
      <div className="h-[calc(env(safe-area-inset-bottom)+120px)] shrink-0 bg-mostaza" aria-hidden />
    </motion.div>
  );
};

export default SplashScreen;
