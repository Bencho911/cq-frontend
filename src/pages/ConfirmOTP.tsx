import { useState, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '../components/ui/Button';

const ConfirmOTP = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const telefono = location.state?.telefono || '300 000 0000';

  const [otp, setOtp] = useState(['', '', '', '', '']);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const isComplete = otp.every((digit) => digit !== '');

  const handleChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);
    if (value && index < 4) inputRefs.current[index + 1]?.focus();
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  return (
    <div className="relative flex h-[100dvh] flex-col overflow-hidden bg-cream">
      <div className="flex items-center gap-1 px-4 py-3">
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
      </div>

      <div className="flex flex-1 flex-col items-center px-5 pt-8 pb-8">

        <h2 className="mb-2 text-center text-[24px] font-medium text-ink">{telefono}</h2>
        <p className="mb-10 max-w-[334px] text-center text-[13px] leading-[18px] text-muted">
          Introduce el código OTP de 5 dígitos enviado por SMS para completar el registro.
        </p>

        <div className="mb-8 flex w-full max-w-[332px] flex-row items-center justify-center gap-2">
          {otp.map((digit, index) => (
            <div
              key={index}
              className={`flex h-[64px] w-[56px] items-center justify-center rounded-xl transition-all duration-200 ${
                digit ? 'border border-brand bg-surface shadow-soft' : 'border border-transparent bg-cream-deep'
              }`}
            >
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
                className="h-full w-full bg-transparent text-center text-[24px] font-medium text-ink outline-none"
              />
            </div>
          ))}
        </div>

        <p className="mb-8 text-center text-[12px] text-muted">
          ¿Aún no has recibido el código?{' '}
          <button className="font-semibold text-brand">Reenviar</button>
        </p>

        <div className="flex-1" />

        <Button onClick={() => isComplete && navigate('/account-loading')} disabled={!isComplete} className="w-full max-w-[335px]">
          Confirmar
        </Button>
      </div>
    </div>
  );
};

export default ConfirmOTP;
