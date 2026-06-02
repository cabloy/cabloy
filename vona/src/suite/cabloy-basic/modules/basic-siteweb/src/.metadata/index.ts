// eslint-disable
/** ssrSite: begin */
export * from '../bean/ssrSite.web.ts';
import type { ISsrSiteOptionsWeb } from '../bean/ssrSite.web.ts';
import 'vona-module-a-ssr';
declare module 'vona-module-a-ssr' {
  
    export interface ISsrSiteRecord {
      'basic-siteweb:web': ISsrSiteOptionsWeb;
    }

  
}
declare module 'vona-module-basic-siteweb' {
  
        export interface SsrSiteWeb {
          /** @internal */
          get scope(): ScopeModuleBasicSiteweb;
        }

          export interface SsrSiteWeb {
            get $beanFullName(): 'basic-siteweb.ssrSite.web';
            get $onionName(): 'basic-siteweb:web';
            get $onionOptions(): ISsrSiteOptionsWeb;
          } 
}
/** ssrSite: end */
/** scope: begin */
import { BeanScopeBase, type BeanScopeUtil } from 'vona';
import { Scope } from 'vona-module-a-bean';

@Scope()
export class ScopeModuleBasicSiteweb extends BeanScopeBase {}

export interface ScopeModuleBasicSiteweb {
  util: BeanScopeUtil;
}

import 'vona';
declare module 'vona' {
  export interface IBeanScopeRecord {
    'basic-siteweb': ScopeModuleBasicSiteweb;
  }

  export interface IBeanScopeContainer {
    basicSiteweb: ScopeModuleBasicSiteweb;
  }
  
  

  

  
}
/** scope: end */
