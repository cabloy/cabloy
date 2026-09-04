import type { TableIdentity } from 'table-identity';
import type { IRole, IRoleAdapter, IRoleMembershipReplaceResult } from 'vona-module-a-user';

import { BeanBase } from 'vona';
import { Service } from 'vona-module-a-bean';
import { Core } from 'vona-module-a-core';

@Service()
export class ServiceRoleAdapter extends BeanBase implements IRoleAdapter {
  async findOneByName(name: string): Promise<IRole | undefined> {
    return await this.scope.model.role.getByNameEqI(name);
  }

  async findOne(role: Partial<IRole>): Promise<IRole | undefined> {
    return await this.scope.model.role.get(role);
  }

  async findAllByUserId(userId: TableIdentity): Promise<IRole[] | undefined> {
    const user = await this.scope.model.user.get({ id: userId }, { include: { roles: true } });
    return user?.roles;
  }

  async addUserId(id: TableIdentity, userId: TableIdentity): Promise<boolean> {
    return await this.withUserMembershipLock(
      userId,
      async () => await this.addUserIdInTransaction(id, userId),
    );
  }

  async removeUserId(id: TableIdentity, userId: TableIdentity): Promise<boolean> {
    return await this.withUserMembershipLock(
      userId,
      async () => await this.removeUserIdInTransaction(id, userId),
    );
  }

  async replaceUserRoleIds(
    userId: TableIdentity,
    roleIds: TableIdentity[],
    options?: { preserveRoleIds?: TableIdentity[] },
  ): Promise<IRoleMembershipReplaceResult> {
    const requestedRoleIds = this.uniqueIds(roleIds);
    const preserveRoleIds = this.uniqueIds(options?.preserveRoleIds ?? []);
    return await this.withUserMembershipLock(
      userId,
      async () =>
        await this.replaceUserRoleIdsInTransaction(userId, requestedRoleIds, preserveRoleIds),
    );
  }

  @Core.transaction()
  private async addUserIdInTransaction(id: TableIdentity, userId: TableIdentity): Promise<boolean> {
    const existing = await this.scope.model.roleUser.get({ userId, roleId: id });
    if (existing) return false;
    await this.scope.model.roleUser.insert({ userId, roleId: id });
    return true;
  }

  @Core.transaction()
  private async removeUserIdInTransaction(
    id: TableIdentity,
    userId: TableIdentity,
  ): Promise<boolean> {
    const memberships = await this.scope.model.roleUser.select({ where: { userId, roleId: id } });
    if (!memberships.length) return false;
    await this.scope.model.roleUser.deleteBulk(memberships.map(item => item.id));
    return true;
  }

  @Core.transaction()
  private async replaceUserRoleIdsInTransaction(
    userId: TableIdentity,
    requestedRoleIds: TableIdentity[],
    preserveRoleIds: TableIdentity[],
  ): Promise<IRoleMembershipReplaceResult> {
    const memberships = await this.scope.model.roleUser.select({ where: { userId } });
    const membershipsByRoleId = new Map<string, (typeof memberships)[number]>();
    const duplicateMembershipIds: TableIdentity[] = [];
    for (const membership of memberships) {
      const key = String(membership.roleId);
      if (membershipsByRoleId.has(key)) {
        duplicateMembershipIds.push(membership.id);
      } else {
        membershipsByRoleId.set(key, membership);
      }
    }

    const requestedRoleIdsByKey = this.idsByKey(requestedRoleIds);
    const preserveRoleIdsByKey = this.idsByKey(preserveRoleIds);
    const desiredRoleIdsByKey = new Map(requestedRoleIdsByKey);
    for (const [key, roleId] of preserveRoleIdsByKey) {
      if (membershipsByRoleId.has(key)) desiredRoleIdsByKey.set(key, roleId);
    }

    const removedRoleIds: TableIdentity[] = [];
    const obsoleteMembershipIds = [...duplicateMembershipIds];
    for (const [key, membership] of membershipsByRoleId) {
      if (!desiredRoleIdsByKey.has(key)) {
        obsoleteMembershipIds.push(membership.id);
        removedRoleIds.push(membership.roleId);
      }
    }
    if (obsoleteMembershipIds.length) {
      await this.scope.model.roleUser.deleteBulk(obsoleteMembershipIds);
    }

    const addedRoleIds: TableIdentity[] = [];
    for (const [key, roleId] of requestedRoleIdsByKey) {
      if (!membershipsByRoleId.has(key)) {
        await this.scope.model.roleUser.insert({ userId, roleId });
        addedRoleIds.push(roleId);
      }
    }
    return { addedRoleIds, removedRoleIds };
  }

  private async withUserMembershipLock<RESULT>(
    userId: TableIdentity,
    operation: () => Promise<RESULT>,
  ): Promise<RESULT> {
    return await this.scope.redlock.lock(
      `homeUser.roleMembership.${encodeURIComponent(String(userId))}`,
      operation,
    );
  }

  private uniqueIds(ids: TableIdentity[]): TableIdentity[] {
    return [...this.idsByKey(ids).entries()]
      .toSorted(([left], [right]) => left.localeCompare(right))
      .map(([, id]) => id);
  }

  private idsByKey(ids: TableIdentity[]): Map<string, TableIdentity> {
    const values = new Map<string, TableIdentity>();
    for (const id of ids) values.set(String(id), id);
    return values;
  }
}
