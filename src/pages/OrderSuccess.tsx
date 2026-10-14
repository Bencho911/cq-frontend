import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useLocation, useNavigate } from 'react-router-dom';

const COUNTDOWN = 3;

/** Confirmación breve antes del seguimiento: verde de fachada, sin halos. */
const OrderSuccess = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const orderId = (location.state as { orderId?: number } | null)?.orderId ?? null;
  const [count, setCount] = useState(COUNTDOWN);

  useEffect(() => {
    const interval = setInterval(() => setCount((c) => Math.max(0, c - 1)), 1000);
    const timer = setTimeout(() => navigate('/track-order', { state: { orderId } }), COUNTDOWN * 1000);
    return () => {
      clearInterval(interval);
      clearTimeout(timer);
    };
  }, [navigate, orderId]);

  return (
    <div className="relative flex h-[100dvh] flex-col overflow-hidden bg-verde text-white">
      <div className="px-6 pt-[max(env(safe-area-inset-top),28px)]">
        {orderId != null && (
          <span className="inline-flex h-8 items-center gap-2 rounded-full bg-white/15 px-3 text-[14px] font-semibold">
            <span className="h-2 w-2 rounded-full bg-mostaza" aria-hidden />
            Pedido <span className="num">{orderId}</span>
          </span>
        )}
        <motion.h1
          initial={{ opacity: 0, transform: 'translateY(12px)' }}
          animate={{ opacity: 1, transform: 'translateY(0px)' }}
          transition={{ duration: 0.45, ease: [0.23, 1, 0.32, 1] }}
          className="mt-4 font-display text-[54px] font-extrabold leading-[0.92] tracking-[-0.045em]"
        >
          Recibimos tu pedido.
        </motion.h1>
        <p className="mt-3 text-[17px] leading-snug text-[#D7ECE9]">
          La barra ya lo está preparando. Te avisamos cuando esté listo.
        </p>
      </div>

      <img
        src="/brand/ventana-ave.webp"
        alt=""
        aria-hidden
        className="pointer-events-none absolute bottom-[150px] left-1/2 w-[230px] -translate-x-1/2"
      />
      <div className="absolute inset-x-0 bottom-0 h-[150px] bg-mostaza">
        <div className="zocalo absolute inset-x-0 top-0 -translate-y-full" aria-hidden />
      </div>

      <div className="absolute inset-x-5 bottom-[calc(env(safe-area-inset-bottom)+24px)] grid gap-1">
        <button
          onClick={() => navigate('/track-order', { state: { orderId } })}
          className="h-[54px] rounded-md bg-ink text-[17px] font-semibold text-white transition-transform duration-150 active:scale-[0.97]"
        >
          Ver estado del pedido
        </button>
        <p className="text-center text-[14px] text-ink" aria-live="polite">
          Te llevamos al seguimiento en <span className="num">{count}</span> s
        </p>
      </div>
    </div>
  );
};

export default OrderSuccess;
