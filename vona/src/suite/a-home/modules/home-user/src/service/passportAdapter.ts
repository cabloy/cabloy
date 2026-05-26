import type { IPassport, IPassportAdapter } from 'vona-module-a-user';

import { BeanBase } from 'vona';
import { Service } from 'vona-module-a-bean';

import type { IPayloadDataOfPassport } from '../types/jwt.ts';

@Service()
export class ServicePassportAdapter extends BeanBase implements IPassportAdapter {
  async isAdmin(passport: IPassport | undefined): Promise<boolean> {
    if (!passport) return false;
    if (passport.roles?.some(role => role.name === 'admin')) return true;
    return false;
  }

  async setCurrent(passport: IPassport | undefined): Promise<IPassport | undefined> {
    return passport;
  }

  async serialize(passport: IPassport): Promise<IPayloadDataOfPassport> {
    const userId = passport.user!.id;
    const authId = passport.auth!.id;
    return { userId, authId };
  }

  async deserialize(payloadData: IPayloadDataOfPassport): Promise<IPassport | undefined> {
    const user = await this.bean.user.findOneById(payloadData.userId);
    if (!user) return;
    const auth = await this.bean.auth.findOne({ id: payloadData.authId });
    if (!auth) return;
    const roles = await this.bean.role.findAllByUserId(payloadData.userId);
    return { user, auth, roles };
  }
}
