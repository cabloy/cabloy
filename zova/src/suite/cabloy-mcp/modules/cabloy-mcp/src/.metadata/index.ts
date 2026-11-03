// eslint-disable
/** model: begin */
export * from '../model/authorization.ts';
export * from '../model/authorizationRecords.ts';
import { IModelOptionsAuthorization } from '../model/authorization.ts';
import { IModelOptionsAuthorizationRecords } from '../model/authorizationRecords.ts';
import 'zova-module-a-model';
declare module 'zova-module-a-model' {

    export interface IModelRecord {
      'cabloy-mcp:authorization': IModelOptionsAuthorization;
'cabloy-mcp:authorizationRecords': IModelOptionsAuthorizationRecords;
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

        export interface ModelAuthorizationRecords {
          /** @internal */
          get scope(): ScopeModuleCabloyMcp;
        }

        export interface ModelAuthorizationRecords {
          get $beanFullName(): 'cabloy-mcp.model.authorizationRecords';
          get $onionName(): 'cabloy-mcp:authorizationRecords';
          get $onionOptions(): IModelOptionsAuthorizationRecords;
        }
}
/** model: end */
/** model: begin */
import type { ModelAuthorization } from '../model/authorization.ts';
import type { ModelAuthorizationRecords } from '../model/authorizationRecords.ts';
import 'zova';
declare module 'zova' {
  export interface IBeanRecordGeneral {
    'cabloy-mcp.model.authorization': ModelAuthorization;
'cabloy-mcp.model.authorizationRecords': ModelAuthorizationRecords;
  }
}
/** model: end */
/** api: begin */
export * from '../api/authorization.ts';
export * from '../api/mcpAuthAuthorizationGrant.ts';

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

        export interface ApiMcpAuthAuthorizationGrant {
          /** @internal */
          get scope(): ScopeModuleCabloyMcp;
        }

        export interface ApiMcpAuthAuthorizationGrant {
          get $beanFullName(): 'cabloy-mcp.api.mcpAuthAuthorizationGrant';
          get $onionName(): 'cabloy-mcp:mcpAuthAuthorizationGrant';

        }
}
/** api: end */
/** api: begin */
import type { ApiAuthorization } from '../api/authorization.ts';
import type { ApiMcpAuthAuthorizationGrant } from '../api/mcpAuthAuthorizationGrant.ts';
export interface IModuleApi {
  'authorization': ApiAuthorization;
'mcpAuthAuthorizationGrant': ApiMcpAuthAuthorizationGrant;
}
/** api: end */
/** api: begin */

import 'zova';
declare module 'zova' {
  export interface IBeanRecordGeneral {
    'cabloy-mcp.api.authorization': ApiAuthorization;
'cabloy-mcp.api.mcpAuthAuthorizationGrant': ApiMcpAuthAuthorizationGrant;
  }
}
/** api: end */
/** openapi: begin */
export * from '../api/openapi/index.ts';
/** openapi: end */
/** apiSchema: begin */
export * from '../apiSchema/authorization.ts';
export * from '../apiSchema/mcpAuthAuthorizationGrant.ts';

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

        export interface ApiSchemaMcpAuthAuthorizationGrant {
          /** @internal */
          get scope(): ScopeModuleCabloyMcp;
        }

        export interface ApiSchemaMcpAuthAuthorizationGrant {
          get $beanFullName(): 'cabloy-mcp.apiSchema.mcpAuthAuthorizationGrant';
          get $onionName(): 'cabloy-mcp:mcpAuthAuthorizationGrant';

        }
}
/** apiSchema: end */
/** apiSchema: begin */
import type { ApiSchemaAuthorization } from '../apiSchema/authorization.ts';
import type { ApiSchemaMcpAuthAuthorizationGrant } from '../apiSchema/mcpAuthAuthorizationGrant.ts';
export interface IModuleApiSchema {
  'authorization': ApiSchemaAuthorization;
'mcpAuthAuthorizationGrant': ApiSchemaMcpAuthAuthorizationGrant;
}
/** apiSchema: end */
/** apiSchema: begin */

import 'zova';
declare module 'zova' {
  export interface IBeanRecordGeneral {
    'cabloy-mcp.apiSchema.authorization': ApiSchemaAuthorization;
'cabloy-mcp.apiSchema.mcpAuthAuthorizationGrant': ApiSchemaMcpAuthAuthorizationGrant;
  }
}
/** apiSchema: end */
/** controller: begin */
export * from '../page/authorizations/controller.tsx';
export * from '../page/consent/controller.tsx';

import 'zova';
declare module 'zova' {


}
declare module 'zova-module-cabloy-mcp' {

        export interface ControllerPageAuthorizations {
          /** @internal */
          get scope(): ScopeModuleCabloyMcp;
        }

        export interface ControllerPageConsent {
          /** @internal */
          get scope(): ScopeModuleCabloyMcp;
        }
}
/** controller: end */
/** controller: begin */
import type { ControllerPageAuthorizations } from '../page/authorizations/controller.tsx';
import type { ControllerPageConsent } from '../page/consent/controller.tsx';
import 'zova';
declare module 'zova' {
  export interface IBeanRecordLocal {
    'cabloy-mcp.controller.pageAuthorizations': ControllerPageAuthorizations;
'cabloy-mcp.controller.pageConsent': ControllerPageConsent;
  }
}
/** controller: end */
/** pages: begin */
export * from './page/authorizations.ts';
export * from './page/consent.ts';
import { NSControllerPageConsent } from './page/consent.ts';
export * from '../routes.ts';
import { TypePagePathSchema } from 'zova-module-a-router';
import 'zova';
declare module 'zova-module-a-router' {
export interface IPagePathRecord {
  '/cabloy/mcp/authorizations': TypePagePathSchema<undefined,undefined>;
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
import { locales } from './locales.ts';
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
