export function scaleQuantity(q: number, from: number, to: number): number {
  return Math.round(100 * q * to / from) / 100;
}
