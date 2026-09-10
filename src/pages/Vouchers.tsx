import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Check, Ticket } from 'lucide-react';
import { Button } from '../components/ui/Button';

// MOCK: el backend no expone cupones/descuentos aún.
const vouchers = [
  { id: 1, title: 'Desc 10% para más de $20.000', subtitle: 'Sin compra mínima', disabled: false },
  { id: 2, title: 'Desc 15% para más de $25.000', subtitle: 'Gasto mínimo $20.000', disabled: false },
  { id: 3, title: 'Desc $75.000', subtitle: 'Mínimo de compra $280.000', disabled: true, error: 'Gasta otros $100.000 para usar este cupón.' },
  { id: 4, title: 'Desc $20.000', subtitle: 'Compra mínima $80.000', disabled: true, error: 'Gasta otros $60.000 para usar este cupón.' },
  { id: 5, title: 'Desc 30% para más de $30.000', subtitle: 'Compra mínima $30.000', disabled: true, error: 'Gasta otros $20.000 para usar este cupón.' },
];

const Vouchers = () => {
  const navigate = useNavigate();
  const [selectedId, setSelectedId] = useState<number | null>(2);

  return (
    <div className="flex min-h-[100dvh] flex-col bg-cream">
      <div className="sticky top-0 z-40 flex items-center gap-1 border-b border-line bg-cream/90 px-2 py-3 backdrop-blur-xl">
        <button onClick={() => navigate(-1)} aria-label="Volver" className="flex h-10 w-10 shrink-0 items-center justify-center text-ink">
          <ArrowLeft size={24} aria-hidden />
        </button>
        <img
          src="/Artes corporativos/Logo-Slogan/Logos-Slogan-Café.png"
          alt="Café Quindío"
          className="w-28 object-contain"
        />
      </div>

      <div className="flex flex-1 flex-col pb-28">
        <div className="px-5 pt-4">
          <input
            type="text"
            placeholder="Introduce el código del vale aquí."
            aria-label="Código de cupón"
            className="h-12 w-full rounded-2xl border border-line bg-surface px-4 text-[14px] text-ink outline-none placeholder:text-muted-soft focus:border-brand"
          />
          <div className="mt-3">
          </div>
        </div>

        <div className="mt-4 flex flex-col px-5">
          {vouchers.map((voucher, index) => (
            <div key={voucher.id}>
              <div
                className={`flex items-start gap-4 py-4 ${voucher.disabled ? 'opacity-60' : 'cursor-pointer'}`}
                onClick={() => {
                  if (!voucher.disabled) setSelectedId(voucher.id);
                }}
              >
                <div className="flex h-11 w-12 shrink-0 items-center justify-center rounded-lg bg-cream-deep text-brand">
                  <Ticket size={20} aria-hidden />
                </div>
                <div className="flex flex-1 flex-col gap-1 pr-2">
                  <h3 className="text-[14px] font-semibold leading-[20px] text-ink">{voucher.title}</h3>
                  <span className="text-[11px] font-medium leading-[14px] text-muted">{voucher.subtitle}</span>
                  {voucher.error && <span className="mt-0.5 text-[11px] leading-[14px] text-danger">{voucher.error}</span>}
                </div>
                {!voucher.disabled && (
                  <div className={`mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border ${selectedId === voucher.id ? 'border-brand bg-brand' : 'border-muted-soft'}`}>
                    {selectedId === voucher.id && <Check size={15} strokeWidth={3} className="text-cream" aria-hidden />}
                  </div>
                )}
              </div>
              {index < vouchers.length - 1 && <div className="h-px w-full bg-line" />}
            </div>
          ))}
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 z-50 mx-auto max-w-[400px] border-t border-line bg-surface px-5 py-3 pb-[calc(env(safe-area-inset-bottom)+12px)]">
        <div className="flex items-center justify-between">
          <span className="text-[14px] font-medium text-ink">{selectedId ? '1' : '0'} cupón</span>
          <Button onClick={() => navigate(-1)}>Usar</Button>
        </div>
      </div>
    </div>
  );
};

export default Vouchers;
