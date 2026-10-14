import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Check } from 'lucide-react';
import { PageHeader } from '../components/brand/PageHeader';

// MOCK: el backend no expone cupones/descuentos aún.
const vouchers = [
  { id: 1, amount: '10%', title: 'Descuento del 10%', subtitle: 'En compras desde $20.000', disabled: false },
  { id: 2, amount: '15%', title: 'Descuento del 15%', subtitle: 'En compras desde $25.000', disabled: false },
  { id: 3, amount: '$75.000', title: 'Descuento de $75.000', subtitle: 'En compras desde $280.000', disabled: true, error: 'Te faltan $100.000 para usar este cupón.' },
  { id: 4, amount: '$20.000', title: 'Descuento de $20.000', subtitle: 'En compras desde $80.000', disabled: true, error: 'Te faltan $60.000 para usar este cupón.' },
  { id: 5, amount: '30%', title: 'Descuento del 30%', subtitle: 'En compras desde $30.000', disabled: true, error: 'Te faltan $20.000 para usar este cupón.' },
];

const Vouchers = () => {
  const navigate = useNavigate();
  const [selectedId, setSelectedId] = useState<number | null>(2);
  const [code, setCode] = useState('');
  const [codeError, setCodeError] = useState<string | null>(null);

  // MOCK: sin endpoint de validación, cualquier código se rechaza.
  const applyCode = () => {
    if (!code.trim()) return;
    setCodeError('No encontramos ese código. Revisa que esté bien escrito e intenta de nuevo.');
  };

  return (
    <div className="flex min-h-[100dvh] flex-col bg-cream">
      <PageHeader title="Bonos y cupones" onBack={() => navigate(-1)} />

      <div className="flex flex-1 flex-col pb-32">
        <form
          className="px-5 pt-2"
          onSubmit={(e) => {
            e.preventDefault();
            applyCode();
          }}
        >
          <label htmlFor="voucher-code" className="text-[14px] font-semibold text-ink">
            ¿Tienes un código?
          </label>
          <div className="mt-1.5 flex gap-2">
            <input
              id="voucher-code"
              type="text"
              value={code}
              onChange={(e) => {
                setCode(e.target.value.toUpperCase());
                setCodeError(null);
              }}
              placeholder="Ej. CAFE20"
              autoCapitalize="characters"
              aria-invalid={codeError ? true : undefined}
              aria-describedby={codeError ? 'voucher-code-error' : undefined}
              className={`num h-12 min-w-0 flex-1 rounded-md border bg-cream-deep px-4 text-[16px] text-ink outline-none placeholder:text-muted-soft focus:border-ink ${
                codeError ? 'border-danger' : 'border-line'
              }`}
            />
            <button
              type="submit"
              disabled={!code.trim()}
              className="h-12 shrink-0 rounded-md bg-ink px-5 text-[16px] font-semibold text-white transition-transform duration-150 active:scale-[0.97] disabled:opacity-45"
            >
              Aplicar
            </button>
          </div>
          {codeError && (
            <p id="voucher-code-error" role="alert" className="mt-1.5 text-[14px] text-danger">
              {codeError}
            </p>
          )}
        </form>

        <h2 className="px-5 pt-7 font-display text-[20px] font-extrabold text-ink">Tus cupones</h2>
        <ul className="px-5 pt-1" role="radiogroup" aria-label="Tus cupones">
          {vouchers.map((voucher) => {
            const selected = selectedId === voucher.id;
            return (
              <li key={voucher.id}>
                <button
                  role="radio"
                  aria-checked={selected}
                  aria-disabled={voucher.disabled || undefined}
                  onClick={() => {
                    if (!voucher.disabled) setSelectedId(voucher.id);
                  }}
                  className="grid w-full grid-cols-[92px_1fr_24px] items-center gap-3.5 border-b border-line py-3.5 text-left"
                >
                  <span
                    className={`grid h-[68px] place-items-center rounded-md bg-mostaza-soft px-1 ${voucher.disabled ? 'opacity-50' : ''}`}
                  >
                    <span
                      className={`font-display font-extrabold leading-none text-ink ${
                        voucher.amount.length > 4 ? 'text-[19px]' : 'text-[30px]'
                      }`}
                    >
                      {voucher.amount}
                    </span>
                  </span>
                  <span className="min-w-0">
                    <span className={`block text-[16px] font-bold ${voucher.disabled ? 'text-muted' : 'text-ink'}`}>
                      {voucher.title}
                    </span>
                    <span className="block text-[14px] leading-snug text-muted">{voucher.subtitle}</span>
                    {voucher.error && (
                      <span className="mt-0.5 block text-[14px] leading-snug text-danger">{voucher.error}</span>
                    )}
                  </span>
                  {!voucher.disabled ? (
                    <span
                      className={`grid h-6 w-6 place-items-center rounded-full ${
                        selected ? 'bg-ink text-white' : 'border-[1.5px] border-muted-soft'
                      }`}
                      aria-hidden
                    >
                      {selected && <Check size={15} strokeWidth={3} />}
                    </span>
                  ) : (
                    <span aria-hidden />
                  )}
                </button>
              </li>
            );
          })}
        </ul>
      </div>

      <div className="fixed inset-x-0 bottom-0 z-50 mx-auto max-w-[400px] border-t border-line bg-white px-5 pb-[calc(env(safe-area-inset-bottom)+14px)] pt-3">
        <button
          onClick={() => navigate(-1)}
          className="flex h-[54px] w-full items-center justify-between rounded-md bg-ink px-4 text-[17px] font-semibold text-white transition-transform duration-150 active:scale-[0.97]"
        >
          {selectedId ? 'Usar cupón' : 'Seguir sin cupón'}
          {selectedId && <span className="num">{vouchers.find((v) => v.id === selectedId)?.amount}</span>}
        </button>
      </div>
    </div>
  );
};

export default Vouchers;
