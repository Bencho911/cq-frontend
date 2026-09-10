import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Award, Gift, History, Star, TrendingUp } from 'lucide-react';

const stagger = {
  initial: {},
  animate: { transition: { staggerChildren: 0.08 } },
};
const fadeUp = {
  initial: { opacity: 0, y: 15 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.23, 1, 0.32, 1] } },
};

// Mock data para el demo
const USER_POINTS = 47;
const LOYALTY_MAX = 50;
const POINTS_TO_NEXT = LOYALTY_MAX - USER_POINTS;
const PCT = Math.min((USER_POINTS / LOYALTY_MAX) * 100, 100);

const BENEFITS = [
  { icon: Gift, title: 'Bebida de cortesía', desc: 'Cada 50 puntos acumulados.' },
  { icon: Star, title: 'Beneficios VIP', desc: 'Prioridad en tus pedidos de tienda.' },
  { icon: Award, title: 'Regalo de cumpleaños', desc: 'Un postre gratis en tu mes.' },
];

const HISTORY = [
  { id: 1, action: 'Compra en Café Quindío Centro', points: '+12', date: 'Hoy, 2:15 PM' },
  { id: 2, action: 'Bebida gratis redimida', points: '-50', date: '04 Sep, 10:00 AM' },
  { id: 3, action: 'Compra en Portal del Quindío', points: '+15', date: '28 Ago, 4:30 PM' },
];

const LoyaltyProgram = () => {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-[100dvh] flex-col bg-cream pb-20">
      {/* ── Header Transparente sobre Hero ── */}
      <div className="absolute left-0 right-0 top-0 z-40 flex items-center gap-1 px-2 py-3">
        <button
          onClick={() => navigate(-1)}
          aria-label="Volver"
          className="flex h-10 w-10 items-center justify-center rounded-full text-cream transition-colors hover:bg-white/10"
        >
          <ArrowLeft size={24} aria-hidden />
        </button>
        <h1 className="text-[16px] font-semibold text-cream">Programa de lealtad</h1>
      </div>

      {/* ── Hero & Tarjeta Virtual ── */}
      <div
        className="relative overflow-hidden px-5 pb-10 pt-20"
        style={{ background: 'linear-gradient(160deg, #0F1F1E 0%, #1A2E2C 60%, #243B38 100%)' }}
      >
        <div
          className="pointer-events-none absolute inset-0 opacity-8"
          style={{
            backgroundImage: "url('/Artes corporativos/Fondos/fondos de color-Palmas.png')",
            backgroundSize: 'cover',
            backgroundPosition: 'bottom center',
            opacity: 0.1,
          }}
        />
        <div className="pointer-events-none absolute -right-12 -top-12 h-[250px] w-[250px] opacity-15">
          <img
            src="/Artes corporativos/Composiciones/composiciones- 5.png"
            alt=""
            aria-hidden
            className="h-full w-full object-contain"
          />
        </div>

        <motion.div
          variants={stagger}
          initial="initial"
          animate="animate"
          className="relative z-10 flex flex-col items-center"
        >
          <motion.div variants={fadeUp} className="mb-6 flex flex-col items-center">
            <div className="mb-2 flex h-16 w-16 items-center justify-center rounded-full border-2 border-brand bg-brand-soft shadow-[0_0_24px_rgba(73,180,170,0.25)]">
              <Star size={32} className="fill-brand text-brand" aria-hidden />
            </div>
            <h2 className="font-display text-[24px] font-semibold text-cream">Nivel Gold</h2>
            <p className="text-[14px]" style={{ color: 'rgba(245,237,216,0.7)' }}>
              El café te recompensa
            </p>
          </motion.div>

          <motion.div
            variants={fadeUp}
            className="w-full overflow-hidden rounded-3xl border p-5 shadow-2xl backdrop-blur-md"
            style={{
              background: 'rgba(245, 237, 216, 0.08)',
              borderColor: 'rgba(245, 237, 216, 0.15)',
            }}
          >
            <div className="flex items-end justify-between mb-4">
              <div className="flex flex-col">
                <span className="text-[12px] font-medium uppercase tracking-wider text-cream/70">
                  Puntos actuales
                </span>
                <span className="font-display text-[42px] font-bold leading-none text-brand">
                  {USER_POINTS}
                </span>
              </div>
              <img
                src="/Artes corporativos/Logo-Slogan/Logo-Blanco.png"
                alt="Café Quindío"
                className="w-24 object-contain opacity-80"
              />
            </div>

            <div className="flex flex-col gap-2">
              <p className="text-[13px] font-medium text-cream/90">
                Te faltan <span className="font-bold text-brand">{POINTS_TO_NEXT} puntos</span> para tu próxima bebida
              </p>
              <div className="h-2.5 w-full overflow-hidden rounded-full bg-black/20">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${PCT}%` }}
                  transition={{ delay: 0.6, duration: 1, ease: 'easeOut' }}
                  className="h-full rounded-full"
                  style={{ background: 'var(--color-brand)' }}
                />
              </div>
              <div className="flex justify-between text-[11px] font-medium text-cream/50">
                <span>0</span>
                <span>{LOYALTY_MAX} pts = 1 Bebida</span>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* ── Beneficios ── */}
      <div className="px-5 pt-8">
        <h3 className="mb-4 text-[15px] font-bold uppercase tracking-wider text-muted">Tus Beneficios Gold</h3>
        <div className="flex flex-col gap-3">
          {BENEFITS.map((b, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 + i * 0.1 }}
              className="flex items-center gap-4 rounded-2xl border border-line bg-surface p-4"
            >
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-brand-soft">
                <b.icon size={22} className="text-brand" aria-hidden />
              </div>
              <div className="flex flex-col">
                <span className="text-[15px] font-semibold text-ink">{b.title}</span>
                <span className="text-[13px] text-muted">{b.desc}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* ── Historial ── */}
      <div className="px-5 pt-8">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-[15px] font-bold uppercase tracking-wider text-muted">Historial de puntos</h3>
          <button className="text-[13px] font-semibold text-brand">Ver todo</button>
        </div>
        <div className="flex flex-col rounded-2xl border border-line bg-surface">
          {HISTORY.map((h, i) => (
            <div
              key={h.id}
              className={`flex items-center justify-between p-4 ${i !== HISTORY.length - 1 ? 'border-b border-line' : ''}`}
            >
              <div className="flex items-center gap-3">
                <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${h.points.startsWith('+') ? 'bg-success-soft text-success' : 'bg-danger-soft text-danger'}`}>
                  {h.points.startsWith('+') ? <TrendingUp size={16} /> : <History size={16} />}
                </div>
                <div className="flex flex-col">
                  <span className="text-[14px] font-medium text-ink">{h.action}</span>
                  <span className="text-[12px] text-muted-soft">{h.date}</span>
                </div>
              </div>
              <span className={`text-[15px] font-bold ${h.points.startsWith('+') ? 'text-success' : 'text-danger'}`}>
                {h.points}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LoyaltyProgram;
