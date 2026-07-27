import type { IDecoratorControllerOptions } from 'vona-module-a-web';

import { BeanBase } from 'vona';
import { Api, Resource, v } from 'vona-module-a-openapiutils';
import { Passport } from 'vona-module-a-user';
import { Controller, Web } from 'vona-module-a-web';

import { DtoMetricsSnapshot } from '../dto/metricsSnapshot.ts';

export interface IControllerOptionsMetrics extends IDecoratorControllerOptions {}

@Controller<IControllerOptionsMetrics>('metrics')
@Resource()
export class ControllerMetrics extends BeanBase {
  @Web.get('snapshot')
  @Api.body(v.object(DtoMetricsSnapshot))
  @Passport.systemAdmin()
  async snapshot(): Promise<DtoMetricsSnapshot> {
    return this.scope.service.metrics.snapshot();
  }
}
