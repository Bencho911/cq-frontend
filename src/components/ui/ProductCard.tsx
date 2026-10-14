import { motion } from 'framer-motion';
import { Plus } from 'lucide-react';
import type { Product } from '../../lib/types';
import { discountedPrice, formatCOP } from '../../lib/format';
import { resolveImageUrl } from '../../lib/image';

interface ProductCardProps {
  product: Product;
  onAdd: (product: Product) => void;
  onClick?: (product: Product) => void;
  /** @deprecated Ya no se usa: las filas no tienen entrada escalonada. */
  index?: number;
}

/**
 * Fila de producto plana (sin tarjeta ni sombra): foto redonda, nombre,
 * descripción y precio. El arco se reserva para el detalle y el carrito.
 */
export const ProductCard: React.FC<ProductCardProps> = ({ product, onAdd, onClick }) => {
  const finalPrice = discountedPrice(product.precio_unitario, product.descuento);
  const hasDiscount = Boolean(product.descuento && product.descuento > 0);

  return (
    <div className="flex items-center gap-3 border-b border-line py-3">
      <button
        type="button"
        onClick={() => onClick?.(product)}
        className="flex min-w-0 flex-1 items-center gap-3 text-left"
      >
        <span className="relative grid h-16 w-16 shrink-0 place-items-center overflow-hidden rounded-full bg-cream-mid">
          {product.url_imagen ? (
            <img
              src={resolveImageUrl(product.url_imagen)}
              alt=""
              className="h-[52px] w-[52px] object-contain"
              loading="lazy"
            />
          ) : (
            <span className="text-[12px] text-muted">Sin imagen</span>
          )}
        </span>
        <span className="min-w-0 flex-1">
          <span className="block text-[17px] font-bold leading-tight text-ink">{product.nom_prod}</span>
          <span className="mt-0.5 line-clamp-2 block text-[14px] leading-snug text-muted">{product.desc_prod}</span>
          <span className="mt-1 flex items-baseline gap-2">
            <span className="num text-[16px] font-semibold text-ink">{formatCOP(finalPrice)}</span>
            {hasDiscount && (
              <>
                <span className="num text-[13px] text-muted line-through">{formatCOP(product.precio_unitario)}</span>
                <span className="rounded-sm bg-mostaza px-1.5 text-[12px] font-bold text-ink">-{product.descuento}%</span>
              </>
            )}
          </span>
        </span>
      </button>

      <motion.button
        whileTap={{ scale: 0.95 }}
        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
        onClick={() => onAdd(product)}
        aria-label={`Agregar ${product.nom_prod}`}
        className="grid h-11 w-11 shrink-0 place-items-center rounded-full border-[1.5px] border-ink text-ink transition-colors hover:bg-ink hover:text-white"
      >
        <Plus size={18} strokeWidth={2.4} aria-hidden />
      </motion.button>
    </div>
  );
};
