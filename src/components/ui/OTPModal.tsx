import { motion } from 'framer-motion';
import { Button } from './Button';

interface OTPModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  phoneNumber: string;
}

const OTPModal: React.FC<OTPModalProps> = ({ isOpen, onClose, onConfirm, phoneNumber }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-ink/40"
      />

      <motion.div
        role="dialog"
        aria-modal="true"
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        className="relative flex w-full max-w-[320px] flex-col items-center gap-5 rounded-3xl border border-line bg-surface p-5 shadow-lift"
      >
        <div className="flex h-[150px] w-[150px] items-center justify-center">
          <img src="/otp-illustration.svg" alt="Verificación OTP" className="h-full w-full object-contain" />
        </div>

        <div className="flex flex-col items-center gap-2">
          <h2 className="text-center text-[18px] font-semibold text-ink">Enviar código OTP</h2>
          <p className="px-2 text-center text-[13px] leading-[20px] text-muted">
            Enviaremos el código OTP por SMS. Asegúrate de que el número{' '}
            <span className="font-semibold text-ink">{phoneNumber || 'ingresado'}</span> esté activo.
          </p>
        </div>

        <div className="flex w-full items-center gap-3 px-1">
          <Button variant="secondary" size="md" onClick={onClose} className="flex-1">
            Cancelar
          </Button>
          <Button size="md" onClick={onConfirm} className="flex-1">
            Confirmar
          </Button>
        </div>
      </motion.div>
    </div>
  );
};

export default OTPModal;
