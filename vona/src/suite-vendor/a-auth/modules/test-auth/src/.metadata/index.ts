// eslint-disable
import type { TypeControllerOptionsActions } from 'vona-module-a-openapi';
/** controller: begin */
export * from '../controller/passport.ts';
import type { IControllerOptionsPassport } from '../controller/passport.ts';
import 'vona-module-a-web';
declare module 'vona-module-a-web' {
  
    export interface IControllerRecord {
      'test-auth:passport': IControllerOptionsPassport;
    }

  
}
declare module 'vona-module-test-auth' {
  
        export interface ControllerPassport {
          /** @internal */
          get scope(): ScopeModuleTestAuth;
        }

          export interface ControllerPassport {
            get $beanFullName(): 'test-auth.controller.passport';
            get $onionName(): 'test-auth:passport';
            get $onionOptions(): IControllerOptionsPassport;
          } 
}
/** controller: end */
/** controller: begin */
// @ts-ignore ignore
import type { ControllerPassport } from '../controller/passport.ts';
declare module 'vona-module-test-auth' {
  
    export interface IControllerOptionsPassport {
      actions?: TypeControllerOptionsActions<ControllerPassport>;
    }
}
declare module 'vona-module-a-web' {
  export interface IApiPathGetRecord{
        '/test/auth/passport/isAuthenticated': undefined;
'/test/auth/passport/current': undefined;
    }

}

/** controller: end */
/** scope: begin */
import { BeanScopeBase, type BeanScopeUtil } from 'vona';
import { Scope } from 'vona-module-a-bean';

@Scope()
export class ScopeModuleTestAuth extends BeanScopeBase {}

export interface ScopeModuleTestAuth {
  util: BeanScopeUtil;
}

import 'vona';
declare module 'vona' {
  export interface IBeanScopeRecord {
    'test-auth': ScopeModuleTestAuth;
  }

  export interface IBeanScopeContainer {
    testAuth: ScopeModuleTestAuth;
  }
  
  

  

  
}
/** scope: end */
