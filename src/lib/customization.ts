/** MOCK: adiciones de bebida (el backend no expone variantes/toppings aún). */
export const TOPPINGS = [
  { id: 'espresso', name: 'Espresso extra', price: 5000 },
  { id: 'jelly', name: 'Coffee jelly', price: 3000 },
  { id: 'icecream', name: 'Helado de chocolate', price: 7000 },
  { id: 'caramelo', name: 'Shot de caramelo', price: 2500 },
];

export function toppingsPrice(ids: string[] = []): number {
  return ids.reduce((acc, id) => acc + (TOPPINGS.find((t) => t.id === id)?.price ?? 0), 0);
}

export function toppingNames(ids: string[] = []): string[] {
  return ids.map((id) => TOPPINGS.find((t) => t.id === id)?.name).filter((n): n is string => Boolean(n));
}
