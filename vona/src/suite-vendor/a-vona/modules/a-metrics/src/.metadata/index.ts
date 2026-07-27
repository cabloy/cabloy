// eslint-disable
/** middlewareSystem: begin */
export * from '../bean/middlewareSystem.health.ts';
export * from '../bean/middlewareSystem.metrics.ts';
import type { IMiddlewareSystemOptionsHealth } from '../bean/middlewareSystem.health.ts';
import type { IMiddlewareSystemOptionsMetrics } from '../bean/middlewareSystem.metrics.ts';
import 'vona-module-a-aspect';
declare module 'vona-module-a-aspect' {
  
    export interface IMiddlewareSystemRecord {
      'a-metrics:health': IMiddlewareSystemOptionsHealth;
'a-metrics:metrics': IMiddlewareSystemOptionsMetrics;
    }

  
}
declare module 'vona-module-a-metrics' {
  
        export interface MiddlewareSystemHealth {
          /** @internal */
          get scope(): ScopeModuleAMetrics;
        }

          export interface MiddlewareSystemHealth {
            get $beanFullName(): 'a-metrics.middlewareSystem.health';
            get $onionName(): 'a-metrics:health';
            get $onionOptions(): IMiddlewareSystemOptionsHealth;
          }

        export interface MiddlewareSystemMetrics {
          /** @internal */
          get scope(): ScopeModuleAMetrics;
        }

          export interface MiddlewareSystemMetrics {
            get $beanFullName(): 'a-metrics.middlewareSystem.metrics';
            get $onionName(): 'a-metrics:metrics';
            get $onionOptions(): IMiddlewareSystemOptionsMetrics;
          } 
}
/** middlewareSystem: end */
/** bean: begin */
export * from '../bean/bean.metrics.ts';

import 'vona';
declare module 'vona' {
  
  
}
declare module 'vona-module-a-metrics' {
  
        export interface BeanMetrics {
          /** @internal */
          get scope(): ScopeModuleAMetrics;
        } 
}
/** bean: end */
/** bean: begin */
import type { BeanMetrics } from '../bean/bean.metrics.ts';
import 'vona';
declare module 'vona' {
  export interface IBeanRecordGlobal {
    'metrics': BeanMetrics;
  }
}
/** bean: end */
/** service: begin */
export * from '../service/health.ts';
export * from '../service/metrics.ts';
export * from '../service/metricsRuntime.ts';

import 'vona-module-a-bean';
declare module 'vona-module-a-bean' {
  
    export interface IServiceRecord {
      'a-metrics:health': never;
'a-metrics:metrics': never;
'a-metrics:metricsRuntime': never;
    }

  
}
declare module 'vona-module-a-metrics' {
  
        export interface ServiceHealth {
          /** @internal */
          get scope(): ScopeModuleAMetrics;
        }

          export interface ServiceHealth {
            get $beanFullName(): 'a-metrics.service.health';
            get $onionName(): 'a-metrics:health';
            
          }

        export interface ServiceMetrics {
          /** @internal */
          get scope(): ScopeModuleAMetrics;
        }

          export interface ServiceMetrics {
            get $beanFullName(): 'a-metrics.service.metrics';
            get $onionName(): 'a-metrics:metrics';
            
          }

        export interface ServiceMetricsRuntime {
          /** @internal */
          get scope(): ScopeModuleAMetrics;
        }

          export interface ServiceMetricsRuntime {
            get $beanFullName(): 'a-metrics.service.metricsRuntime';
            get $onionName(): 'a-metrics:metricsRuntime';
            
          } 
}
/** service: end */
/** service: begin */
import type { ServiceHealth } from '../service/health.ts';
import type { ServiceMetrics } from '../service/metrics.ts';
import type { ServiceMetricsRuntime } from '../service/metricsRuntime.ts';
export interface IModuleService {
  'health': ServiceHealth;
'metrics': ServiceMetrics;
'metricsRuntime': ServiceMetricsRuntime;
}
/** service: end */
/** service: begin */

import 'vona';
declare module 'vona' {
  export interface IBeanRecordGeneral {
    'a-metrics.service.health': ServiceHealth;
'a-metrics.service.metrics': ServiceMetrics;
'a-metrics.service.metricsRuntime': ServiceMetricsRuntime;
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
export class ScopeModuleAMetrics extends BeanScopeBase {}

export interface ScopeModuleAMetrics {
  util: BeanScopeUtil;
config: TypeModuleConfig<typeof config>;
service: IModuleService;
}

import 'vona';
declare module 'vona' {
  export interface IBeanScopeRecord {
    'a-metrics': ScopeModuleAMetrics;
  }

  export interface IBeanScopeContainer {
    metrics: ScopeModuleAMetrics;
  }
  
  export interface IBeanScopeConfig {
    'a-metrics': ReturnType<typeof config>;
  }

  

  
}
/** scope: end */
