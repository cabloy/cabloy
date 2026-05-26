// eslint-disable
/** model: begin */
export * from '../model/layout.js';
export * from '../model/menu.js';
import { IModelOptionsLayout } from '../model/layout.js';
import { IModelOptionsMenu } from '../model/menu.js';
import 'zova-module-a-model';
declare module 'zova-module-a-model' {
  
    export interface IModelRecord {
      'home-layouttabs:layout': IModelOptionsLayout;
'home-layouttabs:menu': IModelOptionsMenu;
    }

  
}
declare module 'zova-module-home-layouttabs' {
  
        export interface ModelLayout {
          /** @internal */
          get scope(): ScopeModuleHomeLayouttabs;
        }

        export interface ModelLayout {
          get $beanFullName(): 'home-layouttabs.model.layout';
          get $onionName(): 'home-layouttabs:layout';
          get $onionOptions(): IModelOptionsLayout;
        }

        export interface ModelMenu {
          /** @internal */
          get scope(): ScopeModuleHomeLayouttabs;
        }

        export interface ModelMenu {
          get $beanFullName(): 'home-layouttabs.model.menu';
          get $onionName(): 'home-layouttabs:menu';
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
    'home-layouttabs.model.layout': ModelLayout;
'home-layouttabs.model.menu': ModelMenu;
  }
}
/** model: end */
/** controller: begin */
export * from '../component/layoutTabs/controller.jsx';

import 'zova';
declare module 'zova' {
  
  
}
declare module 'zova-module-home-layouttabs' {
  
        export interface ControllerLayoutTabs {
          /** @internal */
          get scope(): ScopeModuleHomeLayouttabs;
        } 
}
/** controller: end */
/** controller: begin */
import { ControllerLayoutTabs } from '../component/layoutTabs/controller.jsx';
import 'zova';
declare module 'zova' {
  export interface IBeanRecordLocal {
    'home-layouttabs.controller.layoutTabs': ControllerLayoutTabs;
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
  'home-layouttabs:layoutTabs': ControllerLayoutTabs;
}
export interface IZovaComponentRecord {
  'home-layouttabs:layoutTabs': typeof ZLayoutTabs;
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
declare module 'zova-module-home-layouttabs' {
  
        export interface RenderContent {
          /** @internal */
          get scope(): ScopeModuleHomeLayouttabs;
        }

        export interface RenderHeader {
          /** @internal */
          get scope(): ScopeModuleHomeLayouttabs;
        }

        export interface RenderLocale {
          /** @internal */
          get scope(): ScopeModuleHomeLayouttabs;
        }

        export interface RenderMenu {
          /** @internal */
          get scope(): ScopeModuleHomeLayouttabs;
        }

        export interface RenderSidebar {
          /** @internal */
          get scope(): ScopeModuleHomeLayouttabs;
        }

        export interface RenderTabs {
          /** @internal */
          get scope(): ScopeModuleHomeLayouttabs;
        }

        export interface RenderTheme {
          /** @internal */
          get scope(): ScopeModuleHomeLayouttabs;
        }

        export interface RenderLayoutTabs {
          /** @internal */
          get scope(): ScopeModuleHomeLayouttabs;
        }

        export interface RenderUser {
          /** @internal */
          get scope(): ScopeModuleHomeLayouttabs;
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
    'home-layouttabs.render.content': RenderContent;
'home-layouttabs.render.header': RenderHeader;
'home-layouttabs.render.locale': RenderLocale;
'home-layouttabs.render.menu': RenderMenu;
'home-layouttabs.render.sidebar': RenderSidebar;
'home-layouttabs.render.tabs': RenderTabs;
'home-layouttabs.render.theme': RenderTheme;
'home-layouttabs.render.layoutTabs': RenderLayoutTabs;
'home-layouttabs.render.user': RenderUser;
  }
}
/** render: end */
/** style: begin */
export * from '../component/layoutTabs/style.js';

import 'zova';
declare module 'zova' {
  
  
}
declare module 'zova-module-home-layouttabs' {
  
        export interface StyleLayoutTabs {
          /** @internal */
          get scope(): ScopeModuleHomeLayouttabs;
        } 
}
/** style: end */
/** style: begin */
import { StyleLayoutTabs } from '../component/layoutTabs/style.js';
import 'zova';
declare module 'zova' {
  export interface IBeanRecordLocal {
    'home-layouttabs.style.layoutTabs': StyleLayoutTabs;
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
export class ScopeModuleHomeLayouttabs extends BeanScopeBase {}

export interface ScopeModuleHomeLayouttabs {
  util: BeanScopeUtil;
config: TypeModuleConfig<typeof config>;
locale: TypeModuleLocales<(typeof locales)[TypeLocaleBase]>;
}

import 'zova';
declare module 'zova' {
  export interface IBeanScopeRecord {
    'home-layouttabs': ScopeModuleHomeLayouttabs;
  }
  
  export interface IBeanScopeConfig {
    'home-layouttabs': ReturnType<typeof config>;
  }

  export interface IBeanScopeLocale {
    'home-layouttabs': (typeof locales)[TypeLocaleBase];
  }

  
}

export function locale<K extends keyof (typeof locales)[TypeLocaleBase]>(key: K): `home-layouttabs::${K}` {
  return `home-layouttabs::${key}`;
}  
/** scope: end */
