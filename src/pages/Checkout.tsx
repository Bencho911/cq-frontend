import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Minus, Plus, Store, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { itemUnitPrice, useCart, useCartTotals, toOrderLines, type CartItem } from '../lib/cart';
import { orderService } from '../lib/orderService';
import { formatCOP } from '../lib/format';
import { USE_MOCKS } from '../lib/env';
import { Button } from '../components/ui/Button';
import { EmptyState } from '../components/ui/EmptyState';
import TimePickerModal from '../components/ui/TimePickerModal';
import { resolveImageUrl } from '../lib/image';
import { toppingNames } from '../lib/customization';
import { MOCK_ACCOUNT, POINTS_PER_REWARD, estimatePoints, preview, summarize } from '../lib/loyalty';
import { MOCK_READY_MINUTES, storeShortName, useSelectedStore } from '../lib/session';
import { Arch, archToneFor } from '../components/brand/Arch';
import { Stamp } from '../components/brand/Stamp';

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
  const store = useSelectedStore();

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
        <Header onBack={() => navigate('/home')} />
        <EmptyState
          icon={Store}
          title="Tu pedido está vacío"
          description="Elige algo del menú para empezar."
          action={<Button onClick={() => navigate('/menu')}>Ver el menú</Button>}
        />
      </div>
    );
  }

  const earned = estimatePoints(subtotal);
  const reward = preview(MOCK_ACCOUNT, earned);
  const prizeBird = reward.newBirds.at(-1) ?? null;

  return (
    <div className="flex min-h-[100dvh] flex-col bg-cream">
      <Header onBack={() => navigate(-1)} />

      <div className="flex-1 pb-36">
        {/* Recogida */}
        <div className="mx-5 mt-2 rounded-md bg-teal-soft p-1">
          <div className="grid grid-cols-2 gap-1" role="group" aria-label="Tipo de entrega">
            <DeliveryChip active={state.deliveryType === 'recoger'} onClick={() => dispatch({ type: 'SET_DELIVERY', deliveryType: 'recoger' })} label="Recoger en tienda" />
            <DeliveryChip active={state.deliveryType === 'domicilio'} onClick={() => dispatch({ type: 'SET_DELIVERY', deliveryType: 'domicilio' })} label="Domicilio" />
          </div>
          <div className="flex items-center justify-between px-3 py-2.5">
            <div>
              <span className="block text-[13px] text-muted">{state.deliveryType === 'recoger' ? 'Recoges en' : 'Prepara la tienda'}</span>
              <span className="block text-[16px] font-bold text-ink">
                {store ? `Tienda ${storeShortName(store)}` : 'Elige una tienda'}
                {state.deliveryType === 'recoger' && (
                  <>, {state.pickupTime ? `a las ${state.pickupTime}` : `en ${MOCK_READY_MINUTES} min`}</>
                )}
              </span>
            </div>
            <button onClick={() => navigate('/stores')} className="min-h-[44px] text-[15px] font-semibold text-ink underline underline-offset-4">
              Cambiar
            </button>
          </div>
        </div>

        {/* Líneas: el arco solo aparece al armar el pedido */}
        <ul className="px-5 pt-2">
          {items.map((item) => (
            <li key={item.product.cod_prod} className="grid grid-cols-[56px_1fr_auto] items-center gap-3 border-b border-line py-3.5">
              <Arch tone={archToneFor(item.product.cod_prod)} className="h-[68px] w-14">
                {item.product.url_imagen && (
                  <img src={resolveImageUrl(item.product.url_imagen)} alt="" className="mb-0.5 w-[46px] object-contain" />
                )}
              </Arch>
              <div className="min-w-0">
                <span className="block text-[16px] font-bold text-ink">{item.product.nom_prod}</span>
                <span className="block text-[14px] leading-snug text-muted">{describe(item) || 'Como viene'}</span>
                <span className="num mt-0.5 block text-[15px] text-ink">{formatCOP(item.quantity * itemUnitPrice(item))}</span>
              </div>
              <div className="flex h-11 items-center rounded-md border-[1.5px] border-line">
                <button
                  onClick={() =>
                    item.quantity === 1
                      ? dispatch({ type: 'REMOVE', codProd: item.product.cod_prod })
                      : dispatch({ type: 'SET_QTY', codProd: item.product.cod_prod, quantity: item.quantity - 1 })
                  }
                  aria-label={item.quantity === 1 ? `Quitar ${item.product.nom_prod}` : 'Quitar uno'}
                  className="grid h-full w-10 place-items-center text-ink"
                >
                  {item.quantity === 1 ? <Trash2 size={16} aria-hidden /> : <Minus size={16} aria-hidden />}
                </button>
                <span className="num w-5 text-center text-[15px] text-ink">{item.quantity}</span>
                <button
                  onClick={() => dispatch({ type: 'SET_QTY', codProd: item.product.cod_prod, quantity: item.quantity + 1 })}
                  aria-label="Agregar uno"
                  className="grid h-full w-10 place-items-center text-ink"
                >
                  <Plus size={16} aria-hidden />
                </button>
              </div>
            </li>
          ))}
        </ul>

        <button onClick={() => navigate('/menu')} className="ml-5 mt-1 flex h-12 items-center gap-1.5 text-[15px] font-semibold text-ink">
          <Plus size={17} aria-hidden /> Agregar algo más
        </button>

        {/* Puntos que suma el pedido */}
        {earned > 0 && (
          <div className="mx-5 mt-2 grid grid-cols-[64px_1fr] items-center gap-3.5">
            <Stamp
              bird={prizeBird ?? summarize(MOCK_ACCOUNT).nextBird ?? summarize(MOCK_ACCOUNT).slots[0].bird}
              state={prizeBird ? 'earned' : 'next'}
              className="h-[78px] w-16"
            />
            <div>
              <span className="block text-[16px] font-bold text-ink">
                Este pedido suma <span className="num">{earned}</span> {earned === 1 ? 'punto' : 'puntos'}
              </span>
              <span className="block text-[14px] leading-snug text-muted">
                {reward.completesCard
                  ? `Completas la tarjeta: ganas ${prizeBird ? `al ${prizeBird.name} y ` : ''}una bebida gratis.`
                  : prizeBird
                    ? `Llegas a ${reward.total} y ganas al ${prizeBird.name}.`
                    : `Llegas a ${reward.total} de ${POINTS_PER_REWARD}.`}
              </span>
            </div>
          </div>
        )}

        {/* Entrega a domicilio */}
        {state.deliveryType === 'domicilio' && (
          <div className="mt-5 flex flex-col gap-2.5 px-5">
            <h2 className="text-[15px] font-semibold text-ink">Dirección de entrega</h2>
            <Field id="delivery-address" label="Dirección" placeholder="Ej. Calle 12 #9-34" />
            <Field id="delivery-apt" label="Apartamento o piso (opcional)" placeholder="Ej. Apto 301" />
            <Field id="delivery-refs" label="Referencias" placeholder="Ej. Casa azul, portón blanco" />
          </div>
        )}

        {/* Horario y pago */}
        <div className="mt-4 px-5">
          {state.deliveryType === 'recoger' && (
            <Row onClick={() => setIsTimePickerOpen(true)} label="Hora de recogida" value={state.pickupTime ?? 'Lo antes posible'} />
          )}
          <Row
            onClick={() => navigate('/payment-method')}
            label="Método de pago"
            value={state.paymentMethod ? PAYMENT_LABELS[state.paymentMethod] ?? state.paymentMethod : 'Elegir'}
          />
          <div className="flex items-center justify-between pt-4">
            <span className="text-[16px] text-ink">
              Total (<span className="num">{count}</span> {count === 1 ? 'producto' : 'productos'})
            </span>
            <span className="num text-[20px] text-ink">{formatCOP(subtotal)}</span>
          </div>
        </div>
      </div>

      {/* Acción fija inferior */}
      <div className="fixed inset-x-0 bottom-0 z-50 mx-auto max-w-[400px] border-t border-line bg-white px-5 pb-[calc(env(safe-area-inset-bottom)+14px)] pt-3">
        <button
          onClick={handlePay}
          disabled={submitting}
          aria-busy={submitting || undefined}
          className="flex h-[54px] w-full items-center justify-between rounded-md bg-ink px-4 text-[17px] font-semibold text-white transition-transform duration-150 active:scale-[0.97] disabled:opacity-60"
        >
          {submitting ? 'Enviando pedido…' : 'Pagar y pedir'}
          <span className="num">{formatCOP(subtotal)}</span>
        </button>
      </div>

      <TimePickerModal
        isOpen={isTimePickerOpen}
        onClose={() => setIsTimePickerOpen(false)}
        onConfirm={(time) => dispatch({ type: 'SET_PICKUP_TIME', pickupTime: time })}
      />
    </div>
  );
};

function describe(item: CartItem): string {
  return [
    item.size,
    item.variant?.toLowerCase(),
    item.sugar && item.sugar !== 'Normal' ? item.sugar.toLowerCase() : null,
    item.ice && item.ice !== 'Normal' ? item.ice.toLowerCase() : null,
    ...toppingNames(item.toppings).map((n) => `+ ${n.toLowerCase()}`),
  ]
    .filter(Boolean)
    .join(', ');
}

function Header({ onBack }: { onBack: () => void }) {
  return (
    <div className="sticky top-0 z-40 flex items-center gap-1 bg-white/95 px-2 pb-2 pt-[max(env(safe-area-inset-top),12px)] backdrop-blur-xl">
      <button onClick={onBack} aria-label="Volver" className="grid h-11 w-11 place-items-center text-ink">
        <ChevronLeft size={26} aria-hidden />
      </button>
      <h1 className="font-display text-[26px] font-extrabold text-ink">Tu pedido</h1>
    </div>
  );
}

function Row({ onClick, label, value }: { onClick: () => void; label: string; value: string }) {
  return (
    <button onClick={onClick} className="flex min-h-[52px] w-full items-center justify-between border-b border-line text-left">
      <span className="text-[16px] text-ink">{label}</span>
      <span className="flex items-center gap-1 text-[15px] text-muted">
        {value}
        <ChevronRight size={17} aria-hidden />
      </span>
    </button>
  );
}

function Field({ id, label, placeholder }: { id: string; label: string; placeholder: string }) {
  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={id} className="text-[14px] font-semibold text-ink">{label}</label>
      <input
        id={id}
        type="text"
        placeholder={placeholder}
        className="h-12 w-full rounded-md border border-line bg-cream-deep px-4 text-[16px] text-ink outline-none placeholder:text-muted-soft focus:border-ink"
      />
    </div>
  );
}

function DeliveryChip({ active, onClick, label }: { active: boolean; onClick: () => void; label: string }) {
  return (
    <button
      onClick={onClick}
      aria-pressed={active}
      className={`h-11 rounded-md text-[15px] font-semibold transition-colors ${
        active ? 'bg-white text-ink shadow-xs' : 'text-muted'
      }`}
    >
      {label}
    </button>
  );
}

export default Checkout;
