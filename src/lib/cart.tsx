import { createContext, useContext, useEffect, useMemo, useReducer } from 'react';
import type { ReactNode } from 'react';
import type { OrderLine, Product } from './types';

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
  | { type: 'REMOVE'; codProd: number }
  | { type: 'SET_QTY'; codProd: number; quantity: number }
  | { type: 'CLEAR' }
  | { type: 'SET_STORE'; storeId: number }
  | { type: 'SET_DELIVERY'; deliveryType: DeliveryType }
  | { type: 'SET_PICKUP_TIME'; pickupTime: string | null }
  | { type: 'SET_PAYMENT_METHOD'; paymentMethod: string | null };

const STORAGE_KEY = 'cq-cart-v1';

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
      const existing = state.items.find((i) => i.product.cod_prod === action.item.product.cod_prod);
      if (existing) {
        return {
          ...state,
          items: state.items.map((i) =>
            i.product.cod_prod === action.item.product.cod_prod
              ? { ...i, quantity: i.quantity + action.item.quantity }
              : i,
          ),
        };
      }
      return { ...state, items: [...state.items, action.item] };
    }
    case 'REMOVE':
      return { ...state, items: state.items.filter((i) => i.product.cod_prod !== action.codProd) };
    case 'SET_QTY':
      return {
        ...state,
        items: state.items.map((i) =>
          i.product.cod_prod === action.codProd ? { ...i, quantity: Math.max(1, action.quantity) } : i,
        ),
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
  const subtotal = state.items.reduce(
    (sum, i) => sum + i.quantity * i.product.precio_unitario,
    0,
  );
  return { count, subtotal, items: state.items };
}

/** Convierte el carrito a líneas de orden (contrato del backend). */
export function toOrderLines(items: CartItem[]): OrderLine[] {
  return items.map((i) => ({
    cod_prod: i.product.cod_prod,
    cantidad: i.quantity,
    precio_unit: i.product.precio_unitario,
    nom_prod: i.product.nom_prod,
    url_imagen: i.product.url_imagen,
  }));
}
