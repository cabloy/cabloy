// eslint-disable
import type { TypeControllerOptionsActions } from 'vona-module-a-openapi';
/** controller: begin */
export * from '../controller/image.ts';
import type { IControllerOptionsImage } from '../controller/image.ts';
import 'vona-module-a-web';
declare module 'vona-module-a-web' {
  export interface IControllerRecord {
    'test-image:image': IControllerOptionsImage;
  }
}
declare module 'vona-module-test-image' {
  export interface ControllerImage {
    /** @internal */
    get scope(): ScopeModuleTestImage;
  }

  export interface ControllerImage {
    get $beanFullName(): 'test-image.controller.image';
    get $onionName(): 'test-image:image';
    get $onionOptions(): IControllerOptionsImage;
  }
}
/** controller: end */
/** controller: begin */
import type { ControllerImage } from '../controller/image.ts';
declare module 'vona-module-test-image' {
  export interface IControllerOptionsImage {
    actions?: TypeControllerOptionsActions<ControllerImage>;
  }
}
declare module 'vona-module-a-web' {
  export interface IApiPathPostRecord {
    '/test/image/upload': undefined;
  }
}
/** controller: end */
/** meta: begin */
export * from '../bean/meta.version.ts';

import 'vona-module-a-meta';
declare module 'vona-module-a-meta' {
  export interface IMetaRecord {
    'test-image:version': never;
  }
}
declare module 'vona-module-test-image' {
  export interface MetaVersion {
    /** @internal */
    get scope(): ScopeModuleTestImage;
  }

  export interface MetaVersion {
    get $beanFullName(): 'test-image.meta.version';
    get $onionName(): 'test-image:version';
  }
}
/** meta: end */
/** scope: begin */
import { BeanScopeBase, type BeanScopeUtil } from 'vona';
import { Scope } from 'vona-module-a-bean';

@Scope()
export class ScopeModuleTestImage extends BeanScopeBase {}

export interface ScopeModuleTestImage {
  util: BeanScopeUtil;
}

import 'vona';
declare module 'vona' {
  export interface IBeanScopeRecord {
    'test-image': ScopeModuleTestImage;
  }

  export interface IBeanScopeContainer {
    testImage: ScopeModuleTestImage;
  }
}
/** scope: end */
