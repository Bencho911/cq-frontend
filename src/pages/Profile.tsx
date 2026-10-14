import { useNavigate } from 'react-router-dom';
import { ChevronRight, CreditCard, Gift, History, LogOut, MapPin, Settings, Shield, Ticket } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { ListRow } from '../components/brand/ListRow';
import { Stamp } from '../components/brand/Stamp';
import { MOCK_ACCOUNT, summarize } from '../lib/loyalty';

// MOCK: datos de usuario para la demo de gerencia (el backend aún no expone el perfil).
const MOCK_USER = {
  name: 'Santiago Restrepo',
  phone: '+57 313 892 4671',
};

interface MenuGroup {
  title: string;
  items: { icon: LucideIcon; label: string; to: string; value?: string }[];
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
      // MOCK: cantidad de cupones activos.
      { icon: Ticket, label: 'Bonos y cupones', to: '/vouchers', value: '2 activos' },
      { icon: Gift, label: 'Puntos y álbum de aves', to: '/album' },
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
  const s = summarize(MOCK_ACCOUNT);
  const stampBird = s.nextBird ?? s.slots[s.slots.length - 1].bird;

  return (
    <div className="flex min-h-[100dvh] flex-col bg-cream pb-28">
      {/* Identidad */}
      <header className="flex items-center gap-4 px-5 pt-[max(env(safe-area-inset-top),20px)]">
        <span
          className="grid h-16 w-16 shrink-0 place-items-center rounded-full bg-mostaza font-display text-[28px] font-extrabold text-ink"
          aria-hidden
        >
          {MOCK_USER.name.charAt(0)}
        </span>
        <div className="min-w-0">
          <h1 className="truncate font-display text-[28px] font-extrabold leading-tight text-ink">{MOCK_USER.name}</h1>
          <p className="num text-[15px] text-muted">{MOCK_USER.phone}</p>
        </div>
      </header>

      {/* Puntos y próxima ave */}
      <button
        onClick={() => navigate('/album')}
        className="mx-5 mt-6 grid grid-cols-[64px_1fr_auto] items-center gap-3.5 rounded-md border-[1.5px] border-line p-3 text-left transition-transform duration-150 active:scale-[0.97]"
      >
        <Stamp bird={stampBird} state={s.nextBird ? 'next' : 'earned'} className="h-[78px] w-16" />
        <span className="min-w-0">
          <span className="block text-[17px] font-bold text-ink">
            <span className="num">{s.points}</span> puntos
          </span>
          <span className="block text-[14px] leading-snug text-muted">
            {s.pointsToReward > 0
              ? `Te faltan ${s.pointsToReward} para tu bebida gratis`
              : 'Tienes una bebida gratis para canjear'}
          </span>
          {s.nextBird && (
            <span className="mt-0.5 block text-[14px] font-semibold text-ink">Próxima ave: {s.nextBird.name}</span>
          )}
        </span>
        <ChevronRight size={18} className="text-muted" aria-hidden />
      </button>

      {/* Menú */}
      {MENU_GROUPS.map((group) => (
        <section key={group.title} className="px-5 pt-7">
          <h2 className="font-display text-[20px] font-extrabold text-ink">{group.title}</h2>
          <ul className="mt-1">
            {group.items.map((item) => (
              <li key={item.to + item.label}>
                <ListRow icon={item.icon} label={item.label} value={item.value} onClick={() => navigate(item.to)} />
              </li>
            ))}
          </ul>
        </section>
      ))}

      <div className="px-5 pt-4">
        <ListRow
          icon={LogOut}
          label="Cerrar sesión"
          danger
          chevron={false}
          onClick={() => navigate('/onboarding')}
          className="border-b-0"
        />
      </div>
    </div>
  );
};

export default Profile;
