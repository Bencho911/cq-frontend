import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Clock, Gift, Store } from 'lucide-react';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';

const staggerContainer = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.08 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 15 },
  show: { opacity: 1, y: 0, transition: { type: 'spring' as const, damping: 25, stiffness: 300 } },
};

const VALUE_PROPS = [
  { icon: Clock, label: 'Pide sin filas' },
  { icon: Gift, label: 'Acumula puntos' },
  { icon: Store, label: 'Recoge en tienda' },
];

const Login = () => {
  const navigate = useNavigate();
  const [telefono, setTelefono] = useState('');

  const isValid = telefono.length >= 10;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isValid) navigate('/input-pin', { state: { telefono } });
  };

  return (
    <div className="relative flex h-[100dvh] flex-col overflow-hidden bg-cream">
      {/* ── Fondo completo: wallpaper de palmas ── */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: "url('/Artes corporativos/Fondos/fondos de color-Palmas.png')",
          backgroundSize: 'cover',
          backgroundPosition: 'bottom center',
        }}
      />
      {/* Overlay crema para legibilidad del formulario */}
      <div
        className="absolute inset-0"
        style={{ background: 'rgba(245, 237, 216, 0.82)' }}
      />

      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="show"
        className="relative z-10 flex flex-1 flex-col items-center justify-center overflow-y-auto px-5 pb-20 no-scrollbar"
      >
        {/* Logo con slogan */}
        <motion.div variants={fadeUp} className="mb-8 flex flex-col items-center">
          <img
            src="/Artes corporativos/Logo-Slogan/Logos-Slogan-Café.png"
            alt="Café Quindío"
            className="w-[180px] object-contain"
          />
        </motion.div>

        {/* ── Chips de propuesta de valor ── */}
        <motion.div variants={fadeUp} className="mb-10 flex gap-3">
          {VALUE_PROPS.map(({ icon: Icon, label }) => (
            <div
              key={label}
              className="flex flex-col items-center gap-1.5 rounded-2xl px-3 py-3"
              style={{
                background: 'rgba(73, 180, 170, 0.10)',
                border: '1px solid rgba(73, 180, 170, 0.22)',
                minWidth: '88px',
              }}
            >
              <div
                className="flex h-8 w-8 items-center justify-center rounded-full"
                style={{ background: 'var(--color-brand-soft)' }}
              >
                <Icon size={16} style={{ color: 'var(--color-brand)' }} aria-hidden />
              </div>
              <span className="text-center text-[11px] font-semibold leading-tight text-ink">
                {label}
              </span>
            </div>
          ))}
        </motion.div>

        {/* Formulario */}
        <motion.form
          variants={fadeUp}
          onSubmit={handleSubmit}
          className="flex w-full max-w-[335px] flex-col gap-5"
        >
          <Input
            label="No. teléfono móvil"
            type="tel"
            inputMode="numeric"
            value={telefono}
            onChange={(e) => setTelefono(e.target.value.replace(/\D/g, ''))}
            placeholder="Ingresa tu número de teléfono"
          />
          <Button type="submit" disabled={!isValid} size="md" className="w-full">
            Iniciar sesión
          </Button>
        </motion.form>
      </motion.div>

      {/* Link a registro */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="absolute bottom-8 left-0 z-10 flex w-full justify-center"
      >
        <span className="flex gap-1 text-[14px] font-medium text-muted">
          ¿No tienes una cuenta?{' '}
          <Link to="/register" className="font-semibold text-brand">
            Regístrate
          </Link>
        </span>
      </motion.div>
    </div>
  );
};

export default Login;
