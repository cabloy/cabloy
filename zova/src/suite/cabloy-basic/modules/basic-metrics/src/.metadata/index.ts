// eslint-disable
/** model: begin */
export * from '../model/metrics.js';
import { IModelOptionsMetrics } from '../model/metrics.js';
import 'zova-module-a-model';
declare module 'zova-module-a-model' {

    export interface IModelRecord {
      'basic-metrics:metrics': IModelOptionsMetrics;
    }


}
declare module 'zova-module-basic-metrics' {

        export interface ModelMetrics {
          /** @internal */
          get scope(): ScopeModuleBasicMetrics;
        }

        export interface ModelMetrics {
          get $beanFullName(): 'basic-metrics.model.metrics';
          get $onionName(): 'basic-metrics:metrics';
          get $onionOptions(): IModelOptionsMetrics;
        }
}
/** model: end */
/** model: begin */
import { ModelMetrics } from '../model/metrics.js';
import 'zova';
declare module 'zova' {
  export interface IBeanRecordGeneral {
    'basic-metrics.model.metrics': ModelMetrics;
  }
}
/** model: end */
/** api: begin */
export * from '../api/basicMetricsMetrics.js';

import 'zova';
declare module 'zova' {


}
declare module 'zova-module-basic-metrics' {

        export interface ApiBasicMetricsMetrics {
          /** @internal */
          get scope(): ScopeModuleBasicMetrics;
        }

        export interface ApiBasicMetricsMetrics {
          get $beanFullName(): 'basic-metrics.api.basicMetricsMetrics';
          get $onionName(): 'basic-metrics:basicMetricsMetrics';

        }
}
/** api: end */
/** api: begin */
import { ApiBasicMetricsMetrics } from '../api/basicMetricsMetrics.js';
export interface IModuleApi {
  'basicMetricsMetrics': ApiBasicMetricsMetrics;
}
/** api: end */
/** api: begin */

import 'zova';
declare module 'zova' {
  export interface IBeanRecordGeneral {
    'basic-metrics.api.basicMetricsMetrics': ApiBasicMetricsMetrics;
  }
}
/** api: end */
/** openapi: begin */

/** openapi: end */
/** controller: begin */
export * from '../page/dashboard/controller.jsx';

import 'zova';
declare module 'zova' {


}
declare module 'zova-module-basic-metrics' {

        export interface ControllerPageDashboard {
          /** @internal */
          get scope(): ScopeModuleBasicMetrics;
        }
}
/** controller: end */
/** controller: begin */
import { ControllerPageDashboard } from '../page/dashboard/controller.jsx';
import 'zova';
declare module 'zova' {
  export interface IBeanRecordLocal {
    'basic-metrics.controller.pageDashboard': ControllerPageDashboard;
  }
}
/** controller: end */
/** pages: begin */
export * from './page/dashboard.js';
export * from '../routes.js';
import { TypePagePathSchema } from 'zova-module-a-router';
import 'zova';
declare module 'zova-module-a-router' {
export interface IPagePathRecord {
  '/basic/metrics/dashboard': TypePagePathSchema<undefined,undefined>;
}
export interface IPageNameRecord {

}
}
export const pagePathSchemas = {

};
export const pageNameSchemas = {

};
declare module 'zova-module-basic-metrics' {

}
/** pages: end */

/** scope: begin */
import { BeanScopeBase, type BeanScopeUtil } from 'zova';
import { Scope } from 'zova-module-a-bean';

@Scope()
export class ScopeModuleBasicMetrics extends BeanScopeBase {}

export interface ScopeModuleBasicMetrics {
  util: BeanScopeUtil;
api: IModuleApi;
}

import 'zova';
declare module 'zova' {
  export interface IBeanScopeRecord {
    'basic-metrics': ScopeModuleBasicMetrics;
  }






}

/** scope: end */
