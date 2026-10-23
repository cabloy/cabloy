// eslint-disable
/** sys: begin */
export * from '../bean/sys.onion.ts';

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
import type { SysOnion } from '../bean/sys.onion.ts';
import 'zova';
declare module 'zova' {
  export interface IBeanRecordGeneral {
    'a-bean.sys.onion': SysOnion;
  }
}
/** sys: end */
/** service: begin */
export * from '../service/aop.ts';
export * from '../service/onion_.ts';

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
import type { ServiceAop } from '../service/aop.ts';
import 'zova';
declare module 'zova' {
  export interface IBeanRecordGeneral {
    'a-bean.service.aop': ServiceAop;
  }
}
/** service: end */
/** monkeySys: begin */
export * from '../monkeySys.ts';
/** monkeySys: end */
/** scope: begin */
import { BeanScopeBase, type BeanScopeUtil } from 'zova';
import { Scope } from '../lib/scope.ts';

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
