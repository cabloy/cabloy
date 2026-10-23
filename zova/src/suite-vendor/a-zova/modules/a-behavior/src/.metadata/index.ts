// eslint-disable
/** bean: begin */
export * from '../bean/bean.behavior.ts';
export * from '../bean/bean.behaviorBase.ts';
export * from '../bean/bean.behaviorsHolder.ts';

import 'zova';
declare module 'zova' {


}
declare module 'zova-module-a-behavior' {

        export interface BeanBehavior {
          /** @internal */
          get scope(): ScopeModuleABehavior;
        }

        export interface BeanBehavior {
          get $beanFullName(): 'a-behavior.bean.behavior';
          get $onionName(): 'a-behavior:behavior';

        }

        export interface BeanBehaviorsHolder {
          /** @internal */
          get scope(): ScopeModuleABehavior;
        }

        export interface BeanBehaviorsHolder {
          get $beanFullName(): 'a-behavior.bean.behaviorsHolder';
          get $onionName(): 'a-behavior:behaviorsHolder';

        }
}
/** bean: end */
/** bean: begin */
import type { BeanBehavior } from '../bean/bean.behavior.ts';
import type { BeanBehaviorBase } from '../bean/bean.behaviorBase.ts';
import type { BeanBehaviorsHolder } from '../bean/bean.behaviorsHolder.ts';
import 'zova';
declare module 'zova' {
  export interface IBeanRecordGeneral {
    'a-behavior.bean.behavior': BeanBehavior;
'a-behavior.bean.behaviorBase': BeanBehaviorBase;
'a-behavior.bean.behaviorsHolder': BeanBehaviorsHolder;
  }
}
/** bean: end */
/** service: begin */
export * from '../service/composer.ts';

import 'zova-module-a-bean';
declare module 'zova-module-a-bean' {

    export interface IServiceRecord {
      'a-behavior:composer': never;
    }


}
declare module 'zova-module-a-behavior' {

        export interface ServiceComposer {
          /** @internal */
          get scope(): ScopeModuleABehavior;
        }

        export interface ServiceComposer {
          get $beanFullName(): 'a-behavior.service.composer';
          get $onionName(): 'a-behavior:composer';

        }
}
/** service: end */
/** service: begin */
import type { ServiceComposer } from '../service/composer.ts';
import 'zova';
declare module 'zova' {
  export interface IBeanRecordGeneral {
    'a-behavior.service.composer': ServiceComposer;
  }
}
/** service: end */
/** controller: begin */
export * from '../component/behavior/controller.tsx';

import 'zova';
declare module 'zova' {


}
declare module 'zova-module-a-behavior' {

        export interface ControllerBehavior {
          /** @internal */
          get scope(): ScopeModuleABehavior;
        }
}
/** controller: end */
/** controller: begin */
import type { ControllerBehavior } from '../component/behavior/controller.tsx';
import 'zova';
declare module 'zova' {
  export interface IBeanRecordLocal {
    'a-behavior.controller.behavior': ControllerBehavior;
  }
}
/** controller: end */

/** components: begin */
export * from './component/behavior.ts';
import { ZBehavior } from './component/behavior.ts';
export const components = {
  'behavior': ZBehavior,
};
import 'zova';
declare module 'zova' {
export interface IComponentRecord {
  'a-behavior:behavior': ControllerBehavior;
}
export interface IZovaComponentRecord {
  'a-behavior:behavior': typeof ZBehavior;
}
}
/** components: end */
/** behavior: begin */
export * from '../bean/behavior.root_.ts';

import 'zova-module-a-behavior';
declare module 'zova-module-a-behavior' {


}
declare module 'zova-module-a-behavior' {

}
/** behavior: end */
/** behaviors: begin */
import 'vue';
import 'vue/jsx-runtime';

declare module 'vue' {
  export interface InputHTMLAttributes {

  }
}

declare module 'vue/jsx-runtime' {
  namespace JSX {
    // need define class/style in IntrinsicAttributes
    export interface IntrinsicAttributes {

    }
  }
}
/** behaviors: end */
/** scope: begin */
import { BeanScopeBase, type BeanScopeUtil } from 'zova';
import { Scope } from 'zova-module-a-bean';

@Scope()
export class ScopeModuleABehavior extends BeanScopeBase {}

export interface ScopeModuleABehavior {
  util: BeanScopeUtil;
}

import 'zova';
declare module 'zova' {
  export interface IBeanScopeRecord {
    'a-behavior': ScopeModuleABehavior;
  }






}

/** scope: end */
