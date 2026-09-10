import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Banknote, CreditCard, Store } from 'lucide-react';
import { useCart } from '../lib/cart';
import { Badge } from '../components/ui/Badge';

const METHODS = [
  {
    id: 'wompi',
    label: 'Tarjeta débito o crédito',
    description: 'Visa, Mastercard, Amex (procesado por Wompi).',
    icon: CreditCard,
    iconBg: 'bg-brand',
  },
  {
    id: 'efectivo',
    label: 'Efectivo en tienda',
    description: 'Paga al recoger tu pedido.',
    icon: Banknote,
    iconBg: 'bg-brand-soft',
  },
  {
    id: 'kiosco',
    label: 'Pago en kiosco',
    description: 'Usa el terminal de la tienda al recoger.',
    icon: Store,
    iconBg: 'bg-brand-strong',
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

      <div className="flex flex-col gap-3 px-5 pt-6">
        <p className="text-[13px] text-muted">Elige cómo quieres pagar tu pedido.</p>

        {METHODS.map((m) => {
          const active = state.paymentMethod === m.id;
          return (
            <button
              key={m.id}
              onClick={() => select(m.id)}
              aria-pressed={active}
              className={`flex items-center gap-4 rounded-3xl border p-4 text-left transition-colors ${
                active ? 'border-brand bg-brand-soft' : 'border-line bg-surface hover:bg-cream-deep'
              }`}
            >
              <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl text-cream ${m.iconBg}`}>
                <m.icon size={24} aria-hidden />
              </div>
              <div className="flex flex-1 flex-col gap-0.5">
                <span className="text-[15px] font-semibold text-ink">{m.label}</span>
                <span className="text-[13px] text-muted">{m.description}</span>
              </div>
              <div className={`flex h-5 w-5 items-center justify-center rounded-full border-2 ${active ? 'border-brand' : 'border-muted-soft'}`}>
                {active && <div className="h-2.5 w-2.5 rounded-full bg-brand" />}
              </div>
            </button>
          );
        })}

        <div className="mt-2">
        </div>
      </div>
    </div>
  );
};

export default PaymentMethod;
