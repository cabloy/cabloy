// eslint-disable
/** model: begin */
export * from '../model/passport.js';
import { IModelOptionsPassport } from '../model/passport.js';
import 'zova-module-a-model';
declare module 'zova-module-a-model' {
  
    export interface IModelRecord {
      'home-passport:passport': IModelOptionsPassport;
    }

  
}
declare module 'zova-module-home-passport' {
  
        export interface ModelPassport {
          /** @internal */
          get scope(): ScopeModuleHomePassport;
        }

        export interface ModelPassport {
          get $beanFullName(): 'home-passport.model.passport';
          get $onionName(): 'home-passport:passport';
          get $onionOptions(): IModelOptionsPassport;
        } 
}
/** model: end */
/** model: begin */
import { ModelPassport } from '../model/passport.js';
import 'zova';
declare module 'zova' {
  export interface IBeanRecordGeneral {
    'home-passport.model.passport': ModelPassport;
  }
}
/** model: end */
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
export class ScopeModuleHomePassport extends BeanScopeBase {}

export interface ScopeModuleHomePassport {
  util: BeanScopeUtil;
config: TypeModuleConfig<typeof config>;
}

import 'zova';
declare module 'zova' {
  export interface IBeanScopeRecord {
    'home-passport': ScopeModuleHomePassport;
  }
  
  export interface IBeanScopeConfig {
    'home-passport': ReturnType<typeof config>;
  }

  

  
}
  
/** scope: end */
