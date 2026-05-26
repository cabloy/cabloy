// eslint-disable
/** bean: begin */
export * from '../bean/bean.theme.js';

import 'zova';
declare module 'zova' {
  
  
}
declare module 'zova-module-a-style' {
  
        export interface BeanTheme {
          /** @internal */
          get scope(): ScopeModuleAStyle;
        }

        export interface BeanTheme {
          get $beanFullName(): 'a-style.bean.theme';
          get $onionName(): 'a-style:theme';
          
        } 
}
/** bean: end */
/** bean: begin */
import { BeanTheme } from '../bean/bean.theme.js';
import 'zova';
declare module 'zova' {
  export interface IBeanRecordGeneral {
    'a-style.bean.theme': BeanTheme;
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
export class ScopeModuleAStyle extends BeanScopeBase {}

export interface ScopeModuleAStyle {
  util: BeanScopeUtil;
config: TypeModuleConfig<typeof config>;
}

import 'zova';
declare module 'zova' {
  export interface IBeanScopeRecord {
    'a-style': ScopeModuleAStyle;
  }
  
  export interface IBeanScopeConfig {
    'a-style': ReturnType<typeof config>;
  }

  

  
}
  
/** scope: end */
