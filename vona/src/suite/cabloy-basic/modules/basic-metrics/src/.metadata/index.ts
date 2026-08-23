// eslint-disable
import type { TypeSymbolKeyFieldsMore } from 'vona-module-a-orm';
import type { TypeEntityOptionsFields,TypeControllerOptionsActions } from 'vona-module-a-openapi';
/** service: begin */
export * from '../service/metrics.ts';

import 'vona-module-a-bean';
declare module 'vona-module-a-bean' {

    export interface IServiceRecord {
      'basic-metrics:metrics': never;
    }


}
declare module 'vona-module-basic-metrics' {

        export interface ServiceMetrics {
          /** @internal */
          get scope(): ScopeModuleBasicMetrics;
        }

          export interface ServiceMetrics {
            get $beanFullName(): 'basic-metrics.service.metrics';
            get $onionName(): 'basic-metrics:metrics';
          }
}
/** service: end */
/** service: begin */
import type { ServiceMetrics } from '../service/metrics.ts';
export interface IModuleService {
  'metrics': ServiceMetrics;
}
/** service: end */
/** service: begin */

import 'vona';
declare module 'vona' {
  export interface IBeanRecordGeneral {
    'basic-metrics.service.metrics': ServiceMetrics;
  }
}
/** service: end */
/** dto: begin */
export * from '../dto/metricsQueue.ts';
export * from '../dto/metricsRuntime.ts';
export * from '../dto/metricsSnapshot.ts';
import type { IDtoOptionsMetricsQueue } from '../dto/metricsQueue.ts';
import type { IDtoOptionsMetricsRuntime } from '../dto/metricsRuntime.ts';
import type { IDtoOptionsMetricsSnapshot } from '../dto/metricsSnapshot.ts';
import 'vona-module-a-web';
declare module 'vona-module-a-web' {

    export interface IDtoRecord {
      'basic-metrics:metricsQueue': IDtoOptionsMetricsQueue;
'basic-metrics:metricsRuntime': IDtoOptionsMetricsRuntime;
'basic-metrics:metricsSnapshot': IDtoOptionsMetricsSnapshot;
    }


}
declare module 'vona-module-basic-metrics' {

}
/** dto: end */
/** dto: begin */
import type { DtoMetricsQueue } from '../dto/metricsQueue.ts';
import type { DtoMetricsRuntime } from '../dto/metricsRuntime.ts';
import type { DtoMetricsSnapshot } from '../dto/metricsSnapshot.ts';
declare module 'vona-module-basic-metrics' {

    export interface IDtoOptionsMetricsQueue {
      fields?: TypeEntityOptionsFields<DtoMetricsQueue, IDtoOptionsMetricsQueue[TypeSymbolKeyFieldsMore]>;
    }

    export interface IDtoOptionsMetricsRuntime {
      fields?: TypeEntityOptionsFields<DtoMetricsRuntime, IDtoOptionsMetricsRuntime[TypeSymbolKeyFieldsMore]>;
    }

    export interface IDtoOptionsMetricsSnapshot {
      fields?: TypeEntityOptionsFields<DtoMetricsSnapshot, IDtoOptionsMetricsSnapshot[TypeSymbolKeyFieldsMore]>;
    }
}
/** dto: end */
/** controller: begin */
export * from '../controller/metrics.ts';
import type { IControllerOptionsMetrics } from '../controller/metrics.ts';
import 'vona-module-a-web';
declare module 'vona-module-a-web' {

    export interface IControllerRecord {
      'basic-metrics:metrics': IControllerOptionsMetrics;
    }


}
declare module 'vona-module-basic-metrics' {

        export interface ControllerMetrics {
          /** @internal */
          get scope(): ScopeModuleBasicMetrics;
        }

          export interface ControllerMetrics {
            get $beanFullName(): 'basic-metrics.controller.metrics';
            get $onionName(): 'basic-metrics:metrics';
            get $onionOptions(): IControllerOptionsMetrics;
          }
}
/** controller: end */
/** controller: begin */
// @ts-ignore ignore
import type { ControllerMetrics } from '../controller/metrics.ts';
declare module 'vona-module-basic-metrics' {

    export interface IControllerOptionsMetrics {
      actions?: TypeControllerOptionsActions<ControllerMetrics>;
    }
}
declare module 'vona-module-a-web' {
  export interface IApiPathGetRecord{
        '/basic/metrics/snapshot': undefined;
    }

}
import 'vona-module-a-openapi';
  declare module 'vona-module-a-openapi' {
    export interface IResourceRecord {
      'basic-metrics:metrics': never;
    }
  }

/** controller: end */
/** ssrMenu: begin */
export * from '../bean/ssrMenu.metrics.ts';
import type { ISsrMenuOptionsMetrics } from '../bean/ssrMenu.metrics.ts';
import 'vona-module-a-ssr';
declare module 'vona-module-a-ssr' {

    export interface ISsrMenuRecord {
      'basic-metrics:metrics': ISsrMenuOptionsMetrics;
    }


}
declare module 'vona-module-basic-metrics' {

        export interface SsrMenuMetrics {
          /** @internal */
          get scope(): ScopeModuleBasicMetrics;
        }

          export interface SsrMenuMetrics {
            get $beanFullName(): 'basic-metrics.ssrMenu.metrics';
            get $onionName(): 'basic-metrics:metrics';
            get $onionOptions(): ISsrMenuOptionsMetrics;
          }
}
/** ssrMenu: end */
/** scope: begin */
import { BeanScopeBase, type BeanScopeUtil } from 'vona';
import { Scope } from 'vona-module-a-bean';

@Scope()
export class ScopeModuleBasicMetrics extends BeanScopeBase {}

export interface ScopeModuleBasicMetrics {
  util: BeanScopeUtil;
service: IModuleService;
}

import 'vona';
declare module 'vona' {
  export interface IBeanScopeRecord {
    'basic-metrics': ScopeModuleBasicMetrics;
  }

  export interface IBeanScopeContainer {
    basicMetrics: ScopeModuleBasicMetrics;
  }






}
/** scope: end */
