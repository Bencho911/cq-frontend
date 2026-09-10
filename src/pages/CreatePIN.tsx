import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Eye, EyeOff } from 'lucide-react';
import { Button } from '../components/ui/Button';

const circleVariant = {
  hidden: { opacity: 0, scale: 0.5 },
  show: { opacity: 1, scale: 1, transition: { type: 'spring' as const, damping: 20, stiffness: 300 } },
};

const CreatePIN = () => {
  const navigate = useNavigate();
  const [pin, setPin] = useState(['', '', '', '', '', '']);
  const [showPin, setShowPin] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const isComplete = pin.every((digit) => digit !== '');

  const handleChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;
    const newPin = [...pin];
    newPin[index] = value.slice(-1);
    setPin(newPin);
    if (value && index < 5) inputRefs.current[index + 1]?.focus();
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !pin[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  return (
    <div className="relative flex h-[100dvh] flex-col overflow-hidden bg-cream">
      <div className="flex items-center justify-between px-4 py-3">
        <button
          onClick={() => navigate(-1)}
          aria-label="Volver"
          className="flex h-10 w-10 items-center justify-start text-ink"
        >
          <ArrowLeft size={24} aria-hidden />
        </button>
        <img
          src="/Artes corporativos/Logo-Slogan/Logos-Slogan-Café.png"
          alt="Café Quindío"
          className="w-28 object-contain"
        />
        <div className="w-10" />
      </div>

      <div className="flex flex-1 flex-col items-center px-5 pt-8 pb-8">
        <div className="mb-6 h-[120px] w-[120px] overflow-hidden rounded-full" style={{ border: '2.5px solid var(--color-brand)', background: 'var(--color-brand-soft)' }}>
          <img src="/Artes corporativos/Composiciones/composiciones- 1.png" alt="Seguridad del PIN" className="h-full w-full object-contain" />
        </div>


        <p className="mb-10 max-w-[352px] text-center text-[14px] leading-[20px] text-muted">
          Introduce 6 números para mantener segura tu cuenta.
        </p>

        <div className="mb-8 flex w-full max-w-[335px] flex-row items-center justify-center gap-3">
          {pin.map((digit, index) => (
            <motion.div
              variants={circleVariant}
              initial="hidden"
              animate="show"
              key={index}
              className="relative h-[38px] w-[38px]"
            >
              <div
                className={`absolute inset-0 flex items-center justify-center rounded-full border-2 transition-all duration-200 ${
                  digit
                    ? showPin
                      ? 'scale-110 border-brand'
                      : 'scale-110 border-brand bg-brand'
                    : 'border-muted-soft bg-transparent'
                }`}
              >
                {showPin && digit && <span className="text-sm font-medium text-ink">{digit}</span>}
              </div>
              <input
                ref={(el) => { inputRefs.current[index] = el; }}
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                maxLength={1}
                aria-label={`Dígito ${index + 1}`}
                value={digit}
                onChange={(e) => handleChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                className="absolute inset-0 h-full w-full cursor-text opacity-0"
              />
            </motion.div>
          ))}
        </div>

        <button
          onClick={() => setShowPin(!showPin)}
          className="mb-10 flex items-center justify-center gap-2 text-muted transition-opacity active:opacity-70"
        >
          <span className="text-[14px] font-medium">{showPin ? 'Ocultar PIN' : 'Mostrar PIN'}</span>
          {showPin ? <EyeOff size={22} aria-hidden /> : <Eye size={22} aria-hidden />}
        </button>

        <div className="flex-1" />

        <Button onClick={() => isComplete && navigate('/home')} disabled={!isComplete} className="w-full max-w-[335px]">
          Confirmar
        </Button>
      </div>
    </div>
  );
};

export default CreatePIN;
