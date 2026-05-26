export type PrefixKeys<T, P extends string> = Extract<keyof T, `${P}${string}`>;
