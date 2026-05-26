import type { PartialDeep } from '@cabloy/type-fest';

export type PowerPartial<T> = PartialDeep<
  T,
  { recurseIntoArrays: true; allowUndefinedInNonTupleArrays: false }
>;
// export type PowerPartial<T> = {
//   [U in keyof T]?:
//   T[U] extends (...args: any) => any
//     ? (...args: Parameters<T[U]>) => PowerPartialFunctionResult<ReturnType<T[U]>>
//     : T[U] extends object ? PowerPartial<T[U]> : T[U];
// };

// type PowerPartialFunctionResult<T> = T extends Promise<infer R> ? Promise<PowerPartial<R>> : PowerPartial<T>;
