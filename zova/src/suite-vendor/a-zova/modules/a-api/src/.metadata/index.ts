// eslint-disable
/** bean: begin */
export * from '../bean/bean.apiBase.js';

import 'zova';
declare module 'zova' {
  
  
}
declare module 'zova-module-a-api' {
   
}
/** bean: end */
/** bean: begin */
import { BeanApiBase } from '../bean/bean.apiBase.js';
import 'zova';
declare module 'zova' {
  export interface IBeanRecordGeneral {
    'a-api.bean.apiBase': BeanApiBase;
  }
}
/** bean: end */
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
export class ScopeModuleAApi extends BeanScopeBase {}

export interface ScopeModuleAApi {
  util: BeanScopeUtil;
config: TypeModuleConfig<typeof config>;
}

import 'zova';
declare module 'zova' {
  export interface IBeanScopeRecord {
    'a-api': ScopeModuleAApi;
  }
  
  export interface IBeanScopeConfig {
    'a-api': ReturnType<typeof config>;
  }

  

  
}
  
/** scope: end */
