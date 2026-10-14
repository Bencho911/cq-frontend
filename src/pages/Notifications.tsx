import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, CheckCircle2, Clock, Coffee, Gift, Info, Star } from 'lucide-react';
import { PageHeader } from '../components/brand/PageHeader';
import { EmptyState } from '../components/ui/EmptyState';

// MOCK: datos de notificaciones para la demo de gerencia
const MOCK_NOTIFICATIONS = [
  {
    id: 1,
    type: 'order',
    icon: CheckCircle2,
    title: 'Tu pedido está listo',
    body: 'Pedido #1234: café con leche y Nitro Cold Brew listos para recoger en la Tienda Centro.',
    time: 'Hace 5 min',
    read: false,
  },
  {
    id: 2,
    type: 'promo',
    icon: Gift,
    title: 'Descuento especial para ti',
    body: 'Usa el código CAFE20 y obtén 20% de descuento en tu próximo pedido. Válido hoy.',
    time: 'Hace 1 h',
    read: false,
  },
  {
    id: 3,
    type: 'loyalty',
    icon: Star,
    title: 'Te faltan 3 puntos para un café gratis',
    body: 'Tienes 47 puntos. Llega a 50 y reclama tu bebida favorita sin costo.',
    time: 'Hace 3 h',
    read: true,
  },
  {
    id: 4,
    type: 'order',
    icon: Coffee,
    title: 'Pedido confirmado',
    body: 'Tu pedido #1233 está en preparación. Tiempo estimado: 8 minutos.',
    time: 'Ayer, 4:12 p. m.',
    read: true,
  },
  {
    id: 5,
    type: 'info',
    icon: Info,
    title: 'Nueva tienda en Armenia Norte',
    body: 'Abrimos en la Cra 19 #22-15. Visítanos y prueba el menú de temporada.',
    time: 'Hace 2 días',
    read: true,
  },
  {
    id: 6,
    type: 'promo',
    icon: Clock,
    title: 'Puntos dobles este fin de semana',
    body: 'Sábado y domingo duplicamos tus puntos en cada compra.',
    time: 'Hace 3 días',
    read: true,
  },
];

const Notifications = () => {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState(MOCK_NOTIFICATIONS);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const markRead = (id: number) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  };

  return (
    <div className="flex min-h-[100dvh] flex-col bg-cream pb-8">
      <PageHeader
        title="Notificaciones"
        onBack={() => navigate(-1)}
        action={
          unreadCount > 0 ? (
            <button
              onClick={markAllRead}
              className="min-h-[44px] max-w-[116px] shrink-0 pr-3 text-right text-[14px] font-semibold leading-tight text-ink underline underline-offset-4"
            >
              Marcar todas como leídas
            </button>
          ) : undefined
        }
      />

      {unreadCount > 0 && (
        <p className="px-5 text-[14px] text-muted">
          {unreadCount === 1 ? 'Tienes 1 sin leer' : `Tienes ${unreadCount} sin leer`}
        </p>
      )}

      {notifications.length === 0 ? (
        <EmptyState
          icon={Bell}
          title="Sin notificaciones"
          description="Cuando tengas pedidos, promociones o novedades, aparecerán aquí."
        />
      ) : (
        <ul className="px-5 pt-1">
          {notifications.map((notif) => (
            <li key={notif.id}>
              <button
                onClick={() => markRead(notif.id)}
                className="grid w-full grid-cols-[22px_1fr] gap-3 border-b border-line py-4 text-left"
              >
                <notif.icon
                  size={22}
                  strokeWidth={1.8}
                  className={`mt-0.5 ${notif.read ? 'text-muted' : 'text-ink'}`}
                  aria-hidden
                />
                <span className="min-w-0">
                  <span className="flex items-start gap-2">
                    <span
                      className={`min-w-0 flex-1 text-[16px] leading-snug text-ink ${notif.read ? '' : 'font-bold'}`}
                    >
                      {notif.title}
                    </span>
                    {!notif.read && (
                      <span className="mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full bg-mostaza">
                        <span className="sr-only">Sin leer</span>
                      </span>
                    )}
                  </span>
                  <span className="mt-1 block text-[15px] leading-snug text-muted">{notif.body}</span>
                  <span className="mt-1 block text-[13px] text-muted">{notif.time}</span>
                </span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Notifications;
