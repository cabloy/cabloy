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
export * from '../bean/event.retrievePermissionAction.ts';
export * from '../bean/event.retrievePermissions.ts';

import 'vona';
declare module 'vona' {
  
  
}
declare module 'vona-module-a-permission' {
  
        export interface EventRetrievePermissionAction {
          /** @internal */
          get scope(): ScopeModuleAPermission;
        }

          export interface EventRetrievePermissionAction {
            get $beanFullName(): 'a-permission.event.retrievePermissionAction';
            get $onionName(): 'a-permission:retrievePermissionAction';
            
          }

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
import type { EventRetrievePermissionAction } from '../bean/event.retrievePermissionAction.ts';
import type { EventRetrievePermissions } from '../bean/event.retrievePermissions.ts';
export interface IModuleEvent {
  'retrievePermissionAction': EventRetrievePermissionAction;
'retrievePermissions': EventRetrievePermissions;
}
/** event: end */
/** event: begin */
import type { TypeEventRetrievePermissionActionData, TypeEventRetrievePermissionActionResult } from '../bean/event.retrievePermissionAction.ts';
import type { TypeEventRetrievePermissionsData, TypeEventRetrievePermissionsResult } from '../bean/event.retrievePermissions.ts';
import type { EventOn } from 'vona-module-a-event'; 
declare module 'vona-module-a-event' {
  export interface IEventRecord {
    'a-permission:retrievePermissionAction': EventOn<TypeEventRetrievePermissionActionData, TypeEventRetrievePermissionActionResult>;
'a-permission:retrievePermissions': EventOn<TypeEventRetrievePermissionsData, TypeEventRetrievePermissionsResult>;
  }
}
/** event: end */
/** summerCache: begin */
export * from '../bean/summerCache.permissionActionByRoles.ts';
export * from '../bean/summerCache.permissionUser.ts';

import { type IDecoratorSummerCacheOptions } from 'vona-module-a-summer';
declare module 'vona-module-a-summer' {
  
    export interface ISummerCacheRecord {
      'a-permission:permissionActionByRoles': IDecoratorSummerCacheOptions;
'a-permission:permissionUser': IDecoratorSummerCacheOptions;
    }

  
}
declare module 'vona-module-a-permission' {
  
        export interface SummerCachePermissionActionByRoles {
          /** @internal */
          get scope(): ScopeModuleAPermission;
        }

          export interface SummerCachePermissionActionByRoles {
            get $beanFullName(): 'a-permission.summerCache.permissionActionByRoles';
            get $onionName(): 'a-permission:permissionActionByRoles';
            get $onionOptions(): IDecoratorSummerCacheOptions;
          }

        export interface SummerCachePermissionUser {
          /** @internal */
          get scope(): ScopeModuleAPermission;
        }

          export interface SummerCachePermissionUser {
            get $beanFullName(): 'a-permission.summerCache.permissionUser';
            get $onionName(): 'a-permission:permissionUser';
            get $onionOptions(): IDecoratorSummerCacheOptions;
          } 
}
/** summerCache: end */
/** summerCache: begin */
import type { SummerCachePermissionActionByRoles } from '../bean/summerCache.permissionActionByRoles.ts';
import type { SummerCachePermissionUser } from '../bean/summerCache.permissionUser.ts';
export interface IModuleSummerCache {
  'permissionActionByRoles': SummerCachePermissionActionByRoles;
'permissionUser': SummerCachePermissionUser;
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
