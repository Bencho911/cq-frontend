import { apiFetch } from './api';
import { USE_MOCKS } from './env';

export interface CrossSellingRecommendation {
  product_id: number;
  name: string;
  confidence: number;
}

export const aiService = {
  /**
   * Recomendaciones de cross-selling del ai-service para el carrito actual.
   * En modo mock (o sin backend) no hay recomendaciones.
   */
  async getCrossSelling(cartProductIds: number[]): Promise<CrossSellingRecommendation[]> {
    if (USE_MOCKS || cartProductIds.length === 0) return [];
    try {
      const json = await apiFetch<{ recommendations?: CrossSellingRecommendation[] }>(
        '/ai/cross-selling/recommend',
        { method: 'POST', body: { cart_items: cartProductIds } },
      );
      return json.recommendations ?? [];
    } catch (err) {
      console.warn('[aiService] getCrossSelling:', err);
      return [];
    }
  },
};
