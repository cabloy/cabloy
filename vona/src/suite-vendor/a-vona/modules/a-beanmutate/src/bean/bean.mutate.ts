import type { Constructable, IBeanRecord } from 'vona';

import { appResource, BeanBase } from 'vona';
import { Bean } from 'vona-module-a-bean';

import type { TypeEventReloadInstancesData } from './event.reloadInstances.ts';
import type { TypeEventRemoveInstancesData } from './event.removeInstances.ts';

@Bean()
export class BeanMutate extends BeanBase {
  async reloadInstances<T>(beanFullName: Constructable, data: T): Promise<void>;
  async reloadInstances<K extends keyof IBeanRecord, T>(beanFullName: K, data: T): Promise<void>;
  async reloadInstances<T>(beanFullName: any, data: T): Promise<void> {
    beanFullName = appResource.getBeanFullName(beanFullName);
    await this.reloadInstancesWorker({ beanFullName, data });
    this.scope.broadcast.reloadInstances.emit({ beanFullName, data });
  }

  async reloadInstancesWorker(data: TypeEventReloadInstancesData) {
    await this.scope.event.reloadInstances.emit(data);
  }

  async removeInstances<T>(beanFullName: Constructable, data: T): Promise<void>;
  async removeInstances<K extends keyof IBeanRecord, T>(beanFullName: K, data: T): Promise<void>;
  async removeInstances<T>(beanFullName: any, data: T): Promise<void> {
    beanFullName = appResource.getBeanFullName(beanFullName);
    await this.removeInstancesWorker({ beanFullName, data });
    this.scope.broadcast.removeInstances.emit({ beanFullName, data });
  }

  async removeInstancesWorker(data: TypeEventRemoveInstancesData) {
    await this.scope.event.removeInstances.emit(data);
  }
}
