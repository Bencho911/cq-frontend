import { API_BASE_URL } from './env';

/**
 * Resuelve la URL de imagen del producto.
 * - Si ya es absoluta (http/data) se usa tal cual.
 * - Si es una ruta servida por el gateway (/uploads/...), se antepone el origen del API.
 */
export function resolveImageUrl(path?: string | null): string {
  if (!path) return '';
  if (path.startsWith('http') || path.startsWith('data:')) return path;
  if (path.startsWith('/uploads')) {
    const origin = API_BASE_URL.replace(/\/api\/?$/, '');
    return `${origin}${path}`;
  }
  return path;
}
