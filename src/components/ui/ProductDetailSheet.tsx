import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { motion } from 'framer-motion';
import { Check, ChevronLeft, Minus, Plus } from 'lucide-react';
import type { Product } from '../../lib/types';
import type { CartItem } from '../../lib/cart';
import { discountedPrice, formatCOP } from '../../lib/format';
import { resolveImageUrl } from '../../lib/image';
import { Arch, archToneFor } from '../brand/Arch';
import { TOPPINGS, toppingsPrice } from '../../lib/customization';

interface ProductDetailSheetProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  onAddToCart: (item: CartItem) => void;
}

// MOCK: personalización de bebida (el backend no expone variantes/toppings aún).
const SIZES = [
  { id: 'Pequeño', detail: '12 oz' },
  { id: 'Mediano', detail: '16 oz' },
  { id: 'Grande', detail: '20 oz' },
];

/**
 * Detalle de producto: armar el pedido. El arco de ventana colonial
 * enmarca la foto; es la única pantalla, junto con el carrito, que lo usa.
 */
const ProductDetailSheet = ({ product, isOpen, onClose, onAddToCart }: ProductDetailSheetProps) => {
  const [quantity, setQuantity] = useState(1);
  const [variant, setVariant] = useState('Frío');
  const [size, setSize] = useState('Mediano');
  const [sugar, setSugar] = useState('Normal');
  const [ice, setIce] = useState('Normal');
  const [selectedToppings, setSelectedToppings] = useState<string[]>([]);
  const [notes, setNotes] = useState('');

  useEffect(() => {
    if (isOpen) {
      setQuantity(1);
      setVariant('Frío');
      setSize('Mediano');
      setSugar('Normal');
      setIce('Normal');
      setSelectedToppings([]);
      setNotes('');
    }
  }, [isOpen, product]);

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isOpen, onClose]);

  if (!isOpen || !product) return null;

  const basePrice = discountedPrice(product.precio_unitario, product.descuento);
  const totalPrice = (basePrice + toppingsPrice(selectedToppings)) * quantity;
  const toggleTopping = (id: string) =>
    setSelectedToppings((prev) => (prev.includes(id) ? prev.filter((t) => t !== id) : [...prev, id]));

  const handleAdd = () => {
    onAddToCart({ product, quantity, size, variant, sugar, ice, toppings: selectedToppings, notes });
    onClose();
  };

  return createPortal(
    <motion.div
      initial={{ transform: 'translateY(100%)' }}
      animate={{ transform: 'translateY(0%)' }}
      transition={{ duration: 0.32, ease: [0.32, 0.72, 0, 1] }}
      className="fixed inset-0 z-[9999] mx-auto flex w-full max-w-[400px] flex-col overflow-hidden bg-white"
      role="dialog"
      aria-modal="true"
      aria-label={product.nom_prod}
    >
      <div className="no-scrollbar flex-1 overflow-y-auto overscroll-contain pb-[110px]">
        {/* ── Arco con la foto ── */}
        <div className="relative h-[340px] pt-[max(env(safe-area-inset-top),12px)]">
          <button
            onClick={onClose}
            aria-label="Volver"
            className="absolute left-3 top-[max(env(safe-area-inset-top),12px)] z-10 grid h-11 w-11 place-items-center rounded-full bg-white text-ink shadow-soft"
          >
            <ChevronLeft size={24} aria-hidden />
          </button>
          <Arch tone={archToneFor(product.cod_prod)} className="absolute inset-x-8 bottom-0 top-14">
            {product.url_imagen ? (
              <img
                src={resolveImageUrl(product.url_imagen)}
                alt=""
                className="mb-2 h-[210px] w-auto object-contain"
              />
            ) : (
              <span className="mb-16 text-[14px] text-muted">Sin imagen</span>
            )}
          </Arch>
          <img src="/brand/cafe-rama.webp" alt="" aria-hidden className="absolute bottom-[-6px] left-2 w-[110px]" />
        </div>

        <div className="px-5 pt-5">
          <div className="flex items-start justify-between gap-3">
            <h1 className="font-display text-[30px] font-extrabold leading-none text-ink">{product.nom_prod}</h1>
            {product.descuento ? (
              <span className="mt-1 shrink-0 rounded-sm bg-mostaza px-2 py-0.5 text-[13px] font-bold text-ink">-{product.descuento}%</span>
            ) : null}
          </div>
          <p className="mt-2 text-[16px] leading-relaxed text-muted">{product.desc_prod}</p>

          <Group title="Tamaño">
            <div className="grid grid-cols-3 gap-1.5">
              {SIZES.map((s) => (
                <button
                  key={s.id}
                  onClick={() => setSize(s.id)}
                  aria-pressed={size === s.id}
                  className={`h-[54px] rounded-md border-[1.5px] text-[15px] font-semibold leading-tight transition-colors ${
                    size === s.id ? 'border-ink bg-ink text-white' : 'border-line text-ink'
                  }`}
                >
                  {s.id}
                  <span className={`block text-[12px] font-normal ${size === s.id ? 'text-[#BFD0D6]' : 'text-muted'}`}>{s.detail}</span>
                </button>
              ))}
            </div>
          </Group>

          <Group title="Temperatura">
            <Chips options={['Frío', 'Caliente']} value={variant} onChange={setVariant} />
          </Group>
          <Group title="Azúcar">
            <Chips options={['Normal', 'Poca', 'Sin azúcar']} value={sugar} onChange={setSugar} />
          </Group>
          <Group title="Hielo">
            <Chips options={['Normal', 'Poco', 'Sin hielo']} value={ice} onChange={setIce} />
          </Group>

          <Group title="Adiciones">
            <div className="flex flex-col">
              {TOPPINGS.map((t) => {
                const on = selectedToppings.includes(t.id);
                return (
                  <button
                    key={t.id}
                    onClick={() => toggleTopping(t.id)}
                    role="checkbox"
                    aria-checked={on}
                    className="flex min-h-[48px] items-center justify-between border-b border-line text-left"
                  >
                    <span className="text-[16px] text-ink">{t.name}</span>
                    <span className="flex items-center gap-3">
                      <span className="num text-[15px] text-muted">+{formatCOP(t.price)}</span>
                      <span className={`grid h-6 w-6 place-items-center rounded-sm border-[1.5px] ${on ? 'border-ink bg-ink text-white' : 'border-muted-soft'}`}>
                        {on && <Check size={15} strokeWidth={3} aria-hidden />}
                      </span>
                    </span>
                  </button>
                );
              })}
            </div>
          </Group>

          <Group title="Notas para la barra">
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Opcional"
              className="h-[88px] w-full resize-none rounded-md border border-line bg-cream-deep p-3 text-[16px] text-ink outline-none placeholder:text-muted-soft focus:border-ink"
            />
          </Group>
        </div>
      </div>

      {/* ── Acción ── */}
      <div className="absolute inset-x-0 bottom-0 flex items-center gap-3 border-t border-line bg-white px-5 pb-[calc(env(safe-area-inset-bottom)+14px)] pt-3">
        <div className="flex h-[54px] items-center rounded-md border-[1.5px] border-line">
          <button onClick={() => setQuantity(Math.max(1, quantity - 1))} aria-label="Quitar uno" className="grid h-full w-11 place-items-center text-ink">
            <Minus size={18} aria-hidden />
          </button>
          <span className="num w-6 text-center text-[16px] text-ink" aria-live="polite">{quantity}</span>
          <button onClick={() => setQuantity(quantity + 1)} aria-label="Agregar uno" className="grid h-full w-11 place-items-center text-ink">
            <Plus size={18} aria-hidden />
          </button>
        </div>
        <button
          onClick={handleAdd}
          className="flex h-[54px] flex-1 items-center justify-between rounded-md bg-ink px-4 text-[17px] font-semibold text-white transition-transform duration-150 active:scale-[0.97]"
        >
          Agregar <span className="num">{formatCOP(totalPrice)}</span>
        </button>
      </div>
    </motion.div>,
    document.body,
  );
};

function Group({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mt-5">
      <h2 className="mb-2 text-[15px] font-semibold text-ink">{title}</h2>
      {children}
    </section>
  );
}

function Chips({ options, value, onChange }: { options: string[]; value: string; onChange: (v: string) => void }) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {options.map((o) => (
        <button
          key={o}
          onClick={() => onChange(o)}
          aria-pressed={value === o}
          className={`h-11 rounded-md border-[1.5px] px-4 text-[15px] transition-colors ${
            value === o ? 'border-ink font-bold text-ink' : 'border-line text-ink'
          }`}
        >
          {o}
        </button>
      ))}
    </div>
  );
}

export default ProductDetailSheet;
