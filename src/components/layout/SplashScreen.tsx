import { motion } from 'framer-motion';

const SplashScreen = () => {
  return (
    <motion.div
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-cream"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2, ease: [0.23, 1, 0.32, 1] }}
    >
      {/* Textura de fondo sutil */}
      <div
        className="pointer-events-none absolute inset-0 z-0 bg-cover bg-center opacity-[0.06]"
        style={{ backgroundImage: 'url(/fondo.png)' }}
        aria-hidden
      />

      <div className="relative z-10 flex flex-col items-center gap-5">
        {/* Visible desde el primer cuadro: el splash dura 0.7 s y no debe
            gastar ese tiempo en entradas escalonadas. */}
        <img src="/CQ.svg" alt="Café Quindío" className="h-[54px] w-auto" />
        <h1 className="font-display text-[17px] font-medium tracking-wide text-ink">
          ¡Permítanos alegrarle el día!
        </h1>
      </div>
    </motion.div>
  );
};

export default SplashScreen;
