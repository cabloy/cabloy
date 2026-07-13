import type { TableIdentity } from 'table-identity';

export interface IRoleNameRecord {
  registeredUser: never;
  systemAdmin: never;
}

export interface IRoleIdRecord {}

export interface IRole {
  id: TableIdentity;
  name: string;
  siteIds: string[];
}

export interface IRoleAdapter {
  findOneByName(name: string): Promise<IRole | undefined>;
  findOne(role: Partial<IRole>): Promise<IRole | undefined>;
  findAllByUserId(userId: TableIdentity): Promise<IRole[] | undefined>;
  addUserId(id: TableIdentity, userId: TableIdentity): Promise<TableIdentity>;
}
