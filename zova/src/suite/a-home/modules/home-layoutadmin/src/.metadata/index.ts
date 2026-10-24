// eslint-disable
/** model: begin */
export * from '../model/layout.ts';
export * from '../model/menu.ts';
import { IModelOptionsLayout } from '../model/layout.ts';
import { IModelOptionsMenu } from '../model/menu.ts';
import 'zova-module-a-model';
declare module 'zova-module-a-model' {

    export interface IModelRecord {
      'home-layoutadmin:layout': IModelOptionsLayout;
'home-layoutadmin:menu': IModelOptionsMenu;
    }


}
declare module 'zova-module-home-layoutadmin' {

        export interface ModelLayout {
          /** @internal */
          get scope(): ScopeModuleHomeLayoutadmin;
        }

        export interface ModelLayout {
          get $beanFullName(): 'home-layoutadmin.model.layout';
          get $onionName(): 'home-layoutadmin:layout';
          get $onionOptions(): IModelOptionsLayout;
        }

        export interface ModelMenu {
          /** @internal */
          get scope(): ScopeModuleHomeLayoutadmin;
        }

        export interface ModelMenu {
          get $beanFullName(): 'home-layoutadmin.model.menu';
          get $onionName(): 'home-layoutadmin:menu';
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
    'home-layoutadmin.model.layout': ModelLayout;
'home-layoutadmin.model.menu': ModelMenu;
  }
}
/** model: end */
/** controller: begin */
export * from '../component/layoutAdmin/controller.tsx';

import 'zova';
declare module 'zova' {


}
declare module 'zova-module-home-layoutadmin' {

        export interface ControllerLayoutAdmin {
          /** @internal */
          get scope(): ScopeModuleHomeLayoutadmin;
        }
}
/** controller: end */
/** controller: begin */
import type { ControllerLayoutAdmin } from '../component/layoutAdmin/controller.tsx';
import 'zova';
declare module 'zova' {
  export interface IBeanRecordLocal {
    'home-layoutadmin.controller.layoutAdmin': ControllerLayoutAdmin;
  }
}
/** controller: end */

/** components: begin */
export * from './component/layoutAdmin.ts';
import { ZLayoutAdmin } from './component/layoutAdmin.ts';
export const components = {
  'layoutAdmin': ZLayoutAdmin,
};
import 'zova';
declare module 'zova' {
export interface IComponentRecord {
  'home-layoutadmin:layoutAdmin': ControllerLayoutAdmin;
}
export interface IZovaComponentRecord {
  'home-layoutadmin:layoutAdmin': typeof ZLayoutAdmin;
}
}
/** components: end */
/** render: begin */
export * from '../component/layoutAdmin/render.content.tsx';
export * from '../component/layoutAdmin/render.header.tsx';
export * from '../component/layoutAdmin/render.locale.tsx';
export * from '../component/layoutAdmin/render.menu.tsx';
export * from '../component/layoutAdmin/render.sidebar.tsx';
export * from '../component/layoutAdmin/render.tabs.tsx';
export * from '../component/layoutAdmin/render.theme.tsx';
export * from '../component/layoutAdmin/render.tsx';
export * from '../component/layoutAdmin/render.user.tsx';

import 'zova';
declare module 'zova' {


}
declare module 'zova-module-home-layoutadmin' {

        export interface RenderContent {
          /** @internal */
          get scope(): ScopeModuleHomeLayoutadmin;
        }

        export interface RenderHeader {
          /** @internal */
          get scope(): ScopeModuleHomeLayoutadmin;
        }

        export interface RenderLocale {
          /** @internal */
          get scope(): ScopeModuleHomeLayoutadmin;
        }

        export interface RenderMenu {
          /** @internal */
          get scope(): ScopeModuleHomeLayoutadmin;
        }

        export interface RenderSidebar {
          /** @internal */
          get scope(): ScopeModuleHomeLayoutadmin;
        }

        export interface RenderTabs {
          /** @internal */
          get scope(): ScopeModuleHomeLayoutadmin;
        }

        export interface RenderTheme {
          /** @internal */
          get scope(): ScopeModuleHomeLayoutadmin;
        }

        export interface RenderLayoutAdmin {
          /** @internal */
          get scope(): ScopeModuleHomeLayoutadmin;
        }

        export interface RenderUser {
          /** @internal */
          get scope(): ScopeModuleHomeLayoutadmin;
        }
}
/** render: end */
/** render: begin */
import type { RenderContent } from '../component/layoutAdmin/render.content.tsx';
import type { RenderHeader } from '../component/layoutAdmin/render.header.tsx';
import type { RenderLocale } from '../component/layoutAdmin/render.locale.tsx';
import type { RenderMenu } from '../component/layoutAdmin/render.menu.tsx';
import type { RenderSidebar } from '../component/layoutAdmin/render.sidebar.tsx';
import type { RenderTabs } from '../component/layoutAdmin/render.tabs.tsx';
import type { RenderTheme } from '../component/layoutAdmin/render.theme.tsx';
import type { RenderLayoutAdmin } from '../component/layoutAdmin/render.tsx';
import type { RenderUser } from '../component/layoutAdmin/render.user.tsx';
import 'zova';
declare module 'zova' {
  export interface IBeanRecordLocal {
    'home-layoutadmin.render.content': RenderContent;
'home-layoutadmin.render.header': RenderHeader;
'home-layoutadmin.render.locale': RenderLocale;
'home-layoutadmin.render.menu': RenderMenu;
'home-layoutadmin.render.sidebar': RenderSidebar;
'home-layoutadmin.render.tabs': RenderTabs;
'home-layoutadmin.render.theme': RenderTheme;
'home-layoutadmin.render.layoutAdmin': RenderLayoutAdmin;
'home-layoutadmin.render.user': RenderUser;
  }
}
/** render: end */
/** style: begin */
export * from '../component/layoutAdmin/style.ts';

import 'zova';
declare module 'zova' {


}
declare module 'zova-module-home-layoutadmin' {

        export interface StyleLayoutAdmin {
          /** @internal */
          get scope(): ScopeModuleHomeLayoutadmin;
        }
}
/** style: end */
/** style: begin */
import type { StyleLayoutAdmin } from '../component/layoutAdmin/style.ts';
import 'zova';
declare module 'zova' {
  export interface IBeanRecordLocal {
    'home-layoutadmin.style.layoutAdmin': StyleLayoutAdmin;
  }
}
/** style: end */
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
export class ScopeModuleHomeLayoutadmin extends BeanScopeBase {}

export interface ScopeModuleHomeLayoutadmin {
  util: BeanScopeUtil;
config: TypeModuleConfig<typeof config>;
locale: TypeModuleLocales<(typeof locales)[TypeLocaleBase]>;
}

import 'zova';
declare module 'zova' {
  export interface IBeanScopeRecord {
    'home-layoutadmin': ScopeModuleHomeLayoutadmin;
  }

  export interface IBeanScopeConfig {
    'home-layoutadmin': ReturnType<typeof config>;
  }

  export interface IBeanScopeLocale {
    'home-layoutadmin': (typeof locales)[TypeLocaleBase];
  }


}

export function locale<K extends keyof (typeof locales)[TypeLocaleBase]>(key: K): `home-layoutadmin::${K}` {
  return `home-layoutadmin::${key}`;
}
/** scope: end */
