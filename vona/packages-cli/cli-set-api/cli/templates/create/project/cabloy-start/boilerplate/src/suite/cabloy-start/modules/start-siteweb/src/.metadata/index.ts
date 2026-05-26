// eslint-disable
/** ssrSite: begin */
export * from '../bean/ssrSite.web.ts';
import type { ISsrSiteOptionsWeb } from '../bean/ssrSite.web.ts';
import 'vona-module-a-ssr';
declare module 'vona-module-a-ssr' {
  
    export interface ISsrSiteRecord {
      'start-siteweb:web': ISsrSiteOptionsWeb;
    }

  
}
declare module 'vona-module-start-siteweb' {
  
        export interface SsrSiteWeb {
          /** @internal */
          get scope(): ScopeModuleStartSiteweb;
        }

          export interface SsrSiteWeb {
            get $beanFullName(): 'start-siteweb.ssrSite.web';
            get $onionName(): 'start-siteweb:web';
            get $onionOptions(): ISsrSiteOptionsWeb;
          } 
}
/** ssrSite: end */
/** scope: begin */
import { BeanScopeBase, type BeanScopeUtil } from 'vona';
import { Scope } from 'vona-module-a-bean';

@Scope()
export class ScopeModuleStartSiteweb extends BeanScopeBase {}

export interface ScopeModuleStartSiteweb {
  util: BeanScopeUtil;
}

import 'vona';
declare module 'vona' {
  export interface IBeanScopeRecord {
    'start-siteweb': ScopeModuleStartSiteweb;
  }

  export interface IBeanScopeContainer {
    startSiteweb: ScopeModuleStartSiteweb;
  }
  
  

  

  
}
/** scope: end */
