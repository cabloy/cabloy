import type { TableIdentity } from 'table-identity';

import { BeanBase, beanFullNameFromOnionName } from 'vona';
import { Bean } from 'vona-module-a-bean';

import type { IAuthUserProfile } from '../types/authProfile.ts';
import type { IUser, IUserAdapter } from '../types/user.ts';

@Bean()
export class BeanUser extends BeanBase {
  private _userAdapter: IUserAdapter;

  private get userAdapter(): IUserAdapter {
    if (!this._userAdapter) {
      const beanFullName = beanFullNameFromOnionName(this.scope.config.adapter.user, 'service');
      this._userAdapter = this.bean._getBean(beanFullName) as IUserAdapter;
    }
    return this._userAdapter;
  }

  async activate(user: IUser) {
    await this.scope.event.activate.emit(user, async user => {
      await this.userAdapter.setActivated(user.id, true);
    });
  }

  async register(
    user: Partial<IUser>,
    confirmed?: boolean,
    randomUsername?: boolean,
  ): Promise<IUser> {
    // config.user.autoActivate > confirmed
    const autoActivate = this.scope.config.user.autoActivate ? true : confirmed;
    const data = { user, confirmed, autoActivate };
    return (await this.scope.event.register.emit(data, async data => {
      let name = data.user.name;
      if (!name) this.app.throw(403);
      // check if exists
      const userCheck = await this.userAdapter.findOneByName(name);
      if (userCheck) {
        if (!randomUsername) this.scope.error.UserExists.throw();
        name = `${name}_${userCheck.id}${Date.now().toString().substring(8)}`;
      }
      // user
      const userData = { ...data.user, name };
      const userNew = await this.userAdapter.create(userData);
      if (data.autoActivate) {
        await this.activate(userNew);
      }
      return userNew;
    })) as IUser;
  }

  async registerByProfile(profile: IAuthUserProfile, randomUsername?: boolean): Promise<IUser> {
    const user = await this.userAdapter.userOfProfile(profile);
    return await this.register(user, profile.confirmed, randomUsername);
  }

  async createAnonymous(): Promise<IUser> {
    return (await this.scope.event.createAnonymous.emit(undefined, async () => {
      return await this.userAdapter.createAnonymous();
    })) as Promise<IUser>;
  }

  async findOneByName(name: string): Promise<IUser | undefined> {
    return this.userAdapter.findOneByName(name);
  }

  async findOneById(id: TableIdentity): Promise<IUser | undefined> {
    return this.userAdapter.findOne({ id });
  }

  async findOne(user: Partial<IUser>): Promise<IUser | undefined> {
    return this.userAdapter.findOne(user);
  }

  async updateById(id: TableIdentity, user: Partial<IUser>): Promise<void> {
    return this.userAdapter.update({ ...user, id });
  }

  async update(user: Partial<IUser>): Promise<void> {
    return this.userAdapter.update(user);
  }

  async removeById(id: TableIdentity): Promise<void> {
    return this.userAdapter.remove({ id });
  }

  async remove(user: Partial<IUser>): Promise<void> {
    return this.userAdapter.remove(user);
  }
}
