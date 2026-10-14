import { createContext, useContext, useEffect, useMemo, useReducer } from 'react';
import type { ReactNode } from 'react';
import type { OrderLine, Product } from './types';
import { discountedPrice } from './format';
import { toppingsPrice } from './customization';

export interface CartItem {
  product: Product;
  quantity: number;
  // MOCK: personalización de bebida (no soportada por el backend aún).
  size?: string;
  variant?: string;
  sugar?: string;
  ice?: string;
  toppings?: string[];
  notes?: string;
}

export type DeliveryType = 'recoger' | 'domicilio';

interface CartState {
  items: CartItem[];
  storeId: number | null;
  deliveryType: DeliveryType;
  pickupTime: string | null;
  paymentMethod: string | null;
}

type CartAction =
  | { type: 'ADD'; item: CartItem }
  | { type: 'REMOVE'; key: string }
  | { type: 'SET_QTY'; key: string; quantity: number }
  | { type: 'CLEAR' }
  | { type: 'SET_STORE'; storeId: number }
  | { type: 'SET_DELIVERY'; deliveryType: DeliveryType }
  | { type: 'SET_PICKUP_TIME'; pickupTime: string | null }
  | { type: 'SET_PAYMENT_METHOD'; paymentMethod: string | null };

const STORAGE_KEY = 'cq-cart-v1';

/** Identidad de una línea: producto más su personalización. */
export function lineKey(item: CartItem): string {
  return [
    item.product.cod_prod,
    item.size ?? '',
    item.variant ?? '',
    item.sugar ?? '',
    item.ice ?? '',
    [...(item.toppings ?? [])].sort().join('+'),
    item.notes?.trim() ?? '',
  ].join('|');
}

const initialState: CartState = {
  items: [],
  storeId: null,
  deliveryType: 'recoger',
  pickupTime: null,
  paymentMethod: null,
};

function reducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case 'ADD': {
      // Solo se suman líneas idénticas: un Nitro mediano y uno grande con
      // espresso extra son dos líneas distintas.
      const key = lineKey(action.item);
      const existing = state.items.find((i) => lineKey(i) === key);
      if (existing) {
        return {
          ...state,
          items: state.items.map((i) => (lineKey(i) === key ? { ...i, quantity: i.quantity + action.item.quantity } : i)),
        };
      }
      return { ...state, items: [...state.items, action.item] };
    }
    case 'REMOVE':
      return { ...state, items: state.items.filter((i) => lineKey(i) !== action.key) };
    case 'SET_QTY':
      return {
        ...state,
        items: state.items.map((i) => (lineKey(i) === action.key ? { ...i, quantity: Math.max(1, action.quantity) } : i)),
      };
    case 'CLEAR':
      return { ...state, items: [] };
    case 'SET_STORE':
      return { ...state, storeId: action.storeId };
    case 'SET_DELIVERY':
      return { ...state, deliveryType: action.deliveryType };
    case 'SET_PICKUP_TIME':
      return { ...state, pickupTime: action.pickupTime };
    case 'SET_PAYMENT_METHOD':
      return { ...state, paymentMethod: action.paymentMethod };
    default:
      return state;
  }
}

function loadInitialState(): CartState {
  if (typeof window === 'undefined') return initialState;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? { ...initialState, ...(JSON.parse(raw) as CartState) } : initialState;
  } catch {
    return initialState;
  }
}

const CartContext = createContext<{
  state: CartState;
  dispatch: React.Dispatch<CartAction>;
} | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, undefined, loadInitialState);

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      /* almacenamiento no disponible */
    }
  }, [state]);

  const value = useMemo(() => ({ state, dispatch }), [state]);
  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart debe usarse dentro de <CartProvider>');
  return ctx;
}

/** Helpers de conveniencia sobre el carrito. */
export function useCartTotals() {
  const { state } = useCart();
  const count = state.items.reduce((sum, i) => sum + i.quantity, 0);
  // Con descuento aplicado: antes el carrito sumaba el precio de lista
  // aunque las tarjetas mostraban el precio rebajado.
  const subtotal = state.items.reduce((sum, i) => sum + i.quantity * itemUnitPrice(i), 0);
  return { count, subtotal, items: state.items };
}

/** Precio unitario que paga el cliente (con descuento). */
export function unitPrice(product: Product): number {
  return discountedPrice(product.precio_unitario, product.descuento);
}

/** Precio unitario de una línea: producto con descuento más adiciones. */
export function itemUnitPrice(item: CartItem): number {
  return unitPrice(item.product) + toppingsPrice(item.toppings);
}

/** Convierte el carrito a líneas de orden (contrato del backend). */
export function toOrderLines(items: CartItem[]): OrderLine[] {
  return items.map((i) => ({
    cod_prod: i.product.cod_prod,
    cantidad: i.quantity,
    // Precio con descuento, el mismo que vio el cliente. Confirmar con el
    // backend si espera precio de lista y aplica el descuento por su cuenta.
    precio_unit: itemUnitPrice(i),
    nom_prod: i.product.nom_prod,
    url_imagen: i.product.url_imagen,
  }));
}
