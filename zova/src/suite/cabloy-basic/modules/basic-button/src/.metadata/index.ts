// eslint-disable
/** controller: begin */
export * from '../component/button/controller.jsx';

import 'zova';
declare module 'zova' {


}
declare module 'zova-module-basic-button' {

        export interface ControllerButton {
          /** @internal */
          get scope(): ScopeModuleBasicButton;
        }
}
/** controller: end */
/** controller: begin */
import type { ControllerButton } from '../component/button/controller.jsx';
import 'zova';
declare module 'zova' {
  export interface IBeanRecordLocal {
    'basic-button.controller.button': ControllerButton;
  }
}
/** controller: end */

/** components: begin */
export * from './component/button.js';
import { ZButton } from './component/button.js';
export const components = {
  'button': ZButton,
};
import 'zova';
declare module 'zova' {
export interface IComponentRecord {
  'basic-button:button': ControllerButton;
}
export interface IZovaComponentRecord {
  'basic-button:button': typeof ZButton;
}
}
/** components: end */
/** behavior: begin */
export * from '../bean/behavior.perform.jsx';
import { IBehaviorOptionsPerform } from '../bean/behavior.perform.jsx';
import 'zova-module-a-behavior';
declare module 'zova-module-a-behavior' {

    export interface IBehaviorRecord {
      'basic-button:perform': IBehaviorOptionsPerform;
    }


}
declare module 'zova-module-basic-button' {

        export interface BehaviorPerform {
          /** @internal */
          get scope(): ScopeModuleBasicButton;
        }

        export interface BehaviorPerform {
          get $beanFullName(): 'basic-button.behavior.perform';
          get $onionName(): 'basic-button:perform';
          get $onionOptions(): IBehaviorOptionsPerform;
        }
}
/** behavior: end */
/** behavior: begin */
import type { BehaviorPerform } from '../bean/behavior.perform.jsx';
import 'zova';
declare module 'zova' {
  export interface IBeanRecordLocal {
    'basic-button.behavior.perform': BehaviorPerform;
  }
}
/** behavior: end */
/** behaviors: begin */
import 'vue';
import 'vue/jsx-runtime';

declare module 'vue' {
  export interface InputHTMLAttributes {
    'bs-basic-button-perform'?: IBehaviorOptionsPerform | '' | boolean;
  }
}

declare module 'vue/jsx-runtime' {
  namespace JSX {
    // need define class/style in IntrinsicAttributes
    export interface IntrinsicAttributes {
      'bs-basic-button-perform'?: IBehaviorOptionsPerform | '' | boolean;
    }
  }
}
/** behaviors: end */
/** scope: begin */
import { BeanScopeBase, type BeanScopeUtil } from 'zova';
import { Scope } from 'zova-module-a-bean';

@Scope()
export class ScopeModuleBasicButton extends BeanScopeBase {}

export interface ScopeModuleBasicButton {
  util: BeanScopeUtil;
}

import 'zova';
declare module 'zova' {
  export interface IBeanScopeRecord {
    'basic-button': ScopeModuleBasicButton;
  }






}

/** scope: end */
