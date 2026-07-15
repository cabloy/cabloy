import type { TableIdentity } from 'table-identity';
import type { ILocaleRecord } from 'vona';

export interface IRoleNameRecord {
  registeredUser: never;
  systemAdmin: never;
}

export interface IRoleIdRecord {}

export interface IRole {
  id: TableIdentity;
  name: string;
  title: string;
  locales: Partial<Record<keyof ILocaleRecord, string>>;
  siteIds: string[];
}

export interface IRoleAdapter {
  findOneByName(name: string): Promise<IRole | undefined>;
  findOne(role: Partial<IRole>): Promise<IRole | undefined>;
  findAllByUserId(userId: TableIdentity): Promise<IRole[] | undefined>;
  addUserId(id: TableIdentity, userId: TableIdentity): Promise<TableIdentity>;
}
