import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ChevronRight, MapPin, Minus, Plus, Store, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { useCart, useCartTotals, toOrderLines } from '../lib/cart';
import { orderService } from '../lib/orderService';
import { formatCOP } from '../lib/format';
import { USE_MOCKS } from '../lib/env';
import { Button } from '../components/ui/Button';
import { EmptyState } from '../components/ui/EmptyState';
import TimePickerModal from '../components/ui/TimePickerModal';

const PAYMENT_LABELS: Record<string, string> = {
  wompi: 'Tarjeta (Wompi)',
  efectivo: 'Efectivo en tienda',
  kiosco: 'Pago en kiosco',
};

const Checkout = () => {
  const navigate = useNavigate();
  const { state, dispatch } = useCart();
  const { count, subtotal, items } = useCartTotals();
  const [submitting, setSubmitting] = useState(false);
  const [isTimePickerOpen, setIsTimePickerOpen] = useState(false);

  const handlePay = async () => {
    if (items.length === 0) return;
    setSubmitting(true);
    try {
      const order = await orderService.createOrder({
        metodopago_usu: state.paymentMethod ?? 'kiosco',
        items: toOrderLines(items),
        store_id: state.storeId ?? undefined,
        tipo_entrega: state.deliveryType,
      });

      // Si hay backend real y método con pasarela, abre el checkout de Wompi.
      if (!USE_MOCKS && state.paymentMethod === 'wompi') {
        const successUrl = `${window.location.origin}/order-success?order=${order.id_vent}`;
        const url = await orderService.createCheckoutUrl(order.id_vent, successUrl);
        if (url) {
          window.location.href = url;
          return;
        }
      }

      dispatch({ type: 'CLEAR' });
      navigate('/order-success', { state: { orderId: order.id_vent } });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'No se pudo crear el pedido');
    } finally {
      setSubmitting(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="flex min-h-[100dvh] flex-col bg-cream">
        <Header onBack={() => navigate('/home')} title="Checkout" />
        <EmptyState
          icon={Store}
          title="Tu carrito está vacío"
          description="Agrega productos desde el menú para continuar."
          action={<Button onClick={() => navigate('/menu')}>Ir al menú</Button>}
        />
      </div>
    );
  }

  return (
    <div className="flex min-h-[100dvh] flex-col bg-cream">
      <Header onBack={() => navigate(-1)} title="Checkout" />

      <div className="flex-1 pb-36">
        {/* Items */}
        <div className="flex flex-col gap-3 px-5 py-4">
          {items.map((item) => (
            <div key={item.product.cod_prod} className="flex items-start gap-3 rounded-3xl bg-surface p-3 shadow-soft">
              <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-cream-deep">
                {item.product.url_imagen ? (
                  <img src={item.product.url_imagen} alt={item.product.nom_prod} className="h-full w-full object-contain" />
                ) : (
                  <Store size={20} className="text-muted-soft" aria-hidden />
                )}
              </div>

              <div className="flex flex-1 flex-col gap-1">
                <div className="flex items-start justify-between">
                  <h3 className="text-[14px] font-semibold text-ink">{item.product.nom_prod}</h3>
                  <button
                    onClick={() => dispatch({ type: 'REMOVE', codProd: item.product.cod_prod })}
                    aria-label={`Quitar ${item.product.nom_prod}`}
                    className="text-muted-soft transition-colors hover:text-danger"
                  >
                    <Trash2 size={17} aria-hidden />
                  </button>
                </div>
                <p className="text-[12px] leading-[18px] text-muted">
                  {[item.variant, item.size, item.sugar !== 'Normal' ? item.sugar : null, item.ice !== 'Normal' ? item.ice : null]
                    .filter(Boolean)
                    .join(' · ') || 'Estándar'}
                </p>
                <div className="mt-1 flex items-center justify-between">
                  <div className="flex h-7 items-center overflow-hidden rounded-lg border border-line">
                    <button
                      onClick={() => dispatch({ type: 'SET_QTY', codProd: item.product.cod_prod, quantity: item.quantity - 1 })}
                      aria-label="Disminuir"
                      className="flex h-full w-7 items-center justify-center bg-cream-deep text-brand"
                    >
                      <Minus size={13} aria-hidden />
                    </button>
                    <span className="w-7 text-center text-[13px] font-semibold text-ink">{item.quantity}</span>
                    <button
                      onClick={() => dispatch({ type: 'SET_QTY', codProd: item.product.cod_prod, quantity: item.quantity + 1 })}
                      aria-label="Aumentar"
                      className="flex h-full w-7 items-center justify-center bg-cream-deep text-brand"
                    >
                      <Plus size={13} aria-hidden />
                    </button>
                  </div>
                  <span className="text-[14px] font-bold text-ink">
                    {formatCOP(item.quantity * item.product.precio_unitario)}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <button onClick={() => navigate('/menu')} className="ml-5 flex items-center gap-1 text-[14px] font-semibold text-accent-deep">
          <Plus size={16} aria-hidden /> Agregar más
        </button>

        {/* Entrega */}
        <SectionTitle title="¿Cómo quieres recibir tu pedido?" />
        <div className="px-5">
          <div className="flex gap-2">
            <DeliveryChip active={state.deliveryType === 'recoger'} onClick={() => dispatch({ type: 'SET_DELIVERY', deliveryType: 'recoger' })} label="Recoger en tienda" />
            <DeliveryChip active={state.deliveryType === 'domicilio'} onClick={() => dispatch({ type: 'SET_DELIVERY', deliveryType: 'domicilio' })} label="Domicilio" />
          </div>

          <div className="mt-2 flex flex-col">
            <Row onClick={() => navigate('/stores')}>
              <span className="flex items-center gap-2 text-[14px] font-medium text-ink">
                <MapPin size={17} className="text-accent-deep" aria-hidden />
                Tienda
              </span>
              <span className="flex items-center gap-1 text-[13px] text-muted">
                {state.storeId ? `Tienda #${state.storeId}` : 'Elegir tienda'}
                <ChevronRight size={16} aria-hidden />
              </span>
            </Row>

            <Row onClick={() => setIsTimePickerOpen(true)}>
              <span className="text-[14px] font-medium text-ink">Horario de recogida</span>
              <span className="text-[13px] text-muted">
                {state.pickupTime ?? 'Lo antes posible'}
              </span>
            </Row>

            {/* Formulario de dirección de domicilio */}
            {state.deliveryType === 'domicilio' && (
              <div className="mt-3 flex flex-col gap-2.5">
                <div className="flex flex-col gap-1">
                  <label htmlFor="delivery-address" className="text-[12px] font-semibold text-muted-strong">Dirección de entrega</label>
                  <input
                    id="delivery-address"
                    type="text"
                    placeholder="Ej. Calle 12 #9-34"
                    className="h-11 w-full rounded-xl border border-line bg-surface px-4 text-[14px] text-ink outline-none placeholder:text-muted-soft focus:border-accent"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label htmlFor="delivery-apt" className="text-[12px] font-semibold text-muted-strong">Apartamento / Piso (opcional)</label>
                  <input
                    id="delivery-apt"
                    type="text"
                    placeholder="Ej. Apto 301"
                    className="h-11 w-full rounded-xl border border-line bg-surface px-4 text-[14px] text-ink outline-none placeholder:text-muted-soft focus:border-accent"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label htmlFor="delivery-refs" className="text-[12px] font-semibold text-muted-strong">Referencias</label>
                  <input
                    id="delivery-refs"
                    type="text"
                    placeholder="Ej. Casa de color azul, portón blanco"
                    className="h-11 w-full rounded-xl border border-line bg-surface px-4 text-[14px] text-ink outline-none placeholder:text-muted-soft focus:border-accent"
                  />
                </div>
              </div>
            )}
          </div>
        </div>


        {/* Pago */}
        <SectionTitle title="Pago" />
        <div className="px-5">
          <Row onClick={() => navigate('/payment-method')}>
            <span className="text-[14px] font-medium text-ink">Método de pago</span>
            <span className="flex items-center gap-1 text-[13px] text-muted">
              {state.paymentMethod ? PAYMENT_LABELS[state.paymentMethod] ?? state.paymentMethod : 'Seleccionar'}
              <ChevronRight size={16} aria-hidden />
            </span>
          </Row>

          <div className="mt-3 flex flex-col gap-1 rounded-2xl border border-line p-4">
            <div className="flex items-center justify-between">
              <span className="text-[13px] text-muted">Subtotal ({count} {count === 1 ? 'ítem' : 'ítems'})</span>
              <span className="text-[13px] text-muted">{formatCOP(subtotal)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[15px] font-semibold text-ink">Total</span>
              <span className="text-[16px] font-bold text-ink">{formatCOP(subtotal)}</span>
            </div>
          </div>

          {USE_MOCKS && (
            <div className="mt-3">

            </div>
          )}
        </div>
      </div>

      {/* Acción fija inferior */}
      <div className="fixed bottom-0 left-0 right-0 z-50 mx-auto max-w-[400px] border-t border-line bg-surface px-5 py-3 pb-[calc(env(safe-area-inset-bottom)+12px)]">
        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-[13px] font-medium text-muted">Total</span>
            <span className="text-[18px] font-bold text-ink">{formatCOP(subtotal)}</span>
          </div>
          <Button onClick={handlePay} loading={submitting}>
            Pagar
          </Button>
        </div>
      </div>

      <TimePickerModal
        isOpen={isTimePickerOpen}
        onClose={() => setIsTimePickerOpen(false)}
        onConfirm={(time) => dispatch({ type: 'SET_PICKUP_TIME', pickupTime: time })}
      />
    </div>
  );
};

function Header({ onBack, title }: { onBack: () => void; title: string }) {
  return (
    <div className="sticky top-0 z-40 flex items-center gap-1 border-b border-line bg-cream/90 px-2 py-3 backdrop-blur-xl">
      <button onClick={onBack} aria-label="Volver" className="flex h-10 w-10 items-center justify-center text-ink">
        <ArrowLeft size={24} aria-hidden />
      </button>
      <img
        src="/Artes corporativos/Logo-Slogan/Logos-Slogan-Café.png"
        alt={title}
        className="w-28 object-contain"
      />
    </div>
  );
}

function SectionTitle({ title }: { title: string }) {
  return <h2 className="px-5 pb-2 pt-5 text-[14px] font-semibold text-ink">{title}</h2>;
}

function Row({ children, onClick }: { children: React.ReactNode; onClick?: () => void }) {
  const Comp = onClick ? 'button' : 'div';
  return (
    <Comp
      onClick={onClick}
      className="flex w-full items-center justify-between border-b border-line py-3 text-left"
    >
      {children}
    </Comp>
  );
}

function DeliveryChip({ active, onClick, label }: { active: boolean; onClick: () => void; label: string }) {
  return (
    <button
      onClick={onClick}
      aria-pressed={active}
      className={`flex-1 rounded-2xl border px-3 py-3 text-[13px] font-semibold transition-colors ${
        active ? 'border-brand bg-brand text-cream' : 'border-line bg-surface text-muted-strong'
      }`}
    >
      {label}
    </button>
  );
}

export default Checkout;
