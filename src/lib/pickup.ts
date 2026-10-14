/**
 * Hora de recogida. Se guarda como fecha ISO (formato estándar para el
 * backend) y se muestra en formato local ("3:30 p. m."). `null` significa
 * "lo antes posible".
 */

/** "3:30 p. m." */
export function formatPickup(iso: string): string {
  const d = new Date(iso);
  const h = d.getHours();
  const m = d.getMinutes().toString().padStart(2, '0');
  return `${h % 12 || 12}:${m} ${h < 12 ? 'a. m.' : 'p. m.'}`;
}

/**
 * Hora válida solo si es una fecha ISO futura. Una hora que ya pasó (el
 * carrito se guarda entre visitas) o un valor del formato anterior vuelve
 * a "lo antes posible".
 */
export function upcomingPickup(value: string | null, now: Date = new Date()): string | null {
  if (!value) return null;
  const t = Date.parse(value);
  return Number.isFinite(t) && t > now.getTime() ? value : null;
}
