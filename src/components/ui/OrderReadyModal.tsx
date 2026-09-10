import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, X } from 'lucide-react';

interface OrderReadyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const OrderReadyModal = ({ isOpen, onClose }: OrderReadyModalProps) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-ink/40 px-5" onClick={onClose}>
        <motion.div
          role="dialog"
          aria-modal="true"
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          onClick={(e) => e.stopPropagation()}
          className="relative flex h-[360px] w-full max-w-[335px] flex-col items-center rounded-3xl bg-surface pt-2 shadow-lift"
        >
          <button onClick={onClose} aria-label="Cerrar" className="absolute right-4 top-4 text-muted transition-colors hover:text-ink">
            <X size={22} aria-hidden />
          </button>

          <div className="flex h-[300px] w-[300px] items-center justify-center">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, type: 'spring', stiffness: 200, damping: 20 }}
              className="flex h-40 w-40 items-center justify-center rounded-full bg-success-soft"
            >
              <CheckCircle2 size={80} className="text-success" aria-hidden />
            </motion.div>
          </div>

          <p className="absolute bottom-8 max-w-[237px] text-center text-[16px] font-medium leading-[24px] text-ink">
            ¡Genial! Tu pedido está listo. Puedes recogerlo en la barra.
          </p>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default OrderReadyModal;
