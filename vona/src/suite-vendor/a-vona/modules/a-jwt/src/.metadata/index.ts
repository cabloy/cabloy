// eslint-disable
import type { TypeSymbolKeyFieldsMore } from 'vona-module-a-orm';
import type { TypeEntityOptionsFields } from 'vona-module-a-openapi';
/** bean: begin */
export * from '../bean/bean.jwt.ts';

import 'vona';
declare module 'vona' {
  
  
}
declare module 'vona-module-a-jwt' {
  
        export interface BeanJwt {
          /** @internal */
          get scope(): ScopeModuleAJwt;
        } 
}
/** bean: end */
/** bean: begin */
import type { BeanJwt } from '../bean/bean.jwt.ts';
import 'vona';  
declare module 'vona' {
  export interface IBeanRecordGlobal {
    'jwt': BeanJwt;
  }
}
/** bean: end */
/** service: begin */
export * from '../service/jwtClient.ts';
export * from '../service/jwtExtract.ts';

import 'vona-module-a-bean';
declare module 'vona-module-a-bean' {
  
    export interface IServiceRecord {
      'a-jwt:jwtClient': never;
'a-jwt:jwtExtract': never;
    }

  
}
declare module 'vona-module-a-jwt' {
  
        export interface ServiceJwtClient {
          /** @internal */
          get scope(): ScopeModuleAJwt;
        }

          export interface ServiceJwtClient {
            get $beanFullName(): 'a-jwt.service.jwtClient';
            get $onionName(): 'a-jwt:jwtClient';
            
          }

        export interface ServiceJwtExtract {
          /** @internal */
          get scope(): ScopeModuleAJwt;
        }

          export interface ServiceJwtExtract {
            get $beanFullName(): 'a-jwt.service.jwtExtract';
            get $onionName(): 'a-jwt:jwtExtract';
            
          } 
}
/** service: end */
/** service: begin */
import type { ServiceJwtClient } from '../service/jwtClient.ts';
import type { ServiceJwtExtract } from '../service/jwtExtract.ts';
export interface IModuleService {
  'jwtClient': ServiceJwtClient;
'jwtExtract': ServiceJwtExtract;
}
/** service: end */
/** service: begin */

import 'vona';
declare module 'vona' {
  export interface IBeanRecordGeneral {
    'a-jwt.service.jwtClient': ServiceJwtClient;
'a-jwt.service.jwtExtract': ServiceJwtExtract;
  }
}
/** service: end */
/** dto: begin */
export * from '../dto/jwtToken.ts';
import type { IDtoOptionsJwtToken } from '../dto/jwtToken.ts';
import 'vona-module-a-web';
declare module 'vona-module-a-web' {
  
    export interface IDtoRecord {
      'a-jwt:jwtToken': IDtoOptionsJwtToken;
    }

  
}
declare module 'vona-module-a-jwt' {
   
}
/** dto: end */
/** dto: begin */
import type { DtoJwtToken } from '../dto/jwtToken.ts';
declare module 'vona-module-a-jwt' {
  
    export interface IDtoOptionsJwtToken {
      fields?: TypeEntityOptionsFields<DtoJwtToken, IDtoOptionsJwtToken[TypeSymbolKeyFieldsMore]>;
    }
}
/** dto: end */
/** config: begin */
export * from '../config/config.ts';
import type { config } from '../config/config.ts';
/** config: end */
/** scope: begin */
import { BeanScopeBase, type BeanScopeUtil, type TypeModuleConfig } from 'vona';
import { Scope } from 'vona-module-a-bean';

@Scope()
export class ScopeModuleAJwt extends BeanScopeBase {}

export interface ScopeModuleAJwt {
  util: BeanScopeUtil;
config: TypeModuleConfig<typeof config>;
service: IModuleService;
}

import 'vona';
declare module 'vona' {
  export interface IBeanScopeRecord {
    'a-jwt': ScopeModuleAJwt;
  }

  export interface IBeanScopeContainer {
    jwt: ScopeModuleAJwt;
  }
  
  export interface IBeanScopeConfig {
    'a-jwt': ReturnType<typeof config>;
  }

  

  
}
/** scope: end */
