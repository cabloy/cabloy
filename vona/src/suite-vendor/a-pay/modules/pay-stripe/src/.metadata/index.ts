// eslint-disable
/** bean: begin */
export * from '../bean/bean.payProviderStripe.ts';

import 'vona';
declare module 'vona' {
  
  
}
declare module 'vona-module-pay-stripe' {
  
        export interface BeanPayProviderStripe {
          /** @internal */
          get scope(): ScopeModulePayStripe;
        } 
}
/** bean: end */
/** bean: begin */
import type { BeanPayProviderStripe } from '../bean/bean.payProviderStripe.ts';
import 'vona';
declare module 'vona' {
  export interface IBeanRecordGlobal {
    'payProviderStripe': BeanPayProviderStripe;
  }
}
/** bean: end */
/** config: begin */
export * from '../config/config.ts';
import type { config } from '../config/config.ts';
/** config: end */
/** scope: begin */
import { BeanScopeBase, type BeanScopeUtil, type TypeModuleConfig } from 'vona';
import { Scope } from 'vona-module-a-bean';

@Scope()
export class ScopeModulePayStripe extends BeanScopeBase {}

export interface ScopeModulePayStripe {
  util: BeanScopeUtil;
config: TypeModuleConfig<typeof config>;
}

import 'vona';
declare module 'vona' {
  export interface IBeanScopeRecord {
    'pay-stripe': ScopeModulePayStripe;
  }

  export interface IBeanScopeContainer {
    payStripe: ScopeModulePayStripe;
  }
  
  export interface IBeanScopeConfig {
    'pay-stripe': ReturnType<typeof config>;
  }

  

  
}
/** scope: end */
