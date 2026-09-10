import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation, useNavigate } from 'react-router-dom';
import { Coffee } from 'lucide-react';
import { Button } from '../components/ui/Button';

const COUNTDOWN = 3;

const OrderSuccess = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const orderId = (location.state as { orderId?: number } | null)?.orderId ?? null;
  const [count, setCount] = useState(COUNTDOWN);

  useEffect(() => {
    const interval = setInterval(() => setCount((c) => c - 1), 1000);
    const timer = setTimeout(() => {
      navigate('/track-order', { state: { orderId } });
    }, COUNTDOWN * 1000);
    return () => {
      clearInterval(interval);
      clearTimeout(timer);
    };
  }, [navigate, orderId]);

  return (
    <div
      className="relative flex h-[100dvh] flex-col items-center justify-center overflow-hidden"
      style={{ background: 'linear-gradient(160deg, #0F1F1E 0%, #1A2E2C 55%, #243B38 100%)' }}
    >
      {/* ── Wallpaper de palmas como textura de fondo ── */}
      <div
        className="pointer-events-none absolute inset-0 opacity-10"
        style={{
          backgroundImage: "url('/Artes corporativos/Fondos/fondos de color-Palmas.png')",
          backgroundSize: 'cover',
          backgroundPosition: 'bottom center',
        }}
      />

      {/* ── Halo de éxito (teal) ── */}
      <div
        className="pointer-events-none absolute h-80 w-80 rounded-full opacity-25"
        style={{ background: 'radial-gradient(circle, var(--color-brand) 0%, transparent 70%)' }}
      />

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="relative flex flex-col items-center gap-6 px-8 text-center"
      >
        {/* ── Composición corporativa como ícono de éxito ── */}
        <motion.div
          initial={{ scale: 0.3, opacity: 0, rotate: -10 }}
          animate={{ scale: 1, opacity: 1, rotate: 0 }}
          transition={{ delay: 0.1, type: 'spring', stiffness: 200, damping: 16 }}
          className="relative"
        >
          {/* Anillo teal animado */}
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
            className="absolute inset-0 rounded-full"
            style={{
              background: 'conic-gradient(var(--color-brand) 0%, transparent 70%)',
              padding: 3,
              borderRadius: '50%',
            }}
          />
          <div
            className="relative flex h-32 w-32 items-center justify-center overflow-hidden rounded-full"
            style={{
              background: 'rgba(73, 180, 170, 0.15)',
              border: '3px solid var(--color-brand)',
              boxShadow: '0 0 48px rgba(73,180,170,0.40), 0 0 80px rgba(73,180,170,0.15)',
            }}
          >
            {/* Composición de ave corporativa */}
            <img
              src="/Artes corporativos/Composiciones/composiciones- 2.png"
              alt="Pedido confirmado"
              className="h-28 w-28 object-contain"
            />
          </div>
        </motion.div>

        {/* ── Logo blanco ── */}
        <motion.img
          src="/Artes corporativos/Logo-Slogan/Logo-Blanco.png"
          alt="Café Quindío"
          className="w-36 object-contain opacity-80"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 0.8, y: 0 }}
          transition={{ delay: 0.4, duration: 0.4 }}
        />

        {/* ── Textos ── */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35, duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
        >
          <h1 className="font-display text-[28px] font-semibold leading-tight text-cream">
            ¡Pedido confirmado!
          </h1>
          <p className="mt-2 text-[16px] font-medium" style={{ color: 'rgba(245,237,216,0.65)' }}>
            La cafetería ha recibido tu pedido.
          </p>
        </motion.div>

        {/* ── Indicador de número de orden ── */}
        {orderId && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.55, duration: 0.35 }}
            className="flex items-center gap-3 rounded-2xl px-5 py-3"
            style={{
              background: 'rgba(73,180,170,0.12)',
              border: '1px solid rgba(73,180,170,0.25)',
            }}
          >
            <Coffee size={20} style={{ color: 'var(--color-brand)' }} aria-hidden />
            <div className="text-left">
              <p className="text-[11px] font-medium uppercase tracking-wider" style={{ color: 'rgba(245,237,216,0.55)' }}>
                Número de pedido
              </p>
              <p className="font-display text-[20px] font-semibold text-cream">#{orderId}</p>
            </div>
          </motion.div>
        )}

        {/* ── Countdown y botón ── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.35 }}
          className="flex flex-col items-center gap-3"
        >
          <p className="text-[14px]" style={{ color: 'rgba(245,237,216,0.55)' }}>
            Redirigiendo al seguimiento en{' '}
            <AnimatePresence mode="wait">
              <motion.span
                key={count}
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 8 }}
                style={{ color: 'var(--color-brand)', fontWeight: 700 }}
              >
                {count}
              </motion.span>
            </AnimatePresence>
            {' '}s
          </p>
          <Button
            onClick={() => navigate('/track-order', { state: { orderId } })}
            className="px-8"
          >
            Ver estado del pedido
          </Button>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default OrderSuccess;
