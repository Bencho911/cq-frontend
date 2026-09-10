const copFormatter = new Intl.NumberFormat('es-CO', {
  style: 'currency',
  currency: 'COP',
  maximumFractionDigits: 0,
});

/** Formatea un monto en pesos colombianos, p. ej. $25.000. */
export function formatCOP(value: number): string {
  return copFormatter.format(value || 0);
}

/** Precio con descuento aplicado (descuento en porcentaje 0..100). */
export function discountedPrice(price: number, discount?: number): number {
  if (!discount) return price;
  return Math.round(price * (1 - discount / 100));
}
