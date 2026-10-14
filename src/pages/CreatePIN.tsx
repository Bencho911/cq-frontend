import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import { AuthShell } from '../components/brand/AuthShell';
import { CodeInput } from '../components/brand/CodeInput';

const PIN_LENGTH = 6;

const CreatePIN = () => {
  const navigate = useNavigate();
  const [pin, setPin] = useState('');
  const [showPin, setShowPin] = useState(false);
  const isComplete = pin.length === PIN_LENGTH;

  return (
    <AuthShell
      tone="rosa"
      image="/brand/capibara-palmas.webp"
      title="Elige un PIN."
      subtitle="6 números que solo tú conozcas. Los usarás para entrar."
      onBack={() => navigate(-1)}
    >
      <CodeInput length={PIN_LENGTH} value={pin} onChange={setPin} secret={!showPin} label="Nuevo PIN de 6 dígitos" autoComplete="new-password" autoFocus />
      <button
        onClick={() => setShowPin((v) => !v)}
        className="mt-3 flex min-h-[44px] items-center gap-2 self-start text-[15px] font-semibold text-ink"
      >
        {showPin ? <EyeOff size={20} aria-hidden /> : <Eye size={20} aria-hidden />}
        {showPin ? 'Ocultar PIN' : 'Mostrar PIN'}
      </button>

      <div className="mt-auto pb-[calc(env(safe-area-inset-bottom)+20px)] pt-6">
        <button
          onClick={() => isComplete && navigate('/home')}
          disabled={!isComplete}
          className="h-[54px] w-full rounded-md bg-ink text-[17px] font-semibold text-white transition-transform duration-150 active:scale-[0.97] disabled:bg-cream-deep disabled:text-muted"
        >
          Guardar PIN
        </button>
      </div>
    </AuthShell>
  );
};

export default CreatePIN;
