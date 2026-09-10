import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import OTPModal from '../components/ui/OTPModal';

const staggerContainer = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.08 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 15 },
  show: { opacity: 1, y: 0, transition: { type: 'spring' as const, damping: 25, stiffness: 300 } },
};

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ nombre: '', telefono: '', cedula: '' });
  const [showOTPModal, setShowOTPModal] = useState(false);

  const isFormValid =
    formData.nombre.trim() !== '' && formData.telefono.trim() !== '' && formData.cedula.trim() !== '';

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleOTPConfirm = () => {
    setShowOTPModal(false);
    navigate('/otp-loading', { state: { telefono: formData.telefono } });
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
        <motion.div variants={fadeUp} className="mb-10 flex flex-col items-center gap-3">
          <img
            src="/Artes corporativos/Logo-Slogan/Logos-Slogan-Café.png"
            alt="Café Quindío Logo"
            className="w-[180px] object-contain"
          />
        </motion.div>

        <motion.div variants={fadeUp} className="flex w-full max-w-[335px] flex-col gap-5">
          <Input
            label="Nombre"
            name="nombre"
            value={formData.nombre}
            onChange={handleChange}
            placeholder="Introduce tu nombre"
            autoComplete="name"
          />
          <Input
            label="No. teléfono móvil"
            name="telefono"
            type="tel"
            inputMode="numeric"
            value={formData.telefono}
            onChange={handleChange}
            placeholder="Ingresa tu número de teléfono"
          />
          <Input
            label="Cédula"
            name="cedula"
            inputMode="numeric"
            value={formData.cedula}
            onChange={handleChange}
            placeholder="Ingresa tu número de cédula"
          />
        </motion.div>

        <motion.div variants={fadeUp} className="mt-8 flex w-full max-w-[335px] flex-col items-center">
          <p className="mb-6 text-center text-[12px] leading-[18px] text-muted">
            Al pulsar «Registrarse», aceptas nuestros{' '}
            <span className="font-semibold text-brand">Términos de uso</span> y nuestra{' '}
            <span className="font-semibold text-brand">Política de privacidad</span>.
          </p>
          <Button
            onClick={() => isFormValid && setShowOTPModal(true)}
            disabled={!isFormValid}
            className="w-full"
          >
            Registrarse
          </Button>
        </motion.div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="absolute bottom-8 left-0 z-10 flex w-full justify-center"
      >
        <button className="flex gap-1 text-[14px] font-medium text-muted" onClick={() => navigate('/login')}>
          ¿Tienes una cuenta? <span className="font-semibold text-brand">Inicia sesión</span>
        </button>
      </motion.div>

      <AnimatePresence>
        {showOTPModal && (
          <OTPModal
            isOpen={showOTPModal}
            onClose={() => setShowOTPModal(false)}
            onConfirm={handleOTPConfirm}
            phoneNumber={formData.telefono}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default Register;
