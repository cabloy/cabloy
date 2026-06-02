// eslint-disable
/** model: begin */
export * from '../model/layout.js';
export * from '../model/menu.js';
import { IModelOptionsLayout } from '../model/layout.js';
import { IModelOptionsMenu } from '../model/menu.js';
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
import { ModelLayout } from '../model/layout.js';
import { ModelMenu } from '../model/menu.js';
import 'zova';
declare module 'zova' {
  export interface IBeanRecordGeneral {
    'home-layoutweb.model.layout': ModelLayout;
'home-layoutweb.model.menu': ModelMenu;
  }
}
/** model: end */
/** controller: begin */
export * from '../component/layoutWeb/controller.jsx';

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
import { ControllerLayoutWeb } from '../component/layoutWeb/controller.jsx';
import 'zova';
declare module 'zova' {
  export interface IBeanRecordLocal {
    'home-layoutweb.controller.layoutWeb': ControllerLayoutWeb;
  }
}
/** controller: end */

/** components: begin */
export * from './component/layoutWeb.js';
import { ZLayoutWeb } from './component/layoutWeb.js';
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
export * from '../component/layoutWeb/render.content.jsx';
export * from '../component/layoutWeb/render.header.jsx';
export * from '../component/layoutWeb/render.locale.jsx';
export * from '../component/layoutWeb/render.tabs.jsx';
export * from '../component/layoutWeb/render.theme.jsx';
export * from '../component/layoutWeb/render.jsx';

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
}
/** render: end */
/** render: begin */
import { RenderContent } from '../component/layoutWeb/render.content.jsx';
import { RenderHeader } from '../component/layoutWeb/render.header.jsx';
import { RenderLocale } from '../component/layoutWeb/render.locale.jsx';
import { RenderTabs } from '../component/layoutWeb/render.tabs.jsx';
import { RenderTheme } from '../component/layoutWeb/render.theme.jsx';
import { RenderLayoutWeb } from '../component/layoutWeb/render.jsx';
import 'zova';
declare module 'zova' {
  export interface IBeanRecordLocal {
    'home-layoutweb.render.content': RenderContent;
'home-layoutweb.render.header': RenderHeader;
'home-layoutweb.render.locale': RenderLocale;
'home-layoutweb.render.tabs': RenderTabs;
'home-layoutweb.render.theme': RenderTheme;
'home-layoutweb.render.layoutWeb': RenderLayoutWeb;
  }
}
/** render: end */
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
