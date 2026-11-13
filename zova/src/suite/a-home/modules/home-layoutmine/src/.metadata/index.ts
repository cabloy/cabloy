// eslint-disable
/** controller: begin */
export * from '../component/layoutMine/controller.tsx';

import 'zova';
declare module 'zova' {


}
declare module 'zova-module-home-layoutmine' {

        export interface ControllerLayoutMine {
          /** @internal */
          get scope(): ScopeModuleHomeLayoutmine;
        }
}
/** controller: end */
/** controller: begin */
import type { ControllerLayoutMine } from '../component/layoutMine/controller.tsx';
import 'zova';
declare module 'zova' {
  export interface IBeanRecordLocal {
    'home-layoutmine.controller.layoutMine': ControllerLayoutMine;
  }
}
/** controller: end */

/** components: begin */
export * from './component/layoutMine.ts';
import { ZLayoutMine } from './component/layoutMine.ts';
export const components = {
  'layoutMine': ZLayoutMine,
};
import 'zova';
declare module 'zova' {
export interface IComponentRecord {
  'home-layoutmine:layoutMine': ControllerLayoutMine;
}
export interface IZovaComponentRecord {
  'home-layoutmine:layoutMine': typeof ZLayoutMine;
}
}
/** components: end */
/** render: begin */
export * from '../component/layoutMine/render.locale.tsx';
export * from '../component/layoutMine/render.theme.tsx';
export * from '../component/layoutMine/render.tsx';
export * from '../component/layoutMine/render.user.tsx';

import 'zova';
declare module 'zova' {


}
declare module 'zova-module-home-layoutmine' {

        export interface RenderLocale {
          /** @internal */
          get scope(): ScopeModuleHomeLayoutmine;
        }

        export interface RenderTheme {
          /** @internal */
          get scope(): ScopeModuleHomeLayoutmine;
        }

        export interface RenderLayoutMine {
          /** @internal */
          get scope(): ScopeModuleHomeLayoutmine;
        }

        export interface RenderUser {
          /** @internal */
          get scope(): ScopeModuleHomeLayoutmine;
        }
}
/** render: end */
/** render: begin */
import type { RenderLocale } from '../component/layoutMine/render.locale.tsx';
import type { RenderTheme } from '../component/layoutMine/render.theme.tsx';
import type { RenderLayoutMine } from '../component/layoutMine/render.tsx';
import type { RenderUser } from '../component/layoutMine/render.user.tsx';
import 'zova';
declare module 'zova' {
  export interface IBeanRecordLocal {
    'home-layoutmine.render.locale': RenderLocale;
'home-layoutmine.render.theme': RenderTheme;
'home-layoutmine.render.layoutMine': RenderLayoutMine;
'home-layoutmine.render.user': RenderUser;
  }
}
/** render: end */
/** style: begin */
export * from '../component/layoutMine/style.ts';

import 'zova';
declare module 'zova' {


}
declare module 'zova-module-home-layoutmine' {

        export interface StyleLayoutMine {
          /** @internal */
          get scope(): ScopeModuleHomeLayoutmine;
        }
}
/** style: end */
/** style: begin */
import type { StyleLayoutMine } from '../component/layoutMine/style.ts';
import 'zova';
declare module 'zova' {
  export interface IBeanRecordLocal {
    'home-layoutmine.style.layoutMine': StyleLayoutMine;
  }
}
/** style: end */
/** locale: begin */
import { locales } from './locales.ts';
/** locale: end */
/** scope: begin */
import { BeanScopeBase, type BeanScopeUtil, TypeModuleLocales, TypeLocaleBase } from 'zova';
import { Scope } from 'zova-module-a-bean';

@Scope()
export class ScopeModuleHomeLayoutmine extends BeanScopeBase {}

export interface ScopeModuleHomeLayoutmine {
  util: BeanScopeUtil;
locale: TypeModuleLocales<(typeof locales)[TypeLocaleBase]>;
}

import 'zova';
declare module 'zova' {
  export interface IBeanScopeRecord {
    'home-layoutmine': ScopeModuleHomeLayoutmine;
  }



  export interface IBeanScopeLocale {
    'home-layoutmine': (typeof locales)[TypeLocaleBase];
  }


}

export function locale<K extends keyof (typeof locales)[TypeLocaleBase]>(key: K): `home-layoutmine::${K}` {
  return `home-layoutmine::${key}`;
}
/** scope: end */
