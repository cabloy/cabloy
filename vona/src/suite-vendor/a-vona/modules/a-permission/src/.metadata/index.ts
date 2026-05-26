// eslint-disable
import type { TypeSymbolKeyFieldsMore } from 'vona-module-a-orm';
import type { TypeEntityOptionsFields } from 'vona-module-a-openapi';
/** bean: begin */
export * from '../bean/bean.permission.ts';

import 'vona';
declare module 'vona' {
  
  
}
declare module 'vona-module-a-permission' {
  
        export interface BeanPermission {
          /** @internal */
          get scope(): ScopeModuleAPermission;
        } 
}
/** bean: end */
/** bean: begin */
import type { BeanPermission } from '../bean/bean.permission.ts';
import 'vona';  
declare module 'vona' {
  export interface IBeanRecordGlobal {
    'permission': BeanPermission;
  }
}
/** bean: end */
/** event: begin */
export * from '../bean/event.retrievePermissions.ts';

import 'vona';
declare module 'vona' {
  
  
}
declare module 'vona-module-a-permission' {
  
        export interface EventRetrievePermissions {
          /** @internal */
          get scope(): ScopeModuleAPermission;
        }

          export interface EventRetrievePermissions {
            get $beanFullName(): 'a-permission.event.retrievePermissions';
            get $onionName(): 'a-permission:retrievePermissions';
            
          } 
}
/** event: end */
/** event: begin */
import type { EventRetrievePermissions } from '../bean/event.retrievePermissions.ts';
export interface IModuleEvent {
  'retrievePermissions': EventRetrievePermissions;
}
/** event: end */
/** event: begin */
import type { TypeEventRetrievePermissionsData, TypeEventRetrievePermissionsResult } from '../bean/event.retrievePermissions.ts';
import type { EventOn } from 'vona-module-a-event'; 
declare module 'vona-module-a-event' {
  export interface IEventRecord {
    'a-permission:retrievePermissions': EventOn<TypeEventRetrievePermissionsData, TypeEventRetrievePermissionsResult>;
  }
}
/** event: end */
/** summerCache: begin */
export * from '../bean/summerCache.permission.ts';

import { type IDecoratorSummerCacheOptions } from 'vona-module-a-summer';
declare module 'vona-module-a-summer' {
  
    export interface ISummerCacheRecord {
      'a-permission:permission': IDecoratorSummerCacheOptions;
    }

  
}
declare module 'vona-module-a-permission' {
  
        export interface SummerCachePermission {
          /** @internal */
          get scope(): ScopeModuleAPermission;
        }

          export interface SummerCachePermission {
            get $beanFullName(): 'a-permission.summerCache.permission';
            get $onionName(): 'a-permission:permission';
            get $onionOptions(): IDecoratorSummerCacheOptions;
          } 
}
/** summerCache: end */
/** summerCache: begin */
import type { SummerCachePermission } from '../bean/summerCache.permission.ts';
export interface IModuleSummerCache {
  'permission': SummerCachePermission;
}
/** summerCache: end */
/** dto: begin */
export * from '../dto/permissions.tsx';
import type { IDtoOptionsPermissions } from '../dto/permissions.tsx';
import 'vona-module-a-web';
declare module 'vona-module-a-web' {
  
    export interface IDtoRecord {
      'a-permission:permissions': IDtoOptionsPermissions;
    }

  
}
declare module 'vona-module-a-permission' {
   
}
/** dto: end */
/** dto: begin */
import type { DtoPermissions } from '../dto/permissions.tsx';
declare module 'vona-module-a-permission' {
  
    export interface IDtoOptionsPermissions {
      fields?: TypeEntityOptionsFields<DtoPermissions, IDtoOptionsPermissions[TypeSymbolKeyFieldsMore]>;
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
export class ScopeModuleAPermission extends BeanScopeBase {}

export interface ScopeModuleAPermission {
  util: BeanScopeUtil;
config: TypeModuleConfig<typeof config>;
event: IModuleEvent;
summerCache: IModuleSummerCache;
}

import 'vona';
declare module 'vona' {
  export interface IBeanScopeRecord {
    'a-permission': ScopeModuleAPermission;
  }

  export interface IBeanScopeContainer {
    permission: ScopeModuleAPermission;
  }
  
  export interface IBeanScopeConfig {
    'a-permission': ReturnType<typeof config>;
  }

  

  
}
/** scope: end */
