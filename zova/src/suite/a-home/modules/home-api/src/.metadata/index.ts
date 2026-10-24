// eslint-disable
/** api: begin */
export * from '../api/captcha.ts';
export * from '../api/home.ts';
export * from '../api/homeBaseMenu.ts';
export * from '../api/homeBasePermission.ts';
export * from '../api/homeBaseSiteCatalog.ts';
export * from '../api/homeUserAccount.ts';
export * from '../api/homeUserPassport.ts';
export * from '../api/testSsrToolOne.ts';

import 'zova';
declare module 'zova' {


}
declare module 'zova-module-home-api' {

        export interface ApiCaptcha {
          /** @internal */
          get scope(): ScopeModuleHomeApi;
        }

        export interface ApiCaptcha {
          get $beanFullName(): 'home-api.api.captcha';
          get $onionName(): 'home-api:captcha';

        }

        export interface ApiHome {
          /** @internal */
          get scope(): ScopeModuleHomeApi;
        }

        export interface ApiHome {
          get $beanFullName(): 'home-api.api.home';
          get $onionName(): 'home-api:home';

        }

        export interface ApiHomeBaseMenu {
          /** @internal */
          get scope(): ScopeModuleHomeApi;
        }

        export interface ApiHomeBaseMenu {
          get $beanFullName(): 'home-api.api.homeBaseMenu';
          get $onionName(): 'home-api:homeBaseMenu';

        }

        export interface ApiHomeBasePermission {
          /** @internal */
          get scope(): ScopeModuleHomeApi;
        }

        export interface ApiHomeBasePermission {
          get $beanFullName(): 'home-api.api.homeBasePermission';
          get $onionName(): 'home-api:homeBasePermission';

        }

        export interface ApiHomeBaseSiteCatalog {
          /** @internal */
          get scope(): ScopeModuleHomeApi;
        }

        export interface ApiHomeBaseSiteCatalog {
          get $beanFullName(): 'home-api.api.homeBaseSiteCatalog';
          get $onionName(): 'home-api:homeBaseSiteCatalog';

        }

        export interface ApiHomeUserAccount {
          /** @internal */
          get scope(): ScopeModuleHomeApi;
        }

        export interface ApiHomeUserAccount {
          get $beanFullName(): 'home-api.api.homeUserAccount';
          get $onionName(): 'home-api:homeUserAccount';

        }

        export interface ApiHomeUserPassport {
          /** @internal */
          get scope(): ScopeModuleHomeApi;
        }

        export interface ApiHomeUserPassport {
          get $beanFullName(): 'home-api.api.homeUserPassport';
          get $onionName(): 'home-api:homeUserPassport';

        }

        export interface ApiTestSsrToolOne {
          /** @internal */
          get scope(): ScopeModuleHomeApi;
        }

        export interface ApiTestSsrToolOne {
          get $beanFullName(): 'home-api.api.testSsrToolOne';
          get $onionName(): 'home-api:testSsrToolOne';

        }
}
/** api: end */
/** api: begin */
import type { ApiCaptcha } from '../api/captcha.ts';
import type { ApiHome } from '../api/home.ts';
import type { ApiHomeBaseMenu } from '../api/homeBaseMenu.ts';
import type { ApiHomeBasePermission } from '../api/homeBasePermission.ts';
import type { ApiHomeBaseSiteCatalog } from '../api/homeBaseSiteCatalog.ts';
import type { ApiHomeUserAccount } from '../api/homeUserAccount.ts';
import type { ApiHomeUserPassport } from '../api/homeUserPassport.ts';
import type { ApiTestSsrToolOne } from '../api/testSsrToolOne.ts';
export interface IModuleApi {
  'captcha': ApiCaptcha;
'home': ApiHome;
'homeBaseMenu': ApiHomeBaseMenu;
'homeBasePermission': ApiHomeBasePermission;
'homeBaseSiteCatalog': ApiHomeBaseSiteCatalog;
'homeUserAccount': ApiHomeUserAccount;
'homeUserPassport': ApiHomeUserPassport;
'testSsrToolOne': ApiTestSsrToolOne;
}
/** api: end */
/** api: begin */

import 'zova';
declare module 'zova' {
  export interface IBeanRecordGeneral {
    'home-api.api.captcha': ApiCaptcha;
'home-api.api.home': ApiHome;
'home-api.api.homeBaseMenu': ApiHomeBaseMenu;
'home-api.api.homeBasePermission': ApiHomeBasePermission;
'home-api.api.homeBaseSiteCatalog': ApiHomeBaseSiteCatalog;
'home-api.api.homeUserAccount': ApiHomeUserAccount;
'home-api.api.homeUserPassport': ApiHomeUserPassport;
'home-api.api.testSsrToolOne': ApiTestSsrToolOne;
  }
}
/** api: end */
/** openapi: begin */
export * from '../api/openapi/index.ts';
/** openapi: end */
/** apiSchema: begin */
export * from '../apiSchema/captcha.ts';
export * from '../apiSchema/home.ts';
export * from '../apiSchema/homeBaseMenu.ts';
export * from '../apiSchema/homeBasePermission.ts';
export * from '../apiSchema/homeBaseSiteCatalog.ts';
export * from '../apiSchema/homeUserAccount.ts';
export * from '../apiSchema/homeUserPassport.ts';
export * from '../apiSchema/testSsrToolOne.ts';

import 'zova';
declare module 'zova' {


}
declare module 'zova-module-home-api' {

        export interface ApiSchemaCaptcha {
          /** @internal */
          get scope(): ScopeModuleHomeApi;
        }

        export interface ApiSchemaCaptcha {
          get $beanFullName(): 'home-api.apiSchema.captcha';
          get $onionName(): 'home-api:captcha';

        }

        export interface ApiSchemaHome {
          /** @internal */
          get scope(): ScopeModuleHomeApi;
        }

        export interface ApiSchemaHome {
          get $beanFullName(): 'home-api.apiSchema.home';
          get $onionName(): 'home-api:home';

        }

        export interface ApiSchemaHomeBaseMenu {
          /** @internal */
          get scope(): ScopeModuleHomeApi;
        }

        export interface ApiSchemaHomeBaseMenu {
          get $beanFullName(): 'home-api.apiSchema.homeBaseMenu';
          get $onionName(): 'home-api:homeBaseMenu';

        }

        export interface ApiSchemaHomeBasePermission {
          /** @internal */
          get scope(): ScopeModuleHomeApi;
        }

        export interface ApiSchemaHomeBasePermission {
          get $beanFullName(): 'home-api.apiSchema.homeBasePermission';
          get $onionName(): 'home-api:homeBasePermission';

        }

        export interface ApiSchemaHomeBaseSiteCatalog {
          /** @internal */
          get scope(): ScopeModuleHomeApi;
        }

        export interface ApiSchemaHomeBaseSiteCatalog {
          get $beanFullName(): 'home-api.apiSchema.homeBaseSiteCatalog';
          get $onionName(): 'home-api:homeBaseSiteCatalog';

        }

        export interface ApiSchemaHomeUserAccount {
          /** @internal */
          get scope(): ScopeModuleHomeApi;
        }

        export interface ApiSchemaHomeUserAccount {
          get $beanFullName(): 'home-api.apiSchema.homeUserAccount';
          get $onionName(): 'home-api:homeUserAccount';

        }

        export interface ApiSchemaHomeUserPassport {
          /** @internal */
          get scope(): ScopeModuleHomeApi;
        }

        export interface ApiSchemaHomeUserPassport {
          get $beanFullName(): 'home-api.apiSchema.homeUserPassport';
          get $onionName(): 'home-api:homeUserPassport';

        }

        export interface ApiSchemaTestSsrToolOne {
          /** @internal */
          get scope(): ScopeModuleHomeApi;
        }

        export interface ApiSchemaTestSsrToolOne {
          get $beanFullName(): 'home-api.apiSchema.testSsrToolOne';
          get $onionName(): 'home-api:testSsrToolOne';

        }
}
/** apiSchema: end */
/** apiSchema: begin */
import type { ApiSchemaCaptcha } from '../apiSchema/captcha.ts';
import type { ApiSchemaHome } from '../apiSchema/home.ts';
import type { ApiSchemaHomeBaseMenu } from '../apiSchema/homeBaseMenu.ts';
import type { ApiSchemaHomeBasePermission } from '../apiSchema/homeBasePermission.ts';
import type { ApiSchemaHomeBaseSiteCatalog } from '../apiSchema/homeBaseSiteCatalog.ts';
import type { ApiSchemaHomeUserAccount } from '../apiSchema/homeUserAccount.ts';
import type { ApiSchemaHomeUserPassport } from '../apiSchema/homeUserPassport.ts';
import type { ApiSchemaTestSsrToolOne } from '../apiSchema/testSsrToolOne.ts';
export interface IModuleApiSchema {
  'captcha': ApiSchemaCaptcha;
'home': ApiSchemaHome;
'homeBaseMenu': ApiSchemaHomeBaseMenu;
'homeBasePermission': ApiSchemaHomeBasePermission;
'homeBaseSiteCatalog': ApiSchemaHomeBaseSiteCatalog;
'homeUserAccount': ApiSchemaHomeUserAccount;
'homeUserPassport': ApiSchemaHomeUserPassport;
'testSsrToolOne': ApiSchemaTestSsrToolOne;
}
/** apiSchema: end */
/** apiSchema: begin */

import 'zova';
declare module 'zova' {
  export interface IBeanRecordGeneral {
    'home-api.apiSchema.captcha': ApiSchemaCaptcha;
'home-api.apiSchema.home': ApiSchemaHome;
'home-api.apiSchema.homeBaseMenu': ApiSchemaHomeBaseMenu;
'home-api.apiSchema.homeBasePermission': ApiSchemaHomeBasePermission;
'home-api.apiSchema.homeBaseSiteCatalog': ApiSchemaHomeBaseSiteCatalog;
'home-api.apiSchema.homeUserAccount': ApiSchemaHomeUserAccount;
'home-api.apiSchema.homeUserPassport': ApiSchemaHomeUserPassport;
'home-api.apiSchema.testSsrToolOne': ApiSchemaTestSsrToolOne;
  }
}
/** apiSchema: end */
/** service: begin */
export * from '../service/jwtAdapter.ts';

import 'zova-module-a-bean';
declare module 'zova-module-a-bean' {

    export interface IServiceRecord {
      'home-api:jwtAdapter': never;
    }


}
declare module 'zova-module-home-api' {

        export interface ServiceJwtAdapter {
          /** @internal */
          get scope(): ScopeModuleHomeApi;
        }

        export interface ServiceJwtAdapter {
          get $beanFullName(): 'home-api.service.jwtAdapter';
          get $onionName(): 'home-api:jwtAdapter';

        }
}
/** service: end */
/** service: begin */
import type { ServiceJwtAdapter } from '../service/jwtAdapter.ts';
import 'zova';
declare module 'zova' {
  export interface IBeanRecordGeneral {
    'home-api.service.jwtAdapter': ServiceJwtAdapter;
  }
}
/** service: end */
/** scope: begin */
import { BeanScopeBase, type BeanScopeUtil } from 'zova';
import { Scope } from 'zova-module-a-bean';

@Scope()
export class ScopeModuleHomeApi extends BeanScopeBase {}

export interface ScopeModuleHomeApi {
  util: BeanScopeUtil;
api: IModuleApi;
apiSchema: IModuleApiSchema;
}

import 'zova';
declare module 'zova' {
  export interface IBeanScopeRecord {
    'home-api': ScopeModuleHomeApi;
  }






}

/** scope: end */
