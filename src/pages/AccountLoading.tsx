import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import CoffeeLoader from '../components/ui/CoffeeLoader';

const AccountLoading = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => navigate('/create-pin'), 3000);
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div
      className="relative flex h-[100dvh] flex-col items-center justify-center overflow-hidden px-5"
      style={{ background: 'linear-gradient(160deg, #0F1F1E 0%, #1A2E2C 55%, #243B38 100%)' }}
    >
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage: "url('/Artes corporativos/Fondos/fondos de color-Palmas.png')",
          backgroundSize: 'cover',
          backgroundPosition: 'bottom center',
          opacity: 0.07,
        }}
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="relative flex flex-col items-center gap-6"
      >
        <img
          src="/Artes corporativos/Logo-Slogan/Logo-Blanco.png"
          alt="Café Quindío"
          className="mb-2 w-36 object-contain"
        />
        <CoffeeLoader />
        <p className="max-w-[262px] text-center text-[14px] font-medium leading-[20px]" style={{ color: 'rgba(245,237,216,0.65)' }}>
          Por favor, espera un momento; estamos procesando tu cuenta.
        </p>
      </motion.div>
    </div>
  );
};

export default AccountLoading;
