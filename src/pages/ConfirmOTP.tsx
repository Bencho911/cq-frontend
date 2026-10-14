import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { AuthShell } from '../components/brand/AuthShell';
import { CodeInput } from '../components/brand/CodeInput';

const OTP_LENGTH = 5;

const ConfirmOTP = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const telefono = (location.state as { telefono?: string } | null)?.telefono || '300 000 0000';
  const [otp, setOtp] = useState('');
  const isComplete = otp.length === OTP_LENGTH;

  return (
    <AuthShell
      tone="mostaza"
      image="/brand/ventana-amarilla.webp"
      title="Revisa tus mensajes."
      subtitle={<>Enviamos un código de 5 dígitos al <span className="num whitespace-nowrap font-semibold text-ink">+57 {telefono}</span>.</>}
      onBack={() => navigate(-1)}
    >
      <CodeInput length={OTP_LENGTH} value={otp} onChange={setOtp} label="Código de 5 dígitos" autoFocus />
      <p className="mt-3 text-[15px] text-muted">
        ¿No te llegó?{' '}
        <button className="min-h-[44px] font-semibold text-ink underline underline-offset-4">Enviar otro código</button>
      </p>

      <div className="mt-auto pb-[calc(env(safe-area-inset-bottom)+20px)] pt-6">
        <button
          onClick={() => isComplete && navigate('/account-loading')}
          disabled={!isComplete}
          className="h-[54px] w-full rounded-md bg-ink text-[17px] font-semibold text-white transition-transform duration-150 active:scale-[0.97] disabled:bg-cream-deep disabled:text-muted"
        >
          Confirmar código
        </button>
      </div>
    </AuthShell>
  );
};

export default ConfirmOTP;
