export type FilteredKeys<T> = {
  [K in keyof T]: T[K] extends never ? never : K;
}[keyof T];

export type RemoveNever<T> = {
  [K in FilteredKeys<T>]: T[K];
};

export type OmitNever<T> = { [K in keyof T as T[K] extends never ? never : K]: T[K] };
