// eslint-disable
import type { TypeSymbolKeyFieldsMore } from 'vona-module-a-orm';
import type { TypeEntityOptionsFields,TypeControllerOptionsActions } from 'vona-module-a-openapi';
/** interceptor: begin */
export * from '../bean/interceptor.openapiSchema.ts';
import type { IInterceptorOptionsOpenapiSchema } from '../bean/interceptor.openapiSchema.ts';
import 'vona-module-a-aspect';
declare module 'vona-module-a-aspect' {
  
    export interface IInterceptorRecordGlobal {
      'a-openapischema:openapiSchema': IInterceptorOptionsOpenapiSchema;
    }

  
}
declare module 'vona-module-a-openapischema' {
  
        export interface InterceptorOpenapiSchema {
          /** @internal */
          get scope(): ScopeModuleAOpenapischema;
        }

          export interface InterceptorOpenapiSchema {
            get $beanFullName(): 'a-openapischema.interceptor.openapiSchema';
            get $onionName(): 'a-openapischema:openapiSchema';
            get $onionOptions(): IInterceptorOptionsOpenapiSchema;
          } 
}
/** interceptor: end */
/** dto: begin */
export * from '../dto/bootstrap.tsx';
import type { IDtoOptionsBootstrap } from '../dto/bootstrap.tsx';
import 'vona-module-a-web';
declare module 'vona-module-a-web' {
  
    export interface IDtoRecord {
      'a-openapischema:bootstrap': IDtoOptionsBootstrap;
    }

  
}
declare module 'vona-module-a-openapischema' {
   
}
/** dto: end */
/** dto: begin */
import type { DtoBootstrap } from '../dto/bootstrap.tsx';
declare module 'vona-module-a-openapischema' {
  
    export interface IDtoOptionsBootstrap {
      fields?: TypeEntityOptionsFields<DtoBootstrap, IDtoOptionsBootstrap[TypeSymbolKeyFieldsMore]>;
    }
}
/** dto: end */
/** controller: begin */
export * from '../controller/resource.ts';
import type { IControllerOptionsResource } from '../controller/resource.ts';
import 'vona-module-a-web';
declare module 'vona-module-a-web' {
  
    export interface IControllerRecord {
      'a-openapischema:resource': IControllerOptionsResource;
    }

  
}
declare module 'vona-module-a-openapischema' {
  
        export interface ControllerResource {
          /** @internal */
          get scope(): ScopeModuleAOpenapischema;
        }

          export interface ControllerResource {
            get $beanFullName(): 'a-openapischema.controller.resource';
            get $onionName(): 'a-openapischema:resource';
            get $onionOptions(): IControllerOptionsResource;
          } 
}
/** controller: end */
/** controller: begin */
// @ts-ignore ignore
import type { ControllerResource } from '../controller/resource.ts';
declare module 'vona-module-a-openapischema' {
  
    export interface IControllerOptionsResource {
      actions?: TypeControllerOptionsActions<ControllerResource>;
    }
}
declare module 'vona-module-a-web' {
  export interface IApiPathGetRecord{
        '/openapischema/resource/bootstrap/:resource': undefined;
    }

}

/** controller: end */
/** scope: begin */
import { BeanScopeBase, type BeanScopeUtil } from 'vona';
import { Scope } from 'vona-module-a-bean';

@Scope()
export class ScopeModuleAOpenapischema extends BeanScopeBase {}

export interface ScopeModuleAOpenapischema {
  util: BeanScopeUtil;
}

import 'vona';
declare module 'vona' {
  export interface IBeanScopeRecord {
    'a-openapischema': ScopeModuleAOpenapischema;
  }

  export interface IBeanScopeContainer {
    openapischema: ScopeModuleAOpenapischema;
  }
  
  

  

  
}
/** scope: end */
