// eslint-disable
/** model: begin */
export * from '../model/draft.ts';
import { IModelOptionsDraft } from '../model/draft.ts';
import 'zova-module-a-model';
declare module 'zova-module-a-model' {

    export interface IModelRecord {
      'basic-pageentry:draft': IModelOptionsDraft;
    }


}
declare module 'zova-module-basic-pageentry' {

        export interface ModelDraft {
          /** @internal */
          get scope(): ScopeModuleBasicPageentry;
        }

        export interface ModelDraft {
          get $beanFullName(): 'basic-pageentry.model.draft';
          get $onionName(): 'basic-pageentry:draft';
          get $onionOptions(): IModelOptionsDraft;
        }
}
/** model: end */
/** model: begin */
import type { ModelDraft } from '../model/draft.ts';
import 'zova';
declare module 'zova' {
  export interface IBeanRecordGeneral {
    'basic-pageentry.model.draft': ModelDraft;
  }
}
/** model: end */
/** bean: begin */
export * from '../bean/bean.draftCoordinator.ts';

import 'zova';
declare module 'zova' {


}
declare module 'zova-module-basic-pageentry' {

        export interface BeanDraftCoordinator {
          /** @internal */
          get scope(): ScopeModuleBasicPageentry;
        }

        export interface BeanDraftCoordinator {
          get $beanFullName(): 'basic-pageentry.bean.draftCoordinator';
          get $onionName(): 'basic-pageentry:draftCoordinator';

        }
}
/** bean: end */
/** bean: begin */
import type { BeanDraftCoordinator } from '../bean/bean.draftCoordinator.ts';
import 'zova';
declare module 'zova' {
  export interface IBeanRecordGeneral {
    'basic-pageentry.bean.draftCoordinator': BeanDraftCoordinator;
  }
}
/** bean: end */
/** controller: begin */
export * from '../component/blockForm/controller.tsx';
export * from '../component/blockPageEntry/controller.tsx';
export * from '../component/blockToolbarRow/controller.tsx';

import 'zova';
declare module 'zova' {


}
declare module 'zova-module-basic-pageentry' {

        export interface ControllerBlockForm {
          /** @internal */
          get scope(): ScopeModuleBasicPageentry;
        }

        export interface ControllerBlockPageEntry {
          /** @internal */
          get scope(): ScopeModuleBasicPageentry;
        }

        export interface ControllerBlockToolbarRow {
          /** @internal */
          get scope(): ScopeModuleBasicPageentry;
        }
}
/** controller: end */
/** controller: begin */
import type { ControllerBlockForm } from '../component/blockForm/controller.tsx';
import type { ControllerBlockPageEntry } from '../component/blockPageEntry/controller.tsx';
import type { ControllerBlockToolbarRow } from '../component/blockToolbarRow/controller.tsx';
import 'zova';
declare module 'zova' {
  export interface IBeanRecordLocal {
    'basic-pageentry.controller.blockForm': ControllerBlockForm;
'basic-pageentry.controller.blockPageEntry': ControllerBlockPageEntry;
'basic-pageentry.controller.blockToolbarRow': ControllerBlockToolbarRow;
  }
}
/** controller: end */

/** components: begin */
export * from './component/blockForm.ts';
import { ZBlockForm } from './component/blockForm.ts';
export * from './component/blockPageEntry.ts';
import { ZBlockPageEntry } from './component/blockPageEntry.ts';
export * from './component/blockToolbarRow.ts';
import { ZBlockToolbarRow } from './component/blockToolbarRow.ts';
export const components = {
  'blockForm': ZBlockForm,
'blockPageEntry': ZBlockPageEntry,
'blockToolbarRow': ZBlockToolbarRow,
};
import 'zova';
declare module 'zova' {
export interface IComponentRecord {
  'basic-pageentry:blockForm': ControllerBlockForm;
'basic-pageentry:blockPageEntry': ControllerBlockPageEntry;
'basic-pageentry:blockToolbarRow': ControllerBlockToolbarRow;
}
export interface IZovaComponentRecord {
  'basic-pageentry:blockForm': typeof ZBlockForm;
'basic-pageentry:blockPageEntry': typeof ZBlockPageEntry;
'basic-pageentry:blockToolbarRow': typeof ZBlockToolbarRow;
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
/** scope: begin */
import { BeanScopeBase, type BeanScopeUtil, TypeModuleConfig, TypeModuleLocales, TypeLocaleBase } from 'zova';
import { Scope } from 'zova-module-a-bean';

@Scope()
export class ScopeModuleBasicPageentry extends BeanScopeBase {}

export interface ScopeModuleBasicPageentry {
  util: BeanScopeUtil;
config: TypeModuleConfig<typeof config>;
locale: TypeModuleLocales<(typeof locales)[TypeLocaleBase]>;
}

import 'zova';
declare module 'zova' {
  export interface IBeanScopeRecord {
    'basic-pageentry': ScopeModuleBasicPageentry;
  }

  export interface IBeanScopeConfig {
    'basic-pageentry': ReturnType<typeof config>;
  }

  export interface IBeanScopeLocale {
    'basic-pageentry': (typeof locales)[TypeLocaleBase];
  }


}

export function locale<K extends keyof (typeof locales)[TypeLocaleBase]>(key: K): `basic-pageentry::${K}` {
  return `basic-pageentry::${key}`;
}
/** scope: end */
