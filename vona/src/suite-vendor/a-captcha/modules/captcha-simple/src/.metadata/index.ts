// eslint-disable
/** captchaProvider: begin */
export * from '../bean/captchaProvider.imageText.ts';
import type { ICaptchaProviderOptionsImageText } from '../bean/captchaProvider.imageText.ts';
import 'vona-module-a-captcha';
declare module 'vona-module-a-captcha' {
  
    export interface ICaptchaProviderRecord {
      'captcha-simple:imageText': ICaptchaProviderOptionsImageText;
    }

  
}
declare module 'vona-module-captcha-simple' {
  
        export interface CaptchaProviderImageText {
          /** @internal */
          get scope(): ScopeModuleCaptchaSimple;
        }

          export interface CaptchaProviderImageText {
            get $beanFullName(): 'captcha-simple.captchaProvider.imageText';
            get $onionName(): 'captcha-simple:imageText';
            get $onionOptions(): ICaptchaProviderOptionsImageText;
          } 
}
/** captchaProvider: end */
/** captchaScene: begin */
export * from '../bean/captchaScene.simple.ts';

import { type IDecoratorCaptchaSceneOptions } from 'vona-module-a-captcha';
declare module 'vona-module-a-captcha' {
  
    export interface ICaptchaSceneRecord {
      'captcha-simple:simple': IDecoratorCaptchaSceneOptions;
    }

  
}
declare module 'vona-module-captcha-simple' {
  
        export interface CaptchaSceneSimple {
          /** @internal */
          get scope(): ScopeModuleCaptchaSimple;
        }

          export interface CaptchaSceneSimple {
            get $beanFullName(): 'captcha-simple.captchaScene.simple';
            get $onionName(): 'captcha-simple:simple';
            get $onionOptions(): IDecoratorCaptchaSceneOptions;
          } 
}
/** captchaScene: end */
/** meta: begin */
export * from '../bean/meta.asset.ts';

import 'vona-module-a-meta';
declare module 'vona-module-a-meta' {
  
    export interface IMetaRecord {
      'captcha-simple:asset': never;
    }

  
}
declare module 'vona-module-captcha-simple' {
  
        export interface MetaAsset {
          /** @internal */
          get scope(): ScopeModuleCaptchaSimple;
        }

          export interface MetaAsset {
            get $beanFullName(): 'captcha-simple.meta.asset';
            get $onionName(): 'captcha-simple:asset';
            
          } 
}
/** meta: end */
/** meta asset: begin */
import type { MetaAsset } from '../bean/meta.asset.ts';
/** meta asset: end */
/** scope: begin */
import { BeanScopeBase, type BeanScopeUtil } from 'vona';
import { Scope } from 'vona-module-a-bean';

@Scope()
export class ScopeModuleCaptchaSimple extends BeanScopeBase {}

export interface ScopeModuleCaptchaSimple {
  util: BeanScopeUtil;
asset: MetaAsset;
}

import 'vona';
declare module 'vona' {
  export interface IBeanScopeRecord {
    'captcha-simple': ScopeModuleCaptchaSimple;
  }

  export interface IBeanScopeContainer {
    captchaSimple: ScopeModuleCaptchaSimple;
  }
  
  

  

  
}
/** scope: end */
