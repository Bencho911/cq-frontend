import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft, ChevronRight, CheckCircle2 } from 'lucide-react';
import { orderService } from '../lib/orderService';
import { useCartTotals } from '../lib/cart';
import { formatCOP } from '../lib/format';
import { USE_MOCKS } from '../lib/env';
import OrderReadyModal from '../components/ui/OrderReadyModal';
import { Button } from '../components/ui/Button';

// 1 = tomado, 2 = preparando, 3 = listo
const TrackOrder = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { items } = useCartTotals();

  const orderId = (location.state as { orderId?: number } | null)?.orderId ?? null;
  const [step, setStep] = useState(1);
  const [showModal, setShowModal] = useState(false);

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


  return (
    <div className="relative flex min-h-[100dvh] flex-col bg-cream">
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

      <div className="flex flex-1 flex-col pb-32">
        {/* Resumen */}
        <div className="flex flex-col gap-3 px-5 pt-6">
          {items.length === 0 ? (
            <div className="flex items-center gap-3 rounded-3xl bg-surface p-4 shadow-soft">
              <CheckCircle2 size={28} className="text-success" aria-hidden />
              <div>
                <p className="text-[14px] font-semibold text-ink">Pedido confirmado</p>
                <p className="text-[12px] text-muted">Tu pedido está en camino a la barra.</p>
              </div>
            </div>
          ) : (
            items.map((item) => (
              <div key={item.product.cod_prod} className="flex items-start gap-3">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-cream-deep">
                  {item.product.url_imagen ? (
                    <img src={item.product.url_imagen} alt={item.product.nom_prod} className="h-full w-full object-contain" />
                  ) : null}
                </div>
                <div className="flex flex-1 flex-col gap-0.5">
                  <div className="flex items-start justify-between">
                    <h3 className="text-[14px] font-semibold text-ink">{item.product.nom_prod}</h3>
                    <span className="text-[14px] font-semibold text-ink">{formatCOP(item.quantity * item.product.precio_unitario)}</span>
                  </div>
                  <div className="flex items-start justify-between">
                    <p className="max-w-[200px] text-[12px] text-muted">Cantidad: {item.quantity}</p>
                  </div>
                </div>
              </div>
            ))
          )}
          <button onClick={() => navigate('/order-details', { state: { orderId } })} className="flex w-fit items-center gap-1 rounded-full border-2 border-brand px-4 py-1.5 text-[14px] font-semibold text-brand">
            Orden de recepción <ChevronRight size={16} aria-hidden />
          </button>
        </div>

        {/* Timeline */}
        <div className="relative mt-8 flex flex-col px-8">
          <div className="absolute bottom-4 left-[44px] top-3 w-[2px] bg-line" />
          <div
            className="absolute left-[44px] top-3 w-[2px] bg-brand transition-all duration-700"
            style={{ height: step === 1 ? '0px' : step === 2 ? '72px' : '144px' }}
          />

          <TimelineStep done label="La cafetería toma tu pedido." />
          <TimelineStep done={step >= 2} label="Preparando su pedido." />
          <TimelineStep done={step >= 3} label="Su pedido está listo. Recójalo en la barra." isLast />
        </div>
      </div>

      <div className="fixed bottom-8 left-5 right-5 z-50 mx-auto max-w-[360px]">
        <Button
          disabled={step < 3}
          onClick={() => navigate('/rating-review')}
          className="w-full"
        >
          Volver a pedir
        </Button>
      </div>

      <OrderReadyModal isOpen={showModal} onClose={() => setShowModal(false)} />
    </div>
  );
};

function TimelineStep({ done, label, isLast }: { done: boolean; label: string; isLast?: boolean }) {
  return (
    <div className={`relative z-10 flex items-start gap-4 ${isLast ? '' : 'mb-14'}`}>
      <div
        className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full transition-colors duration-500"
        style={{ background: done ? 'var(--color-brand)' : 'var(--color-line)' }}
      >
        {done && <CheckCircle2 size={15} className="text-cream" aria-hidden />}
      </div>
      <span className={`text-[14px] leading-[20px] ${done ? 'font-medium text-ink' : 'text-muted'}`}>{label}</span>
    </div>
  );
}

export default TrackOrder;
