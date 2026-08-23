// eslint-disable
/** meta: begin */
export * from '../bean/meta.version.ts';

import 'vona-module-a-meta';
declare module 'vona-module-a-meta' {

    export interface IMetaRecord {
      'commerce-seed:version': never;
    }


}
declare module 'vona-module-commerce-seed' {

        export interface MetaVersion {
          /** @internal */
          get scope(): ScopeModuleCommerceSeed;
        }

          export interface MetaVersion {
            get $beanFullName(): 'commerce-seed.meta.version';
            get $onionName(): 'commerce-seed:version';
          }
}
/** meta: end */
/** scope: begin */
import { BeanScopeBase, type BeanScopeUtil } from 'vona';
import { Scope } from 'vona-module-a-bean';

@Scope()
export class ScopeModuleCommerceSeed extends BeanScopeBase {}

export interface ScopeModuleCommerceSeed {
  util: BeanScopeUtil;
}

import 'vona';
declare module 'vona' {
  export interface IBeanScopeRecord {
    'commerce-seed': ScopeModuleCommerceSeed;
  }

  export interface IBeanScopeContainer {
    commerceSeed: ScopeModuleCommerceSeed;
  }






}
/** scope: end */
