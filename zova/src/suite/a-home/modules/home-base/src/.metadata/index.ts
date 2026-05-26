// eslint-disable
/** service: begin */
export * from '../service/routerGuards.js';
export * from '../service/ssr.js';
export * from '../service/ssrLayout.js';

import 'zova-module-a-bean';
declare module 'zova-module-a-bean' {
  
    export interface IServiceRecord {
      'home-base:routerGuards': never;
'home-base:ssr': never;
'home-base:ssrLayout': never;
    }

  
}
declare module 'zova-module-home-base' {
  
        export interface ServiceRouterGuards {
          /** @internal */
          get scope(): ScopeModuleHomeBase;
        }

        export interface ServiceRouterGuards {
          get $beanFullName(): 'home-base.service.routerGuards';
          get $onionName(): 'home-base:routerGuards';
          
        }

        export interface ServiceSsr {
          /** @internal */
          get scope(): ScopeModuleHomeBase;
        }

        export interface ServiceSsr {
          get $beanFullName(): 'home-base.service.ssr';
          get $onionName(): 'home-base:ssr';
          
        }

        export interface ServiceSsrLayout {
          /** @internal */
          get scope(): ScopeModuleHomeBase;
        }

        export interface ServiceSsrLayout {
          get $beanFullName(): 'home-base.service.ssrLayout';
          get $onionName(): 'home-base:ssrLayout';
          
        } 
}
/** service: end */
/** service: begin */
import { ServiceRouterGuards } from '../service/routerGuards.js';
import { ServiceSsr } from '../service/ssr.js';
import { ServiceSsrLayout } from '../service/ssrLayout.js';
import 'zova';
declare module 'zova' {
  export interface IBeanRecordGeneral {
    'home-base.service.routerGuards': ServiceRouterGuards;
'home-base.service.ssr': ServiceSsr;
'home-base.service.ssrLayout': ServiceSsrLayout;
  }
}
/** service: end */
/** controller: begin */
export * from '../component/itemLink/controller.jsx';
export * from '../component/page/controller.jsx';
export * from '../page/authCallback/controller.jsx';
export * from '../page/errorExpired/controller.jsx';
export * from '../page/errorNotFound/controller.jsx';

import 'zova';
declare module 'zova' {
  
  
}
declare module 'zova-module-home-base' {
  
        export interface ControllerItemLink {
          /** @internal */
          get scope(): ScopeModuleHomeBase;
        }

        export interface ControllerPage {
          /** @internal */
          get scope(): ScopeModuleHomeBase;
        }

        export interface ControllerPageAuthCallback {
          /** @internal */
          get scope(): ScopeModuleHomeBase;
        }

        export interface ControllerPageErrorExpired {
          /** @internal */
          get scope(): ScopeModuleHomeBase;
        }

        export interface ControllerPageErrorNotFound {
          /** @internal */
          get scope(): ScopeModuleHomeBase;
        } 
}
/** controller: end */
/** controller: begin */
import { ControllerItemLink } from '../component/itemLink/controller.jsx';
import { ControllerPage } from '../component/page/controller.jsx';
import { ControllerPageAuthCallback } from '../page/authCallback/controller.jsx';
import { ControllerPageErrorExpired } from '../page/errorExpired/controller.jsx';
import { ControllerPageErrorNotFound } from '../page/errorNotFound/controller.jsx';
import 'zova';
declare module 'zova' {
  export interface IBeanRecordLocal {
    'home-base.controller.itemLink': ControllerItemLink;
'home-base.controller.page': ControllerPage;
'home-base.controller.pageAuthCallback': ControllerPageAuthCallback;
'home-base.controller.pageErrorExpired': ControllerPageErrorExpired;
'home-base.controller.pageErrorNotFound': ControllerPageErrorNotFound;
  }
}
/** controller: end */
/** pages: begin */
export * from './page/authCallback.js';
import { NSControllerPageAuthCallback } from './page/authCallback.js';
export * from './page/errorExpired.js';
import { NSControllerPageErrorExpired } from './page/errorExpired.js';
export * from './page/errorNotFound.js';
export * from '../routes.js';
import { TypePagePathSchema } from 'zova-module-a-router';
import 'zova';
declare module 'zova-module-a-router' {
export interface IPagePathRecord {
  '/home/base/authCallback': TypePagePathSchema<undefined,NSControllerPageAuthCallback.QueryInput>;
'/home/base/errorExpired': TypePagePathSchema<undefined,NSControllerPageErrorExpired.QueryInput>;
'/home/base//:catchAll(.*)*': TypePagePathSchema<undefined,undefined>;
}
export interface IPageNameRecord {
  
}
}
export const pagePathSchemas = {
'/home/base/authCallback': {
          query: NSControllerPageAuthCallback.querySchema,
        },
'/home/base/errorExpired': {
          query: NSControllerPageErrorExpired.querySchema,
        },
};
export const pageNameSchemas = {

};
declare module 'zova-module-home-base' {
  export interface ControllerPageAuthCallback {
        $query: NSControllerPageAuthCallback.QueryOutput;
      }
export interface ControllerPageErrorExpired {
        $query: NSControllerPageErrorExpired.QueryOutput;
      }
}
/** pages: end */

/** components: begin */
export * from './component/itemLink.js';
import { ZItemLink } from './component/itemLink.js';
export * from './component/page.js';
import { ZPage } from './component/page.js';
export const components = {
  'itemLink': ZItemLink,
'page': ZPage,
};
import 'zova';
declare module 'zova' {
export interface IComponentRecord {
  'home-base:itemLink': ControllerItemLink;
'home-base:page': ControllerPage;
}
export interface IZovaComponentRecord {
  'home-base:itemLink': typeof ZItemLink;
'home-base:page': typeof ZPage;
}
}
/** components: end */
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
/** main: begin */
export * from '../main.js';
/** main: end */
/** scope: begin */
import { BeanScopeBase, type BeanScopeUtil, TypeModuleConfig, TypeModuleLocales, TypeLocaleBase } from 'zova';
import { Scope } from 'zova-module-a-bean';

@Scope()
export class ScopeModuleHomeBase extends BeanScopeBase {}

export interface ScopeModuleHomeBase {
  util: BeanScopeUtil;
config: TypeModuleConfig<typeof config>;
locale: TypeModuleLocales<(typeof locales)[TypeLocaleBase]>;
}

import 'zova';
declare module 'zova' {
  export interface IBeanScopeRecord {
    'home-base': ScopeModuleHomeBase;
  }
  
  export interface IBeanScopeConfig {
    'home-base': ReturnType<typeof config>;
  }

  export interface IBeanScopeLocale {
    'home-base': (typeof locales)[TypeLocaleBase];
  }

  
}

export function locale<K extends keyof (typeof locales)[TypeLocaleBase]>(key: K): `home-base::${K}` {
  return `home-base::${key}`;
}  
/** scope: end */
