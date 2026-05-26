// eslint-disable
/** interceptor: begin */
export * from '../bean/interceptor.ssrRedirect.ts';
export * from '../bean/interceptor.ssrRender.ts';
import type { IInterceptorOptionsSsrRedirect } from '../bean/interceptor.ssrRedirect.ts';
import type { IInterceptorOptionsSsrRender } from '../bean/interceptor.ssrRender.ts';
import 'vona-module-a-aspect';
declare module 'vona-module-a-aspect' {
  
  
export interface IInterceptorRecordLocal {
  'a-ssr:ssrRedirect': IInterceptorOptionsSsrRedirect;
'a-ssr:ssrRender': IInterceptorOptionsSsrRender;
}

}
declare module 'vona-module-a-ssr' {
  
        export interface InterceptorSsrRedirect {
          /** @internal */
          get scope(): ScopeModuleASsr;
        }

          export interface InterceptorSsrRedirect {
            get $beanFullName(): 'a-ssr.interceptor.ssrRedirect';
            get $onionName(): 'a-ssr:ssrRedirect';
            get $onionOptions(): IInterceptorOptionsSsrRedirect;
          }

        export interface InterceptorSsrRender {
          /** @internal */
          get scope(): ScopeModuleASsr;
        }

          export interface InterceptorSsrRender {
            get $beanFullName(): 'a-ssr.interceptor.ssrRender';
            get $onionName(): 'a-ssr:ssrRender';
            get $onionOptions(): IInterceptorOptionsSsrRender;
          } 
}
/** interceptor: end */
/** middleware: begin */
export * from '../bean/middleware.ssrPassport.ts';
import type { IMiddlewareOptionsSsrPassport } from '../bean/middleware.ssrPassport.ts';
import 'vona-module-a-aspect';
declare module 'vona-module-a-aspect' {
  
    export interface IMiddlewareRecordGlobal {
      'a-ssr:ssrPassport': IMiddlewareOptionsSsrPassport;
    }

  
}
declare module 'vona-module-a-ssr' {
  
        export interface MiddlewareSsrPassport {
          /** @internal */
          get scope(): ScopeModuleASsr;
        }

          export interface MiddlewareSsrPassport {
            get $beanFullName(): 'a-ssr.middleware.ssrPassport';
            get $onionName(): 'a-ssr:ssrPassport';
            get $onionOptions(): IMiddlewareOptionsSsrPassport;
          } 
}
/** middleware: end */
/** bean: begin */
export * from '../bean/bean.ssr.ts';

import 'vona';
declare module 'vona' {
  
  
}
declare module 'vona-module-a-ssr' {
  
        export interface BeanSsr {
          /** @internal */
          get scope(): ScopeModuleASsr;
        } 
}
/** bean: end */
/** bean: begin */
import type { BeanSsr } from '../bean/bean.ssr.ts';
import 'vona';  
declare module 'vona' {
  export interface IBeanRecordGlobal {
    'ssr': BeanSsr;
  }
}
/** bean: end */
/** service: begin */
export * from '../service/devProxy.ts';
export * from '../service/ssr.ts';
export * from '../service/ssrHandler.ts';

import 'vona-module-a-bean';
declare module 'vona-module-a-bean' {
  
    export interface IServiceRecord {
      'a-ssr:devProxy': never;
'a-ssr:ssr': never;
'a-ssr:ssrHandler': never;
    }

  
}
declare module 'vona-module-a-ssr' {
  
        export interface ServiceDevProxy {
          /** @internal */
          get scope(): ScopeModuleASsr;
        }

          export interface ServiceDevProxy {
            get $beanFullName(): 'a-ssr.service.devProxy';
            get $onionName(): 'a-ssr:devProxy';
            
          }

        export interface ServiceSsr {
          /** @internal */
          get scope(): ScopeModuleASsr;
        }

          export interface ServiceSsr {
            get $beanFullName(): 'a-ssr.service.ssr';
            get $onionName(): 'a-ssr:ssr';
            
          }

        export interface ServiceSsrHandler {
          /** @internal */
          get scope(): ScopeModuleASsr;
        }

          export interface ServiceSsrHandler {
            get $beanFullName(): 'a-ssr.service.ssrHandler';
            get $onionName(): 'a-ssr:ssrHandler';
            
          } 
}
/** service: end */
/** service: begin */
import type { ServiceDevProxy } from '../service/devProxy.ts';
import type { ServiceSsr } from '../service/ssr.ts';
import type { ServiceSsrHandler } from '../service/ssrHandler.ts';
export interface IModuleService {
  'devProxy': ServiceDevProxy;
'ssr': ServiceSsr;
'ssrHandler': ServiceSsrHandler;
}
/** service: end */
/** service: begin */

import 'vona';
declare module 'vona' {
  export interface IBeanRecordGeneral {
    'a-ssr.service.devProxy': ServiceDevProxy;
'a-ssr.service.ssr': ServiceSsr;
'a-ssr.service.ssrHandler': ServiceSsrHandler;
  }
}
/** service: end */
/** event: begin */
export * from '../bean/event.retrieveMenus.ts';
export * from '../bean/event.retrieveMenusSite.ts';

import 'vona';
declare module 'vona' {
  
  
}
declare module 'vona-module-a-ssr' {
  
        export interface EventRetrieveMenus {
          /** @internal */
          get scope(): ScopeModuleASsr;
        }

          export interface EventRetrieveMenus {
            get $beanFullName(): 'a-ssr.event.retrieveMenus';
            get $onionName(): 'a-ssr:retrieveMenus';
            
          }

        export interface EventRetrieveMenusSite {
          /** @internal */
          get scope(): ScopeModuleASsr;
        }

          export interface EventRetrieveMenusSite {
            get $beanFullName(): 'a-ssr.event.retrieveMenusSite';
            get $onionName(): 'a-ssr:retrieveMenusSite';
            
          } 
}
/** event: end */
/** event: begin */
import type { EventRetrieveMenus } from '../bean/event.retrieveMenus.ts';
import type { EventRetrieveMenusSite } from '../bean/event.retrieveMenusSite.ts';
export interface IModuleEvent {
  'retrieveMenus': EventRetrieveMenus;
'retrieveMenusSite': EventRetrieveMenusSite;
}
/** event: end */
/** event: begin */
import type { TypeEventRetrieveMenusData, TypeEventRetrieveMenusResult } from '../bean/event.retrieveMenus.ts';
import type { TypeEventRetrieveMenusSiteData, TypeEventRetrieveMenusSiteResult } from '../bean/event.retrieveMenusSite.ts';
import type { EventOn } from 'vona-module-a-event'; 
declare module 'vona-module-a-event' {
  export interface IEventRecord {
    'a-ssr:retrieveMenus': EventOn<TypeEventRetrieveMenusData, TypeEventRetrieveMenusResult>;
'a-ssr:retrieveMenusSite': EventOn<TypeEventRetrieveMenusSiteData, TypeEventRetrieveMenusSiteResult>;
  }
}
/** event: end */
/** eventListener: begin */
export * from '../bean/eventListener.hmrReload.ts';
export * from '../bean/eventListener.resolvePath.ts';

import { type IDecoratorEventListenerOptions } from 'vona-module-a-event';
declare module 'vona-module-a-event' {
  
    export interface IEventListenerRecord {
      'a-ssr:hmrReload': IDecoratorEventListenerOptions;
'a-ssr:resolvePath': IDecoratorEventListenerOptions;
    }

  
}
declare module 'vona-module-a-ssr' {
  
        export interface EventListenerHmrReload {
          /** @internal */
          get scope(): ScopeModuleASsr;
        }

          export interface EventListenerHmrReload {
            get $beanFullName(): 'a-ssr.eventListener.hmrReload';
            get $onionName(): 'a-ssr:hmrReload';
            get $onionOptions(): IDecoratorEventListenerOptions;
          }

        export interface EventListenerResolvePath {
          /** @internal */
          get scope(): ScopeModuleASsr;
        }

          export interface EventListenerResolvePath {
            get $beanFullName(): 'a-ssr.eventListener.resolvePath';
            get $onionName(): 'a-ssr:resolvePath';
            get $onionOptions(): IDecoratorEventListenerOptions;
          } 
}
/** eventListener: end */
/** hmr: begin */
export * from '../bean/hmr.ssrMenu.ts';
export * from '../bean/hmr.ssrMenuGroup.ts';
export * from '../bean/hmr.ssrSite.ts';

import 'vona';
declare module 'vona' {
  
    export interface IHmrRecord {
      'a-ssr:ssrMenu': never;
'a-ssr:ssrMenuGroup': never;
'a-ssr:ssrSite': never;
    }

  
}
declare module 'vona-module-a-ssr' {
  
        export interface HmrSsrMenu {
          /** @internal */
          get scope(): ScopeModuleASsr;
        }

          export interface HmrSsrMenu {
            get $beanFullName(): 'a-ssr.hmr.ssrMenu';
            get $onionName(): 'a-ssr:ssrMenu';
            
          }

        export interface HmrSsrMenuGroup {
          /** @internal */
          get scope(): ScopeModuleASsr;
        }

          export interface HmrSsrMenuGroup {
            get $beanFullName(): 'a-ssr.hmr.ssrMenuGroup';
            get $onionName(): 'a-ssr:ssrMenuGroup';
            
          }

        export interface HmrSsrSite {
          /** @internal */
          get scope(): ScopeModuleASsr;
        }

          export interface HmrSsrSite {
            get $beanFullName(): 'a-ssr.hmr.ssrSite';
            get $onionName(): 'a-ssr:ssrSite';
            
          } 
}
/** hmr: end */
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
export class ScopeModuleASsr extends BeanScopeBase {}

export interface ScopeModuleASsr {
  util: BeanScopeUtil;
config: TypeModuleConfig<typeof config>;
service: IModuleService;
event: IModuleEvent;
}

import 'vona';
declare module 'vona' {
  export interface IBeanScopeRecord {
    'a-ssr': ScopeModuleASsr;
  }

  export interface IBeanScopeContainer {
    ssr: ScopeModuleASsr;
  }
  
  export interface IBeanScopeConfig {
    'a-ssr': ReturnType<typeof config>;
  }

  

  
}
/** scope: end */
