// eslint-disable
import type { TypeControllerOptionsActions } from 'vona-module-a-openapi';
/** meta: begin */
export * from '../bean/meta.status.ts';

import 'vona-module-a-meta';
declare module 'vona-module-a-meta' {
  
    export interface IMetaRecord {
      'test-cabloy:status': never;
    }

  
}
declare module 'vona-module-test-cabloy' {
  
        export interface MetaStatus {
          /** @internal */
          get scope(): ScopeModuleTestCabloy;
        }

          export interface MetaStatus {
            get $beanFullName(): 'test-cabloy.meta.status';
            get $onionName(): 'test-cabloy:status';
            
          } 
}
/** meta: end */
/** meta status: begin */
import type { MetaStatus } from '../bean/meta.status.ts';
/** meta status: end */
/** controller: begin */
export * from '../controller/status.ts';
import type { IControllerOptionsStatus } from '../controller/status.ts';
import 'vona-module-a-web';
declare module 'vona-module-a-web' {
  
    export interface IControllerRecord {
      'test-cabloy:status': IControllerOptionsStatus;
    }

  
}
declare module 'vona-module-test-cabloy' {
  
        export interface ControllerStatus {
          /** @internal */
          get scope(): ScopeModuleTestCabloy;
        }

          export interface ControllerStatus {
            get $beanFullName(): 'test-cabloy.controller.status';
            get $onionName(): 'test-cabloy:status';
            get $onionOptions(): IControllerOptionsStatus;
          } 
}
/** controller: end */
/** controller: begin */
// @ts-ignore ignore
import type { ControllerStatus } from '../controller/status.ts';
declare module 'vona-module-test-cabloy' {
  
    export interface IControllerOptionsStatus {
      actions?: TypeControllerOptionsActions<ControllerStatus>;
    }
}
declare module 'vona-module-a-web' {
  export interface IApiPathPostRecord{
        '/test/cabloy/status': undefined;
    }

}

/** controller: end */
/** scope: begin */
import { BeanScopeBase, type BeanScopeUtil } from 'vona';
import { Scope } from 'vona-module-a-bean';

@Scope()
export class ScopeModuleTestCabloy extends BeanScopeBase {}

export interface ScopeModuleTestCabloy {
  util: BeanScopeUtil;
status: MetaStatus;
}

import 'vona';
declare module 'vona' {
  export interface IBeanScopeRecord {
    'test-cabloy': ScopeModuleTestCabloy;
  }

  export interface IBeanScopeContainer {
    testCabloy: ScopeModuleTestCabloy;
  }
  
  

  

  
}
/** scope: end */
