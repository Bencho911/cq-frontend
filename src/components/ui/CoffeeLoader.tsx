
import { motion } from 'framer-motion';

const CoffeeLoader = () => {
  return (
    <div className="w-[110px] h-[78px] flex justify-center items-center relative">
      <svg width="110" height="78" viewBox="0 0 110 78" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          {/* Forma interna de la taza para enmascarar el líquido */}
          <clipPath id="cup-clip">
            <path d="M25 20 V45 C25 58.8 36.2 70 50 70 C63.8 70 75 58.8 75 45 V20 H25Z" />
          </clipPath>
        </defs>

        {/* Humo (Animado) */}
        <motion.path
          d="M 45 15 Q 40 5 50 -5"
          stroke="#D0D0D0"
          strokeWidth="2"
          strokeLinecap="round"
          fill="none"
          initial={{ pathLength: 0, opacity: 0, y: 5 }}
          animate={{ pathLength: 1, opacity: [0, 1, 0], y: -10 }}
          transition={{ duration: 2.2, repeat: Infinity, ease: [0.25, 0.1, 0.25, 1], delay: 0 }}
        />
        <motion.path
          d="M 55 12 Q 60 2 50 -8"
          stroke="#D0D0D0"
          strokeWidth="2"
          strokeLinecap="round"
          fill="none"
          initial={{ pathLength: 0, opacity: 0, y: 5 }}
          animate={{ pathLength: 1, opacity: [0, 1, 0], y: -10 }}
          transition={{ duration: 2.2, repeat: Infinity, ease: [0.25, 0.1, 0.25, 1], delay: 1.1 }}
        />

        {/* Líquido (Café) con efecto de olas moviéndose usando clipPath */}
        <g clipPath="url(#cup-clip)">
          {/* Fondo del café */}
          <rect x="25" y="40" width="50" height="30" fill="#4A2C1C" />
          
          {/* Ola superior animada */}
          <motion.path
            d="M 0 45 Q 12.5 35 25 45 T 50 45 T 75 45 T 100 45 T 125 45 V 70 H 0 Z"
            fill="#5E3A24"
            initial={{ x: -50 }}
            animate={{ x: 0 }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "linear"
            }}
          />
        </g>

        {/* Contorno de la taza */}
        <path 
          d="M25 20 V45 C25 58.8 36.2 70 50 70 C63.8 70 75 58.8 75 45 V20 H25Z" 
          stroke="#3C3C3C" 
          strokeWidth="4" 
          strokeLinejoin="round"
        />
        
        {/* Asa de la taza */}
        <path 
          d="M75 30 H82 C88.627 30 94 35.373 94 42 C94 48.627 88.627 54 82 54 H70.5" 
          stroke="#3C3C3C" 
          strokeWidth="4" 
          strokeLinecap="round" 
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
};

export default CoffeeLoader;
