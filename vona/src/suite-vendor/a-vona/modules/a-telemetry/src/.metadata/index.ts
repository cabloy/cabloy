// eslint-disable
/** middlewareSystem: begin */
export * from '../bean/middlewareSystem.trace.ts';
import type { IMiddlewareSystemOptionsTrace } from '../bean/middlewareSystem.trace.ts';
import 'vona-module-a-aspect';
declare module 'vona-module-a-aspect' {
  
    export interface IMiddlewareSystemRecord {
      'a-telemetry:trace': IMiddlewareSystemOptionsTrace;
    }

  
}
declare module 'vona-module-a-telemetry' {
  
        export interface MiddlewareSystemTrace {
          /** @internal */
          get scope(): ScopeModuleATelemetry;
        }

          export interface MiddlewareSystemTrace {
            get $beanFullName(): 'a-telemetry.middlewareSystem.trace';
            get $onionName(): 'a-telemetry:trace';
            get $onionOptions(): IMiddlewareSystemOptionsTrace;
          } 
}
/** middlewareSystem: end */
/** service: begin */
export * from '../service/telemetry.ts';

import 'vona-module-a-bean';
declare module 'vona-module-a-bean' {
  
    export interface IServiceRecord {
      'a-telemetry:telemetry': never;
    }

  
}
declare module 'vona-module-a-telemetry' {
  
        export interface ServiceTelemetry {
          /** @internal */
          get scope(): ScopeModuleATelemetry;
        }

          export interface ServiceTelemetry {
            get $beanFullName(): 'a-telemetry.service.telemetry';
            get $onionName(): 'a-telemetry:telemetry';
            
          } 
}
/** service: end */
/** service: begin */
import type { ServiceTelemetry } from '../service/telemetry.ts';
export interface IModuleService {
  'telemetry': ServiceTelemetry;
}
/** service: end */
/** service: begin */

import 'vona';
declare module 'vona' {
  export interface IBeanRecordGeneral {
    'a-telemetry.service.telemetry': ServiceTelemetry;
  }
}
/** service: end */
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
export class ScopeModuleATelemetry extends BeanScopeBase {}

export interface ScopeModuleATelemetry {
  util: BeanScopeUtil;
config: TypeModuleConfig<typeof config>;
service: IModuleService;
}

import 'vona';
declare module 'vona' {
  export interface IBeanScopeRecord {
    'a-telemetry': ScopeModuleATelemetry;
  }

  export interface IBeanScopeContainer {
    telemetry: ScopeModuleATelemetry;
  }
  
  export interface IBeanScopeConfig {
    'a-telemetry': ReturnType<typeof config>;
  }

  

  
}
/** scope: end */
