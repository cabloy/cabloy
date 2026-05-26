import type { ScopeModuleASummer } from '../.metadata/index.ts';

declare module 'vona-module-a-summer' {
  export interface ServiceLocalMem {
    /** @internal */
    get scope(): ScopeModuleASummer;
  }
}
