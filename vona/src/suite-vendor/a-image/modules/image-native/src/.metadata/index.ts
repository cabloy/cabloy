// eslint-disable
import type { TypeControllerOptionsActions } from 'vona-module-a-openapi';
/** service: begin */
export * from '../service/imageNative.ts';

import 'vona-module-a-bean';
declare module 'vona-module-a-bean' {
  
    export interface IServiceRecord {
      'image-native:imageNative': never;
    }

  
}
declare module 'vona-module-image-native' {
  
        export interface ServiceImageNative {
          /** @internal */
          get scope(): ScopeModuleImageNative;
        }

          export interface ServiceImageNative {
            get $beanFullName(): 'image-native.service.imageNative';
            get $onionName(): 'image-native:imageNative';
            
          } 
}
/** service: end */
/** service: begin */
import type { ServiceImageNative } from '../service/imageNative.ts';
export interface IModuleService {
  'imageNative': ServiceImageNative;
}
/** service: end */
/** service: begin */

import 'vona';
declare module 'vona' {
  export interface IBeanRecordGeneral {
    'image-native.service.imageNative': ServiceImageNative;
  }
}
/** service: end */
/** imageProvider: begin */
export * from '../bean/imageProvider.native.ts';
import type { IImageProviderOptionsNative } from '../bean/imageProvider.native.ts';
import 'vona-module-a-image';
declare module 'vona-module-a-image' {
  
    export interface IImageProviderRecord {
      'image-native:native': IImageProviderOptionsNative;
    }

  
}
declare module 'vona-module-image-native' {
  
        export interface ImageProviderNative {
          /** @internal */
          get scope(): ScopeModuleImageNative;
        }

          export interface ImageProviderNative {
            get $beanFullName(): 'image-native.imageProvider.native';
            get $onionName(): 'image-native:native';
            get $onionOptions(): IImageProviderOptionsNative;
          } 
}
/** imageProvider: end */
/** imageProvider: begin */
import type { ImageProviderNative } from '../bean/imageProvider.native.ts';
export interface IModuleImageProvider {
  'native': ImageProviderNative;
}
/** imageProvider: end */
/** controller: begin */
export * from '../controller/image.ts';
import type { IControllerOptionsImage } from '../controller/image.ts';
import 'vona-module-a-web';
declare module 'vona-module-a-web' {
  export interface IControllerRecord {
    'image-native:image': IControllerOptionsImage;
  }
}
declare module 'vona-module-image-native' {
  export interface ControllerImage {
    /** @internal */
    get scope(): ScopeModuleImageNative;
  }

  export interface ControllerImage {
    get $beanFullName(): 'image-native.controller.image';
    get $onionName(): 'image-native:image';
    get $onionOptions(): IControllerOptionsImage;
  }
}
/** controller: end */
/** controller: begin */
// @ts-ignore ignore
import type { ControllerImage } from '../controller/image.ts';
declare module 'vona-module-image-native' {
  export interface IControllerOptionsImage {
    actions?: TypeControllerOptionsActions<ControllerImage>;
  }
}
declare module 'vona-module-a-web' {
  export interface IApiPathPostRecord {
    '/image-native/direct-upload/:resourceId': undefined;
  }
}
/** controller: end */
/** config: begin */
export * from '../config/config.ts';
import type { config } from '../config/config.ts';
/** config: end */
/** monkey: begin */
export * from '../monkey.ts';
/** monkey: end */
/** scope: begin */
import { BeanScopeBase, type BeanScopeUtil, type TypeModuleConfig } from 'vona';
import { Scope } from 'vona-module-a-bean';

@Scope()
export class ScopeModuleImageNative extends BeanScopeBase {}

export interface ScopeModuleImageNative {
  util: BeanScopeUtil;
config: TypeModuleConfig<typeof config>;
service: IModuleService;
imageProvider: IModuleImageProvider;
}

import 'vona';
declare module 'vona' {
  export interface IBeanScopeRecord {
    'image-native': ScopeModuleImageNative;
  }

  export interface IBeanScopeContainer {
    imageNative: ScopeModuleImageNative;
  }
  
  export interface IBeanScopeConfig {
    'image-native': ReturnType<typeof config>;
  }

  

  
}
/** scope: end */
