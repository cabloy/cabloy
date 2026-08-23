// eslint-disable
/** service: begin */
export * from '../service/appModal.js';

import 'zova-module-a-bean';
declare module 'zova-module-a-bean' {

    export interface IServiceRecord {
      'basic-app:appModal': never;
    }


}
declare module 'zova-module-basic-app' {

        export interface ServiceAppModal {
          /** @internal */
          get scope(): ScopeModuleBasicApp;
        }

        export interface ServiceAppModal {
          get $beanFullName(): 'basic-app.service.appModal';
          get $onionName(): 'basic-app:appModal';

        }
}
/** service: end */
/** service: begin */
import { ServiceAppModal } from '../service/appModal.js';
import 'zova';
declare module 'zova' {
  export interface IBeanRecordGeneral {
    'basic-app.service.appModal': ServiceAppModal;
  }
}
/** service: end */
/** behavior: begin */
export * from '../bean/behavior.appModal.jsx';
import { IBehaviorOptionsAppModal } from '../bean/behavior.appModal.jsx';
import 'zova-module-a-behavior';
declare module 'zova-module-a-behavior' {

    export interface IBehaviorRecord {
      'basic-app:appModal': IBehaviorOptionsAppModal;
    }


}
declare module 'zova-module-basic-app' {

        export interface BehaviorAppModal {
          /** @internal */
          get scope(): ScopeModuleBasicApp;
        }

        export interface BehaviorAppModal {
          get $beanFullName(): 'basic-app.behavior.appModal';
          get $onionName(): 'basic-app:appModal';
          get $onionOptions(): IBehaviorOptionsAppModal;
        }
}
/** behavior: end */
/** behavior: begin */
import { BehaviorAppModal } from '../bean/behavior.appModal.jsx';
import 'zova';
declare module 'zova' {
  export interface IBeanRecordLocal {
    'basic-app.behavior.appModal': BehaviorAppModal;
  }
}
/** behavior: end */
/** behaviors: begin */
import 'vue';
import 'vue/jsx-runtime';

declare module 'vue' {
  export interface InputHTMLAttributes {
    'bs-basic-app-appModal'?: IBehaviorOptionsAppModal | '' | boolean;
  }
}

declare module 'vue/jsx-runtime' {
  namespace JSX {
    // need define class/style in IntrinsicAttributes
    export interface IntrinsicAttributes {
      'bs-basic-app-appModal'?: IBehaviorOptionsAppModal | '' | boolean;
    }
  }
}
/** behaviors: end */
/** config: begin */
export * from '../config/config.js';
import { config } from '../config/config.js';
/** config: end */
/** locale: begin */
import { locales } from './locales.js';
/** locale: end */
/** monkey: begin */
export * from '../monkey.js';
/** monkey: end */
/** monkeySys: begin */
export * from '../monkeySys.js';
/** monkeySys: end */
/** scope: begin */
import { BeanScopeBase, type BeanScopeUtil, TypeModuleConfig, TypeModuleLocales, TypeLocaleBase } from 'zova';
import { Scope } from 'zova-module-a-bean';

@Scope()
export class ScopeModuleBasicApp extends BeanScopeBase {}

export interface ScopeModuleBasicApp {
  util: BeanScopeUtil;
config: TypeModuleConfig<typeof config>;
locale: TypeModuleLocales<(typeof locales)[TypeLocaleBase]>;
}

import 'zova';
declare module 'zova' {
  export interface IBeanScopeRecord {
    'basic-app': ScopeModuleBasicApp;
  }

  export interface IBeanScopeConfig {
    'basic-app': ReturnType<typeof config>;
  }

  export interface IBeanScopeLocale {
    'basic-app': (typeof locales)[TypeLocaleBase];
  }


}

export function locale<K extends keyof (typeof locales)[TypeLocaleBase]>(key: K): `basic-app::${K}` {
  return `basic-app::${key}`;
}
/** scope: end */
