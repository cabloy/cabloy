// eslint-disable
/** interceptor: begin */
export * from '../bean/interceptor.datasharding.ts';
import type { IInterceptorOptionsDatasharding } from '../bean/interceptor.datasharding.ts';
import 'vona-module-a-aspect';
declare module 'vona-module-a-aspect' {
  
    export interface IInterceptorRecordGlobal {
      'a-datasharding:datasharding': IInterceptorOptionsDatasharding;
    }

  
}
declare module 'vona-module-a-datasharding' {
  
        export interface InterceptorDatasharding {
          /** @internal */
          get scope(): ScopeModuleADatasharding;
        }

          export interface InterceptorDatasharding {
            get $beanFullName(): 'a-datasharding.interceptor.datasharding';
            get $onionName(): 'a-datasharding:datasharding';
            get $onionOptions(): IInterceptorOptionsDatasharding;
          } 
}
/** interceptor: end */
/** bean: begin */
export * from '../bean/bean.datasharding.ts';

import 'vona';
declare module 'vona' {
  
  
}
declare module 'vona-module-a-datasharding' {
  
        export interface BeanDatasharding {
          /** @internal */
          get scope(): ScopeModuleADatasharding;
        } 
}
/** bean: end */
/** bean: begin */
import type { BeanDatasharding } from '../bean/bean.datasharding.ts';
import 'vona';  
declare module 'vona' {
  export interface IBeanRecordGlobal {
    'datasharding': BeanDatasharding;
  }
}
/** bean: end */
/** service: begin */
export * from '../service/datasharding.ts';

import 'vona-module-a-bean';
declare module 'vona-module-a-bean' {
  
    export interface IServiceRecord {
      'a-datasharding:datasharding': never;
    }

  
}
declare module 'vona-module-a-datasharding' {
  
        export interface ServiceDatasharding {
          /** @internal */
          get scope(): ScopeModuleADatasharding;
        }

          export interface ServiceDatasharding {
            get $beanFullName(): 'a-datasharding.service.datasharding';
            get $onionName(): 'a-datasharding:datasharding';
            
          } 
}
/** service: end */
/** service: begin */
import type { ServiceDatasharding } from '../service/datasharding.ts';
export interface IModuleService {
  'datasharding': ServiceDatasharding;
}
/** service: end */
/** service: begin */

import 'vona';
declare module 'vona' {
  export interface IBeanRecordGeneral {
    'a-datasharding.service.datasharding': ServiceDatasharding;
  }
}
/** service: end */
/** eventListener: begin */
export * from '../bean/eventListener.clientNameReal.ts';

import { type IDecoratorEventListenerOptions } from 'vona-module-a-event';
declare module 'vona-module-a-event' {
  
    export interface IEventListenerRecord {
      'a-datasharding:clientNameReal': IDecoratorEventListenerOptions;
    }

  
}
declare module 'vona-module-a-datasharding' {
  
        export interface EventListenerClientNameReal {
          /** @internal */
          get scope(): ScopeModuleADatasharding;
        }

          export interface EventListenerClientNameReal {
            get $beanFullName(): 'a-datasharding.eventListener.clientNameReal';
            get $onionName(): 'a-datasharding:clientNameReal';
            get $onionOptions(): IDecoratorEventListenerOptions;
          } 
}
/** eventListener: end */
/** summerCache: begin */
export * from '../bean/summerCache.datasourceWrite.ts';

import { type IDecoratorSummerCacheOptions } from 'vona-module-a-summer';
declare module 'vona-module-a-summer' {
  
    export interface ISummerCacheRecord {
      'a-datasharding:datasourceWrite': IDecoratorSummerCacheOptions;
    }

  
}
declare module 'vona-module-a-datasharding' {
  
        export interface SummerCacheDatasourceWrite {
          /** @internal */
          get scope(): ScopeModuleADatasharding;
        }

          export interface SummerCacheDatasourceWrite {
            get $beanFullName(): 'a-datasharding.summerCache.datasourceWrite';
            get $onionName(): 'a-datasharding:datasourceWrite';
            get $onionOptions(): IDecoratorSummerCacheOptions;
          } 
}
/** summerCache: end */
/** summerCache: begin */
import type { SummerCacheDatasourceWrite } from '../bean/summerCache.datasourceWrite.ts';
export interface IModuleSummerCache {
  'datasourceWrite': SummerCacheDatasourceWrite;
}
/** summerCache: end */
/** config: begin */
export * from '../config/config.ts';
import type { config } from '../config/config.ts';
/** config: end */
/** scope: begin */
import { BeanScopeBase, type BeanScopeUtil, type TypeModuleConfig } from 'vona';
import { Scope } from 'vona-module-a-bean';

@Scope()
export class ScopeModuleADatasharding extends BeanScopeBase {}

export interface ScopeModuleADatasharding {
  util: BeanScopeUtil;
config: TypeModuleConfig<typeof config>;
service: IModuleService;
summerCache: IModuleSummerCache;
}

import 'vona';
declare module 'vona' {
  export interface IBeanScopeRecord {
    'a-datasharding': ScopeModuleADatasharding;
  }

  export interface IBeanScopeContainer {
    datasharding: ScopeModuleADatasharding;
  }
  
  export interface IBeanScopeConfig {
    'a-datasharding': ReturnType<typeof config>;
  }

  

  
}
/** scope: end */
