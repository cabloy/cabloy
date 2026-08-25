// eslint-disable
/** controller: begin */
export * from '../component/formFieldMarkdown/controller.jsx';
export * from '../component/markdownHtml/controller.jsx';

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
import { ControllerFormFieldMarkdown } from '../component/formFieldMarkdown/controller.jsx';
import { ControllerMarkdownHtml } from '../component/markdownHtml/controller.jsx';
import 'zova';
declare module 'zova' {
  export interface IBeanRecordLocal {
    'basic-markdown.controller.formFieldMarkdown': ControllerFormFieldMarkdown;
'basic-markdown.controller.markdownHtml': ControllerMarkdownHtml;
  }
}
/** controller: end */

/** components: begin */
export * from './component/formFieldMarkdown.js';
import { ZFormFieldMarkdown } from './component/formFieldMarkdown.js';
export * from './component/markdownHtml.js';
import { ZMarkdownHtml } from './component/markdownHtml.js';
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
export * from '../component/formFieldMarkdown/render.jsx';
export * from '../component/markdownHtml/render.jsx';

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
import { RenderFormFieldMarkdown } from '../component/formFieldMarkdown/render.jsx';
import { RenderMarkdownHtml } from '../component/markdownHtml/render.jsx';
import 'zova';
declare module 'zova' {
  export interface IBeanRecordLocal {
    'basic-markdown.render.formFieldMarkdown': RenderFormFieldMarkdown;
'basic-markdown.render.markdownHtml': RenderMarkdownHtml;
  }
}
/** render: end */
/** style: begin */
export * from '../component/formFieldMarkdown/style.js';
export * from '../component/markdownHtml/style.js';

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
import { StyleFormFieldMarkdown } from '../component/formFieldMarkdown/style.js';
import { StyleMarkdownHtml } from '../component/markdownHtml/style.js';
import 'zova';
declare module 'zova' {
  export interface IBeanRecordLocal {
    'basic-markdown.style.formFieldMarkdown': StyleFormFieldMarkdown;
'basic-markdown.style.markdownHtml': StyleMarkdownHtml;
  }
}
/** style: end */
/** locale: begin */
import { locales } from './locales.js';
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
