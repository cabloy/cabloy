// eslint-disable
/** model: begin */
export * from '../model/layout.ts';
export * from '../model/menu.ts';
import { IModelOptionsLayout } from '../model/layout.ts';
import { IModelOptionsMenu } from '../model/menu.ts';
import 'zova-module-a-model';
declare module 'zova-module-a-model' {

    export interface IModelRecord {
      'home-layoutweb:layout': IModelOptionsLayout;
'home-layoutweb:menu': IModelOptionsMenu;
    }


}
declare module 'zova-module-home-layoutweb' {

        export interface ModelLayout {
          /** @internal */
          get scope(): ScopeModuleHomeLayoutweb;
        }

        export interface ModelLayout {
          get $beanFullName(): 'home-layoutweb.model.layout';
          get $onionName(): 'home-layoutweb:layout';
          get $onionOptions(): IModelOptionsLayout;
        }

        export interface ModelMenu {
          /** @internal */
          get scope(): ScopeModuleHomeLayoutweb;
        }

        export interface ModelMenu {
          get $beanFullName(): 'home-layoutweb.model.menu';
          get $onionName(): 'home-layoutweb:menu';
          get $onionOptions(): IModelOptionsMenu;
        }
}
/** model: end */
/** model: begin */
import type { ModelLayout } from '../model/layout.ts';
import type { ModelMenu } from '../model/menu.ts';
import 'zova';
declare module 'zova' {
  export interface IBeanRecordGeneral {
    'home-layoutweb.model.layout': ModelLayout;
'home-layoutweb.model.menu': ModelMenu;
  }
}
/** model: end */
/** controller: begin */
export * from '../component/layoutWeb/controller.tsx';

import 'zova';
declare module 'zova' {


}
declare module 'zova-module-home-layoutweb' {

        export interface ControllerLayoutWeb {
          /** @internal */
          get scope(): ScopeModuleHomeLayoutweb;
        }
}
/** controller: end */
/** controller: begin */
import type { ControllerLayoutWeb } from '../component/layoutWeb/controller.tsx';
import 'zova';
declare module 'zova' {
  export interface IBeanRecordLocal {
    'home-layoutweb.controller.layoutWeb': ControllerLayoutWeb;
  }
}
/** controller: end */

/** components: begin */
export * from './component/layoutWeb.ts';
import { ZLayoutWeb } from './component/layoutWeb.ts';
export const components = {
  'layoutWeb': ZLayoutWeb,
};
import 'zova';
declare module 'zova' {
export interface IComponentRecord {
  'home-layoutweb:layoutWeb': ControllerLayoutWeb;
}
export interface IZovaComponentRecord {
  'home-layoutweb:layoutWeb': typeof ZLayoutWeb;
}
}
/** components: end */
/** render: begin */
export * from '../component/layoutWeb/render.content.tsx';
export * from '../component/layoutWeb/render.header.tsx';
export * from '../component/layoutWeb/render.locale.tsx';
export * from '../component/layoutWeb/render.tabs.tsx';
export * from '../component/layoutWeb/render.theme.tsx';
export * from '../component/layoutWeb/render.tsx';
export * from '../component/layoutWeb/render.user.tsx';

import 'zova';
declare module 'zova' {


}
declare module 'zova-module-home-layoutweb' {

        export interface RenderContent {
          /** @internal */
          get scope(): ScopeModuleHomeLayoutweb;
        }

        export interface RenderHeader {
          /** @internal */
          get scope(): ScopeModuleHomeLayoutweb;
        }

        export interface RenderLocale {
          /** @internal */
          get scope(): ScopeModuleHomeLayoutweb;
        }

        export interface RenderTabs {
          /** @internal */
          get scope(): ScopeModuleHomeLayoutweb;
        }

        export interface RenderTheme {
          /** @internal */
          get scope(): ScopeModuleHomeLayoutweb;
        }

        export interface RenderLayoutWeb {
          /** @internal */
          get scope(): ScopeModuleHomeLayoutweb;
        }

        export interface RenderUser {
          /** @internal */
          get scope(): ScopeModuleHomeLayoutweb;
        }
}
/** render: end */
/** render: begin */
import type { RenderContent } from '../component/layoutWeb/render.content.tsx';
import type { RenderHeader } from '../component/layoutWeb/render.header.tsx';
import type { RenderLocale } from '../component/layoutWeb/render.locale.tsx';
import type { RenderTabs } from '../component/layoutWeb/render.tabs.tsx';
import type { RenderTheme } from '../component/layoutWeb/render.theme.tsx';
import type { RenderLayoutWeb } from '../component/layoutWeb/render.tsx';
import type { RenderUser } from '../component/layoutWeb/render.user.tsx';
import 'zova';
declare module 'zova' {
  export interface IBeanRecordLocal {
    'home-layoutweb.render.content': RenderContent;
'home-layoutweb.render.header': RenderHeader;
'home-layoutweb.render.locale': RenderLocale;
'home-layoutweb.render.tabs': RenderTabs;
'home-layoutweb.render.theme': RenderTheme;
'home-layoutweb.render.layoutWeb': RenderLayoutWeb;
'home-layoutweb.render.user': RenderUser;
  }
}
/** render: end */
/** config: begin */
export * from '../config/config.ts';
import { config } from '../config/config.ts';
/** config: end */
/** locale: begin */
import { locales } from './locales.ts';
/** locale: end */
/** scope: begin */
import { BeanScopeBase, type BeanScopeUtil, TypeModuleConfig, TypeModuleLocales, TypeLocaleBase } from 'zova';
import { Scope } from 'zova-module-a-bean';

@Scope()
export class ScopeModuleHomeLayoutweb extends BeanScopeBase {}

export interface ScopeModuleHomeLayoutweb {
  util: BeanScopeUtil;
config: TypeModuleConfig<typeof config>;
locale: TypeModuleLocales<(typeof locales)[TypeLocaleBase]>;
}

import 'zova';
declare module 'zova' {
  export interface IBeanScopeRecord {
    'home-layoutweb': ScopeModuleHomeLayoutweb;
  }

  export interface IBeanScopeConfig {
    'home-layoutweb': ReturnType<typeof config>;
  }

  export interface IBeanScopeLocale {
    'home-layoutweb': (typeof locales)[TypeLocaleBase];
  }


}

export function locale<K extends keyof (typeof locales)[TypeLocaleBase]>(key: K): `home-layoutweb::${K}` {
  return `home-layoutweb::${key}`;
}
/** scope: end */
