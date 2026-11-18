// eslint-disable
/** model: begin */
export * from '../model/chat.ts';
import { IModelOptionsChat } from '../model/chat.ts';
import 'zova-module-a-model';
declare module 'zova-module-a-model' {

    export interface IModelRecord {
      'cabloy-ai:chat': IModelOptionsChat;
    }


}
declare module 'zova-module-cabloy-ai' {

        export interface ModelChat {
          /** @internal */
          get scope(): ScopeModuleCabloyAi;
        }

        export interface ModelChat {
          get $beanFullName(): 'cabloy-ai.model.chat';
          get $onionName(): 'cabloy-ai:chat';
          get $onionOptions(): IModelOptionsChat;
        }
}
/** model: end */
/** model: begin */
import type { ModelChat } from '../model/chat.ts';
import 'zova';
declare module 'zova' {
  export interface IBeanRecordGeneral {
    'cabloy-ai.model.chat': ModelChat;
  }
}
/** model: end */
/** api: begin */
export * from '../api/cabloyAiChat.ts';

import 'zova';
declare module 'zova' {


}
declare module 'zova-module-cabloy-ai' {

        export interface ApiCabloyAiChat {
          /** @internal */
          get scope(): ScopeModuleCabloyAi;
        }

        export interface ApiCabloyAiChat {
          get $beanFullName(): 'cabloy-ai.api.cabloyAiChat';
          get $onionName(): 'cabloy-ai:cabloyAiChat';

        }
}
/** api: end */
/** api: begin */
import type { ApiCabloyAiChat } from '../api/cabloyAiChat.ts';
export interface IModuleApi {
  'cabloyAiChat': ApiCabloyAiChat;
}
/** api: end */
/** api: begin */

import 'zova';
declare module 'zova' {
  export interface IBeanRecordGeneral {
    'cabloy-ai.api.cabloyAiChat': ApiCabloyAiChat;
  }
}
/** api: end */
/** openapi: begin */
export * from '../api/openapi/index.ts';
/** openapi: end */
/** apiSchema: begin */
export * from '../apiSchema/cabloyAiChat.ts';

import 'zova';
declare module 'zova' {


}
declare module 'zova-module-cabloy-ai' {

        export interface ApiSchemaCabloyAiChat {
          /** @internal */
          get scope(): ScopeModuleCabloyAi;
        }

        export interface ApiSchemaCabloyAiChat {
          get $beanFullName(): 'cabloy-ai.apiSchema.cabloyAiChat';
          get $onionName(): 'cabloy-ai:cabloyAiChat';

        }
}
/** apiSchema: end */
/** apiSchema: begin */
import type { ApiSchemaCabloyAiChat } from '../apiSchema/cabloyAiChat.ts';
export interface IModuleApiSchema {
  'cabloyAiChat': ApiSchemaCabloyAiChat;
}
/** apiSchema: end */
/** apiSchema: begin */

import 'zova';
declare module 'zova' {
  export interface IBeanRecordGeneral {
    'cabloy-ai.apiSchema.cabloyAiChat': ApiSchemaCabloyAiChat;
  }
}
/** apiSchema: end */
/** controller: begin */
export * from '../page/chat/controller.tsx';

import 'zova';
declare module 'zova' {


}
declare module 'zova-module-cabloy-ai' {

        export interface ControllerPageChat {
          /** @internal */
          get scope(): ScopeModuleCabloyAi;
        }
}
/** controller: end */
/** controller: begin */
import type { ControllerPageChat } from '../page/chat/controller.tsx';
import 'zova';
declare module 'zova' {
  export interface IBeanRecordLocal {
    'cabloy-ai.controller.pageChat': ControllerPageChat;
  }
}
/** controller: end */
/** pages: begin */
export * from './page/chat.ts';
export * from '../routes.ts';
import { TypePagePathSchema } from 'zova-module-a-router';
import 'zova';
declare module 'zova-module-a-router' {
export interface IPagePathRecord {
  '/cabloy/ai/chat': TypePagePathSchema<undefined,undefined>;
}
export interface IPageNameRecord {

}
}
export const pagePathSchemas = {

};
export const pageNameSchemas = {

};
declare module 'zova-module-cabloy-ai' {

}
/** pages: end */

/** locale: begin */
import { locales } from './locales.ts';
/** locale: end */
/** scope: begin */
import { BeanScopeBase, type BeanScopeUtil, TypeModuleLocales, TypeLocaleBase } from 'zova';
import { Scope } from 'zova-module-a-bean';

@Scope()
export class ScopeModuleCabloyAi extends BeanScopeBase {}

export interface ScopeModuleCabloyAi {
  util: BeanScopeUtil;
locale: TypeModuleLocales<(typeof locales)[TypeLocaleBase]>;
api: IModuleApi;
apiSchema: IModuleApiSchema;
}

import 'zova';
declare module 'zova' {
  export interface IBeanScopeRecord {
    'cabloy-ai': ScopeModuleCabloyAi;
  }



  export interface IBeanScopeLocale {
    'cabloy-ai': (typeof locales)[TypeLocaleBase];
  }


}

export function locale<K extends keyof (typeof locales)[TypeLocaleBase]>(key: K): `cabloy-ai::${K}` {
  return `cabloy-ai::${key}`;
}
/** scope: end */
