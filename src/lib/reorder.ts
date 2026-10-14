import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useCart } from './cart';
import { productService } from './productService';
import type { Product } from './types';
import type { CartItem } from './cart';
import { TOPPINGS } from './customization';

/** Línea de un pedido anterior, tal como la conocen Pedidos y Recibo. */
export interface ReorderLine {
  /** Código del producto; si falta, se busca por nombre. */
  codProd?: number;
  name: string;
  quantity: number;
  size?: string;
  variant?: string;
  toppings?: string[];
}

/** Tamaños que ofrece hoy el detalle de producto. */
const SIZES = ['Pequeño', 'Mediano', 'Grande'];

const normalize = (s: string) =>
  s.normalize('NFD').replace(/[̀-ͯ]/g, '').trim().toLowerCase();

function findProduct(products: Product[], line: ReorderLine): Product | undefined {
  if (line.codProd != null) {
    const byCode = products.find((p) => p.cod_prod === line.codProd);
    if (byCode) return byCode;
  }
  const name = normalize(line.name);
  return products.find((p) => normalize(p.nom_prod) === name);
}

/** Algunos pedidos traen las adiciones como líneas propias. */
function findTopping(line: ReorderLine) {
  const name = normalize(line.name);
  return TOPPINGS.find((t) => normalize(t.name) === name);
}

function isAvailable(product: Product): boolean {
  return product.stock_actual == null || product.stock_actual > 0;
}

/**
 * "Repetir pedido": busca cada producto en el menú de hoy y lo agrega al
 * carrito con la misma cantidad y personalización. Se cobra el precio
 * actual. Lo que ya no está disponible se omite y se avisa; si el carrito
 * tenía productos, se suman sin borrar nada.
 */
export function useReorder() {
  const navigate = useNavigate();
  const { state, dispatch } = useCart();
  const [busy, setBusy] = useState(false);

  const reorder = async (lines: ReorderLine[]) => {
    if (busy || lines.length === 0) return;
    setBusy(true);
    try {
      const products = await productService.getProducts();
      const hadItems = state.items.length > 0;
      const items: CartItem[] = [];
      const missing: string[] = [];

      for (const line of lines) {
        const topping = findTopping(line);
        if (topping) {
          // Se suma a la bebida anterior; si esa bebida no está, se omite con ella.
          const previous = items.at(-1);
          if (previous && !previous.toppings?.includes(topping.id)) {
            previous.toppings = [...(previous.toppings ?? []), topping.id];
          }
          continue;
        }
        const product = findProduct(products, line);
        if (!product || !isAvailable(product)) {
          missing.push(line.name);
          continue;
        }
        items.push({
          product,
          quantity: line.quantity,
          size: line.size && SIZES.includes(line.size) ? line.size : 'Mediano',
          variant: line.variant ?? 'Frío',
          sugar: 'Normal',
          ice: 'Normal',
          toppings: [...(line.toppings ?? [])],
        });
      }

      items.forEach((item) => dispatch({ type: 'ADD', item }));
      const added = items.map((i) => i.product.nom_prod);

      if (added.length === 0) {
        toast.error('Ninguno de esos productos está disponible hoy.', {
          description: 'Elige algo parecido en el menú.',
        });
        return;
      }

      const parts = [
        missing.length > 0 ? `No está disponible: ${missing.join(', ')}.` : null,
        hadItems ? 'Lo sumamos a lo que ya tenías.' : null,
        'Con los precios de hoy.',
      ].filter(Boolean);
      toast.success(
        added.length === 1 ? 'Agregamos 1 producto a tu pedido.' : `Agregamos ${added.length} productos a tu pedido.`,
        { description: parts.join(' ') },
      );
      navigate('/checkout');
    } catch {
      toast.error('No pudimos cargar el menú.', { description: 'Revisa tu conexión e inténtalo de nuevo.' });
    } finally {
      setBusy(false);
    }
  };

  return { reorder, busy };
}
