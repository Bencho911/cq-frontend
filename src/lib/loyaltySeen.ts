import type { LoyaltyAccount } from './loyalty';

/**
 * Último saldo que el cliente vio en su álbum. Sirve para animar solo lo
 * que cambió desde la visita anterior: los puntos nuevos y las aves nuevas.
 */
const STORAGE_KEY = 'cq.loyalty.seen';

export function readSeen(): LoyaltyAccount | null {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as LoyaltyAccount) : null;
  } catch {
    return null;
  }
}

export function writeSeen(account: LoyaltyAccount) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(account));
  } catch {
    /* almacenamiento no disponible */
  }
}

/**
 * Puntos desde los que arranca la animación. La primera visita y una
 * tarjeta nueva arrancan en 0; si el saldo bajó (canje), no se anima.
 */
export function pointsFrom(seen: LoyaltyAccount | null, current: LoyaltyAccount): number {
  if (!seen || seen.completedCards !== current.completedCards) return 0;
  return Math.min(seen.points, current.points);
}
