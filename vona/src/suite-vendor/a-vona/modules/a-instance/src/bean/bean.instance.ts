import type { IInstanceRecord, VonaConfig } from 'vona';

import { isNil } from '@cabloy/utils';
import { BeanBase } from 'vona';
import { Bean } from 'vona-module-a-bean';

import type { EntityInstance } from '../entity/instance.ts';
import type { ConfigInstanceBase } from '../types/instance.ts';

@Bean()
export class BeanInstance extends BeanBase {
  private get modelInstance() {
    return this.scope.model.instance;
  }

  get config(): VonaConfig {
    return this.scope.service.instance.getConfig()!;
  }

  async list() {
    return await this.modelInstance.select();
  }

  async update(data: EntityInstance) {
    // update
    await this.modelInstance.update(data);
    // changed
    await this.scope.service.instance.instanceChanged();
  }

  async get(instanceName?: keyof IInstanceRecord | null) {
    if (isNil(instanceName)) this.app.throw(403);
    return await this._get(instanceName);
  }

  private async _get(instanceName: keyof IInstanceRecord): Promise<EntityInstance | undefined> {
    // get
    const instance = await this.modelInstance.get({ name: instanceName });
    if (instance) return instance;
    // instance base
    const configInstanceBase = this.scope.service.instance.getConfigInstanceBase(instanceName);
    if (!configInstanceBase) return;
    if (configInstanceBase.isolate && !configInstanceBase.id) {
      throw new Error(`should specify id for isolate instance: ${instanceName}`);
    }
    // lock
    return await this.scope.redlock.lockIsolate(
      `registerInstance.${instanceName}`,
      async () => {
        return await this._registerLock(instanceName, configInstanceBase);
      },
      { instanceName: null },
    );
  }

  private async _registerLock(
    instanceName: keyof IInstanceRecord,
    configInstanceBase: ConfigInstanceBase,
  ) {
    // get again
    let instance = await this.modelInstance.get({ name: instanceName }, { cache: { force: true } });
    if (instance) return instance;
    // insert
    instance = {
      name: instanceName,
      title: configInstanceBase.title,
      config: undefined,
      disabled: false,
    } as EntityInstance;
    // id
    if (configInstanceBase.id) {
      instance.id = configInstanceBase.id;
    }
    // isolate
    if (configInstanceBase.isolate) {
      if (!configInstanceBase.id)
        throw new Error(`should specify id for isolate instance: ${instanceName}`);
      instance.isolate = configInstanceBase.isolate;
    }
    return await this.modelInstance.insert(instance);
  }

  async reload(instanceName?: keyof IInstanceRecord) {
    const instanceName2 = instanceName ?? this.ctx.instanceName;
    if (isNil(instanceName2)) throw new Error('Should specify the instanceName');
    await this.reloadWorker(instanceName2);
    // broadcast
    this.scope.broadcast.reload.emit(instanceName2);
  }

  async reloadWorker(instanceName: keyof IInstanceRecord) {
    await this.scope.service.instance.instanceStartupIsolate(instanceName, { force: true });
  }
}
