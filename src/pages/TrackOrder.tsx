import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Store as StoreIcon } from 'lucide-react';
import { orderService } from '../lib/orderService';
import { useCartTotals } from '../lib/cart';
import { formatCOP } from '../lib/format';
import { resolveImageUrl } from '../lib/image';
import { USE_MOCKS } from '../lib/env';
import type { OrderLine } from '../lib/types';
import OrderReadyModal from '../components/ui/OrderReadyModal';
import { PageHeader } from '../components/brand/PageHeader';
import { MOCK_READY_MINUTES, storeShortName, useSelectedStore } from '../lib/session';

const STEPS = [
  { label: 'Tomado', title: 'Recibimos tu pedido', desc: 'La barra ya lo tiene en la fila.' },
  { label: 'Preparando', title: 'Preparando tu pedido', desc: `Estará listo en unos ${MOCK_READY_MINUTES} minutos.` },
  { label: 'Listo', title: 'Tu pedido está listo', desc: 'Recógelo en la barra.' },
];

// 1 = tomado, 2 = preparando, 3 = listo
const TrackOrder = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { items } = useCartTotals();

  const orderId = (location.state as { orderId?: number } | null)?.orderId ?? null;
  const [step, setStep] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [orderTotal, setOrderTotal] = useState(0);
  const [orderLines, setOrderLines] = useState<OrderLine[]>([]);
  const store = useSelectedStore();

  useEffect(() => {
    if (!orderId) return;
    orderService
      .getOrderById(orderId)
      .then((o) => {
        setOrderTotal(o.montofinal_vent ?? 0);
        setOrderLines(o.items ?? []);
      })
      .catch(() => {});
  }, [orderId]);

  useEffect(() => {
    // MOCK: avance simulado (el backend no emite "preparando").
    if (USE_MOCKS) {
      const t1 = setTimeout(() => setStep(2), 3000);
      const t2 = setTimeout(() => {
        setStep(3);
        setShowModal(true);
      }, 6000);
      return () => {
        clearTimeout(t1);
        clearTimeout(t2);
      };
    }

    // Real: sondeo del estado de la orden.
    if (!orderId) return;
    const poll = async () => {
      try {
        const order = await orderService.getOrderById(orderId);
        setStep(order.estado === 'completada' ? 3 : 1);
      } catch {
        /* mantener estado */
      }
    };
    poll();
    const interval = setInterval(poll, 2500);
    return () => clearInterval(interval);
  }, [orderId]);

  // El carrito se vacía al pagar: las líneas salen de la orden y, si no hay, del carrito.
  const lines: OrderLine[] =
    orderLines.length > 0
      ? orderLines
      : items.map((i) => ({
          cod_prod: i.product.cod_prod,
          cantidad: i.quantity,
          precio_unit: i.product.precio_unitario,
          nom_prod: i.product.nom_prod,
          url_imagen: i.product.url_imagen,
        }));
  const current = STEPS[step - 1];

  return (
    <div className="relative flex min-h-[100dvh] flex-col bg-cream">
      <PageHeader title="Tu pedido" onBack={() => navigate(-1)} />

      <div className="flex flex-1 flex-col pb-36">
        {/* Estado actual */}
        <section className="px-5 pt-3" aria-live="polite">
          {orderId != null && (
            <span className="block text-[15px] text-muted">
              Pedido <span className="num text-ink">{orderId}</span>
            </span>
          )}
          <h2 className="mt-1 font-display text-[40px] font-extrabold leading-[0.95] tracking-[-0.04em] text-ink">
            {current.title}
          </h2>
          <p className="mt-2 text-[16px] text-muted">{current.desc}</p>

          {/* Un tramo por paso */}
          <div
            className="mt-5 grid grid-cols-3 gap-1"
            role="progressbar"
            aria-valuemin={1}
            aria-valuemax={3}
            aria-valuenow={step}
            aria-valuetext={current.label}
            aria-label="Avance del pedido"
          >
            {STEPS.map((s, i) => (
              <span
                key={s.label}
                className={`h-2.5 rounded-sm transition-colors duration-500 ${i < step ? 'bg-ink' : 'bg-line'}`}
              />
            ))}
          </div>
          <div className="mt-1.5 grid grid-cols-3 gap-1 text-[13px]" aria-hidden>
            {STEPS.map((s, i) => (
              <span key={s.label} className={i < step ? 'font-semibold text-ink' : 'text-muted'}>
                {s.label}
              </span>
            ))}
          </div>
        </section>

        {/* Tienda */}
        <section className="mt-6 px-5">
          <div className="flex items-start gap-3 rounded-md bg-teal-soft px-4 py-3.5">
            <StoreIcon size={20} strokeWidth={1.8} className="mt-0.5 shrink-0 text-ink" aria-hidden />
            <span className="min-w-0">
              <span className="block text-[14px] text-muted">Recoges en</span>
              <span className="block text-[16px] font-bold text-ink">
                {store ? `Tienda ${storeShortName(store)}` : 'Tu tienda'}
              </span>
              {store?.direccion && <span className="block text-[14px] leading-snug text-muted">{store.direccion}</span>}
            </span>
          </div>
        </section>

        {/* Productos */}
        <section className="mt-6 px-5">
          <h3 className="font-display text-[20px] font-extrabold text-ink">Lo que pediste</h3>
          {lines.length === 0 ? (
            <p className="mt-2 border-b border-line pb-4 text-[15px] text-muted">
              Tu pedido ya está en la barra.
            </p>
          ) : (
            <ul className="mt-1">
              {lines.map((line) => (
                <li key={line.cod_prod} className="flex items-center gap-3 border-b border-line py-3">
                  <span className="grid h-14 w-14 shrink-0 place-items-center overflow-hidden rounded-full bg-cream-mid">
                    {line.url_imagen && (
                      <img src={resolveImageUrl(line.url_imagen)} alt="" className="h-[46px] w-[46px] object-contain" />
                    )}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-[16px] font-bold text-ink">{line.nom_prod ?? `Producto ${line.cod_prod}`}</span>
                    <span className="block text-[14px] text-muted">
                      <span className="num">{line.cantidad}</span> {line.cantidad === 1 ? 'unidad' : 'unidades'}
                    </span>
                  </span>
                  <span className="num shrink-0 text-[16px] text-ink">{formatCOP(line.cantidad * line.precio_unit)}</span>
                </li>
              ))}
            </ul>
          )}
          {step >= 3 && (
            <button
              onClick={() => navigate('/rating-review')}
              className="mt-2 min-h-[44px] text-[15px] font-semibold text-ink underline underline-offset-4"
            >
              Calificar el pedido
            </button>
          )}
        </section>
      </div>

      <div className="fixed inset-x-0 bottom-0 z-50 mx-auto max-w-[400px] border-t border-line bg-white px-5 pb-[calc(env(safe-area-inset-bottom)+14px)] pt-3">
        <button
          onClick={() => navigate('/order-details', { state: { orderId } })}
          className="flex h-[54px] w-full items-center justify-center rounded-md bg-ink text-[17px] font-semibold text-white transition-transform duration-150 active:scale-[0.97]"
        >
          Detalle del pedido
        </button>
      </div>

      <OrderReadyModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        orderId={orderId}
        storeName={store ? storeShortName(store) : null}
        total={orderTotal}
        onPickedUp={() => navigate('/rating-review')}
        onReceipt={orderId ? () => navigate(`/invoice/${orderId}`) : undefined}
      />
    </div>
  );
};

export default TrackOrder;
