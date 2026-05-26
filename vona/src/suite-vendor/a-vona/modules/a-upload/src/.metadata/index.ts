// eslint-disable
/** interceptor: begin */
export * from '../bean/interceptor.upload.ts';
import type { IInterceptorOptionsUpload } from '../bean/interceptor.upload.ts';
import 'vona-module-a-aspect';
declare module 'vona-module-a-aspect' {
  
  
export interface IInterceptorRecordLocal {
  'a-upload:upload': IInterceptorOptionsUpload;
}

}
declare module 'vona-module-a-upload' {
  
        export interface InterceptorUpload {
          /** @internal */
          get scope(): ScopeModuleAUpload;
        }

          export interface InterceptorUpload {
            get $beanFullName(): 'a-upload.interceptor.upload';
            get $onionName(): 'a-upload:upload';
            get $onionOptions(): IInterceptorOptionsUpload;
          } 
}
/** interceptor: end */
/** scope: begin */
import { BeanScopeBase, type BeanScopeUtil } from 'vona';
import { Scope } from 'vona-module-a-bean';

@Scope()
export class ScopeModuleAUpload extends BeanScopeBase {}

export interface ScopeModuleAUpload {
  util: BeanScopeUtil;
}

import 'vona';
declare module 'vona' {
  export interface IBeanScopeRecord {
    'a-upload': ScopeModuleAUpload;
  }

  export interface IBeanScopeContainer {
    upload: ScopeModuleAUpload;
  }
  
  

  

  
}
/** scope: end */
