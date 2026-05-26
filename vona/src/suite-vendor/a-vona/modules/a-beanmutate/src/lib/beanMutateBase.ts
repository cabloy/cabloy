import { BeanBase } from 'vona';

export class BeanMutateBase extends BeanBase {
  private _onReloadInstancesCancel?: Function;
  private _onRemoveInstancesCancel?: Function;

  protected __init__() {
    this._onReloadInstancesCancel = this.$scope.beanmutate.event.reloadInstances.on(
      async ({ beanFullName, data }, next) => {
        if (this.$beanFullName === beanFullName) {
          await this.onReloadInstance(data);
        }
        await next();
      },
    );
    this._onRemoveInstancesCancel = this.$scope.beanmutate.event.removeInstances.on(
      async ({ beanFullName, data }, next) => {
        if (this.$beanFullName === beanFullName) {
          await this.onRemoveInstance(data);
        }
        await next();
      },
    );
  }

  protected async __dispose__() {
    this._onReloadInstancesCancel?.();
    this._onRemoveInstancesCancel?.();
    this._onReloadInstancesCancel = undefined;
    this._onRemoveInstancesCancel = undefined;
  }

  protected async onReloadInstance(_data: unknown) {}

  protected async onRemoveInstance(_data: unknown) {
    await this.bean._removeBean(this);
  }
}
