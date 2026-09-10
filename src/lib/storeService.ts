import { apiFetch } from './api';
import { USE_MOCKS } from './env';
import { MOCK_STORES } from './mockData';
import type { Store } from './types';

function normalizeStore(raw: Record<string, unknown>): Store {
  return {
    id_tienda: Number(raw.id_tienda ?? raw.id ?? 0),
    nombre: String(raw.nombre ?? ''),
    direccion: String(raw.direccion ?? ''),
    telefono: raw.telefono ? String(raw.telefono) : null,
    estado: String(raw.estado ?? 'CERRADO').toUpperCase(),
    activa: Boolean(raw.activa ?? true),
    latitud: raw.latitud != null ? Number(raw.latitud) : null,
    longitud: raw.longitud != null ? Number(raw.longitud) : null,
    ciudad_nombre: raw.ciudad_nombre ? String(raw.ciudad_nombre) : undefined,
  };
}

export const storeService = {
  async getStores(): Promise<Store[]> {
    if (USE_MOCKS) return MOCK_STORES;
    try {
      const json = await apiFetch<{ data?: unknown[] }>('/stores');
      return (json.data ?? []).map((r) => normalizeStore(r as Record<string, unknown>));
    } catch (err) {
      console.warn('[storeService] getStores → mock:', err);
      return MOCK_STORES;
    }
  },
};
