// eslint-disable
/** api: begin */
export * from '../api/captcha.js';
export * from '../api/home.js';
export * from '../api/homeBaseMenu.js';
export * from '../api/homeBasePermission.js';
export * from '../api/homeBaseSiteCatalog.js';
export * from '../api/homeUserAccount.js';
export * from '../api/homeUserPassport.js';
export * from '../api/testSsrToolOne.js';

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
import { ApiCaptcha } from '../api/captcha.js';
import { ApiHome } from '../api/home.js';
import { ApiHomeBaseMenu } from '../api/homeBaseMenu.js';
import { ApiHomeBasePermission } from '../api/homeBasePermission.js';
import { ApiHomeBaseSiteCatalog } from '../api/homeBaseSiteCatalog.js';
import { ApiHomeUserAccount } from '../api/homeUserAccount.js';
import { ApiHomeUserPassport } from '../api/homeUserPassport.js';
import { ApiTestSsrToolOne } from '../api/testSsrToolOne.js';
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
export * from '../api/openapi/index.js';
/** openapi: end */
/** apiSchema: begin */
export * from '../apiSchema/captcha.js';
export * from '../apiSchema/home.js';
export * from '../apiSchema/homeBaseMenu.js';
export * from '../apiSchema/homeBasePermission.js';
export * from '../apiSchema/homeBaseSiteCatalog.js';
export * from '../apiSchema/homeUserAccount.js';
export * from '../apiSchema/homeUserPassport.js';
export * from '../apiSchema/testSsrToolOne.js';

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
import { ApiSchemaCaptcha } from '../apiSchema/captcha.js';
import { ApiSchemaHome } from '../apiSchema/home.js';
import { ApiSchemaHomeBaseMenu } from '../apiSchema/homeBaseMenu.js';
import { ApiSchemaHomeBasePermission } from '../apiSchema/homeBasePermission.js';
import { ApiSchemaHomeBaseSiteCatalog } from '../apiSchema/homeBaseSiteCatalog.js';
import { ApiSchemaHomeUserAccount } from '../apiSchema/homeUserAccount.js';
import { ApiSchemaHomeUserPassport } from '../apiSchema/homeUserPassport.js';
import { ApiSchemaTestSsrToolOne } from '../apiSchema/testSsrToolOne.js';
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
export * from '../service/jwtAdapter.js';

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
import { ServiceJwtAdapter } from '../service/jwtAdapter.js';
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
