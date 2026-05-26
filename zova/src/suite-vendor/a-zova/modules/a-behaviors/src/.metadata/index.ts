// eslint-disable
/** behavior: begin */
export * from '../bean/behavior.focus.js';
import { IBehaviorOptionsFocus } from '../bean/behavior.focus.js';
import 'zova-module-a-behavior';
declare module 'zova-module-a-behavior' {
  
    export interface IBehaviorRecord {
      'a-behaviors:focus': IBehaviorOptionsFocus;
    }

  
}
declare module 'zova-module-a-behaviors' {
  
        export interface BehaviorFocus {
          /** @internal */
          get scope(): ScopeModuleABehaviors;
        }

        export interface BehaviorFocus {
          get $beanFullName(): 'a-behaviors.behavior.focus';
          get $onionName(): 'a-behaviors:focus';
          get $onionOptions(): IBehaviorOptionsFocus;
        } 
}
/** behavior: end */
/** behavior: begin */
import { BehaviorFocus } from '../bean/behavior.focus.js';
import 'zova';
declare module 'zova' {
  export interface IBeanRecordLocal {
    'a-behaviors.behavior.focus': BehaviorFocus;
  }
}
/** behavior: end */
/** behaviors: begin */
import 'vue';
import 'vue/jsx-runtime';

declare module 'vue' {
  export interface InputHTMLAttributes {
    'bs-behaviors-focus'?: IBehaviorOptionsFocus | '' | boolean;
  }
}

declare module 'vue/jsx-runtime' {
  namespace JSX {
    // need define class/style in IntrinsicAttributes
    export interface IntrinsicAttributes {
      'bs-behaviors-focus'?: IBehaviorOptionsFocus | '' | boolean;
    }
  }
}
/** behaviors: end */
/** scope: begin */
import { BeanScopeBase, type BeanScopeUtil } from 'zova';
import { Scope } from 'zova-module-a-bean';

@Scope()
export class ScopeModuleABehaviors extends BeanScopeBase {}

export interface ScopeModuleABehaviors {
  util: BeanScopeUtil;
}

import 'zova';
declare module 'zova' {
  export interface IBeanScopeRecord {
    'a-behaviors': ScopeModuleABehaviors;
  }
  
  

  

  
}
  
/** scope: end */
