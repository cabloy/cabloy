// eslint-disable
/** guard: begin */
export * from '../bean/guard.rbac.ts';
import type { IGuardOptionsRbac } from '../bean/guard.rbac.ts';
import 'vona-module-a-aspect';
declare module 'vona-module-a-aspect' {
  
  
export interface IGuardRecordLocal {
  'a-rbac:rbac': IGuardOptionsRbac;
}

}
declare module 'vona-module-a-rbac' {
  
        export interface GuardRbac {
          /** @internal */
          get scope(): ScopeModuleARbac;
        }

          export interface GuardRbac {
            get $beanFullName(): 'a-rbac.guard.rbac';
            get $onionName(): 'a-rbac:rbac';
            get $onionOptions(): IGuardOptionsRbac;
          } 
}
/** guard: end */
/** bean: begin */
export * from '../bean/bean.rbacCatalog.ts';
export * from '../bean/bean.rbacScope.ts';

import 'vona';
declare module 'vona' {
  
  
}
declare module 'vona-module-a-rbac' {
  
        export interface BeanRbacCatalog {
          /** @internal */
          get scope(): ScopeModuleARbac;
        }

        export interface BeanRbacScope {
          /** @internal */
          get scope(): ScopeModuleARbac;
        } 
}
/** bean: end */
/** bean: begin */
import type { BeanRbacCatalog } from '../bean/bean.rbacCatalog.ts';
import type { BeanRbacScope } from '../bean/bean.rbacScope.ts';
import 'vona';
declare module 'vona' {
  export interface IBeanRecordGlobal {
    'rbacCatalog': BeanRbacCatalog;
    'rbacScope': BeanRbacScope;
  }
}
/** bean: end */
/** event: begin */
export * from '../bean/event.policyInvalidated.ts';
export * from '../bean/event.resolvePolicy.ts';

import 'vona';
declare module 'vona' {
  
  
}
declare module 'vona-module-a-rbac' {
  
        export interface EventPolicyInvalidated {
          /** @internal */
          get scope(): ScopeModuleARbac;
        }

          export interface EventPolicyInvalidated {
            get $beanFullName(): 'a-rbac.event.policyInvalidated';
            get $onionName(): 'a-rbac:policyInvalidated';
          }

        export interface EventResolvePolicy {
          /** @internal */
          get scope(): ScopeModuleARbac;
        }

          export interface EventResolvePolicy {
            get $beanFullName(): 'a-rbac.event.resolvePolicy';
            get $onionName(): 'a-rbac:resolvePolicy';
          } 
}
/** event: end */
/** event: begin */
import type { EventPolicyInvalidated } from '../bean/event.policyInvalidated.ts';
import type { EventResolvePolicy } from '../bean/event.resolvePolicy.ts';
export interface IModuleEvent {
  'policyInvalidated': EventPolicyInvalidated;
'resolvePolicy': EventResolvePolicy;
}
/** event: end */
/** event: begin */
import type { TypeEventPolicyInvalidatedData, TypeEventPolicyInvalidatedResult } from '../bean/event.policyInvalidated.ts';
import type { TypeEventResolvePolicyData, TypeEventResolvePolicyResult } from '../bean/event.resolvePolicy.ts';
import type { EventOn } from 'vona-module-a-event'; 
declare module 'vona-module-a-event' {
  export interface IEventRecord {
    'a-rbac:policyInvalidated': EventOn<TypeEventPolicyInvalidatedData, TypeEventPolicyInvalidatedResult>;
'a-rbac:resolvePolicy': EventOn<TypeEventResolvePolicyData, TypeEventResolvePolicyResult>;
  }
}
/** event: end */
/** config: begin */
export * from '../config/config.ts';
import type { config } from '../config/config.ts';
/** config: end */
/** scope: begin */
import { BeanScopeBase, type BeanScopeUtil, type TypeModuleConfig } from 'vona';
import { Scope } from 'vona-module-a-bean';

@Scope()
export class ScopeModuleARbac extends BeanScopeBase {}

export interface ScopeModuleARbac {
  util: BeanScopeUtil;
config: TypeModuleConfig<typeof config>;
event: IModuleEvent;
}

import 'vona';
declare module 'vona' {
  export interface IBeanScopeRecord {
    'a-rbac': ScopeModuleARbac;
  }

  export interface IBeanScopeContainer {
    rbac: ScopeModuleARbac;
  }
  
  export interface IBeanScopeConfig {
    'a-rbac': ReturnType<typeof config>;
  }

  

  
}
/** scope: end */
