import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft, CheckCircle2, Download } from 'lucide-react';
import { orderService } from '../lib/orderService';
import { useCartTotals } from '../lib/cart';
import { formatCOP } from '../lib/format';
import type { Order } from '../lib/types';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';

const OrderDetails = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { items } = useCartTotals();

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
    precio_unit: i.product.precio_unitario,
    nom_prod: i.product.nom_prod,
  }));
  const lines = order?.items ?? fallbackItems;
  const total = order?.montofinal_vent ?? lines.reduce((sum, l) => sum + l.cantidad * l.precio_unit, 0);
  const fecha = order?.fecha_vent ? new Date(order.fecha_vent) : null;

  return (
    <div className="flex min-h-[100dvh] flex-col bg-cream">
      <div className="sticky top-0 z-40 flex items-center gap-1 border-b border-line bg-cream/90 px-2 py-3 backdrop-blur-xl">
        <button onClick={() => navigate(-1)} aria-label="Volver" className="flex h-10 w-10 items-center justify-center text-ink">
          <ArrowLeft size={24} aria-hidden />
        </button>
        <img
          src="/Artes corporativos/Logo-Slogan/Logos-Slogan-Café.png"
          alt="Café Quindío"
          className="w-28 object-contain"
        />
      </div>

      <div className="flex flex-1 flex-col items-center px-5 pb-28 pt-8">
        <div
          className="mb-6 flex h-16 w-16 items-center justify-center overflow-hidden rounded-full"
          style={{
            border: '2.5px solid var(--color-brand)',
            boxShadow: '0 0 24px rgba(73,180,170,0.25)',
            background: 'var(--color-brand-soft)',
          }}
        >
          <img
            src="/Artes corporativos/Composiciones/composiciones- 2.png"
            alt="Pedido confirmado"
            className="h-14 w-14 object-contain"
          />
        </div>

        <div className="w-full rounded-3xl border border-line bg-surface p-5">
          <div className="mb-4 flex flex-col items-center gap-1">
            <h2 className="font-display text-[20px] font-semibold text-ink">¡Gracias!</h2>
            <p className="text-[13px] text-muted">Tu transacción se ha realizado con éxito.</p>
            {order?.estado && (
              <Badge tone={order.estado === 'completada' ? 'success' : 'accent'} className="mt-1">
                {order.estado === 'completada' ? 'Completado' : 'En proceso'}
              </Badge>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <InfoRow label="N° de pedido" value={`#${String(order?.id_vent ?? '—').padStart(6, '0')}`} />
            {fecha && (
              <>
                <InfoRow label="Fecha" value={fecha.toLocaleDateString('es-CO')} />
                <InfoRow label="Hora" value={fecha.toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit' })} />
              </>
            )}
          </div>

          <div className="my-3 h-px bg-line" />

          <h3 className="mb-2 text-[13px] font-semibold text-ink">Ítems</h3>
          <div className="flex flex-col gap-2">
            {lines.map((line, idx) => (
              <div key={idx} className="flex items-start justify-between">
                <span className="text-[14px] text-ink">{line.nom_prod ?? `Producto #${line.cod_prod}`}</span>
                <span className="text-[14px] text-muted">x{line.cantidad}</span>
              </div>
            ))}
          </div>

          <div className="my-3 h-px bg-line" />

          <div className="flex flex-col gap-2">
            <InfoRow label="Método de pago" value={order?.metodopago_usu ?? 'Kiosco'} />
            <InfoRow label="Tipo de entrega" value={order?.tipo_entrega === 'domicilio' ? 'Domicilio' : 'Recoger en tienda'} />
            <div className="flex items-center justify-between pt-1">
              <span className="text-[15px] font-semibold text-ink">Total</span>
              <span className="text-[16px] font-bold text-ink">{formatCOP(total)}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="fixed bottom-8 right-5 z-50">
        <Button onClick={() => window.print()}>
          <Download size={18} aria-hidden />
          Descargar
        </Button>
      </div>
    </div>
  );
};

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-[13px] font-medium text-muted">{label}</span>
      <span className="text-[13px] text-ink">{value}</span>
    </div>
  );
}

export default OrderDetails;
