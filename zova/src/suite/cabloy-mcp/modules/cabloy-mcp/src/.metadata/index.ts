// eslint-disable
/** model: begin */
export * from '../model/authorization.js';
import { IModelOptionsAuthorization } from '../model/authorization.js';
import 'zova-module-a-model';
declare module 'zova-module-a-model' {

    export interface IModelRecord {
      'cabloy-mcp:authorization': IModelOptionsAuthorization;
    }


}
declare module 'zova-module-cabloy-mcp' {

        export interface ModelAuthorization {
          /** @internal */
          get scope(): ScopeModuleCabloyMcp;
        }

        export interface ModelAuthorization {
          get $beanFullName(): 'cabloy-mcp.model.authorization';
          get $onionName(): 'cabloy-mcp:authorization';
          get $onionOptions(): IModelOptionsAuthorization;
        }
}
/** model: end */
/** model: begin */
import type { ModelAuthorization } from '../model/authorization.js';
import 'zova';
declare module 'zova' {
  export interface IBeanRecordGeneral {
    'cabloy-mcp.model.authorization': ModelAuthorization;
  }
}
/** model: end */
/** api: begin */
export * from '../api/authorization.js';

import 'zova';
declare module 'zova' {


}
declare module 'zova-module-cabloy-mcp' {

        export interface ApiAuthorization {
          /** @internal */
          get scope(): ScopeModuleCabloyMcp;
        }

        export interface ApiAuthorization {
          get $beanFullName(): 'cabloy-mcp.api.authorization';
          get $onionName(): 'cabloy-mcp:authorization';

        }
}
/** api: end */
/** api: begin */
import type { ApiAuthorization } from '../api/authorization.js';
export interface IModuleApi {
  'authorization': ApiAuthorization;
}
/** api: end */
/** api: begin */

import 'zova';
declare module 'zova' {
  export interface IBeanRecordGeneral {
    'cabloy-mcp.api.authorization': ApiAuthorization;
  }
}
/** api: end */
/** openapi: begin */
export * from '../api/openapi/index.js';
/** openapi: end */
/** apiSchema: begin */
export * from '../apiSchema/authorization.js';

import 'zova';
declare module 'zova' {


}
declare module 'zova-module-cabloy-mcp' {

        export interface ApiSchemaAuthorization {
          /** @internal */
          get scope(): ScopeModuleCabloyMcp;
        }

        export interface ApiSchemaAuthorization {
          get $beanFullName(): 'cabloy-mcp.apiSchema.authorization';
          get $onionName(): 'cabloy-mcp:authorization';

        }
}
/** apiSchema: end */
/** apiSchema: begin */
import type { ApiSchemaAuthorization } from '../apiSchema/authorization.js';
export interface IModuleApiSchema {
  'authorization': ApiSchemaAuthorization;
}
/** apiSchema: end */
/** apiSchema: begin */

import 'zova';
declare module 'zova' {
  export interface IBeanRecordGeneral {
    'cabloy-mcp.apiSchema.authorization': ApiSchemaAuthorization;
  }
}
/** apiSchema: end */
/** controller: begin */
export * from '../page/consent/controller.jsx';

import 'zova';
declare module 'zova' {


}
declare module 'zova-module-cabloy-mcp' {

        export interface ControllerPageConsent {
          /** @internal */
          get scope(): ScopeModuleCabloyMcp;
        }
}
/** controller: end */
/** controller: begin */
import type { ControllerPageConsent } from '../page/consent/controller.jsx';
import 'zova';
declare module 'zova' {
  export interface IBeanRecordLocal {
    'cabloy-mcp.controller.pageConsent': ControllerPageConsent;
  }
}
/** controller: end */
/** pages: begin */
export * from './page/consent.js';
import { NSControllerPageConsent } from './page/consent.js';
export * from '../routes.js';
import { TypePagePathSchema } from 'zova-module-a-router';
import 'zova';
declare module 'zova-module-a-router' {
export interface IPagePathRecord {
  '/cabloy/mcp/consent': TypePagePathSchema<undefined,NSControllerPageConsent.QueryInput>;
}
export interface IPageNameRecord {

}
}
export const pagePathSchemas = {
'/cabloy/mcp/consent': {
          query: NSControllerPageConsent.querySchema,
        },
};
export const pageNameSchemas = {

};
declare module 'zova-module-cabloy-mcp' {
  export interface ControllerPageConsent {
        $query: NSControllerPageConsent.QueryOutput;
      }
}
/** pages: end */

/** locale: begin */
import { locales } from './locales.js';
/** locale: end */
/** scope: begin */
import { BeanScopeBase, type BeanScopeUtil, TypeModuleLocales, TypeLocaleBase } from 'zova';
import { Scope } from 'zova-module-a-bean';

@Scope()
export class ScopeModuleCabloyMcp extends BeanScopeBase {}

export interface ScopeModuleCabloyMcp {
  util: BeanScopeUtil;
locale: TypeModuleLocales<(typeof locales)[TypeLocaleBase]>;
api: IModuleApi;
apiSchema: IModuleApiSchema;
}

import 'zova';
declare module 'zova' {
  export interface IBeanScopeRecord {
    'cabloy-mcp': ScopeModuleCabloyMcp;
  }



  export interface IBeanScopeLocale {
    'cabloy-mcp': (typeof locales)[TypeLocaleBase];
  }


}

export function locale<K extends keyof (typeof locales)[TypeLocaleBase]>(key: K): `cabloy-mcp::${K}` {
  return `cabloy-mcp::${key}`;
}
/** scope: end */
