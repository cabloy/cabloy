import type { WatchSource } from 'vue';

export type MaybeUndefined<T, I> = I extends true ? T | undefined : T;
export type MapSources<T, Immediate> = {
  [K in keyof T]: T[K] extends WatchSource<infer V>
    ? MaybeUndefined<V, Immediate>
    : T[K] extends object
      ? MaybeUndefined<T[K], Immediate>
      : never;
};
