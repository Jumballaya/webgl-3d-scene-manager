export const epsilon = 0.00001;
export function numbers_equal(a: number, b: number): boolean {
  return Math.abs(a - b) < epsilon;
}
