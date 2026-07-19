export const VAT_RATE = 0.05;

export function calculateVat(subtotal: number): number {
  return round2(subtotal * VAT_RATE);
}

export function round2(value: number): number {
  return Math.round(value * 100) / 100;
}
