export const SymbolStaticGetFullPathInner = Symbol('SymbolStaticGetFullPathInner');

declare module 'vona' {
  export interface ContextState {
    staticFileServed?: boolean;
  }
}

declare module 'vona-module-a-meta' {
  export interface IMetaNameRecord {
    static: never;
  }
}
