import { useNavigate } from 'react-router-dom';
import { Banknote, CreditCard, Store } from 'lucide-react';
import { useCart } from '../lib/cart';
import { PageHeader } from '../components/brand/PageHeader';

const METHODS = [
  {
    id: 'wompi',
    label: 'Tarjeta débito o crédito',
    description: 'Visa, Mastercard o Amex. Pago seguro con Wompi.',
    icon: CreditCard,
  },
  {
    id: 'efectivo',
    label: 'Efectivo en tienda',
    description: 'Pagas al recoger tu pedido.',
    icon: Banknote,
  },
  {
    id: 'kiosco',
    label: 'Pago en kiosco',
    description: 'Usas el terminal de la tienda al recoger.',
    icon: Store,
  },
];

const PaymentMethod = () => {
  const navigate = useNavigate();
  const { state, dispatch } = useCart();

  const select = (id: string) => {
    dispatch({ type: 'SET_PAYMENT_METHOD', paymentMethod: id });
    navigate(-1);
  };

  return (
    <div className="flex min-h-[100dvh] flex-col bg-cream pb-8">
      <PageHeader title="Método de pago" onBack={() => navigate(-1)} />
      <p className="px-5 text-[15px] text-muted">Elige cómo quieres pagar tu pedido.</p>

      <ul className="flex flex-col gap-2.5 px-5 pt-4" role="radiogroup" aria-label="Método de pago">
        {METHODS.map((m) => {
          const active = state.paymentMethod === m.id;
          return (
            <li key={m.id}>
              <button
                onClick={() => select(m.id)}
                role="radio"
                aria-checked={active}
                className={`grid w-full grid-cols-[24px_1fr_22px] items-center gap-3.5 rounded-md border-[1.5px] p-4 text-left transition-[transform,border-color] duration-150 active:scale-[0.97] ${
                  active ? 'border-ink' : 'border-line'
                }`}
              >
                <m.icon size={24} strokeWidth={1.8} className="text-ink" aria-hidden />
                <span className="min-w-0">
                  <span className="block text-[16px] font-bold text-ink">{m.label}</span>
                  <span className="block text-[14px] leading-snug text-muted">{m.description}</span>
                </span>
                <span
                  className={`grid h-[22px] w-[22px] place-items-center rounded-full border-[1.5px] ${
                    active ? 'border-ink' : 'border-muted-soft'
                  }`}
                  aria-hidden
                >
                  {active && <span className="h-3 w-3 rounded-full bg-ink" />}
                </span>
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default PaymentMethod;
