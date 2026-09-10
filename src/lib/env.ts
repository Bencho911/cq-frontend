/**
 * Configuración de entorno del cliente (solo claves con prefijo VITE_).
 *
 * - VITE_API_URL: base del API Gateway (por defecto `/api`; en dev apunta a
 *   `http://localhost:3000/api`).
 * - VITE_KIOSK_API_KEY: llave pública del kiosco para pedidos sin JWT.
 * - VITE_USE_MOCKS: si es `true` (por defecto) los servicios caen a datos
 *   locales etiquetados como mock cuando el backend no está disponible.
 */
const env = import.meta.env;

export const API_BASE_URL: string = (() => {
  const raw = env.VITE_API_URL;
  if (raw === undefined || raw === null || String(raw).trim() === '') {
    if (env.DEV) return 'http://localhost:3000/api';
    return '/api';
  }
  return String(raw).trim().replace(/\/$/, '') || '/api';
})();

export const KIOSK_API_KEY: string = env.VITE_KIOSK_API_KEY
  ? String(env.VITE_KIOSK_API_KEY)
  : '';

export const USE_MOCKS: boolean = env.VITE_USE_MOCKS !== 'false';
