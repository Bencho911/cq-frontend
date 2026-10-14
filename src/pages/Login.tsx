import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthShell } from '../components/brand/AuthShell';

const PHONE_LENGTH = 10;

const Login = () => {
  const navigate = useNavigate();
  const [telefono, setTelefono] = useState('');

  const missing = PHONE_LENGTH - telefono.length;
  const isValid = missing <= 0;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isValid) navigate('/input-pin', { state: { telefono } });
  };

  return (
    <AuthShell
      tone="verde"
      image="/brand/ventana-tucan.webp"
      title="Entra con tu celular."
      subtitle="Te pediremos tu PIN de 6 dígitos."
    >
      <form onSubmit={handleSubmit} className="flex flex-1 flex-col">
        <label htmlFor="login-phone" className="text-[14px] font-semibold text-ink">
          Número de celular
        </label>
        <div className="mt-1.5 flex h-[52px] items-center rounded-md border-[1.5px] border-transparent bg-cream-deep focus-within:border-ink">
          <span className="num border-r border-line px-3.5 text-[16px] text-ink">+57</span>
          <input
            id="login-phone"
            type="tel"
            inputMode="numeric"
            autoComplete="tel-national"
            value={telefono}
            onChange={(e) => setTelefono(e.target.value.replace(/\D/g, '').slice(0, PHONE_LENGTH))}
            placeholder="300 000 0000"
            aria-describedby="login-phone-hint"
            className="num h-full flex-1 bg-transparent px-3.5 text-[16px] text-ink outline-none placeholder:text-muted-soft"
          />
        </div>
        <p id="login-phone-hint" className="mt-1.5 text-[13px] text-muted" aria-live="polite">
          {telefono.length === 0
            ? 'Sin espacios ni guiones.'
            : isValid
              ? 'Listo.'
              : `Faltan ${missing} ${missing === 1 ? 'dígito' : 'dígitos'}.`}
        </p>

        <div className="mt-auto pb-[calc(env(safe-area-inset-bottom)+20px)] pt-6">
          <button
            type="submit"
            disabled={!isValid}
            className="h-[54px] w-full rounded-md bg-ink text-[17px] font-semibold text-white transition-transform duration-150 active:scale-[0.97] disabled:bg-cream-deep disabled:text-muted"
          >
            Continuar
          </button>
          <p className="mt-4 text-center text-[15px] text-muted">
            ¿Primera vez?{' '}
            <Link to="/register" className="inline-flex min-h-[44px] items-center font-semibold text-ink underline underline-offset-4">
              Crea tu cuenta
            </Link>
          </p>
        </div>
      </form>
    </AuthShell>
  );
};

export default Login;
