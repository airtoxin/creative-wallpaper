export const range = (size: number): number[] =>
  Array.from(Array(size)).map((_, i) => i);

export const choose = <T>(arr: T[]): T =>
  arr[Math.floor(Math.random() * arr.length)];
