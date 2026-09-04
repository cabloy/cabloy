import type { TableIdentity } from 'table-identity';

import { BeanBase, beanFullNameFromOnionName } from 'vona';
import { Bean } from 'vona-module-a-bean';
import { Core } from 'vona-module-a-core';

import type { IRole, IRoleAdapter, IRoleMembershipReplaceResult } from '../types/role.ts';

@Bean()
export class BeanRole extends BeanBase {
  private _roleAdapter: IRoleAdapter;

  private get roleAdapter(): IRoleAdapter {
    if (!this._roleAdapter) {
      const beanFullName = beanFullNameFromOnionName(this.scope.config.adapter.role, 'service');
      this._roleAdapter = this.bean._getBean(beanFullName) as IRoleAdapter;
    }
    return this._roleAdapter;
  }

  findOneByName(name: string): Promise<IRole | undefined> {
    return this.roleAdapter.findOneByName(name);
  }

  findOneById(id: TableIdentity): Promise<IRole | undefined> {
    return this.roleAdapter.findOne({ id });
  }

  findOne(role: Partial<IRole>): Promise<IRole | undefined> {
    return this.roleAdapter.findOne(role);
  }

  findAllByUserId(userId: TableIdentity): Promise<IRole[] | undefined> {
    return this.roleAdapter.findAllByUserId(userId);
  }

  @Core.transaction()
  async addUserId(id: TableIdentity, userId: TableIdentity): Promise<boolean> {
    const changed = await this.roleAdapter.addUserId(id, userId);
    if (changed) await this.emitMembershipChanged(userId, [id]);
    return changed;
  }

  @Core.transaction()
  async removeUserId(id: TableIdentity, userId: TableIdentity): Promise<boolean> {
    const changed = await this.roleAdapter.removeUserId(id, userId);
    if (changed) await this.emitMembershipChanged(userId, [id]);
    return changed;
  }

  @Core.transaction()
  async replaceUserRoleIds(
    userId: TableIdentity,
    roleIds: TableIdentity[],
    options?: { preserveRoleIds?: TableIdentity[] },
  ): Promise<IRoleMembershipReplaceResult> {
    const result = await this.roleAdapter.replaceUserRoleIds(userId, roleIds, options);
    const changedRoleIds = [...result.addedRoleIds, ...result.removedRoleIds];
    if (changedRoleIds.length) await this.emitMembershipChanged(userId, changedRoleIds);
    return result;
  }

  private async emitMembershipChanged(
    userId: TableIdentity,
    roleIds: TableIdentity[],
  ): Promise<void> {
    await this.scope.event.roleMembershipChanged.emit({
      userIds: this.uniqueIds([userId]),
      roleIds: this.uniqueIds(roleIds),
    });
  }

  private uniqueIds(ids: TableIdentity[]): TableIdentity[] {
    const values = new Map<string, TableIdentity>();
    for (const id of ids) values.set(String(id), id);
    return [...values.entries()]
      .toSorted(([left], [right]) => left.localeCompare(right))
      .map(([, id]) => id);
  }
}
