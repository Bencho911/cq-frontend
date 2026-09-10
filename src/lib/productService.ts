import { apiFetch } from './api';
import { USE_MOCKS } from './env';
import { MOCK_CATEGORIES, MOCK_PRODUCTS } from './mockData';
import type { Category, Product } from './types';

/** Normaliza la respuesta del microservicio de productos (robusto a alias de campo). */
function normalizeProduct(raw: Record<string, unknown>): Product {
  const cats = Array.isArray(raw.fk_cod_cats)
    ? (raw.fk_cod_cats as unknown[]).map(Number).filter((n) => !Number.isNaN(n))
    : [];
  return {
    cod_prod: Number(raw.cod_prod ?? raw.id ?? 0),
    nom_prod: String(raw.nom_prod ?? raw.nombre ?? ''),
    desc_prod: String(raw.desc_prod ?? raw.descrip_prod ?? ''),
    precio_unitario: Number(raw.precio_unitario ?? raw.precio_prod ?? raw.precio ?? 0),
    descuento: raw.descuento !== undefined && raw.descuento !== null ? Number(raw.descuento) : undefined,
    url_imagen: raw.url_imagen ? String(raw.url_imagen) : null,
    codigo_barras: raw.codigo_barras ? String(raw.codigo_barras) : null,
    fechaven_prod: raw.fechaven_prod ? String(raw.fechaven_prod) : null,
    fk_cod_cats: cats.length ? cats : undefined,
    stock_actual: Number(raw.stock_actual ?? 0),
    stock_minimo: Number(raw.stock_minimo ?? 0),
    categoria: raw.categoria as Product['categoria'],
  };
}

function normalizeCategory(raw: Record<string, unknown>): Category {
  return {
    cod_cat: Number(raw.cod_cat ?? raw.id ?? 0),
    nom_cat: String(raw.nom_cat ?? raw.nombre ?? ''),
    desc_cat: raw.desc_cat ? String(raw.desc_cat) : undefined,
  };
}

export const productService = {
  async getProducts(storeId?: number): Promise<Product[]> {
    if (USE_MOCKS) return MOCK_PRODUCTS;
    try {
      const qs = storeId ? `?store_id=${storeId}&limit=100` : '?limit=100';
      const json = await apiFetch<{ data?: unknown[] }>(`/public/products${qs}`);
      return (json.data ?? []).map((r) => normalizeProduct(r as Record<string, unknown>));
    } catch (err) {
      console.warn('[productService] getProducts → mock:', err);
      return MOCK_PRODUCTS;
    }
  },

  async getCategories(): Promise<Category[]> {
    if (USE_MOCKS) return MOCK_CATEGORIES;
    try {
      const json = await apiFetch<{ data?: unknown[] }>('/public/categories?limit=100');
      return (json.data ?? []).map((r) => normalizeCategory(r as Record<string, unknown>));
    } catch (err) {
      console.warn('[productService] getCategories → mock:', err);
      return MOCK_CATEGORIES;
    }
  },

  async getProductById(id: number): Promise<Product | null> {
    if (USE_MOCKS) return MOCK_PRODUCTS.find((p) => p.cod_prod === id) ?? null;
    try {
      const json = await apiFetch<Record<string, unknown>>(`/public/products/${id}`);
      return normalizeProduct(json);
    } catch (err) {
      console.warn('[productService] getProductById → mock:', err);
      return MOCK_PRODUCTS.find((p) => p.cod_prod === id) ?? null;
    }
  },
};
