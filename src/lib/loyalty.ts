/**
 * Programa de lealtad: los puntos son el sistema oficial (regla de gerencia:
 * 50 puntos = 1 bebida gratis). El álbum de aves solo los representa:
 * cada 10 puntos se gana un ave de la tarjeta actual, 5 aves por tarjeta.
 * Las aves se derivan del saldo de puntos y de las tarjetas completadas,
 * así que no requieren cambios en la regla del backend.
 */

export const POINTS_PER_REWARD = 50;
export const POINTS_PER_BIRD = 10;
export const BIRDS_PER_CARD = POINTS_PER_REWARD / POINTS_PER_BIRD;

export type StampTone = 'rosa' | 'teal' | 'mostaza' | 'rosa-soft' | 'mostaza-soft';

export interface Bird {
  id: string;
  /** Nombre provisional: validar con el equipo de marca. */
  name: string;
  image: string;
  tone: StampTone;
}

/** Orden en que se ganan las aves; al terminar la lista se repite. */
export const BIRDS: Bird[] = [
  { id: 'tucan', name: 'Tucán', image: '/brand/ave-tucan.webp', tone: 'rosa' },
  { id: 'toche', name: 'Toche', image: '/brand/ave-toche.webp', tone: 'teal' },
  { id: 'loro', name: 'Loro', image: '/brand/ave-loro.webp', tone: 'rosa-soft' },
  { id: 'martin', name: 'Martín pescador', image: '/brand/ave-martin.webp', tone: 'mostaza-soft' },
  { id: 'barranquero', name: 'Barranquero', image: '/brand/ave-barranquero.webp', tone: 'mostaza' },
  { id: 'carriqui', name: 'Carriquí', image: '/brand/ave-carriqui.webp', tone: 'teal' },
  { id: 'colibri', name: 'Colibrí', image: '/brand/ave-colibri-rosa.webp', tone: 'mostaza-soft' },
  { id: 'mirla', name: 'Mirla', image: '/brand/ave-mirla.webp', tone: 'rosa-soft' },
  { id: 'azulejo', name: 'Azulejo', image: '/brand/ave-azulejo.webp', tone: 'mostaza' },
  { id: 'cuco', name: 'Cuco', image: '/brand/ave-cuco.webp', tone: 'rosa' },
];

export interface LoyaltyAccount {
  /** Saldo de puntos de la tarjeta en curso. */
  points: number;
  /** Tarjetas completadas (bebidas ganadas) en el historial. */
  completedCards: number;
}

/**
 * MOCK: el backend aún no expone el saldo de puntos. Estos valores son los
 * mismos que usaban Perfil y Lealtad antes del rediseño.
 */
export const MOCK_ACCOUNT: LoyaltyAccount = { points: 47, completedCards: 2 };

/**
 * MOCK: regla provisional de acumulación (1 punto por cada $5.000) hasta que
 * gerencia confirme la regla real; se usa solo para anticipar en el carrito
 * cuántos puntos sumará el pedido.
 */
export function estimatePoints(total: number): number {
  return Math.floor(total / 5000);
}

export interface CardSlot {
  bird: Bird;
  earned: boolean;
  /** Puntos de la tarjeta en los que se gana esta ave (10, 20…50). */
  at: number;
}

export interface LoyaltySummary {
  points: number;
  pointsToReward: number;
  birdsEarned: number;
  /** 0..1 de avance hacia la siguiente ave. */
  progressToNextBird: number;
  nextBird: Bird | null;
  slots: CardSlot[];
  completedCards: number;
}

function cardBirds(cardIndex: number): Bird[] {
  return Array.from({ length: BIRDS_PER_CARD }, (_, i) => BIRDS[(cardIndex * BIRDS_PER_CARD + i) % BIRDS.length]);
}

export function summarize(account: LoyaltyAccount): LoyaltySummary {
  const points = Math.max(0, Math.min(account.points, POINTS_PER_REWARD));
  const birdsEarned = Math.floor(points / POINTS_PER_BIRD);
  const birds = cardBirds(account.completedCards);
  const slots = birds.map((bird, i) => ({ bird, earned: i < birdsEarned, at: (i + 1) * POINTS_PER_BIRD }));
  return {
    points,
    pointsToReward: POINTS_PER_REWARD - points,
    birdsEarned,
    progressToNextBird: birdsEarned >= BIRDS_PER_CARD ? 1 : (points % POINTS_PER_BIRD) / POINTS_PER_BIRD,
    nextBird: birdsEarned < BIRDS_PER_CARD ? birds[birdsEarned] : null,
    slots,
    completedCards: account.completedCards,
  };
}

/** Lo que pasaría con la tarjeta si se suman `earned` puntos. */
export function preview(account: LoyaltyAccount, earned: number) {
  const before = summarize(account);
  const total = account.points + earned;
  const after = summarize({ ...account, points: total });
  return {
    earned,
    total,
    completesCard: total >= POINTS_PER_REWARD,
    newBirds: before.slots.filter((s, i) => !s.earned && after.slots[i].earned).map((s) => s.bird),
  };
}
