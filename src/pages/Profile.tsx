import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ChevronRight,
  CreditCard,
  Gift,
  History,
  LogOut,
  MapPin,
  Settings,
  Shield,
  Star,
  Ticket,
  UserRound,
} from 'lucide-react';

// MOCK: datos de usuario para la demo de gerencia
const MOCK_USER = {
  name: 'Santiago Restrepo',
  phone: '+57 313 892 4671',
  email: 'santiago.r@gmail.com',
  memberSince: 'Sep 2024',
  points: 47,
  pointsToNextReward: 3,
  totalOrders: 23,
  tier: 'Gold',
};

const LOYALTY_MAX = 50;

const stagger = {
  initial: {},
  animate: { transition: { staggerChildren: 0.06 } },
};
const fadeUp = {
  initial: { opacity: 0, y: 14 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.35, ease: [0.23, 1, 0.32, 1] } },
};

interface MenuGroup {
  title: string;
  items: { icon: typeof UserRound; label: string; to: string; badge?: string }[];
}

const MENU_GROUPS: MenuGroup[] = [
  {
    title: 'Mi cuenta',
    items: [
      { icon: History, label: 'Historial de pedidos', to: '/orders' },
      { icon: MapPin, label: 'Mis tiendas favoritas', to: '/stores' },
      { icon: CreditCard, label: 'Métodos de pago', to: '/payment-method' },
    ],
  },
  {
    title: 'Beneficios',
    items: [
      { icon: Ticket, label: 'Bonos y cupones', to: '/vouchers', badge: '2 activos' },
      { icon: Gift, label: 'Programa de lealtad', to: '/loyalty', badge: 'Gold' },
    ],
  },
  {
    title: 'Configuración',
    items: [
      { icon: Shield, label: 'Privacidad y seguridad', to: '/privacy' },
      { icon: Settings, label: 'Preferencias', to: '/home' },
    ],
  },
];

const Profile = () => {
  const navigate = useNavigate();
  const loyaltyPct = Math.min((MOCK_USER.points / LOYALTY_MAX) * 100, 100);

  return (
    <div className="flex min-h-[100dvh] flex-col bg-cream pb-24">
      {/* ── Hero del perfil con identidad real Café Quindío ── */}
      <div
        className="relative overflow-hidden pb-6 pt-10"
        style={{ background: 'linear-gradient(160deg, #0F1F1E 0%, #1A2E2C 60%, #243B38 100%)' }}
      >
        {/* Wallpaper de palmas como textura sutil */}
        <div
          className="pointer-events-none absolute inset-0 opacity-8"
          style={{
            backgroundImage: "url('/Artes corporativos/Fondos/fondos de color-Palmas.png')",
            backgroundSize: 'cover',
            backgroundPosition: 'bottom right',
            opacity: 0.08,
          }}
        />

        {/* Composición decorativa — esquina derecha */}
        <div className="pointer-events-none absolute -right-8 -top-4 h-[160px] w-[160px] opacity-20">
          <img
            src="/Artes corporativos/Composiciones/composiciones- 4.png"
            alt=""
            aria-hidden
            className="h-full w-full object-contain"
          />
        </div>

        {/* Logo blanco en la parte superior */}
        <div className="relative z-10 px-5 pb-4">
          <img
            src="/Artes corporativos/Logo-Slogan/Logo-Blanco.png"
            alt="Café Quindío"
            className="w-36 object-contain opacity-90"
          />
        </div>

        {/* Avatar + nombre */}
        <motion.div
          variants={stagger}
          initial="initial"
          animate="animate"
          className="relative z-10 flex items-center gap-4 px-5"
        >
          {/* Avatar */}
          <motion.div variants={fadeUp} className="relative">
            <div
              className="flex h-[68px] w-[68px] items-center justify-center rounded-full"
              style={{
                background: 'linear-gradient(135deg, var(--color-brand-deep) 0%, var(--color-brand) 100%)',
                boxShadow: 'var(--shadow-brand)',
              }}
            >
              <UserRound size={32} className="text-cream" aria-hidden />
            </div>
            <div
              className="absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full"
              style={{ background: 'var(--color-accent)' }}
            >
              <Star size={12} className="fill-cream text-cream" aria-hidden />
            </div>
          </motion.div>

          <motion.div variants={fadeUp} className="flex-1">
            <div className="flex items-center gap-2">
              <h1 className="font-display text-[20px] font-semibold text-cream">{MOCK_USER.name}</h1>
              <span
                className="rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-cream"
                style={{ background: 'var(--color-accent)' }}
              >
                {MOCK_USER.tier}
              </span>
            </div>
            <p className="mt-0.5 text-[13px]" style={{ color: 'rgba(245,237,216,0.60)' }}>
              {MOCK_USER.phone}
            </p>
          </motion.div>
        </motion.div>

        {/* Stats rápidas */}
        <motion.div
          variants={fadeUp}
          initial="initial"
          animate="animate"
          className="relative z-10 mt-5 flex gap-3 px-5"
        >
          <StatChip value={String(MOCK_USER.totalOrders)} label="Pedidos" />
          <StatChip value={String(MOCK_USER.points)} label="Puntos" />
          <StatChip value={MOCK_USER.memberSince} label="Miembro desde" />
        </motion.div>
      </div>

      {/* ── Tarjeta de lealtad ── */}
      <div className="px-5 py-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
          className="overflow-hidden rounded-2xl border bg-surface"
          style={{
            borderColor: 'var(--color-brand-soft)',
            boxShadow: 'var(--shadow-card)',
          }}
        >
          {/* Header de la tarjeta — teal real */}
          <div
            className="flex items-center justify-between px-4 py-3"
            style={{ background: 'var(--color-brand)' }}
          >
            <div className="flex items-center gap-2">
              <Star size={16} className="fill-cream text-cream" aria-hidden />
              <span className="text-[13px] font-bold uppercase tracking-wider text-cream">
                Café Quindío Gold
              </span>
            </div>
            <span className="text-[13px] font-medium" style={{ color: 'rgba(245,237,216,0.85)' }}>
              {MOCK_USER.points} pts
            </span>
          </div>
          <div className="px-4 py-3">
            <p className="text-[13px] font-medium text-muted-strong">
              Te faltan{' '}
              <span className="font-bold" style={{ color: 'var(--color-brand)' }}>
                {MOCK_USER.pointsToNextReward} puntos
              </span>{' '}
              para tu próxima bebida gratis
            </p>
            {/* Barra de progreso teal */}
            <div className="mt-2 h-2 overflow-hidden rounded-full bg-cream-deep">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${loyaltyPct}%` }}
                transition={{ delay: 0.5, duration: 0.8, ease: [0.23, 1, 0.32, 1] }}
                className="h-full rounded-full"
                style={{ background: 'var(--color-brand)' }}
              />
            </div>
            <div className="mt-1 flex justify-between">
              <span className="text-[11px] text-muted-soft">0</span>
              <span className="text-[11px] text-muted-soft">{LOYALTY_MAX} pts = 1 bebida</span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* ── Menú de opciones ── */}
      <div className="flex flex-col gap-4 px-5">
        {MENU_GROUPS.map((group, gi) => (
          <motion.div
            key={group.title}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 + gi * 0.07, duration: 0.35, ease: [0.23, 1, 0.32, 1] }}
          >
            <p className="mb-2 text-[11px] font-bold uppercase tracking-widest text-muted">
              {group.title}
            </p>
            <div className="overflow-hidden rounded-2xl border border-line bg-surface">
              {group.items.map((item, ii) => (
                <button
                  key={item.to + item.label}
                  onClick={() => navigate(item.to)}
                  className={`flex w-full items-center gap-3 px-4 py-3.5 text-left transition-colors hover:bg-cream-deep ${
                    ii < group.items.length - 1 ? 'border-b border-line' : ''
                  }`}
                >
                  <div
                    className="flex h-8 w-8 items-center justify-center rounded-lg"
                    style={{ background: 'var(--color-brand-soft)' }}
                  >
                    <item.icon size={17} style={{ color: 'var(--color-brand)' }} aria-hidden />
                  </div>
                  <span className="flex-1 text-[14px] font-medium text-ink">{item.label}</span>
                  {item.badge && (
                    <span
                      className="rounded-full px-2 py-0.5 text-[11px] font-semibold"
                      style={{
                        background: 'var(--color-brand-soft)',
                        color: 'var(--color-brand-deep)',
                      }}
                    >
                      {item.badge}
                    </span>
                  )}
                  <ChevronRight size={17} className="text-muted-soft" aria-hidden />
                </button>
              ))}
            </div>
          </motion.div>
        ))}
      </div>

      {/* ── Cerrar sesión ── */}
      <div className="px-5 pt-4">
        <button
          onClick={() => navigate('/onboarding')}
          className="flex w-full items-center justify-center gap-2 rounded-2xl border border-danger bg-danger-soft px-4 py-3.5 text-[14px] font-semibold text-danger transition-opacity hover:opacity-80"
        >
          <LogOut size={18} aria-hidden />
          Cerrar sesión
        </button>
      </div>

      {/* Slogan corporativo al pie */}
      <div className="flex flex-col items-center gap-2 px-5 pb-4 pt-4">
        <img
          src="/Artes corporativos/Logo-Slogan/Slogan-Largo.png"
          alt="El café del corazón de Colombia"
          className="w-48 object-contain opacity-50"
        />
      </div>
    </div>
  );
};

function StatChip({ value, label }: { value: string; label: string }) {
  return (
    <div
      className="flex flex-1 flex-col items-center rounded-xl py-2.5"
      style={{
        background: 'rgba(73,180,170,0.10)',
        border: '1px solid rgba(73,180,170,0.18)',
      }}
    >
      <span className="font-display text-[18px] font-semibold text-cream">{value}</span>
      <span className="text-[10px] font-medium" style={{ color: 'rgba(245,237,216,0.55)' }}>
        {label}
      </span>
    </div>
  );
}

export default Profile;
