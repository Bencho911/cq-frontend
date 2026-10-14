import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight, RotateCcw } from 'lucide-react';
import { Badge } from '../components/ui/Badge';
import { EmptyState } from '../components/ui/EmptyState';
import { PageHeader } from '../components/brand/PageHeader';
import { Segmented } from '../components/brand/Segmented';
import { formatCOP } from '../lib/format';

type OrderStatus = 'pendiente' | 'preparando' | 'listo' | 'completada' | 'cancelada';

interface MockOrderItem {
  name: string;
  size?: string;
  quantity: number;
  unitPrice: number;
}

interface MockOrder {
  id: number;
  status: OrderStatus;
  items: MockOrderItem[];
  total: number;
  store: string;
  date: string;
  paymentMethod: string;
  discount: number;
}

const STATUS_CONFIG: Record<OrderStatus, { label: string; tone: 'accent' | 'brand' | 'neutral' | 'danger' | 'warning' }> = {
  pendiente: { label: 'Recibido', tone: 'warning' },
  preparando: { label: 'Preparando', tone: 'accent' },
  listo: { label: 'Listo', tone: 'brand' },
  completada: { label: 'Entregado', tone: 'neutral' },
  cancelada: { label: 'Cancelado', tone: 'danger' },
};

const order = (o: Omit<MockOrder, 'total' | 'discount'>): MockOrder => ({
  ...o,
  discount: 0,
  total: o.items.reduce((s, i) => s + i.quantity * i.unitPrice, 0),
});

// MOCK: pedidos de ejemplo hasta que el backend exponga el historial del usuario.
const MOCK_ACTIVE: MockOrder[] = [
  order({
    id: 1238,
    status: 'preparando',
    items: [
      { name: 'Nitro Cold Brew', quantity: 1, unitPrice: 31000 },
      { name: 'Caramel Latte', quantity: 1, unitPrice: 33000 },
    ],
    store: 'Café Quindío · Centro',
    date: 'Hoy, 2:15 p. m.',
    paymentMethod: 'Tarjeta (Wompi)',
  }),
];

// MOCK
const MOCK_HISTORY: MockOrder[] = [
  order({
    id: 1237,
    status: 'completada',
    items: [
      { name: 'Café con leche', quantity: 1, unitPrice: 25000 },
      { name: 'Caffè Mocha', quantity: 1, unitPrice: 29000 },
      { name: 'Croissant', quantity: 1, unitPrice: 28000 },
    ],
    store: 'Café Quindío · Norte',
    date: 'Ayer, 10:30 a. m.',
    paymentMethod: 'Efectivo en tienda',
  }),
  order({
    id: 1236,
    status: 'completada',
    items: [{ name: 'Cocoa Caramel Latte', quantity: 1, unitPrice: 33000 }],
    store: 'Café Quindío · Centro',
    date: '8 sep, 3:45 p. m.',
    paymentMethod: 'Tarjeta (Wompi)',
  }),
  order({
    id: 1235,
    status: 'completada',
    items: [
      { name: 'Caramel Latte', quantity: 1, unitPrice: 28000 },
      { name: 'Nitro Cold Brew', quantity: 1, unitPrice: 31000 },
    ],
    store: 'Café Quindío · Aeropuerto',
    date: '5 sep, 9:00 a. m.',
    paymentMethod: 'Pago en kiosco',
  }),
  order({
    id: 1234,
    status: 'cancelada',
    items: [{ name: 'Café con leche', quantity: 1, unitPrice: 25000 }],
    store: 'Café Quindío · Centro',
    date: '2 sep, 11:20 a. m.',
    paymentMethod: 'Tarjeta (Wompi)',
  }),
];

const shortStore = (name: string) => `Tienda ${name.replace(/^Café Quindío\s*[·-]\s*/i, '')}`;

function OrderRow({ order, onOpen, onReorder }: { order: MockOrder; onOpen: () => void; onReorder?: () => void }) {
  const status = STATUS_CONFIG[order.status];
  return (
    <li className="border-b border-line">
      <button onClick={onOpen} className="flex w-full items-start gap-3 pb-3 pt-4 text-left">
        <span className="min-w-0 flex-1">
          <span className="flex items-center gap-2">
            <span className="text-[16px] font-bold text-ink">
              Pedido <span className="num">{order.id}</span>
            </span>
            <Badge tone={status.tone}>{status.label}</Badge>
          </span>
          <span className="mt-0.5 block text-[14px] text-muted">
            {order.date}, {shortStore(order.store)}
          </span>
          <span className="mt-1 block text-[15px] leading-snug text-ink">
            {order.items.map((i) => i.name).join(', ')}
          </span>
        </span>
        <span className="flex shrink-0 items-center gap-1 pt-0.5">
          <span className={`num text-[16px] ${order.status === 'cancelada' ? 'text-muted line-through' : 'text-ink'}`}>
            {formatCOP(order.total)}
          </span>
          <ChevronRight size={18} className="text-muted" aria-hidden />
        </span>
      </button>
      {onReorder && (
        <button
          onClick={onReorder}
          className="mb-4 flex h-11 items-center gap-2 rounded-md border-[1.5px] border-ink px-4 text-[15px] font-semibold text-ink transition-transform duration-150 active:scale-[0.97]"
        >
          <RotateCcw size={16} aria-hidden />
          Repetir pedido
        </button>
      )}
    </li>
  );
}

const Orders = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'activos' | 'historial'>('activos');
  const list = activeTab === 'activos' ? MOCK_ACTIVE : MOCK_HISTORY;

  return (
    <div className="flex min-h-[100dvh] flex-col bg-cream pb-28">
      <PageHeader title="Pedidos" />

      <div className="px-5 pt-2">
        <Segmented
          label="Tipo de pedidos"
          value={activeTab}
          onChange={setActiveTab}
          options={[
            {
              value: 'activos',
              label: (
                <>
                  En curso
                  {MOCK_ACTIVE.length > 0 && (
                    <span className="num ml-1.5 text-muted">{MOCK_ACTIVE.length}</span>
                  )}
                </>
              ),
            },
            { value: 'historial', label: 'Historial' },
          ]}
        />
      </div>

      {list.length === 0 ? (
        <EmptyState
          image="/brand/ave-colibri-rosa.webp"
          title={activeTab === 'activos' ? 'No tienes pedidos en curso' : 'Aún no tienes pedidos'}
          description={
            activeTab === 'activos'
              ? 'Cuando hagas un pedido, aquí verás cómo va.'
              : 'Tus pedidos anteriores aparecerán aquí para repetirlos rápido.'
          }
          action={
            <button
              onClick={() => navigate('/menu')}
              className="h-12 rounded-md bg-ink px-6 text-[16px] font-semibold text-white transition-transform duration-150 active:scale-[0.97]"
            >
              Ver el menú
            </button>
          }
        />
      ) : (
        <ul className="px-5 pt-1">
          {list.map((o) => (
            <OrderRow
              key={o.id}
              order={o}
              onOpen={() => navigate(`/invoice/${o.id}`, { state: { order: o } })}
              onReorder={o.status === 'completada' ? () => navigate('/menu') : undefined}
            />
          ))}
        </ul>
      )}
    </div>
  );
};

export default Orders;
