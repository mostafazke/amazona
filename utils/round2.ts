export const round2 = (num: number): number =>
  Math.round(num * 100 + Number.EPSILON) / 100;
