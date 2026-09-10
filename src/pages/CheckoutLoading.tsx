import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import CoffeeLoader from '../components/ui/CoffeeLoader';

const CheckoutLoading = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => navigate('/order-success'), 3000);
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="relative flex h-[100dvh] flex-col items-center justify-center overflow-hidden bg-cream px-5">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col items-center gap-6"
      >
        <CoffeeLoader />
      </motion.div>
    </div>
  );
};

export default CheckoutLoading;
