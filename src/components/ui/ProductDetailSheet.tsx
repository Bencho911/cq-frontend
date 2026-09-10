import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Minus, Plus } from 'lucide-react';
import type { Product } from '../../lib/types';
import type { CartItem } from '../../lib/cart';
import { discountedPrice, formatCOP } from '../../lib/format';
import { Badge } from './Badge';
import { Button } from './Button';

interface ProductDetailSheetProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  onAddToCart: (item: CartItem) => void;
}

// MOCK: personalización de bebida (el backend no expone variantes/toppings aún).
const TOPPINGS = [
  { id: 'espresso', name: 'Espresso extra', price: 5000 },
  { id: 'jelly', name: 'Coffee Jelly', price: 3000 },
  { id: 'icecream', name: 'Helado de chocolate', price: 7000 },
  { id: 'caramelo', name: 'Shot de caramelo', price: 2500 },
];

const ProductDetailSheet = ({ product, isOpen, onClose, onAddToCart }: ProductDetailSheetProps) => {
  const [quantity, setQuantity] = useState(1);
  const [variant, setVariant] = useState('Frío');
  const [size, setSize] = useState('Regular');
  const [sugar, setSugar] = useState('Normal');
  const [ice, setIce] = useState('Normal');
  const [selectedToppings, setSelectedToppings] = useState<string[]>([]);
  const [notes, setNotes] = useState('');

  useEffect(() => {
    if (isOpen) {
      setQuantity(1);
      setVariant('Frío');
      setSize('Regular');
      setSugar('Normal');
      setIce('Normal');
      setSelectedToppings([]);
      setNotes('');
    }
  }, [isOpen, product]);

  const basePrice = product ? discountedPrice(product.precio_unitario, product.descuento) : 0;
  const toppingsPrice = selectedToppings.reduce((acc, id) => {
    const topping = TOPPINGS.find((t) => t.id === id);
    return acc + (topping?.price || 0);
  }, 0);
  const totalPrice = (basePrice + toppingsPrice) * quantity;

  const toggleTopping = (id: string) =>
    setSelectedToppings((prev) => (prev.includes(id) ? prev.filter((t) => t !== id) : [...prev, id]));

  if (!isOpen || !product) return null;

  const handleAdd = () => {
    onAddToCart({
      product,
      quantity,
      size,
      variant,
      sugar,
      ice,
      toppings: selectedToppings,
      notes,
    });
    onClose();
  };

  const sheet = (
    <AnimatePresence>
      <motion.div
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ type: 'spring', damping: 26, stiffness: 220 }}
        className="fixed inset-0 z-[9999] mx-auto flex w-full max-w-[400px] flex-col overflow-hidden bg-cream"
        role="dialog"
        aria-modal="true"
        aria-label={`Personalizar ${product.nom_prod}`}
      >
        <div className="flex items-center gap-2 bg-surface px-2 py-3">
          <button onClick={onClose} aria-label="Cerrar" className="flex h-10 w-10 items-center justify-center text-ink">
            <ArrowLeft size={24} aria-hidden />
          </button>
          <h1 className="text-[16px] font-semibold text-ink">Personalizar pedido</h1>
        </div>

        <div className="no-scrollbar flex-1 overflow-y-auto pb-[96px]">
          <div className="relative flex h-[260px] w-full items-center justify-center bg-cream-deep">
            <div
              className="absolute h-[170px] w-[170px] rounded-full"
              style={{ background: 'radial-gradient(50% 50% at 50% 50%, #e3b184 0%, rgba(227,177,132,0) 100%)' }}
            />
            {product.url_imagen ? (
              <img src={product.url_imagen} alt={product.nom_prod} className="z-10 h-[220px] w-[150px] object-contain drop-shadow-card" />
            ) : (
              <div className="z-10 text-muted-soft">Sin imagen</div>
            )}
          </div>

          <div className="flex flex-col gap-4 px-5 pb-8 pt-4">
            <div className="relative z-20 -mt-10 mx-1 flex flex-col gap-1 rounded-2xl bg-surface p-4 shadow-card">
              <Badge tone="accent" className="w-fit">{product.categoria?.nom_cat ?? 'Bebida'}</Badge>

              <div className="mt-1 flex items-center justify-between">
                <h2 className="text-[18px] font-semibold text-ink">{product.nom_prod}</h2>
                <span className="text-[18px] font-semibold text-ink">{formatCOP(basePrice)}</span>
              </div>

              <div className="flex items-start justify-between">
                <p className="max-w-[200px] text-[14px] leading-[20px] text-muted">{product.desc_prod}</p>

                <div className="flex h-[30px] items-center overflow-hidden rounded-lg border border-line bg-surface">
                  <button onClick={() => setQuantity(Math.max(1, quantity - 1))} aria-label="Disminuir" className="flex h-full w-[30px] items-center justify-center bg-cream-deep text-brand">
                    <Minus size={15} aria-hidden />
                  </button>
                  <span className="w-[30px] text-center text-[14px] font-bold text-ink">{quantity}</span>
                  <button onClick={() => setQuantity(quantity + 1)} aria-label="Aumentar" className="flex h-full w-[30px] items-center justify-center bg-cream-deep text-brand">
                    <Plus size={15} aria-hidden />
                  </button>
                </div>
              </div>
            </div>



            <div className="flex flex-col gap-3 rounded-2xl border border-line p-4">
              <h3 className="text-[14px] font-semibold text-ink">Personalizar</h3>
              <Row label="Variante">
                <SelectionButton active={variant === 'Frío'} onClick={() => setVariant('Frío')} label="Frío" />
                <SelectionButton active={variant === 'Caliente'} onClick={() => setVariant('Caliente')} label="Caliente" />
              </Row>
              <Row label="Tamaño">
                <SelectionButton active={size === 'Regular'} onClick={() => setSize('Regular')} label="Regular" />
                <SelectionButton active={size === 'Medio'} onClick={() => setSize('Medio')} label="Medio" />
                <SelectionButton active={size === 'Grande'} onClick={() => setSize('Grande')} label="Grande" />
              </Row>
              <Row label="Azúcar">
                <SelectionButton active={sugar === 'Normal'} onClick={() => setSugar('Normal')} label="Normal" />
                <SelectionButton active={sugar === 'Sin'} onClick={() => setSugar('Sin')} label="Sin" />
              </Row>
              <Row label="Hielo">
                <SelectionButton active={ice === 'Normal'} onClick={() => setIce('Normal')} label="Normal" />
                <SelectionButton active={ice === 'Sin'} onClick={() => setIce('Sin')} label="Sin" />
              </Row>
            </div>

            <div className="flex flex-col gap-3 rounded-2xl border border-line p-4">
              <h3 className="text-[14px] font-semibold text-ink">Topping</h3>
              {TOPPINGS.map((topping) => (
                <label key={topping.id} className="flex cursor-pointer items-center justify-between py-1">
                  <span className="text-[14px] text-ink">{topping.name}</span>
                  <span className="flex items-center gap-3">
                    <span className="text-[14px] font-medium text-muted-strong">+ {formatCOP(topping.price)}</span>
                    <div className={`flex h-[20px] w-[20px] items-center justify-center rounded-[6px] border-2 transition-colors ${
                      selectedToppings.includes(topping.id) ? 'border-ink bg-ink' : 'border-muted-soft'
                    }`}>
                      {selectedToppings.includes(topping.id) && (
                        <svg width="11" height="8" viewBox="0 0 12 10" fill="none">
                          <path d="M1.5 5.5L4.5 8.5L10.5 1.5" stroke="#fffdf9" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      )}
                    </div>
                    <input type="checkbox" className="hidden" checked={selectedToppings.includes(topping.id)} onChange={() => toggleTopping(topping.id)} />
                  </span>
                </label>
              ))}
            </div>

            <div className="flex flex-col gap-2">
              <h3 className="text-[14px] font-semibold text-ink">Notas</h3>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Opcional"
                className="h-[100px] w-full resize-none rounded-2xl border border-line bg-surface p-4 text-[14px] text-ink outline-none placeholder:text-muted-soft focus:border-accent"
              />
            </div>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 flex items-center justify-between bg-surface px-5 py-3 pb-[calc(env(safe-area-inset-bottom)+12px)] shadow-[0_-2px_10px_rgba(74,44,28,0.06)]">
          <div className="flex flex-col">
            <span className="text-[13px] font-medium text-muted">Total</span>
            <span className="text-[18px] font-bold text-ink">{formatCOP(totalPrice)}</span>
          </div>
          <Button onClick={handleAdd}>Agregar</Button>
        </div>
      </motion.div>
    </AnimatePresence>
  );

  return createPortal(sheet, document.body);
};

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-[14px] text-ink">{label}</span>
      <div className="flex gap-2">{children}</div>
    </div>
  );
}

function SelectionButton({ active, onClick, label }: { active: boolean; onClick: () => void; label: string }) {
  return (
    <button
      onClick={onClick}
      className={`rounded-lg border px-3 py-1.5 text-[12px] font-semibold transition-colors ${
        active ? 'border-brand bg-brand text-cream' : 'border-brand text-brand'
      }`}
    >
      {label}
    </button>
  );
}

export default ProductDetailSheet;
