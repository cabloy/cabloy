// eslint-disable
import type { TypeSymbolKeyFieldsMore } from 'vona-module-a-orm';
import type { TypeEntityOptionsFields,TypeControllerOptionsActions } from 'vona-module-a-openapi';
/** dto: begin */
export * from '../dto/signin.ts';
import type { IDtoOptionsSignin } from '../dto/signin.ts';
import 'vona-module-a-web';
declare module 'vona-module-a-web' {
  
    export interface IDtoRecord {
      'test-captcha:signin': IDtoOptionsSignin;
    }

  
}
declare module 'vona-module-test-captcha' {
   
}
/** dto: end */
/** dto: begin */
import type { DtoSignin } from '../dto/signin.ts';
declare module 'vona-module-test-captcha' {
  
    export interface IDtoOptionsSignin {
      fields?: TypeEntityOptionsFields<DtoSignin, IDtoOptionsSignin[TypeSymbolKeyFieldsMore]>;
    }
}
/** dto: end */
/** controller: begin */
export * from '../controller/captcha.ts';
import type { IControllerOptionsCaptcha } from '../controller/captcha.ts';
import 'vona-module-a-web';
declare module 'vona-module-a-web' {
  
    export interface IControllerRecord {
      'test-captcha:captcha': IControllerOptionsCaptcha;
    }

  
}
declare module 'vona-module-test-captcha' {
  
        export interface ControllerCaptcha {
          /** @internal */
          get scope(): ScopeModuleTestCaptcha;
        }

          export interface ControllerCaptcha {
            get $beanFullName(): 'test-captcha.controller.captcha';
            get $onionName(): 'test-captcha:captcha';
            get $onionOptions(): IControllerOptionsCaptcha;
          } 
}
/** controller: end */
/** controller: begin */
// @ts-ignore ignore
import type { ControllerCaptcha } from '../controller/captcha.ts';
declare module 'vona-module-test-captcha' {
  
    export interface IControllerOptionsCaptcha {
      actions?: TypeControllerOptionsActions<ControllerCaptcha>;
    }
}
declare module 'vona-module-a-web' {
  export interface IApiPathPostRecord{
        '/test/captcha/signin': undefined;
    }

}

/** controller: end */
/** scope: begin */
import { BeanScopeBase, type BeanScopeUtil } from 'vona';
import { Scope } from 'vona-module-a-bean';

@Scope()
export class ScopeModuleTestCaptcha extends BeanScopeBase {}

export interface ScopeModuleTestCaptcha {
  util: BeanScopeUtil;
}

import 'vona';
declare module 'vona' {
  export interface IBeanScopeRecord {
    'test-captcha': ScopeModuleTestCaptcha;
  }

  export interface IBeanScopeContainer {
    testCaptcha: ScopeModuleTestCaptcha;
  }
  
  

  

  
}
/** scope: end */
