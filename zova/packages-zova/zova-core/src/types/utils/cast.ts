export function cast<T = any>(source: unknown) {
  return source as T;
}

declare global {
  function parseInt(num: number, radix?: number): number;
  function parseInt(num: any, radix?: number): number;
}
