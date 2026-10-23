// eslint-disable
/** bean: begin */
export * from '../bean/bean.modelBase.ts';

import 'zova';
declare module 'zova' {


}
declare module 'zova-module-a-model' {

}
/** bean: end */
/** bean: begin */
import type { BeanModelBase } from '../bean/bean.modelBase.ts';
import 'zova';
declare module 'zova' {
  export interface IBeanRecordGeneral {
    'a-model.bean.modelBase': BeanModelBase;
  }
}
/** bean: end */
/** service: begin */
export * from '../service/storage.ts';

import 'zova-module-a-bean';
declare module 'zova-module-a-bean' {

    export interface IServiceRecord {
      'a-model:storage': never;
    }


}
declare module 'zova-module-a-model' {

        export interface ServiceStorage {
          /** @internal */
          get scope(): ScopeModuleAModel;
        }

        export interface ServiceStorage {
          get $beanFullName(): 'a-model.service.storage';
          get $onionName(): 'a-model:storage';

        }
}
/** service: end */
/** service: begin */
import type { ServiceStorage } from '../service/storage.ts';
import 'zova';
declare module 'zova' {
  export interface IBeanRecordGeneral {
    'a-model.service.storage': ServiceStorage;
  }
}
/** service: end */
/** config: begin */
export * from '../config/config.ts';
import { config } from '../config/config.ts';
/** config: end */
/** monkey: begin */
export * from '../monkey.ts';
/** monkey: end */
/** scope: begin */
import { BeanScopeBase, type BeanScopeUtil, TypeModuleConfig } from 'zova';
import { Scope } from 'zova-module-a-bean';

@Scope()
export class ScopeModuleAModel extends BeanScopeBase {}

export interface ScopeModuleAModel {
  util: BeanScopeUtil;
config: TypeModuleConfig<typeof config>;
}

import 'zova';
declare module 'zova' {
  export interface IBeanScopeRecord {
    'a-model': ScopeModuleAModel;
  }

  export interface IBeanScopeConfig {
    'a-model': ReturnType<typeof config>;
  }




}

/** scope: end */
