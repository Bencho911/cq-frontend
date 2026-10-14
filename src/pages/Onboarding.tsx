import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Check } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ONBOARDING_STEPS = [
  {
    id: 1,
    title: 'Elige y personaliza tus bebidas',
    description: 'Crea tu bebida exactamente como la quieres. Temperatura, tamaño, azúcar, toppings — tú decides.',
    image: '/Artes corporativos/Composiciones/composiciones- 2.png',
    accentColor: '#49B4AA',
  },
  {
    id: 2,
    title: 'Rápido y sin filas',
    description: 'Haz tu pedido desde tu celular o en el kiosco. Programa para recoger cuando quieras.',
    image: '/Artes corporativos/Composiciones/composiciones- 4.png',
    accentColor: '#E8903A',
  },
  {
    id: 3,
    title: 'Acumula puntos en cada café',
    description: 'Cada pedido suma puntos. Canjéalos por bebidas gratis y beneficios exclusivos del programa Gold.',
    image: '/Artes corporativos/Composiciones/composiciones- 1.png',
    accentColor: '#49B4AA',
  },
];

const Onboarding = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);

  const step = ONBOARDING_STEPS[currentStep];
  const isLastStep = currentStep === ONBOARDING_STEPS.length - 1;

  const handleNext = () => {
    if (currentStep < ONBOARDING_STEPS.length - 1) {
      setCurrentStep((prev) => prev + 1);
    } else {
      navigate('/register');
    }
  };

  return (
    <div className="relative flex h-[100dvh] flex-col overflow-hidden">
      {/* ── Fondo: wallpaper corporativo de palmas ── */}
      <div
        className="absolute inset-0 bg-palmas"
        style={{
          backgroundImage: "url('/Artes corporativos/Fondos/fondos de color-Palmas.png')",
          backgroundSize: 'cover',
          backgroundPosition: 'bottom center',
        }}
      />
      {/* Overlay teal oscuro para legibilidad */}
      <div
        className="absolute inset-0"
        style={{ background: 'linear-gradient(160deg, rgba(15,31,30,0.82) 0%, rgba(26,46,44,0.75) 50%, rgba(36,59,56,0.65) 100%)' }}
      />

      {/* ── Logo real blanco ── */}
      <div className="relative z-10 px-6 pt-12">
        <img
          src="/Artes corporativos/Logo-Slogan/Logo-Blanco.png"
          alt="Café Quindío"
          className="w-40 object-contain"
        />
      </div>

      {/* Botón saltar */}
      <div className="absolute right-5 top-12 z-20">
        <button
          onClick={() => navigate('/home')}
          className="rounded-full px-3 py-1.5 text-[13px] font-semibold text-cream/70 transition-colors hover:text-cream"
        >
          Saltar
        </button>
      </div>

      {/* ── Imagen de composición corporativa ── */}
      <div className="relative z-10 mt-4 flex w-full flex-1 items-center justify-center px-8">
        {/* Halo sutil bajo la imagen */}
        <div
          className="absolute h-64 w-64 rounded-full transition-colors duration-700"
          style={{
            background: `radial-gradient(circle, ${step.accentColor}30 0%, transparent 70%)`,
          }}
        />
        <AnimatePresence mode="wait">
          <motion.img
            key={step.id}
            src={step.image}
            alt={step.title}
            initial={{ opacity: 0, x: 60, scale: 0.92 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: -60, scale: 0.92 }}
            transition={{ duration: 0.4, ease: "easeOut" as any }}
            className="z-10 h-auto max-h-[260px] w-full max-w-[260px] object-contain drop-shadow-2xl"
          />
        </AnimatePresence>
      </div>

      {/* ── Texto + controles ── */}
      <div
        className="relative z-10 flex flex-col gap-8 rounded-t-3xl px-6 pb-10 pt-7"
        style={{
          background: 'rgba(15, 31, 30, 0.85)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          border: '1px solid rgba(73, 180, 170, 0.15)',
          borderBottom: 'none',
        }}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={step.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3, ease: "easeOut" as any }}
            className="min-h-[110px]"
          >
            <h1 className="mb-2 font-display text-[30px] font-extrabold leading-none text-white">
              {step.title}
            </h1>
            <p className="text-[16px] leading-relaxed text-white/80">{step.description}</p>
          </motion.div>
        </AnimatePresence>

        <div className="flex items-center justify-between">
          {/* Indicadores de paso */}
          <div className="flex items-center gap-2">
            {ONBOARDING_STEPS.map((_, index) => (
              <motion.div
                key={index}
                animate={{
                  width: currentStep === index ? 24 : 8,
                  backgroundColor:
                    currentStep === index ? 'var(--color-mostaza)' : 'rgba(255,255,255,0.30)',
                }}
                className="h-2 rounded-full"
                transition={{ duration: 0.25 }}
              />
            ))}
          </div>

          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={handleNext}
            className="flex h-[52px] items-center gap-2 rounded-md bg-mostaza px-6 text-[16px] font-bold text-ink"
          >
            <AnimatePresence mode="wait">
              <motion.span
                key={isLastStep ? 'comenzar' : 'siguiente'}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                className="flex items-center gap-2"
              >
                {isLastStep ? (
                  <><span>Empezar</span><Check size={18} strokeWidth={2.5} aria-hidden /></>
                ) : (
                  <><span>Siguiente</span><ArrowRight size={18} strokeWidth={2.5} aria-hidden /></>
                )}
              </motion.span>
            </AnimatePresence>
          </motion.button>
        </div>
      </div>
    </div>
  );
};

export default Onboarding;
