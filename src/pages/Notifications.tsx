import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft,
  Bell,
  CheckCircle2,
  ChevronRight,
  Clock,
  Coffee,
  Gift,
  Info,
  Star,
} from 'lucide-react';
import { Badge } from '../components/ui/Badge';

// MOCK: datos de notificaciones para la demo de gerencia
const MOCK_NOTIFICATIONS = [
  {
    id: 1,
    type: 'order',
    icon: CheckCircle2,
    iconColor: 'text-success',
    bgColor: 'bg-success-soft',
    title: '¡Tu pedido está listo!',
    body: 'Pedido #1234 — Café con leche y Nitro Cold Brew listos para recoger en Café Quindío · Centro.',
    time: 'Hace 5 min',
    read: false,
  },
  {
    id: 2,
    type: 'promo',
    icon: Gift,
    iconColor: 'text-accent',
    bgColor: 'bg-brand-soft',
    title: 'Descuento especial solo para ti',
    body: '¡Usa el código CAFE20 y obtén 20% de descuento en tu próximo pedido! Válido hoy.',
    time: 'Hace 1 h',
    read: false,
  },
  {
    id: 3,
    type: 'loyalty',
    icon: Star,
    iconColor: 'text-star',
    bgColor: 'bg-warning-soft',
    title: 'Te faltan 3 puntos para un café gratis',
    body: 'Has acumulado 47 puntos. Llega a 50 y reclama tu bebida favorita sin costo.',
    time: 'Hace 3 h',
    read: true,
  },
  {
    id: 4,
    type: 'order',
    icon: Coffee,
    iconColor: 'text-brand',
    bgColor: 'bg-brand-soft',
    title: 'Pedido confirmado',
    body: 'Tu pedido #1233 fue tomado y está en preparación. Tiempo estimado: 8 minutos.',
    time: 'Ayer 4:12 PM',
    read: true,
  },
  {
    id: 5,
    type: 'info',
    icon: Info,
    iconColor: 'text-muted',
    bgColor: 'bg-cream-deep',
    title: 'Nueva tienda en Armenia Norte',
    body: 'Abrimos una nueva sede en la Cra 19 #22-15. ¡Visítanos y prueba nuestro nuevo menú de temporada!',
    time: 'Hace 2 días',
    read: true,
  },
  {
    id: 6,
    type: 'promo',
    icon: Clock,
    iconColor: 'text-accent-deep',
    bgColor: 'bg-accent-soft',
    title: 'Puntos x2 este fin de semana',
    body: 'Sábado y domingo duplicamos tus puntos en cada compra. ¡No te lo pierdas!',
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
    <div className="flex min-h-[100dvh] flex-col bg-cream">
      {/* Header */}
      <div className="sticky top-0 z-[20] flex items-center gap-1 border-b border-line bg-cream/90 px-2 py-3 backdrop-blur-xl">
        <button
          onClick={() => navigate(-1)}
          aria-label="Volver"
          className="flex h-10 w-10 items-center justify-center rounded-full text-ink transition-colors hover:bg-cream-deep"
        >
          <ArrowLeft size={24} aria-hidden />
        </button>
        <div className="flex flex-1 items-center justify-between pr-2">
          <div className="flex items-center gap-2">
            <h1 className="font-display text-[20px] font-semibold text-ink">Notificaciones</h1>
            {unreadCount > 0 && (
              <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-danger px-1 text-[11px] font-bold text-cream">
                {unreadCount}
              </span>
            )}
          </div>
          {unreadCount > 0 && (
            <button
              onClick={markAllRead}
              className="text-[13px] font-semibold text-brand"
            >
              Marcar todas
            </button>
          )}
        </div>
      </div>

      <div className="flex flex-col divide-y divide-line">
        <AnimatePresence initial={false}>
          {notifications.map((notif, i) => (
            <motion.button
              key={notif.id}
              initial={{ opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05, duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
              onClick={() => markRead(notif.id)}
              className={`flex w-full items-start gap-3 px-5 py-4 text-left transition-colors ${
                notif.read ? 'bg-cream' : 'bg-surface'
              } hover:bg-cream-deep`}
            >
              {/* Indicador de no leído */}
              <div className="relative mt-1 shrink-0">
                <div className={`flex h-10 w-10 items-center justify-center rounded-full ${notif.bgColor}`}>
                  <notif.icon size={20} className={notif.iconColor} aria-hidden />
                </div>
                {!notif.read && (
                  <span className="absolute -right-0.5 -top-0.5 h-2.5 w-2.5 rounded-full bg-danger ring-2 ring-cream" />
                )}
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between gap-2">
                  <p className={`text-[14px] leading-snug ${notif.read ? 'font-medium text-muted-strong' : 'font-bold text-ink'}`}>
                    {notif.title}
                  </p>
                  <span className="shrink-0 text-[11px] text-muted-soft">{notif.time}</span>
                </div>
                <p className="mt-1 text-[12px] leading-[18px] text-muted">{notif.body}</p>
              </div>

              <ChevronRight size={16} className="mt-1 shrink-0 text-muted-soft" aria-hidden />
            </motion.button>
          ))}
        </AnimatePresence>
      </div>

      {notifications.length === 0 && (
        <div className="flex flex-1 flex-col items-center justify-center gap-3 px-8 text-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-cream-deep">
            <Bell size={36} className="text-muted-soft" />
          </div>
          <h2 className="font-display text-[20px] font-semibold text-ink">Sin notificaciones</h2>
          <p className="text-[14px] leading-relaxed text-muted">
            Cuando tengas pedidos, promociones o novedades, aparecerán aquí.
          </p>
        </div>
      )}

      {/* Footer info badge */}
      <div className="px-5 py-6 text-center">
      </div>
    </div>
  );
};

export default Notifications;
