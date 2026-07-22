export type TypeContextFetch = typeof globalThis.fetch;

declare module 'vona' {
  export interface ContextState {
    fetch?: TypeContextFetch;
  }
}
