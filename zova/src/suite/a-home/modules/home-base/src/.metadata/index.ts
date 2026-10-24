// eslint-disable
/** service: begin */
export * from '../service/routerGuards.ts';
export * from '../service/ssr.ts';
export * from '../service/ssrLayout.ts';

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
import type { ServiceRouterGuards } from '../service/routerGuards.ts';
import type { ServiceSsr } from '../service/ssr.ts';
import type { ServiceSsrLayout } from '../service/ssrLayout.ts';
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
export * from '../component/itemLink/controller.tsx';
export * from '../component/page/controller.tsx';
export * from '../component/siteEntryTables/controller.tsx';
export * from '../page/authCallback/controller.tsx';
export * from '../page/errorAccessDenied/controller.tsx';
export * from '../page/errorExpired/controller.tsx';
export * from '../page/errorNotFound/controller.tsx';

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

        export interface ControllerSiteEntryTables {
          /** @internal */
          get scope(): ScopeModuleHomeBase;
        }

        export interface ControllerPageAuthCallback {
          /** @internal */
          get scope(): ScopeModuleHomeBase;
        }

        export interface ControllerPageErrorAccessDenied {
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
import type { ControllerItemLink } from '../component/itemLink/controller.tsx';
import type { ControllerPage } from '../component/page/controller.tsx';
import type { ControllerSiteEntryTables } from '../component/siteEntryTables/controller.tsx';
import type { ControllerPageAuthCallback } from '../page/authCallback/controller.tsx';
import type { ControllerPageErrorAccessDenied } from '../page/errorAccessDenied/controller.tsx';
import type { ControllerPageErrorExpired } from '../page/errorExpired/controller.tsx';
import type { ControllerPageErrorNotFound } from '../page/errorNotFound/controller.tsx';
import 'zova';
declare module 'zova' {
  export interface IBeanRecordLocal {
    'home-base.controller.itemLink': ControllerItemLink;
'home-base.controller.page': ControllerPage;
'home-base.controller.siteEntryTables': ControllerSiteEntryTables;
'home-base.controller.pageAuthCallback': ControllerPageAuthCallback;
'home-base.controller.pageErrorAccessDenied': ControllerPageErrorAccessDenied;
'home-base.controller.pageErrorExpired': ControllerPageErrorExpired;
'home-base.controller.pageErrorNotFound': ControllerPageErrorNotFound;
  }
}
/** controller: end */
/** pages: begin */
export * from './page/authCallback.ts';
import { NSControllerPageAuthCallback } from './page/authCallback.ts';
export * from './page/errorAccessDenied.ts';
export * from './page/errorExpired.ts';
import { NSControllerPageErrorExpired } from './page/errorExpired.ts';
export * from './page/errorNotFound.ts';
export * from '../routes.ts';
import { TypePagePathSchema } from 'zova-module-a-router';
import 'zova';
declare module 'zova-module-a-router' {
export interface IPagePathRecord {
  '/home/base/authCallback': TypePagePathSchema<undefined,NSControllerPageAuthCallback.QueryInput>;
'/home/base/errorAccessDenied': TypePagePathSchema<undefined,undefined>;
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
export * from './component/itemLink.ts';
import { ZItemLink } from './component/itemLink.ts';
export * from './component/page.ts';
import { ZPage } from './component/page.ts';
export * from './component/siteEntryTables.ts';
import { ZSiteEntryTables } from './component/siteEntryTables.ts';
export const components = {
  'itemLink': ZItemLink,
'page': ZPage,
'siteEntryTables': ZSiteEntryTables,
};
import 'zova';
declare module 'zova' {
export interface IComponentRecord {
  'home-base:itemLink': ControllerItemLink;
'home-base:page': ControllerPage;
'home-base:siteEntryTables': ControllerSiteEntryTables;
}
export interface IZovaComponentRecord {
  'home-base:itemLink': typeof ZItemLink;
'home-base:page': typeof ZPage;
'home-base:siteEntryTables': typeof ZSiteEntryTables;
}
}
/** components: end */
/** config: begin */
export * from '../config/config.ts';
import { config } from '../config/config.ts';
/** config: end */
/** locale: begin */
import { locales } from './locales.ts';
/** locale: end */
/** monkey: begin */
export * from '../monkey.ts';
/** monkey: end */
/** monkeySys: begin */
export * from '../monkeySys.ts';
/** monkeySys: end */
/** main: begin */
export * from '../main.ts';
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
