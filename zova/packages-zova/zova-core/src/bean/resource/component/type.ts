export type TypeModuleComponents<T> = T;

export interface IZovaComponentRecord {}

export interface IComponentRecord {}

export interface ILayoutRecord {
  empty: never;
  default: never;
  // maybe need not admin/web/mobile, just set default to specific layout component
  // admin: never;
  // web: never;
  // mobile: never;
}

export type TypeComponentRecordSelector<PREFIX extends string> = {
  [K in keyof IComponentRecord as K extends `${string}:${PREFIX}${string}`
    ? K
    : never]: IComponentRecord[K];
};
export type TypeComponentRecordSelectorKeys<PREFIX extends string> =
  keyof TypeComponentRecordSelector<PREFIX>;

export type TypeComponentRecordSelectorStrict<PREFIX extends string> = {
  [K in keyof IComponentRecord as K extends `${string}:${PREFIX}` ? K : never]: IComponentRecord[K];
};
export type TypeComponentRecordSelectorKeysStrict<PREFIX extends string> =
  keyof TypeComponentRecordSelectorStrict<PREFIX>;

export type TypeComponentLayoutRecord = TypeComponentRecordSelector<'layout'>;
export type TypeComponentAppRecord = TypeComponentRecordSelector<'app'>;
