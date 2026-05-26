// eslint-disable
/** css: begin */
export * from '../bean/css.base.js';
import { ICssOptionsBase } from '../bean/css.base.js';
import 'zova-module-a-style';
declare module 'zova-module-a-style' {
  
    export interface ICssRecord {
      'home-theme:base': ICssOptionsBase;
    }

  
}
declare module 'zova-module-home-theme' {
  
        export interface CssBase {
          /** @internal */
          get scope(): ScopeModuleHomeTheme;
        }

        export interface CssBase {
          get $beanFullName(): 'home-theme.css.base';
          get $onionName(): 'home-theme:base';
          get $onionOptions(): ICssOptionsBase;
        } 
}
/** css: end */
/** css: begin */
import { CssBase } from '../bean/css.base.js';
import 'zova';
declare module 'zova' {
  export interface IBeanRecordLocal {
    'home-theme.css.base': CssBase;
  }
}
/** css: end */
/** theme: begin */
export * from '../bean/theme.default.js';
export * from '../bean/theme.orange.js';
import { IThemeOptionsDefault } from '../bean/theme.default.js';
import { IThemeOptionsOrange } from '../bean/theme.orange.js';
import 'zova-module-a-style';
declare module 'zova-module-a-style' {
  
    export interface IThemeRecord {
      'home-theme:default': IThemeOptionsDefault;
'home-theme:orange': IThemeOptionsOrange;
    }

  
}
declare module 'zova-module-home-theme' {
  
        export interface ThemeDefault {
          /** @internal */
          get scope(): ScopeModuleHomeTheme;
        }

        export interface ThemeDefault {
          get $beanFullName(): 'home-theme.theme.default';
          get $onionName(): 'home-theme:default';
          get $onionOptions(): IThemeOptionsDefault;
        }

        export interface ThemeOrange {
          /** @internal */
          get scope(): ScopeModuleHomeTheme;
        }

        export interface ThemeOrange {
          get $beanFullName(): 'home-theme.theme.orange';
          get $onionName(): 'home-theme:orange';
          get $onionOptions(): IThemeOptionsOrange;
        } 
}
/** theme: end */
/** theme: begin */
import { ThemeDefault } from '../bean/theme.default.js';
import { ThemeOrange } from '../bean/theme.orange.js';
import 'zova';
declare module 'zova' {
  export interface IBeanRecordLocal {
    'home-theme.theme.default': ThemeDefault;
'home-theme.theme.orange': ThemeOrange;
  }
}
/** theme: end */
/** scope: begin */
import { BeanScopeBase, type BeanScopeUtil } from 'zova';
import { Scope } from 'zova-module-a-bean';

@Scope()
export class ScopeModuleHomeTheme extends BeanScopeBase {}

export interface ScopeModuleHomeTheme {
  util: BeanScopeUtil;
}

import 'zova';
declare module 'zova' {
  export interface IBeanScopeRecord {
    'home-theme': ScopeModuleHomeTheme;
  }
  
  

  

  
}
  
/** scope: end */
