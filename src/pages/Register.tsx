import { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Input } from '../components/ui/Input';
import OTPModal from '../components/ui/OTPModal';
import { AuthShell } from '../components/brand/AuthShell';

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ nombre: '', telefono: '', cedula: '' });
  const [showOTPModal, setShowOTPModal] = useState(false);

  const isFormValid =
    formData.nombre.trim() !== '' && formData.telefono.length >= 10 && formData.cedula.trim() !== '';

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const clean = name === 'nombre' ? value : value.replace(/\D/g, '');
    setFormData((prev) => ({ ...prev, [name]: clean }));
  };

  const handleOTPConfirm = () => {
    setShowOTPModal(false);
    navigate('/otp-loading', { state: { telefono: formData.telefono } });
  };

  return (
    <AuthShell
      tone="mostaza"
      image="/brand/ventana-amarilla.webp"
      title="Crea tu cuenta."
      subtitle="Con ella sumas puntos en cada pedido."
      onBack={() => navigate('/login')}
    >
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (isFormValid) setShowOTPModal(true);
        }}
        className="flex flex-1 flex-col gap-4"
      >
        <Input label="Nombre" name="nombre" value={formData.nombre} onChange={handleChange} placeholder="Como quieres que te llamemos" autoComplete="given-name" />
        <Input
          label="Número de celular"
          name="telefono"
          type="tel"
          inputMode="numeric"
          autoComplete="tel-national"
          value={formData.telefono}
          onChange={handleChange}
          placeholder="300 000 0000"
          maxLength={10}
          hint="Te enviaremos un código por SMS."
        />
        <Input label="Cédula" name="cedula" inputMode="numeric" value={formData.cedula} onChange={handleChange} placeholder="Solo números" />

        <div className="mt-auto pb-[calc(env(safe-area-inset-bottom)+20px)] pt-4">
          <p className="mb-4 text-[13px] leading-relaxed text-muted">
            Al crear tu cuenta aceptas los <span className="font-semibold text-ink underline underline-offset-2">Términos de uso</span> y la{' '}
            <span className="font-semibold text-ink underline underline-offset-2">Política de privacidad</span>.
          </p>
          <button
            type="submit"
            disabled={!isFormValid}
            className="h-[54px] w-full rounded-md bg-ink text-[17px] font-semibold text-white transition-transform duration-150 active:scale-[0.97] disabled:bg-cream-deep disabled:text-muted"
          >
            Crear cuenta
          </button>
          <p className="mt-4 text-center text-[15px] text-muted">
            ¿Ya tienes cuenta?{' '}
            <button type="button" onClick={() => navigate('/login')} className="min-h-[44px] font-semibold text-ink underline underline-offset-4">
              Entra
            </button>
          </p>
        </div>
      </form>

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
    </AuthShell>
  );
};

export default Register;
