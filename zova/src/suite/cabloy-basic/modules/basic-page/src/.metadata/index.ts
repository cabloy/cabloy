// eslint-disable
/** controller: begin */
export * from '../component/blockFilter/controller.jsx';
export * from '../component/blockPage/controller.jsx';
export * from '../component/blockPager/controller.jsx';
export * from '../component/blockTable/controller.jsx';
export * from '../component/blockToolbarBulk/controller.jsx';

import 'zova';
declare module 'zova' {
  
  
}
declare module 'zova-module-basic-page' {
  
        export interface ControllerBlockFilter {
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
import { ControllerBlockFilter } from '../component/blockFilter/controller.jsx';
import { ControllerBlockPage } from '../component/blockPage/controller.jsx';
import { ControllerBlockPager } from '../component/blockPager/controller.jsx';
import { ControllerBlockTable } from '../component/blockTable/controller.jsx';
import { ControllerBlockToolbarBulk } from '../component/blockToolbarBulk/controller.jsx';
import 'zova';
declare module 'zova' {
  export interface IBeanRecordLocal {
    'basic-page.controller.blockFilter': ControllerBlockFilter;
'basic-page.controller.blockPage': ControllerBlockPage;
'basic-page.controller.blockPager': ControllerBlockPager;
'basic-page.controller.blockTable': ControllerBlockTable;
'basic-page.controller.blockToolbarBulk': ControllerBlockToolbarBulk;
  }
}
/** controller: end */

/** components: begin */
export * from './component/blockFilter.js';
import { ZBlockFilter } from './component/blockFilter.js';
export * from './component/blockPage.js';
import { ZBlockPage } from './component/blockPage.js';
export * from './component/blockPager.js';
import { ZBlockPager } from './component/blockPager.js';
export * from './component/blockTable.js';
import { ZBlockTable } from './component/blockTable.js';
export * from './component/blockToolbarBulk.js';
import { ZBlockToolbarBulk } from './component/blockToolbarBulk.js';
export const components = {
  'blockFilter': ZBlockFilter,
'blockPage': ZBlockPage,
'blockPager': ZBlockPager,
'blockTable': ZBlockTable,
'blockToolbarBulk': ZBlockToolbarBulk,
};
import 'zova';
declare module 'zova' {
export interface IComponentRecord {
  'basic-page:blockFilter': ControllerBlockFilter;
'basic-page:blockPage': ControllerBlockPage;
'basic-page:blockPager': ControllerBlockPager;
'basic-page:blockTable': ControllerBlockTable;
'basic-page:blockToolbarBulk': ControllerBlockToolbarBulk;
}
export interface IZovaComponentRecord {
  'basic-page:blockFilter': typeof ZBlockFilter;
'basic-page:blockPage': typeof ZBlockPage;
'basic-page:blockPager': typeof ZBlockPager;
'basic-page:blockTable': typeof ZBlockTable;
'basic-page:blockToolbarBulk': typeof ZBlockToolbarBulk;
}
}
/** components: end */
/** locale: begin */
import { locales } from './locales.js';
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
