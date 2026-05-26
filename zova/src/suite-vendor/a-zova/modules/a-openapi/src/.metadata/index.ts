// eslint-disable
/** model: begin */
export * from '../model/sdk.js';
import { IModelOptionsSdk } from '../model/sdk.js';
import 'zova-module-a-model';
declare module 'zova-module-a-model' {
  
    export interface IModelRecord {
      'a-openapi:sdk': IModelOptionsSdk;
    }

  
}
declare module 'zova-module-a-openapi' {
  
        export interface ModelSdk {
          /** @internal */
          get scope(): ScopeModuleAOpenapi;
        }

        export interface ModelSdk {
          get $beanFullName(): 'a-openapi.model.sdk';
          get $onionName(): 'a-openapi:sdk';
          get $onionOptions(): IModelOptionsSdk;
        } 
}
/** model: end */
/** model: begin */
import { ModelSdk } from '../model/sdk.js';
import 'zova';
declare module 'zova' {
  export interface IBeanRecordGeneral {
    'a-openapi.model.sdk': ModelSdk;
  }
}
/** model: end */
/** sys: begin */
export * from '../bean/sys.sdk.js';

import 'zova';
declare module 'zova' {
  
  
}
declare module 'zova-module-a-openapi' {
  
        export interface SysSdk {
          /** @internal */
          get scope(): ScopeModuleAOpenapi;
        }

        export interface SysSdk {
          get $beanFullName(): 'a-openapi.sys.sdk';
          get $onionName(): 'a-openapi:sdk';
          
        } 
}
/** sys: end */
/** sys: begin */
import { SysSdk } from '../bean/sys.sdk.js';
import 'zova';
declare module 'zova' {
  export interface IBeanRecordGeneral {
    'a-openapi.sys.sdk': SysSdk;
  }
}
/** sys: end */
/** config: begin */
export * from '../config/config.js';
import { config } from '../config/config.js';
/** config: end */
/** monkey: begin */
export * from '../monkey.js';
/** monkey: end */
/** scope: begin */
import { BeanScopeBase, type BeanScopeUtil, TypeModuleConfig } from 'zova';
import { Scope } from 'zova-module-a-bean';

@Scope()
export class ScopeModuleAOpenapi extends BeanScopeBase {}

export interface ScopeModuleAOpenapi {
  util: BeanScopeUtil;
config: TypeModuleConfig<typeof config>;
}

import 'zova';
declare module 'zova' {
  export interface IBeanScopeRecord {
    'a-openapi': ScopeModuleAOpenapi;
  }
  
  export interface IBeanScopeConfig {
    'a-openapi': ReturnType<typeof config>;
  }

  

  
}
  
/** scope: end */
