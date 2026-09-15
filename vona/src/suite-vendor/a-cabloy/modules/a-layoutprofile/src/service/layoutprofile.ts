import type { TableIdentity } from 'table-identity';
import type { IUser } from 'vona-module-a-user';

import { BeanBase } from 'vona';
import { Service } from 'vona-module-a-bean';
import { Core } from 'vona-module-a-core';

import type { ILayoutProfile } from '../types/layoutprofile.ts';

@Service()
export class ServiceLayoutprofile extends BeanBase {
  async load(user: IUser, layoutKey: string): Promise<ILayoutProfile | undefined> {
    const entity = await this.scope.model.layoutprofile.get({ userId: user.id, layoutKey });
    return entity?.profile as ILayoutProfile | undefined;
  }

  async save(user: IUser, layoutKey: string, profile: ILayoutProfile): Promise<ILayoutProfile> {
    if (await this._saveExisting(user.id, layoutKey, profile)) return profile;
    return await this.scope.redlock.lockIsolate(
      `layoutprofileSave.${user.id}.${layoutKey}`,
      async () => await this._saveAfterLock(user.id, layoutKey, profile),
    );
  }

  async reset(user: IUser, layoutKey: string): Promise<void> {
    await this.scope.redlock.lockIsolate(
      `layoutprofileSave.${user.id}.${layoutKey}`,
      async () => await this._reset(user.id, layoutKey),
    );
  }

  @Core.transaction()
  private async _saveExisting(
    userId: TableIdentity,
    layoutKey: string,
    profile: ILayoutProfile,
  ): Promise<boolean> {
    const entity = await this.scope.model.layoutprofile.getForUpdate({ userId, layoutKey });
    if (!entity) return false;
    await this.scope.model.layoutprofile.updateById(entity.id, { profile });
    return true;
  }

  @Core.transaction()
  private async _saveAfterLock(
    userId: TableIdentity,
    layoutKey: string,
    profile: ILayoutProfile,
  ): Promise<ILayoutProfile> {
    const entity = await this.scope.model.layoutprofile.getForUpdate({ userId, layoutKey });
    if (entity) {
      await this.scope.model.layoutprofile.updateById(entity.id, { profile });
    } else {
      await this.scope.model.layoutprofile.insert({ userId, layoutKey, profile });
    }
    return profile;
  }

  @Core.transaction()
  private async _reset(userId: TableIdentity, layoutKey: string): Promise<void> {
    const entity = await this.scope.model.layoutprofile.getForUpdate({ userId, layoutKey });
    if (entity) await this.scope.model.layoutprofile.deleteById(entity.id);
  }
}
