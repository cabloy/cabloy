export type PowerPartial<T> = {
  [U in keyof T]?: T[U] extends Function ? T[U] : T[U] extends object ? PowerPartial<T[U]> : T[U];
};
