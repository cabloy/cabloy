// eslint-disable
/** model: begin */
export * from '../model/layout.js';
export * from '../model/menu.js';
import { IModelOptionsLayout } from '../model/layout.js';
import { IModelOptionsMenu } from '../model/menu.js';
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
import { ModelLayout } from '../model/layout.js';
import { ModelMenu } from '../model/menu.js';
import 'zova';
declare module 'zova' {
  export interface IBeanRecordGeneral {
    'home-layoutadmin.model.layout': ModelLayout;
'home-layoutadmin.model.menu': ModelMenu;
  }
}
/** model: end */
/** controller: begin */
export * from '../component/layoutTabs/controller.jsx';

import 'zova';
declare module 'zova' {
  
  
}
declare module 'zova-module-home-layoutadmin' {
  
        export interface ControllerLayoutTabs {
          /** @internal */
          get scope(): ScopeModuleHomeLayoutadmin;
        } 
}
/** controller: end */
/** controller: begin */
import { ControllerLayoutTabs } from '../component/layoutTabs/controller.jsx';
import 'zova';
declare module 'zova' {
  export interface IBeanRecordLocal {
    'home-layoutadmin.controller.layoutTabs': ControllerLayoutTabs;
  }
}
/** controller: end */

/** components: begin */
export * from './component/layoutTabs.js';
import { ZLayoutTabs } from './component/layoutTabs.js';
export const components = {
  'layoutTabs': ZLayoutTabs,
};
import 'zova';
declare module 'zova' {
export interface IComponentRecord {
  'home-layoutadmin:layoutTabs': ControllerLayoutTabs;
}
export interface IZovaComponentRecord {
  'home-layoutadmin:layoutTabs': typeof ZLayoutTabs;
}
}
/** components: end */
/** render: begin */
export * from '../component/layoutTabs/render.content.jsx';
export * from '../component/layoutTabs/render.header.jsx';
export * from '../component/layoutTabs/render.locale.jsx';
export * from '../component/layoutTabs/render.menu.jsx';
export * from '../component/layoutTabs/render.sidebar.jsx';
export * from '../component/layoutTabs/render.tabs.jsx';
export * from '../component/layoutTabs/render.theme.jsx';
export * from '../component/layoutTabs/render.jsx';
export * from '../component/layoutTabs/render.user.jsx';

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

        export interface RenderLayoutTabs {
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
import { RenderContent } from '../component/layoutTabs/render.content.jsx';
import { RenderHeader } from '../component/layoutTabs/render.header.jsx';
import { RenderLocale } from '../component/layoutTabs/render.locale.jsx';
import { RenderMenu } from '../component/layoutTabs/render.menu.jsx';
import { RenderSidebar } from '../component/layoutTabs/render.sidebar.jsx';
import { RenderTabs } from '../component/layoutTabs/render.tabs.jsx';
import { RenderTheme } from '../component/layoutTabs/render.theme.jsx';
import { RenderLayoutTabs } from '../component/layoutTabs/render.jsx';
import { RenderUser } from '../component/layoutTabs/render.user.jsx';
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
'home-layoutadmin.render.layoutTabs': RenderLayoutTabs;
'home-layoutadmin.render.user': RenderUser;
  }
}
/** render: end */
/** style: begin */
export * from '../component/layoutTabs/style.js';

import 'zova';
declare module 'zova' {
  
  
}
declare module 'zova-module-home-layoutadmin' {
  
        export interface StyleLayoutTabs {
          /** @internal */
          get scope(): ScopeModuleHomeLayoutadmin;
        } 
}
/** style: end */
/** style: begin */
import { StyleLayoutTabs } from '../component/layoutTabs/style.js';
import 'zova';
declare module 'zova' {
  export interface IBeanRecordLocal {
    'home-layoutadmin.style.layoutTabs': StyleLayoutTabs;
  }
}
/** style: end */
/** config: begin */
export * from '../config/config.js';
import { config } from '../config/config.js';
/** config: end */
/** locale: begin */
import { locales } from './locales.js';
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
