// eslint-disable
/** imageProvider: begin */
export * from '../bean/imageProvider.cloudflare.ts';
import type { IImageProviderOptionsCloudflare } from '../bean/imageProvider.cloudflare.ts';
import 'vona-module-a-image';
declare module 'vona-module-a-image' {
  export interface IImageProviderRecord {
    'image-cloudflare:cloudflare': IImageProviderOptionsCloudflare;
  }
}
declare module 'vona-module-image-cloudflare' {
  export interface ImageProviderCloudflare {
    /** @internal */
    get scope(): ScopeModuleImageCloudflare;
  }

  export interface ImageProviderCloudflare {
    get $beanFullName(): 'image-cloudflare.imageProvider.cloudflare';
    get $onionName(): 'image-cloudflare:cloudflare';
    get $onionOptions(): IImageProviderOptionsCloudflare;
  }
}
/** imageProvider: end */
/** scope: begin */
import { BeanScopeBase, type BeanScopeUtil } from 'vona';
import { Scope } from 'vona-module-a-bean';

@Scope()
export class ScopeModuleImageCloudflare extends BeanScopeBase {}

export interface ScopeModuleImageCloudflare {
  util: BeanScopeUtil;
}

import 'vona';
declare module 'vona' {
  export interface IBeanScopeRecord {
    'image-cloudflare': ScopeModuleImageCloudflare;
  }

  export interface IBeanScopeContainer {
    imageCloudflare: ScopeModuleImageCloudflare;
  }
}
/** scope: end */
