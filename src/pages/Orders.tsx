import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft,
  CheckCircle2,
  ChevronRight,
  Clock,
  Coffee,
  FileText,
  RotateCcw,
  ShoppingBag,
} from 'lucide-react';
import { Badge } from '../components/ui/Badge';
import { EmptyState } from '../components/ui/EmptyState';
import { formatCOP } from '../lib/format';

type OrderStatus = 'pendiente' | 'preparando' | 'listo' | 'completada' | 'cancelada';

interface MockOrder {
  id: number;
  status: OrderStatus;
  items: string[];
  total: number;
  store: string;
  date: string;
  paymentMethod: string;
}

const STATUS_CONFIG: Record<OrderStatus, { label: string; tone: 'success' | 'warning' | 'danger' | 'neutral' | 'accent'; icon: typeof CheckCircle2 }> = {
  pendiente: { label: 'Pendiente', tone: 'warning', icon: Clock },
  preparando: { label: 'Preparando', tone: 'accent', icon: Coffee },
  listo: { label: 'Listo para recoger', tone: 'success', icon: CheckCircle2 },
  completada: { label: 'Completado', tone: 'success', icon: CheckCircle2 },
  cancelada: { label: 'Cancelado', tone: 'danger', icon: ShoppingBag },
};

const MOCK_ACTIVE: MockOrder[] = [
  {
    id: 1238,
    status: 'preparando',
    items: ['Nitro Cold Brew', 'Caramel Latte'],
    total: 64000,
    store: 'Café Quindío · Centro',
    date: 'Hoy 2:15 PM',
    paymentMethod: 'Tarjeta (Wompi)',
  },
];

const MOCK_HISTORY: MockOrder[] = [
  {
    id: 1237,
    status: 'completada',
    items: ['Café con leche', 'Caffè Mocha', 'Croissant'],
    total: 82000,
    store: 'Café Quindío · Norte',
    date: 'Ayer 10:30 AM',
    paymentMethod: 'Efectivo',
  },
  {
    id: 1236,
    status: 'completada',
    items: ['Cocoa Caramel Latte'],
    total: 33000,
    store: 'Café Quindío · Centro',
    date: '08 Sep, 3:45 PM',
    paymentMethod: 'Tarjeta (Wompi)',
  },
  {
    id: 1235,
    status: 'completada',
    items: ['Caramel Latte', 'Nitro Cold Brew'],
    total: 59000,
    store: 'Café Quindío · Aeropuerto',
    date: '05 Sep, 9:00 AM',
    paymentMethod: 'Pago en kiosco',
  },
  {
    id: 1234,
    status: 'cancelada',
    items: ['Café con leche'],
    total: 25000,
    store: 'Café Quindío · Centro',
    date: '02 Sep, 11:20 AM',
    paymentMethod: 'Tarjeta (Wompi)',
  },
];

const OrderCard = ({ order, onViewDetails, onReorder }: { order: MockOrder; onViewDetails: () => void; onReorder: () => void }) => {
  const status = STATUS_CONFIG[order.status];
  const StatusIcon = status.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: [0.23, 1, 0.32, 1] }}
      className="rounded-2xl bg-surface p-4"
      style={{ boxShadow: 'var(--shadow-soft)' }}
    >
      {/* Encabezado */}
      <div className="mb-3 flex items-start justify-between">
        <div>
          <p className="text-[12px] font-medium text-muted">Pedido #{order.id}</p>
          <p className="mt-0.5 text-[13px] text-muted-soft">{order.date}</p>
        </div>
        <Badge tone={status.tone}>
          <StatusIcon size={11} aria-hidden />
          {status.label}
        </Badge>
      </div>

      {/* Ítems */}
      <div className="mb-3 flex flex-col gap-0.5">
        {order.items.map((item, i) => (
          <p key={i} className="text-[14px] font-medium text-ink">
            {i > 0 && '+ '}{item}
          </p>
        ))}
      </div>

      {/* Separador */}
      <div className="mb-3 h-px bg-line" />

      {/* Footer */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-[13px] text-muted">{order.store}</p>
          <p className="text-[15px] font-bold text-ink">{formatCOP(order.total)}</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={onViewDetails}
            aria-label="Ver detalles del pedido"
            className="flex items-center gap-1 rounded-xl border border-line bg-cream-deep px-3 py-2 text-[12px] font-semibold text-muted-strong transition-colors hover:bg-line"
          >
            <FileText size={13} aria-hidden />
            Recibo
          </button>
          {order.status === 'completada' && (
            <button
              onClick={onReorder}
              aria-label="Volver a pedir"
              className="flex items-center gap-1 rounded-xl bg-brand px-3 py-2 text-[12px] font-semibold text-cream"
            >
              <RotateCcw size={13} aria-hidden />
              Pedir de nuevo
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
};

const Orders = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'activos' | 'historial'>('activos');

  return (
    <div className="flex min-h-[100dvh] flex-col bg-cream pb-24">
      <div className="sticky top-0 z-[20] border-b border-line bg-cream/90 px-5 py-4 backdrop-blur-xl">
        <h1 className="font-display text-[22px] font-semibold text-ink">Mis pedidos</h1>
      </div>

      {/* Tabs */}
      <div className="px-5 pt-4">
        <div className="flex rounded-xl bg-cream-deep p-1">
          {(['activos', 'historial'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className="relative flex flex-1 items-center justify-center gap-1.5 rounded-lg py-2.5 text-[14px] font-semibold transition-colors"
            >
              {activeTab === tab && (
                <motion.div
                  layoutId="tab-bg"
                  className="absolute inset-0 rounded-lg bg-surface"
                  style={{ boxShadow: 'var(--shadow-soft)' }}
                />
              )}
              <span className={`relative z-10 capitalize ${activeTab === tab ? 'text-ink' : 'text-muted-soft'}`}>
                {tab === 'activos' ? 'En proceso' : 'Historial'}
              </span>
              {tab === 'activos' && MOCK_ACTIVE.length > 0 && (
                <span className="relative z-10 flex h-4 min-w-4 items-center justify-center rounded-full bg-accent px-0.5 text-[10px] font-bold text-cream">
                  {MOCK_ACTIVE.length}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-3 px-5 pt-4">
        <AnimatePresence mode="wait">
          {activeTab === 'activos' ? (
            MOCK_ACTIVE.length === 0 ? (
              <EmptyState
                key="empty-active"
                icon={ShoppingBag}
                title="Sin pedidos activos"
                description="Cuando hagas un pedido, aparecerá aquí su estado en tiempo real."
              />
            ) : (
              <motion.div key="active-list" className="flex flex-col gap-3">
                {MOCK_ACTIVE.map((order) => (
                  <OrderCard
                    key={order.id}
                    order={order}
                    onViewDetails={() => navigate('/invoice/demo', { state: { order } })}
                    onReorder={() => navigate('/menu')}
                  />
                ))}
              </motion.div>
            )
          ) : (
            <motion.div key="history-list" className="flex flex-col gap-3">
              {MOCK_HISTORY.map((order) => (
                <OrderCard
                  key={order.id}
                  order={order}
                  onViewDetails={() => navigate('/invoice/demo', { state: { order } })}
                  onReorder={() => navigate('/menu')}
                />
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Ver más */}
      {activeTab === 'historial' && (
        <div className="px-5 pt-4">
          <button className="flex w-full items-center justify-center gap-2 rounded-2xl border border-line bg-surface py-3 text-[14px] font-semibold text-muted-strong">
            <ChevronRight size={16} aria-hidden />
            Cargar más pedidos
          </button>
        </div>
      )}
    </div>
  );
};

export default Orders;
