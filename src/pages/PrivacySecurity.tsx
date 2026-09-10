import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  ChevronRight,
  Fingerprint,
  Lock,
  ShieldAlert,
  Trash2,
  FileText
} from 'lucide-react';

const stagger = {
  initial: {},
  animate: { transition: { staggerChildren: 0.08 } },
};

const fadeUp = {
  initial: { opacity: 0, y: 15 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.23, 1, 0.32, 1] } },
};

const PrivacySecurity = () => {
  const navigate = useNavigate();
  const [biometricsEnabled, setBiometricsEnabled] = useState(true);

  return (
    <div className="flex min-h-[100dvh] flex-col bg-cream pb-20">
      {/* ── Header ── */}
      <div className="sticky top-0 z-40 flex items-center justify-between border-b border-line bg-cream px-2 py-3">
        <button
          onClick={() => navigate(-1)}
          aria-label="Volver"
          className="flex h-10 w-10 items-center justify-center rounded-full text-ink transition-colors hover:bg-black/5"
        >
          <ArrowLeft size={24} aria-hidden />
        </button>
        <h1 className="text-[16px] font-semibold text-ink">Privacidad y seguridad</h1>
        <div className="w-10" /> {/* Espaciador para centrar el título */}
      </div>

      <motion.div
        variants={stagger}
        initial="initial"
        animate="animate"
        className="flex flex-col gap-6 px-5 pt-6"
      >
        {/* ── Seguridad de la cuenta ── */}
        <motion.div variants={fadeUp}>
          <h2 className="mb-3 text-[13px] font-bold uppercase tracking-wider text-muted">
            Seguridad de la cuenta
          </h2>
          <div className="flex flex-col overflow-hidden rounded-2xl border border-line bg-surface">
            {/* PIN de seguridad */}
            <button
              onClick={() => {}}
              className="flex items-center justify-between border-b border-line px-4 py-4 transition-colors hover:bg-cream-deep"
            >
              <div className="flex items-center gap-3">
                <div
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full"
                  style={{ background: 'var(--color-brand-soft)' }}
                >
                  <Lock size={18} style={{ color: 'var(--color-brand)' }} aria-hidden />
                </div>
                <div className="flex flex-col items-start">
                  <span className="text-[15px] font-medium text-ink">Cambiar PIN</span>
                  <span className="text-[12px] text-muted-soft">Actualiza tu código de acceso</span>
                </div>
              </div>
              <ChevronRight size={20} className="text-muted-soft" aria-hidden />
            </button>

            {/* Biometría */}
            <div className="flex items-center justify-between px-4 py-4">
              <div className="flex items-center gap-3">
                <div
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full"
                  style={{ background: 'var(--color-brand-soft)' }}
                >
                  <Fingerprint size={18} style={{ color: 'var(--color-brand)' }} aria-hidden />
                </div>
                <div className="flex flex-col">
                  <span className="text-[15px] font-medium text-ink">Inicio con biometría</span>
                  <span className="text-[12px] text-muted-soft">Face ID / Huella dactilar</span>
                </div>
              </div>
              
              {/* Toggle switch */}
              <button
                onClick={() => setBiometricsEnabled(!biometricsEnabled)}
                className={`relative h-7 w-12 rounded-full transition-colors duration-300 ${
                  biometricsEnabled ? 'bg-brand' : 'bg-muted-soft'
                }`}
              >
                <div
                  className={`absolute left-1 top-1 h-5 w-5 rounded-full bg-white transition-transform duration-300 ${
                    biometricsEnabled ? 'translate-x-5' : 'translate-x-0'
                  }`}
                  style={{ boxShadow: '0 2px 4px rgba(0,0,0,0.2)' }}
                />
              </button>
            </div>
          </div>
        </motion.div>

        {/* ── Políticas y Legales ── */}
        <motion.div variants={fadeUp}>
          <h2 className="mb-3 text-[13px] font-bold uppercase tracking-wider text-muted">
            Legal y políticas
          </h2>
          <div className="flex flex-col overflow-hidden rounded-2xl border border-line bg-surface">
            <button className="flex items-center justify-between border-b border-line px-4 py-4 transition-colors hover:bg-cream-deep">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-cream-deep text-muted-strong">
                  <FileText size={18} aria-hidden />
                </div>
                <span className="text-[15px] font-medium text-ink">Términos y condiciones</span>
              </div>
              <ChevronRight size={20} className="text-muted-soft" aria-hidden />
            </button>

            <button className="flex items-center justify-between px-4 py-4 transition-colors hover:bg-cream-deep">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-cream-deep text-muted-strong">
                  <ShieldAlert size={18} aria-hidden />
                </div>
                <span className="text-[15px] font-medium text-ink">Política de privacidad</span>
              </div>
              <ChevronRight size={20} className="text-muted-soft" aria-hidden />
            </button>
          </div>
        </motion.div>

        {/* ── Zona de Peligro ── */}
        <motion.div variants={fadeUp} className="mt-4">
          <button className="flex w-full items-center justify-center gap-2 rounded-2xl bg-danger-soft px-4 py-4 text-[14px] font-semibold text-danger transition-colors hover:bg-danger/10">
            <Trash2 size={18} aria-hidden />
            Eliminar cuenta permanentemente
          </button>
          <p className="mt-3 px-2 text-center text-[12px] leading-relaxed text-muted-soft">
            Esta acción borrará todos tus datos, historial de pedidos y puntos acumulados. No se puede deshacer.
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default PrivacySecurity;
