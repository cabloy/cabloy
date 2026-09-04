import type { TableIdentity } from 'table-identity';

export type LocalizedTextMap = Record<string, string>;

export interface IRoleNameRecord {
  registeredUser: never;
  systemAdmin: never;
}

export interface IRoleIdRecord {}

export interface IRole {
  id: TableIdentity;
  name: string;
  title: string;
  titleLocales?: LocalizedTextMap;
  siteIds: string[];
  builtin?: boolean;
}

export interface IRoleMembershipReplaceResult {
  addedRoleIds: TableIdentity[];
  removedRoleIds: TableIdentity[];
}

export interface IRoleAdapter {
  findOneByName(name: string): Promise<IRole | undefined>;
  findOne(role: Partial<IRole>): Promise<IRole | undefined>;
  findAllByUserId(userId: TableIdentity): Promise<IRole[] | undefined>;
  addUserId(id: TableIdentity, userId: TableIdentity): Promise<boolean>;
  removeUserId(id: TableIdentity, userId: TableIdentity): Promise<boolean>;
  replaceUserRoleIds(
    userId: TableIdentity,
    roleIds: TableIdentity[],
    options?: { preserveRoleIds?: TableIdentity[] },
  ): Promise<IRoleMembershipReplaceResult>;
}
