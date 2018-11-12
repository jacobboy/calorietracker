export function scaleQuantity(q: number, from: number, to: number): number {
  const sigFigs = 100;
  const newQ = Math.round(sigFigs * q * to / from) / sigFigs;
  if (isNaN(newQ)) {
    // console.log(`Scale quantity received ${[q, from, to]}, returning 0`);
    return 0;
  }
  return newQ;
}
