// eslint-disable
/** filter: begin */
export * from '../bean/filter.error.ts';
import type { IFilterOptionsError } from '../bean/filter.error.ts';
import 'vona-module-a-aspect';
declare module 'vona-module-a-aspect' {
  
    export interface IFilterRecordGlobal {
      'a-error:error': IFilterOptionsError;
    }

  
}
declare module 'vona-module-a-error' {
  
        export interface FilterError {
          /** @internal */
          get scope(): ScopeModuleAError;
        }

          export interface FilterError {
            get $beanFullName(): 'a-error.filter.error';
            get $onionName(): 'a-error:error';
            get $onionOptions(): IFilterOptionsError;
          } 
}
/** filter: end */
/** bean: begin */
export * from '../bean/bean.error.ts';

import 'vona';
declare module 'vona' {
  
  
}
declare module 'vona-module-a-error' {
  
        export interface BeanError {
          /** @internal */
          get scope(): ScopeModuleAError;
        } 
}
/** bean: end */
/** bean: begin */
import type { BeanError } from '../bean/bean.error.ts';
import 'vona';  
declare module 'vona' {
  export interface IBeanRecordGlobal {
    'error': BeanError;
  }
}
/** bean: end */
/** service: begin */
export * from '../service/errorView.ts';

import 'vona-module-a-bean';
declare module 'vona-module-a-bean' {
  
    export interface IServiceRecord {
      'a-error:errorView': never;
    }

  
}
declare module 'vona-module-a-error' {
  
        export interface ServiceErrorView {
          /** @internal */
          get scope(): ScopeModuleAError;
        }

          export interface ServiceErrorView {
            get $beanFullName(): 'a-error.service.errorView';
            get $onionName(): 'a-error:errorView';
            
          } 
}
/** service: end */
/** service: begin */
import type { ServiceErrorView } from '../service/errorView.ts';
export interface IModuleService {
  'errorView': ServiceErrorView;
}
/** service: end */
/** service: begin */

import 'vona';
declare module 'vona' {
  export interface IBeanRecordGeneral {
    'a-error.service.errorView': ServiceErrorView;
  }
}
/** service: end */
/** meta: begin */
export * from '../bean/meta.asset.ts';

import 'vona-module-a-meta';
declare module 'vona-module-a-meta' {
  
    export interface IMetaRecord {
      'a-error:asset': never;
    }

  
}
declare module 'vona-module-a-error' {
  
        export interface MetaAsset {
          /** @internal */
          get scope(): ScopeModuleAError;
        }

          export interface MetaAsset {
            get $beanFullName(): 'a-error.meta.asset';
            get $onionName(): 'a-error:asset';
            
          } 
}
/** meta: end */
/** meta asset: begin */
import type { MetaAsset } from '../bean/meta.asset.ts';
/** meta asset: end */
/** config: begin */
export * from '../config/config.ts';
import type { config } from '../config/config.ts';
/** config: end */
/** main: begin */
export * from '../main.ts';
/** main: end */
/** scope: begin */
import { BeanScopeBase, type BeanScopeUtil, type TypeModuleConfig } from 'vona';
import { Scope } from 'vona-module-a-bean';

@Scope()
export class ScopeModuleAError extends BeanScopeBase {}

export interface ScopeModuleAError {
  util: BeanScopeUtil;
config: TypeModuleConfig<typeof config>;
service: IModuleService;
asset: MetaAsset;
}

import 'vona';
declare module 'vona' {
  export interface IBeanScopeRecord {
    'a-error': ScopeModuleAError;
  }

  export interface IBeanScopeContainer {
    error: ScopeModuleAError;
  }
  
  export interface IBeanScopeConfig {
    'a-error': ReturnType<typeof config>;
  }

  

  
}
/** scope: end */
