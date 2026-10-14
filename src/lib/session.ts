import { useEffect, useState } from 'react';
import { useCart } from './cart';
import { storeService } from './storeService';
import type { Store } from './types';

/** MOCK: usuario de la demo (el backend aún no expone el perfil). */
export const MOCK_USER = { firstName: 'Santiago', initial: 'S' };

/**
 * MOCK: productos del último pedido, para "Lo de siempre". Debe salir del
 * historial de pedidos cuando el endpoint esté disponible.
 */
export const MOCK_LAST_ORDER_PRODUCT_IDS = [3, 5];

/** MOCK: tiempo estimado de preparación hasta que la tienda lo informe. */
export const MOCK_READY_MINUTES = 6;

/** "Café Quindío · Centro" → "Centro". */
export function storeShortName(store: Store): string {
  return store.nombre.replace(/^Café Quindío\s*[·-]\s*/i, '');
}

/** Tienda donde se recoge: la elegida en el carrito o la primera abierta. */
export function useSelectedStore(): Store | null {
  const { state } = useCart();
  const [stores, setStores] = useState<Store[]>([]);

  useEffect(() => {
    let alive = true;
    storeService.getStores().then((list) => {
      if (alive) setStores(list);
    });
    return () => {
      alive = false;
    };
  }, []);

  return (
    stores.find((s) => s.id_tienda === state.storeId) ??
    stores.find((s) => s.estado === 'ABIERTO') ??
    stores[0] ??
    null
  );
}

export function greetingFor(date: Date): string {
  const h = date.getHours();
  if (h < 12) return 'Buenos días';
  if (h < 18) return 'Buenas tardes';
  return 'Buenas noches';
}
