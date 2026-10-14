import { motion } from 'framer-motion';
import { Plus } from 'lucide-react';
import type { Product } from '../../lib/types';
import { discountedPrice, formatCOP } from '../../lib/format';
import { resolveImageUrl } from '../../lib/image';

interface ProductCardProps {
  product: Product;
  onAdd: (product: Product) => void;
  onClick?: (product: Product) => void;
  /** @deprecated Ya no se usa: las tarjetas no tienen entrada escalonada. */
  index?: number;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onAdd, onClick }) => {
  const finalPrice = discountedPrice(product.precio_unitario, product.descuento);
  const hasDiscount = Boolean(product.descuento && product.descuento > 0);

  return (
    // Sin entrada escalonada al hacer scroll: es una lista que se recorre a
    // diario y la animación solo retrasaba el contenido.
    <motion.div
      whileTap={{ scale: 0.99 }}
      onClick={() => onClick?.(product)}
      className={`flex items-center gap-3.5 overflow-hidden rounded-2xl bg-surface p-3 ${onClick ? 'cursor-pointer' : ''}`}
      style={{ boxShadow: 'var(--shadow-soft)' }}
    >
      {/* Imagen */}
      <div className="relative h-[90px] w-[90px] shrink-0 overflow-hidden rounded-xl bg-cream-deep">
        {product.url_imagen ? (
          <img
            src={resolveImageUrl(product.url_imagen)}
            alt={product.nom_prod}
            className="h-full w-full object-contain p-1.5 transition-transform duration-300 group-hover:scale-105"
            loading="lazy"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-[11px] font-medium text-muted-soft">
            Sin imagen
          </div>
        )}
        {hasDiscount && (
          <div
            className="absolute left-0 top-0 rounded-br-lg px-1.5 py-0.5 text-[11px] font-bold text-ink"
            style={{ background: 'var(--color-accent)' }}
          >
            -{product.descuento}%
          </div>
        )}
      </div>

      {/* Contenido */}
      <div className="min-w-0 flex-1 py-0.5">
        <h4 className="mb-0.5 truncate text-[15px] font-bold leading-snug text-ink">
          {product.nom_prod}
        </h4>
        <p className="mb-2.5 line-clamp-2 text-[12px] leading-snug text-muted">
          {product.desc_prod}
        </p>

        <div className="flex items-center justify-between">
          <div className="flex items-baseline gap-1.5">
            <span className="text-[15px] font-bold text-ink">{formatCOP(finalPrice)}</span>
            {hasDiscount && (
              <span className="text-[11px] font-medium text-muted-soft line-through">
                {formatCOP(product.precio_unitario)}
              </span>
            )}
          </div>

          <motion.button
            whileTap={{ scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 500, damping: 30 }}
            onClick={(e) => {
              e.stopPropagation();
              onAdd(product);
            }}
            aria-label={`Agregar ${product.nom_prod}`}
            className="flex h-11 w-11 items-center justify-center rounded-full bg-brand text-cream transition-colors hover:bg-brand-strong"
          >
            <Plus size={18} strokeWidth={2.5} aria-hidden />
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};
