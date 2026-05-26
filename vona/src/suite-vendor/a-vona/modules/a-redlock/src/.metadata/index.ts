// eslint-disable
/** service: begin */
export * from '../service/redlock.ts';

import 'vona-module-a-bean';
declare module 'vona-module-a-bean' {
  
    export interface IServiceRecord {
      'a-redlock:redlock': never;
    }

  
}
declare module 'vona-module-a-redlock' {
  
        export interface ServiceRedlock {
          /** @internal */
          get scope(): ScopeModuleARedlock;
        }

          export interface ServiceRedlock {
            get $beanFullName(): 'a-redlock.service.redlock';
            get $onionName(): 'a-redlock:redlock';
            
          } 
}
/** service: end */
/** service: begin */
import type { ServiceRedlock } from '../service/redlock.ts';
export interface IModuleService {
  'redlock': ServiceRedlock;
}
/** service: end */
/** service: begin */

import 'vona';
declare module 'vona' {
  export interface IBeanRecordGeneral {
    'a-redlock.service.redlock': ServiceRedlock;
  }
}
/** service: end */
/** config: begin */
export * from '../config/config.ts';
import type { config } from '../config/config.ts';
/** config: end */
/** scope: begin */
import { BeanScopeBase, type BeanScopeUtil, type TypeModuleConfig } from 'vona';
import { Scope } from 'vona-module-a-bean';

@Scope()
export class ScopeModuleARedlock extends BeanScopeBase {}

export interface ScopeModuleARedlock {
  util: BeanScopeUtil;
config: TypeModuleConfig<typeof config>;
service: IModuleService;
}

import 'vona';
declare module 'vona' {
  export interface IBeanScopeRecord {
    'a-redlock': ScopeModuleARedlock;
  }

  export interface IBeanScopeContainer {
    redlock: ScopeModuleARedlock;
  }
  
  export interface IBeanScopeConfig {
    'a-redlock': ReturnType<typeof config>;
  }

  

  
}
/** scope: end */
