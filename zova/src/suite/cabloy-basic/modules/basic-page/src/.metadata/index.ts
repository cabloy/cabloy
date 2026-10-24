// eslint-disable
/** controller: begin */
export * from '../component/blockFilter/controller.tsx';
export * from '../component/blockFilterActions/controller.tsx';
export * from '../component/blockPage/controller.tsx';
export * from '../component/blockPager/controller.tsx';
export * from '../component/blockTable/controller.tsx';
export * from '../component/blockToolbarBulk/controller.tsx';

import 'zova';
declare module 'zova' {


}
declare module 'zova-module-basic-page' {

        export interface ControllerBlockFilter {
          /** @internal */
          get scope(): ScopeModuleBasicPage;
        }

        export interface ControllerBlockFilterActions {
          /** @internal */
          get scope(): ScopeModuleBasicPage;
        }

        export interface ControllerBlockPage {
          /** @internal */
          get scope(): ScopeModuleBasicPage;
        }

        export interface ControllerBlockPager {
          /** @internal */
          get scope(): ScopeModuleBasicPage;
        }

        export interface ControllerBlockTable {
          /** @internal */
          get scope(): ScopeModuleBasicPage;
        }

        export interface ControllerBlockToolbarBulk {
          /** @internal */
          get scope(): ScopeModuleBasicPage;
        }
}
/** controller: end */
/** controller: begin */
import type { ControllerBlockFilter } from '../component/blockFilter/controller.tsx';
import type { ControllerBlockFilterActions } from '../component/blockFilterActions/controller.tsx';
import type { ControllerBlockPage } from '../component/blockPage/controller.tsx';
import type { ControllerBlockPager } from '../component/blockPager/controller.tsx';
import type { ControllerBlockTable } from '../component/blockTable/controller.tsx';
import type { ControllerBlockToolbarBulk } from '../component/blockToolbarBulk/controller.tsx';
import 'zova';
declare module 'zova' {
  export interface IBeanRecordLocal {
    'basic-page.controller.blockFilter': ControllerBlockFilter;
'basic-page.controller.blockFilterActions': ControllerBlockFilterActions;
'basic-page.controller.blockPage': ControllerBlockPage;
'basic-page.controller.blockPager': ControllerBlockPager;
'basic-page.controller.blockTable': ControllerBlockTable;
'basic-page.controller.blockToolbarBulk': ControllerBlockToolbarBulk;
  }
}
/** controller: end */

/** components: begin */
export * from './component/blockFilter.ts';
import { ZBlockFilter } from './component/blockFilter.ts';
export * from './component/blockFilterActions.ts';
import { ZBlockFilterActions } from './component/blockFilterActions.ts';
export * from './component/blockPage.ts';
import { ZBlockPage } from './component/blockPage.ts';
export * from './component/blockPager.ts';
import { ZBlockPager } from './component/blockPager.ts';
export * from './component/blockTable.ts';
import { ZBlockTable } from './component/blockTable.ts';
export * from './component/blockToolbarBulk.ts';
import { ZBlockToolbarBulk } from './component/blockToolbarBulk.ts';
export const components = {
  'blockFilter': ZBlockFilter,
'blockFilterActions': ZBlockFilterActions,
'blockPage': ZBlockPage,
'blockPager': ZBlockPager,
'blockTable': ZBlockTable,
'blockToolbarBulk': ZBlockToolbarBulk,
};
import 'zova';
declare module 'zova' {
export interface IComponentRecord {
  'basic-page:blockFilter': ControllerBlockFilter;
'basic-page:blockFilterActions': ControllerBlockFilterActions;
'basic-page:blockPage': ControllerBlockPage;
'basic-page:blockPager': ControllerBlockPager;
'basic-page:blockTable': ControllerBlockTable;
'basic-page:blockToolbarBulk': ControllerBlockToolbarBulk;
}
export interface IZovaComponentRecord {
  'basic-page:blockFilter': typeof ZBlockFilter;
'basic-page:blockFilterActions': typeof ZBlockFilterActions;
'basic-page:blockPage': typeof ZBlockPage;
'basic-page:blockPager': typeof ZBlockPager;
'basic-page:blockTable': typeof ZBlockTable;
'basic-page:blockToolbarBulk': typeof ZBlockToolbarBulk;
}
}
/** components: end */
/** locale: begin */
import { locales } from './locales.ts';
/** locale: end */
/** scope: begin */
import { BeanScopeBase, type BeanScopeUtil, TypeModuleLocales, TypeLocaleBase } from 'zova';
import { Scope } from 'zova-module-a-bean';

@Scope()
export class ScopeModuleBasicPage extends BeanScopeBase {}

export interface ScopeModuleBasicPage {
  util: BeanScopeUtil;
locale: TypeModuleLocales<(typeof locales)[TypeLocaleBase]>;
}

import 'zova';
declare module 'zova' {
  export interface IBeanScopeRecord {
    'basic-page': ScopeModuleBasicPage;
  }



  export interface IBeanScopeLocale {
    'basic-page': (typeof locales)[TypeLocaleBase];
  }


}

export function locale<K extends keyof (typeof locales)[TypeLocaleBase]>(key: K): `basic-page::${K}` {
  return `basic-page::${key}`;
}
/** scope: end */
