// eslint-disable
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
