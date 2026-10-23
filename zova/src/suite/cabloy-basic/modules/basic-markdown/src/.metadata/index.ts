// eslint-disable
/** controller: begin */
export * from '../component/formFieldMarkdown/controller.tsx';
export * from '../component/markdownHtml/controller.tsx';

import 'zova';
declare module 'zova' {


}
declare module 'zova-module-basic-markdown' {

        export interface ControllerFormFieldMarkdown {
          /** @internal */
          get scope(): ScopeModuleBasicMarkdown;
        }

        export interface ControllerMarkdownHtml {
          /** @internal */
          get scope(): ScopeModuleBasicMarkdown;
        }
}
/** controller: end */
/** controller: begin */
import type { ControllerFormFieldMarkdown } from '../component/formFieldMarkdown/controller.tsx';
import type { ControllerMarkdownHtml } from '../component/markdownHtml/controller.tsx';
import 'zova';
declare module 'zova' {
  export interface IBeanRecordLocal {
    'basic-markdown.controller.formFieldMarkdown': ControllerFormFieldMarkdown;
'basic-markdown.controller.markdownHtml': ControllerMarkdownHtml;
  }
}
/** controller: end */

/** components: begin */
export * from './component/formFieldMarkdown.ts';
import { ZFormFieldMarkdown } from './component/formFieldMarkdown.ts';
export * from './component/markdownHtml.ts';
import { ZMarkdownHtml } from './component/markdownHtml.ts';
export const components = {
  'formFieldMarkdown': ZFormFieldMarkdown,
'markdownHtml': ZMarkdownHtml,
};
import 'zova';
declare module 'zova' {
export interface IComponentRecord {
  'basic-markdown:formFieldMarkdown': ControllerFormFieldMarkdown;
'basic-markdown:markdownHtml': ControllerMarkdownHtml;
}
export interface IZovaComponentRecord {
  'basic-markdown:formFieldMarkdown': typeof ZFormFieldMarkdown;
'basic-markdown:markdownHtml': typeof ZMarkdownHtml;
}
}
/** components: end */
/** render: begin */
export * from '../component/formFieldMarkdown/render.tsx';
export * from '../component/markdownHtml/render.tsx';

import 'zova';
declare module 'zova' {


}
declare module 'zova-module-basic-markdown' {

        export interface RenderFormFieldMarkdown {
          /** @internal */
          get scope(): ScopeModuleBasicMarkdown;
        }

        export interface RenderMarkdownHtml {
          /** @internal */
          get scope(): ScopeModuleBasicMarkdown;
        }
}
/** render: end */
/** render: begin */
import type { RenderFormFieldMarkdown } from '../component/formFieldMarkdown/render.tsx';
import type { RenderMarkdownHtml } from '../component/markdownHtml/render.tsx';
import 'zova';
declare module 'zova' {
  export interface IBeanRecordLocal {
    'basic-markdown.render.formFieldMarkdown': RenderFormFieldMarkdown;
'basic-markdown.render.markdownHtml': RenderMarkdownHtml;
  }
}
/** render: end */
/** style: begin */
export * from '../component/formFieldMarkdown/style.ts';
export * from '../component/markdownHtml/style.ts';

import 'zova';
declare module 'zova' {


}
declare module 'zova-module-basic-markdown' {

        export interface StyleFormFieldMarkdown {
          /** @internal */
          get scope(): ScopeModuleBasicMarkdown;
        }

        export interface StyleMarkdownHtml {
          /** @internal */
          get scope(): ScopeModuleBasicMarkdown;
        }
}
/** style: end */
/** style: begin */
import type { StyleFormFieldMarkdown } from '../component/formFieldMarkdown/style.ts';
import type { StyleMarkdownHtml } from '../component/markdownHtml/style.ts';
import 'zova';
declare module 'zova' {
  export interface IBeanRecordLocal {
    'basic-markdown.style.formFieldMarkdown': StyleFormFieldMarkdown;
'basic-markdown.style.markdownHtml': StyleMarkdownHtml;
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
export class ScopeModuleBasicMarkdown extends BeanScopeBase {}

export interface ScopeModuleBasicMarkdown {
  util: BeanScopeUtil;
locale: TypeModuleLocales<(typeof locales)[TypeLocaleBase]>;
}

import 'zova';
declare module 'zova' {
  export interface IBeanScopeRecord {
    'basic-markdown': ScopeModuleBasicMarkdown;
  }



  export interface IBeanScopeLocale {
    'basic-markdown': (typeof locales)[TypeLocaleBase];
  }


}

export function locale<K extends keyof (typeof locales)[TypeLocaleBase]>(key: K): `basic-markdown::${K}` {
  return `basic-markdown::${key}`;
}
/** scope: end */
