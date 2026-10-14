import { useEffect } from 'react';
import { motion } from 'framer-motion';

interface OTPModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  phoneNumber: string;
}

/** Hoja inferior para confirmar el número antes de enviar el SMS. */
const OTPModal: React.FC<OTPModalProps> = ({ isOpen, onClose, onConfirm, phoneNumber }) => {
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        onClick={onClose}
        className="absolute inset-0 bg-ink/50"
      />
      <motion.div
        role="dialog"
        aria-modal="true"
        aria-labelledby="otp-modal-title"
        initial={{ transform: 'translateY(100%)' }}
        animate={{ transform: 'translateY(0%)' }}
        exit={{ transform: 'translateY(100%)' }}
        transition={{ duration: 0.3, ease: [0.32, 0.72, 0, 1] }}
        className="relative w-full max-w-[400px] rounded-t-[16px] bg-white px-5 pb-[calc(env(safe-area-inset-bottom)+20px)] pt-6"
      >
        <h2 id="otp-modal-title" className="font-display text-[26px] font-extrabold leading-tight text-ink">
          ¿Este es tu número?
        </h2>
        <p className="num mt-2 text-[22px] text-ink">+57 {phoneNumber || '—'}</p>
        <p className="mt-2 text-[15px] leading-relaxed text-muted">Te enviaremos un código por SMS para confirmar que es tuyo.</p>
        <div className="mt-6 grid gap-1.5">
          <button
            onClick={onConfirm}
            className="h-[54px] rounded-md bg-ink text-[17px] font-semibold text-white transition-transform duration-150 active:scale-[0.97]"
          >
            Sí, enviar código
          </button>
          <button onClick={onClose} className="h-12 text-[16px] font-semibold text-ink">
            Corregir número
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default OTPModal;
