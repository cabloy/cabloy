import type { ScopeModuleAOrm } from '../.metadata/index.ts';

declare module 'vona-module-a-orm' {
  export interface ServiceDb {
    /** @internal */
    get scope(): ScopeModuleAOrm;
  }

  export interface ServiceDatabaseClient {
    /** @internal */
    get scope(): ScopeModuleAOrm;
  }

  export interface ServiceColumns {
    /** @internal */
    get scope(): ScopeModuleAOrm;
  }

  export interface ServiceColumnsCache {
    /** @internal */
    get scope(): ScopeModuleAOrm;
  }
}
