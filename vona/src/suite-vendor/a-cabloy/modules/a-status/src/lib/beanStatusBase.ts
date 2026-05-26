import { BeanBase, SymbolModuleBelong } from 'vona';

export class BeanStatusBase<IStatusRecord> extends BeanBase {
  async get<K extends keyof IStatusRecord>(name: K): Promise<IStatusRecord[K] | undefined> {
    const status = await this._modelStatus.get({
      module: this[SymbolModuleBelong],
      name: name as string,
    });
    return status?.value;
  }

  async set<K extends keyof IStatusRecord>(name: K, value: IStatusRecord[K]): Promise<void> {
    await this._setInner(name as string, value, true);
  }

  private get _modelStatus() {
    return this.$scope.status.model.status;
  }

  private async _setInner(name: string, value: any, lock: boolean) {
    const status = await this._modelStatus.get(
      {
        module: this[SymbolModuleBelong],
        name,
      },
      {
        cache: { force: !lock },
      },
    );
    if (status) {
      await this._modelStatus.update({
        id: status.id,
        value,
      });
    } else {
      if (lock) {
        await this.$scope.status.redlock.lockIsolate(
          `statusSet.${this[SymbolModuleBelong]}.${name}`,
          async () => {
            return await this._setInner(name, value, false);
          },
        );
      } else {
        await this._modelStatus.insert({
          module: this[SymbolModuleBelong],
          name,
          value,
        });
      }
    }
  }
}
