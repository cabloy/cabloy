// eslint-disable
/** aop: begin */
export * from '../bean/aop.listenerProbe.ts';

import { type IDecoratorAopOptions } from 'vona-module-a-aspect';
declare module 'vona-module-a-aspect' {

    export interface IAopRecord {
      'a-testutils:listenerProbe': IDecoratorAopOptions;
    }


}
declare module 'vona-module-a-testutils' {

        export interface AopListenerProbe {
          /** @internal */
          get scope(): ScopeModuleATestutils;
        }

          export interface AopListenerProbe {
            get $beanFullName(): 'a-testutils.aop.listenerProbe';
            get $onionName(): 'a-testutils:listenerProbe';
            get $onionOptions(): IDecoratorAopOptions;
          }
}
/** aop: end */
/** scope: begin */
import { BeanScopeBase, type BeanScopeUtil } from 'vona';
import { Scope } from 'vona-module-a-bean';

@Scope()
export class ScopeModuleATestutils extends BeanScopeBase {}

export interface ScopeModuleATestutils {
  util: BeanScopeUtil;
}

import 'vona';
declare module 'vona' {
  export interface IBeanScopeRecord {
    'a-testutils': ScopeModuleATestutils;
  }

  export interface IBeanScopeContainer {
    testutils: ScopeModuleATestutils;
  }






}
/** scope: end */
