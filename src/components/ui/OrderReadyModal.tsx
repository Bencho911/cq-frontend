import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion } from 'framer-motion';
import { MOCK_ACCOUNT, estimatePoints, preview, summarize } from '../../lib/loyalty';
import { Stamp } from '../brand/Stamp';

interface OrderReadyModalProps {
  isOpen: boolean;
  onClose: () => void;
  orderId?: number | null;
  storeName?: string | null;
  /** Total del pedido, para mostrar los puntos que suma. */
  total?: number;
  onPickedUp?: () => void;
  onReceipt?: () => void;
}

/**
 * "Tu pedido está listo": pantalla completa en verde de fachada. Es un
 * momento de pocas veces al día, así que aquí sí cabe una entrada con
 * presencia; el resto de la app se mueve lo mínimo.
 */
const OrderReadyModal = ({ isOpen, onClose, orderId, storeName, total = 0, onPickedUp, onReceipt }: OrderReadyModalProps) => {
  useEffect(() => {
    if (!isOpen) return;
    // Vibración corta en Android; iOS Safari no la soporta y se ignora.
    navigator.vibrate?.(40);
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const earned = estimatePoints(total);
  const reward = preview(MOCK_ACCOUNT, earned);
  const bird = reward.newBirds.at(-1) ?? summarize(MOCK_ACCOUNT).nextBird;

  return createPortal(
    <motion.div
      role="alertdialog"
      aria-modal="true"
      aria-labelledby="order-ready-title"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.2 }}
      className="fixed inset-0 z-[99999] mx-auto flex max-w-[400px] flex-col overflow-hidden bg-verde text-white"
    >
      <div className="px-6 pt-[max(env(safe-area-inset-top),28px)]">
        {orderId != null && (
          <span className="inline-flex h-8 items-center gap-2 rounded-full bg-white/15 px-3 text-[14px] font-semibold">
            <span className="h-2 w-2 rounded-full bg-mostaza" aria-hidden />
            Pedido <span className="num">{orderId}</span>
          </span>
        )}
        <motion.h1
          id="order-ready-title"
          initial={{ opacity: 0, transform: 'translateY(12px)' }}
          animate={{ opacity: 1, transform: 'translateY(0px)' }}
          transition={{ duration: 0.45, ease: [0.23, 1, 0.32, 1], delay: 0.05 }}
          className="mt-4 font-display text-[54px] font-extrabold leading-[0.92] tracking-[-0.045em]"
        >
          Tu pedido está listo.
        </motion.h1>
        <p className="mt-3 text-[17px] leading-snug text-[#D7ECE9]">
          Recógelo en la barra{storeName ? (
            <> de la <b className="text-white">Tienda {storeName}</b></>
          ) : null}.
        </p>
      </div>

      <img
        src="/brand/puerta-capibara.webp"
        alt=""
        aria-hidden
        className="pointer-events-none absolute bottom-[310px] right-6 w-[170px]"
      />

      <div className="absolute inset-x-0 bottom-0 bg-mostaza pb-[calc(env(safe-area-inset-bottom)+20px)] pt-[140px]">
        <div className="zocalo absolute inset-x-0 top-0 -translate-y-full" aria-hidden />
      </div>

      {earned > 0 && bird && (
        <div className="absolute inset-x-5 bottom-[186px] grid grid-cols-[64px_1fr] items-center gap-3.5 rounded-md bg-white p-3 text-ink">
          <Stamp bird={bird} state="earned" className="h-[78px] w-16" />
          <div>
            <span className="block text-[17px] font-bold">
              +<span className="num">{earned}</span> puntos{reward.completesCard ? ' y tarjeta completa' : ''}
            </span>
            <span className="block text-[14px] text-muted">
              {reward.newBirds.length > 0 ? `Ganaste al ${bird.name}` : `Llevas ${reward.total} puntos`}
              {reward.completesCard ? ' y una bebida gratis' : ''}
            </span>
          </div>
        </div>
      )}

      <div className="absolute inset-x-5 bottom-[calc(env(safe-area-inset-bottom)+24px)] grid gap-1.5">
        <button
          onClick={onPickedUp ?? onClose}
          className="h-[54px] rounded-md bg-ink text-[17px] font-semibold text-white transition-transform duration-150 active:scale-[0.97]"
        >
          Ya lo recogí
        </button>
        {onReceipt && (
          <button onClick={onReceipt} className="h-12 text-[16px] font-semibold text-ink">
            Ver recibo
          </button>
        )}
      </div>
    </motion.div>,
    document.body,
  );
};

export default OrderReadyModal;
