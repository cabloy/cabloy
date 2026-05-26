import type { TableIdentity } from 'table-identity';
import type { ILocaleRecord } from 'vona';

import type { IAuthUserProfile } from './authProfile.ts';

export interface IUserNameRecord {
  admin: never;
}

export interface IUserIdRecord {
  '-1': 'anonymous';
}

export interface IUser {
  id: TableIdentity;
  name: string;
  avatar?: string;
  email?: string;
  mobile?: string;
  activated?: boolean;
  locale?: keyof ILocaleRecord;
  tz?: string;
  anonymous?: boolean;
}

export interface IUserAdapter {
  create(user: Partial<IUser>): Promise<IUser>;
  userOfProfile(profile: IAuthUserProfile): Promise<Partial<IUser>>;
  createAnonymous(): Promise<Partial<IUser>>;
  findOneByName(name: string): Promise<IUser | undefined>;
  findOne(user: Partial<IUser>): Promise<IUser | undefined>;
  update(user: Partial<IUser>): Promise<void>;
  remove(user: Partial<IUser>): Promise<void>;
  setActivated(id: TableIdentity, activated: boolean): Promise<void>;
}
