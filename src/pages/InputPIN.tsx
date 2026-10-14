import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { AuthShell } from '../components/brand/AuthShell';
import { CodeInput } from '../components/brand/CodeInput';

const PIN_LENGTH = 6;

const InputPIN = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const telefono = (location.state as { telefono?: string } | null)?.telefono;
  const [pin, setPin] = useState('');
  const isComplete = pin.length === PIN_LENGTH;

  return (
    <AuthShell
      tone="verde"
      image="/brand/ventana-tucan.webp"
      title="Escribe tu PIN."
      subtitle={telefono ? <>Para la cuenta <span className="num whitespace-nowrap font-semibold text-ink">+57 {telefono}</span>.</> : 'Son los 6 números que elegiste al crear tu cuenta.'}
      onBack={() => navigate(-1)}
    >
      <CodeInput length={PIN_LENGTH} value={pin} onChange={setPin} secret label="PIN de 6 dígitos" autoComplete="current-password" autoFocus />
      <button className="mt-3 min-h-[44px] self-start text-[15px] font-semibold text-ink underline underline-offset-4">
        Olvidé mi PIN
      </button>

      <div className="mt-auto pb-[calc(env(safe-area-inset-bottom)+20px)] pt-6">
        <button
          onClick={() => isComplete && navigate('/home')}
          disabled={!isComplete}
          className="h-[54px] w-full rounded-md bg-ink text-[17px] font-semibold text-white transition-transform duration-150 active:scale-[0.97] disabled:bg-cream-deep disabled:text-muted"
        >
          Entrar
        </button>
      </div>
    </AuthShell>
  );
};

export default InputPIN;
