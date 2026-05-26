// eslint-disable
/** tool: begin */
export * from '../bean/tool.v.js';

import 'zova';
declare module 'zova' {
  
  
}
declare module 'zova-module-a-zod' {
  
        export interface ToolV {
          /** @internal */
          get scope(): ScopeModuleAZod;
        }

        export interface ToolV {
          get $beanFullName(): 'a-zod.tool.v';
          get $onionName(): 'a-zod:v';
          
        } 
}
/** tool: end */
/** tool: begin */
import { ToolV } from '../bean/tool.v.js';
import 'zova';
declare module 'zova' {
  export interface IBeanRecordGeneral {
    'a-zod.tool.v': ToolV;
  }
}
/** tool: end */
/** locale: begin */
import { locales } from './locales.js';
/** locale: end */
/** scope: begin */
import { BeanScopeBase, type BeanScopeUtil, TypeModuleLocales, TypeLocaleBase } from 'zova';
import { Scope } from 'zova-module-a-bean';

@Scope()
export class ScopeModuleAZod extends BeanScopeBase {}

export interface ScopeModuleAZod {
  util: BeanScopeUtil;
locale: TypeModuleLocales<(typeof locales)[TypeLocaleBase]>;
}

import 'zova';
declare module 'zova' {
  export interface IBeanScopeRecord {
    'a-zod': ScopeModuleAZod;
  }
  
  

  export interface IBeanScopeLocale {
    'a-zod': (typeof locales)[TypeLocaleBase];
  }

  
}

export function locale<K extends keyof (typeof locales)[TypeLocaleBase]>(key: K): `a-zod::${K}` {
  return `a-zod::${key}`;
}  
/** scope: end */
