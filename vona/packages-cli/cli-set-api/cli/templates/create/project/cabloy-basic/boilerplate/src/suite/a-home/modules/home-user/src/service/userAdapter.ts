import type { TableIdentity } from 'table-identity';
import type { IAuthUserProfile, IUser, IUserAdapter } from 'vona-module-a-user';

import { BeanBase } from 'vona';
import { Service } from 'vona-module-a-bean';

@Service()
export class ServiceUserAdapter extends BeanBase implements IUserAdapter {
  async create(user: Partial<IUser>): Promise<IUser> {
    return await this.scope.model.user.insert(user);
  }

  async userOfProfile(profile: IAuthUserProfile): Promise<Partial<IUser>> {
    return {
      name: profile.username!,
      email: profile.emails?.[0].value,
      avatar: profile.photos?.[0].value,
      locale: profile.locale || this.ctx.locale,
      tz: this.ctx.tz,
    };
  }

  async createAnonymous(): Promise<Partial<IUser>> {
    return { id: -1, anonymous: true, name: 'anonymous' };
  }

  async findOneByName(name: string): Promise<IUser | undefined> {
    return await this.scope.model.user.getByNameEqI(name);
  }

  async findOne(user: Partial<IUser>): Promise<IUser | undefined> {
    return await this.scope.model.user.get(user);
  }

  async update(user: Partial<IUser>): Promise<void> {
    await this.scope.model.user.update(user);
  }

  async remove(user: Partial<IUser>): Promise<void> {
    await this.scope.model.user.delete(user);
  }

  async setActivated(id: TableIdentity, activated: boolean): Promise<void> {
    await this.scope.model.user.update({ id, activated });
  }
}
