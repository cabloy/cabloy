// eslint-disable
import type { TypeControllerOptionsActions } from 'vona-module-a-openapi';
/** meta: begin */
export * from '../bean/meta.printTip.ts';

import 'vona-module-a-meta';
declare module 'vona-module-a-meta' {
  
    export interface IMetaRecord {
      'a-swagger:printTip': never;
    }

  
}
declare module 'vona-module-a-swagger' {
  
        export interface MetaPrintTip {
          /** @internal */
          get scope(): ScopeModuleASwagger;
        }

          export interface MetaPrintTip {
            get $beanFullName(): 'a-swagger.meta.printTip';
            get $onionName(): 'a-swagger:printTip';
            
          } 
}
/** meta: end */
/** summerCache: begin */
export * from '../bean/summerCache.rapidoc.ts';
export * from '../bean/summerCache.swagger.ts';

import { type IDecoratorSummerCacheOptions } from 'vona-module-a-summer';
declare module 'vona-module-a-summer' {
  
    export interface ISummerCacheRecord {
      'a-swagger:rapidoc': IDecoratorSummerCacheOptions;
'a-swagger:swagger': IDecoratorSummerCacheOptions;
    }

  
}
declare module 'vona-module-a-swagger' {
  
        export interface SummerCacheRapidoc {
          /** @internal */
          get scope(): ScopeModuleASwagger;
        }

          export interface SummerCacheRapidoc {
            get $beanFullName(): 'a-swagger.summerCache.rapidoc';
            get $onionName(): 'a-swagger:rapidoc';
            get $onionOptions(): IDecoratorSummerCacheOptions;
          }

        export interface SummerCacheSwagger {
          /** @internal */
          get scope(): ScopeModuleASwagger;
        }

          export interface SummerCacheSwagger {
            get $beanFullName(): 'a-swagger.summerCache.swagger';
            get $onionName(): 'a-swagger:swagger';
            get $onionOptions(): IDecoratorSummerCacheOptions;
          } 
}
/** summerCache: end */
/** summerCache: begin */
import type { SummerCacheRapidoc } from '../bean/summerCache.rapidoc.ts';
import type { SummerCacheSwagger } from '../bean/summerCache.swagger.ts';
export interface IModuleSummerCache {
  'rapidoc': SummerCacheRapidoc;
'swagger': SummerCacheSwagger;
}
/** summerCache: end */
/** controller: begin */
export * from '../controller/rapidoc.ts';
export * from '../controller/swagger.ts';
import type { IControllerOptionsRapidoc } from '../controller/rapidoc.ts';
import type { IControllerOptionsSwagger } from '../controller/swagger.ts';
import 'vona-module-a-web';
declare module 'vona-module-a-web' {
  
    export interface IControllerRecord {
      'a-swagger:rapidoc': IControllerOptionsRapidoc;
'a-swagger:swagger': IControllerOptionsSwagger;
    }

  
}
declare module 'vona-module-a-swagger' {
  
        export interface ControllerRapidoc {
          /** @internal */
          get scope(): ScopeModuleASwagger;
        }

          export interface ControllerRapidoc {
            get $beanFullName(): 'a-swagger.controller.rapidoc';
            get $onionName(): 'a-swagger:rapidoc';
            get $onionOptions(): IControllerOptionsRapidoc;
          }

        export interface ControllerSwagger {
          /** @internal */
          get scope(): ScopeModuleASwagger;
        }

          export interface ControllerSwagger {
            get $beanFullName(): 'a-swagger.controller.swagger';
            get $onionName(): 'a-swagger:swagger';
            get $onionOptions(): IControllerOptionsSwagger;
          } 
}
/** controller: end */
/** controller: begin */
// @ts-ignore ignore
import type { ControllerRapidoc } from '../controller/rapidoc.ts';
// @ts-ignore ignore
import type { ControllerSwagger } from '../controller/swagger.ts';
declare module 'vona-module-a-swagger' {
  
    export interface IControllerOptionsRapidoc {
      actions?: TypeControllerOptionsActions<ControllerRapidoc>;
    }

    export interface IControllerOptionsSwagger {
      actions?: TypeControllerOptionsActions<ControllerSwagger>;
    }
}
declare module 'vona-module-a-web' {
  export interface IApiPathGetRecord{
        '//rapidoc': undefined;
'//swagger': undefined;
'//swagger/json': undefined;
    }

}

/** controller: end */
/** config: begin */
export * from '../config/config.ts';
import type { config } from '../config/config.ts';
/** config: end */
/** scope: begin */
import { BeanScopeBase, type BeanScopeUtil, type TypeModuleConfig } from 'vona';
import { Scope } from 'vona-module-a-bean';

@Scope()
export class ScopeModuleASwagger extends BeanScopeBase {}

export interface ScopeModuleASwagger {
  util: BeanScopeUtil;
config: TypeModuleConfig<typeof config>;
summerCache: IModuleSummerCache;
}

import 'vona';
declare module 'vona' {
  export interface IBeanScopeRecord {
    'a-swagger': ScopeModuleASwagger;
  }

  export interface IBeanScopeContainer {
    swagger: ScopeModuleASwagger;
  }
  
  export interface IBeanScopeConfig {
    'a-swagger': ReturnType<typeof config>;
  }

  

  
}
/** scope: end */
