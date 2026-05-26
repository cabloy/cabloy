// eslint-disable
/** sys: begin */
export * from '../bean/sys.onion.js';

import 'zova';
declare module 'zova' {
  
  
}
declare module 'zova-module-a-bean' {
  
        export interface SysOnion {
          /** @internal */
          get scope(): ScopeModuleABean;
        }

        export interface SysOnion {
          get $beanFullName(): 'a-bean.sys.onion';
          get $onionName(): 'a-bean:onion';
          
        } 
}
/** sys: end */
/** sys: begin */
import { SysOnion } from '../bean/sys.onion.js';
import 'zova';
declare module 'zova' {
  export interface IBeanRecordGeneral {
    'a-bean.sys.onion': SysOnion;
  }
}
/** sys: end */
/** service: begin */
export * from '../service/aop.js';
export * from '../service/onion_.js';

import 'zova-module-a-bean';
declare module 'zova-module-a-bean' {
  
    export interface IServiceRecord {
      'a-bean:aop': never;
    }

  
}
declare module 'zova-module-a-bean' {
  
        export interface ServiceAop {
          /** @internal */
          get scope(): ScopeModuleABean;
        }

        export interface ServiceAop {
          get $beanFullName(): 'a-bean.service.aop';
          get $onionName(): 'a-bean:aop';
          
        } 
}
/** service: end */
/** service: begin */
import { ServiceAop } from '../service/aop.js';
import 'zova';
declare module 'zova' {
  export interface IBeanRecordGeneral {
    'a-bean.service.aop': ServiceAop;
  }
}
/** service: end */
/** monkeySys: begin */
export * from '../monkeySys.js';
/** monkeySys: end */
/** scope: begin */
import { BeanScopeBase, type BeanScopeUtil } from 'zova';
import { Scope } from '../lib/scope.js';

@Scope()
export class ScopeModuleABean extends BeanScopeBase {}

export interface ScopeModuleABean {
  util: BeanScopeUtil;
}

import 'zova';
declare module 'zova' {
  export interface IBeanScopeRecord {
    'a-bean': ScopeModuleABean;
  }
  
  

  

  
}
  
/** scope: end */
