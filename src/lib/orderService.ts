import { apiFetch } from './api';
import { USE_MOCKS } from './env';
import type { Order, OrderLine } from './types';

export interface CreateOrderInput {
  metodopago_usu?: string;
  items: OrderLine[];
  store_id?: number;
  tipo_entrega?: string;
  descuento_global?: number;
}

let mockOrderCounter = 1000;
// MOCK: orden en memoria para que TrackOrder/OrderDetails funcionen sin backend.
const mockOrders = new Map<number, Order>();

export const orderService = {
  async createOrder(input: CreateOrderInput): Promise<Order> {
    if (USE_MOCKS) {
      const id = ++mockOrderCounter;
      const order: Order = {
        id_vent: id,
        montofinal_vent: input.items.reduce((sum, i) => sum + i.cantidad * i.precio_unit, 0),
        estado: 'pendiente',
        metodopago_usu: input.metodopago_usu || 'kiosco',
        store_id: input.store_id,
        tipo_entrega: input.tipo_entrega,
        fecha_vent: new Date().toISOString(),
        items: input.items,
      };
      mockOrders.set(id, order);
      return order;
    }
    return apiFetch<Order>('/orders', {
      method: 'POST',
      body: input,
    });
  },

  async getOrderById(id: number): Promise<Order> {
    if (USE_MOCKS) {
      return mockOrders.get(id) ?? { id_vent: id, estado: 'pendiente', montofinal_vent: 0, items: [] };
    }
    return apiFetch<Order>(`/orders/${id}`);
  },

  async updateOrderStatus(id: number, estado: string): Promise<Order> {
    if (USE_MOCKS) {
      const existing = mockOrders.get(id);
      const order: Order = { ...(existing ?? { id_vent: id }), estado };
      mockOrders.set(id, order);
      return order;
    }
    return apiFetch<Order>(`/orders/${id}/status`, { method: 'PUT', body: { estado } });
  },

  /**
   * Genera la sesión de pago (Wompi) para una orden y devuelve la URL de checkout.
   */
  async createCheckoutUrl(orderId: number, redirectUrl: string): Promise<string> {
    if (USE_MOCKS) {
      // MOCK: no hay pago real; redirige a la pantalla de éxito local.
      return redirectUrl;
    }
    const json = await apiFetch<{ checkout_url?: string; checkoutUrl?: string; url?: string }>(
      `/orders/checkout/${orderId}`,
      { method: 'POST', body: { redirect_url: redirectUrl } },
    );
    return json.checkout_url || json.checkoutUrl || json.url || '';
  },
};
