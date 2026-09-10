
import { motion, type Variants } from 'framer-motion';

// Colores de Figma / Café
const COLORS = {
  espuma: '#D7CCC8', // Light Foam (Teal in figma, but requested coffee)
  latte: '#6D4C41',  // Figma Brand/600
  espresso: '#5D4037', // Figma Brand color
};

// Genera un SVG ondulado para el borde inferior
const WaveSVG = ({ color }: { color: string }) => (
  <svg 
    className="absolute top-full left-0 w-full h-[150px] -mt-[1px] rotate-180" 
    viewBox="0 0 1440 320" 
    preserveAspectRatio="none"
  >
    <path 
      fill={color} 
      d="M0,128L48,144C96,160,192,192,288,181.3C384,171,480,117,576,112C672,107,768,149,864,170.7C960,192,1056,192,1152,176C1248,160,1344,128,1392,112L1440,96L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
    ></path>
  </svg>
);

const layerVariants: Variants = {
  hidden: { y: '-100vh' },
  visible: (custom: number) => ({
    y: '0vh',
    transition: {
      delay: custom * 0.15, // Cascading effect
      duration: 0.8,
      ease: [0.45, 0, 0.15, 1] // Custom organic easing
    }
  }),
  exit: (custom: number) => ({
    y: '120vh', // Drain down
    transition: {
      delay: custom * 0.15,
      duration: 0.8,
      ease: [0.45, 0, 0.15, 1]
    }
  })
};

const LiquidTransition = () => {
  return (
    <div className="fixed inset-0 z-[200] pointer-events-none overflow-hidden">
      
      {/* Capa 1: Espuma Clara */}
      <motion.div
        className="absolute top-0 left-0 w-full h-full"
        style={{ backgroundColor: COLORS.espuma }}
        variants={layerVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        custom={0}
      >
        <WaveSVG color={COLORS.espuma} />
      </motion.div>

      {/* Capa 2: Café Latte */}
      <motion.div
        className="absolute top-0 left-0 w-full h-full"
        style={{ backgroundColor: COLORS.latte }}
        variants={layerVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        custom={1}
      >
        <WaveSVG color={COLORS.latte} />
      </motion.div>

      {/* Capa 3: Café Espresso Puro */}
      <motion.div
        className="absolute top-0 left-0 w-full h-full flex items-center justify-center"
        style={{ backgroundColor: COLORS.espresso }}
        variants={layerVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        custom={2}
      >
        <WaveSVG color={COLORS.espresso} />
        {/* Optional Logo in the center of the dark liquid */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          transition={{ delay: 0.5, duration: 0.3 }}
          className="relative z-10 w-16 h-16 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm"
        >
          <span className="text-white font-bold text-xl">CQ</span>
        </motion.div>
      </motion.div>

    </div>
  );
};

export default LiquidTransition;
