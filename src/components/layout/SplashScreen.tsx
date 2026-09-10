import { motion } from 'framer-motion';

const SplashScreen = () => {
  return (
    <motion.div
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-cream"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
    >
      {/* Textura de fondo sutil */}
      <div
        className="pointer-events-none absolute inset-0 z-0 bg-cover bg-center opacity-[0.06]"
        style={{ backgroundImage: 'url(/fondo.png)' }}
        aria-hidden
      />

      <div className="relative z-10 flex flex-col items-center gap-5">
        <motion.img
          src="/CQ.svg"
          alt="Café Quindío"
          initial={{ scale: 0.92, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.7, type: 'spring', damping: 22, stiffness: 120 }}
          className="h-[54px] w-auto"
        />
        <motion.h1
          initial={{ y: 16, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="font-display text-[17px] font-medium tracking-wide text-ink"
        >
          ¡Permítanos alegrarle el día!
        </motion.h1>
      </div>
    </motion.div>
  );
};

export default SplashScreen;
