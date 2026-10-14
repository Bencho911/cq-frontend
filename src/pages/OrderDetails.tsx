import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Download } from 'lucide-react';
import { orderService } from '../lib/orderService';
import { itemUnitPrice, useCartTotals } from '../lib/cart';
import { formatCOP } from '../lib/format';
import { resolveImageUrl } from '../lib/image';
import type { Order } from '../lib/types';
import { Badge } from '../components/ui/Badge';
import { EmptyState } from '../components/ui/EmptyState';
import { Button } from '../components/ui/Button';
import { PageHeader } from '../components/brand/PageHeader';
import { storeShortName, useSelectedStore } from '../lib/session';

const PAYMENT_LABELS: Record<string, string> = {
  wompi: 'Tarjeta (Wompi)',
  efectivo: 'Efectivo en tienda',
  kiosco: 'Pago en kiosco',
};

function statusBadge(estado?: string) {
  if (estado === 'completada') return { label: 'Entregado', tone: 'neutral' as const };
  if (estado === 'cancelada' || estado === 'reembolsada')
    return { label: estado === 'cancelada' ? 'Cancelado' : 'Reembolsado', tone: 'danger' as const };
  return { label: 'Preparando', tone: 'accent' as const };
}

const OrderDetails = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { items } = useCartTotals();
  const store = useSelectedStore();

  const orderId = (location.state as { orderId?: number } | null)?.orderId ?? null;
  const [order, setOrder] = useState<Order | null>(null);

  useEffect(() => {
    if (!orderId) return;
    orderService
      .getOrderById(orderId)
      .then(setOrder)
      .catch(() => setOrder(null));
  }, [orderId]);

  // Fallback con el carrito si no hay orden (demo).
  const fallbackItems = items.map((i) => ({
    cod_prod: i.product.cod_prod,
    cantidad: i.quantity,
    precio_unit: itemUnitPrice(i),
    nom_prod: i.product.nom_prod,
    url_imagen: i.product.url_imagen,
  }));
  const lines = order?.items && order.items.length > 0 ? order.items : fallbackItems;
  const total = order?.montofinal_vent || lines.reduce((sum, l) => sum + l.cantidad * l.precio_unit, 0);
  const count = lines.reduce((sum, l) => sum + l.cantidad, 0);
  const fecha = order?.fecha_vent ? new Date(order.fecha_vent) : null;
  const status = statusBadge(order?.estado);
  const payment = order?.metodopago_usu ? PAYMENT_LABELS[order.metodopago_usu] ?? order.metodopago_usu : 'Pago en kiosco';

  if (orderId == null && lines.length === 0) {
    return (
      <div className="flex min-h-[100dvh] flex-col bg-cream">
        <PageHeader title="Detalle del pedido" onBack={() => navigate(-1)} />
        <EmptyState
          image="/brand/ave-colibri-rosa.webp"
          title="No encontramos este pedido"
          description="Búscalo en tu lista de pedidos."
          action={<Button onClick={() => navigate('/orders')}>Ver mis pedidos</Button>}
        />
      </div>
    );
  }

  return (
    <div className="flex min-h-[100dvh] flex-col bg-cream">
      <PageHeader title="Detalle del pedido" onBack={() => navigate(-1)} />

      <div className="flex flex-1 flex-col px-5 pb-36 pt-2">
        <div className="flex items-center justify-between gap-3">
          <span className="font-display text-[30px] font-extrabold leading-none text-ink">
            Pedido <span className="num">{order?.id_vent ?? orderId ?? '—'}</span>
          </span>
          {order?.estado && <Badge tone={status.tone}>{status.label}</Badge>}
        </div>
        {fecha && (
          <p className="mt-1.5 text-[15px] text-muted">
            {fecha.toLocaleDateString('es-CO', { day: 'numeric', month: 'long', year: 'numeric' })},{' '}
            {fecha.toLocaleTimeString('es-CO', { hour: 'numeric', minute: '2-digit' })}
          </p>
        )}

        <dl className="mt-4">
          <InfoRow label="Entrega" value={order?.tipo_entrega === 'domicilio' ? 'Domicilio' : 'Recoger en tienda'} />
          {order?.tipo_entrega !== 'domicilio' && store && <InfoRow label="Tienda" value={`Tienda ${storeShortName(store)}`} />}
          <InfoRow label="Método de pago" value={payment} />
        </dl>

        <h2 className="mt-6 font-display text-[20px] font-extrabold text-ink">Productos</h2>
        {lines.length === 0 ? (
          <p className="border-b border-line py-4 text-[15px] text-muted">No encontramos los productos de este pedido.</p>
        ) : (
          <ul className="mt-1">
            {lines.map((line, idx) => (
              <li key={idx} className="flex items-center gap-3 border-b border-line py-3">
                <span className="grid h-12 w-12 shrink-0 place-items-center overflow-hidden rounded-full bg-cream-mid">
                  {line.url_imagen && (
                    <img src={resolveImageUrl(line.url_imagen)} alt="" className="h-10 w-10 object-contain" />
                  )}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-[16px] text-ink">{line.nom_prod ?? `Producto ${line.cod_prod}`}</span>
                  <span className="block text-[14px] text-muted">
                    <span className="num">{line.cantidad} × {formatCOP(line.precio_unit)}</span>
                  </span>
                </span>
                <span className="num shrink-0 text-[16px] text-ink">{formatCOP(line.cantidad * line.precio_unit)}</span>
              </li>
            ))}
          </ul>
        )}

        <div className="flex items-center justify-between pt-4">
          <span className="text-[16px] text-ink">
            Total (<span className="num">{count}</span> {count === 1 ? 'producto' : 'productos'})
          </span>
          <span className="num text-[22px] font-semibold text-ink">{formatCOP(total)}</span>
        </div>

        {orderId != null && (
          <button
            onClick={() => navigate(`/invoice/${orderId}`)}
            className="mt-4 min-h-[44px] self-start text-[15px] font-semibold text-ink underline underline-offset-4"
          >
            Ver recibo
          </button>
        )}
      </div>

      <div className="fixed inset-x-0 bottom-0 z-50 mx-auto max-w-[400px] border-t border-line bg-white px-5 pb-[calc(env(safe-area-inset-bottom)+14px)] pt-3">
        <button
          onClick={() => window.print()}
          className="flex h-[54px] w-full items-center justify-center gap-2 rounded-md bg-ink text-[17px] font-semibold text-white transition-transform duration-150 active:scale-[0.97]"
        >
          <Download size={19} aria-hidden />
          Descargar comprobante
        </button>
      </div>
    </div>
  );
};

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex min-h-[48px] items-center justify-between gap-4 border-b border-line">
      <dt className="text-[15px] text-muted">{label}</dt>
      <dd className="text-right text-[15px] text-ink">{value}</dd>
    </div>
  );
}

export default OrderDetails;
