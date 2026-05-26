import type { IPayloadData } from 'vona-module-a-jwt';

import { BeanBase, createHash, uuidv4 } from 'vona';
import { Service } from 'vona-module-a-bean';

import type { IAuthTokenAdapter } from '../types/authToken.ts';
import type { IUser } from '../types/user.ts';

@Service()
export class ServiceAuthTokenAdapter extends BeanBase implements IAuthTokenAdapter {
  async create(payloadData: IPayloadData, ttl?: number): Promise<IPayloadData> {
    const authIdStr = this._getAuthId(payloadData)?.toString();
    const token = authIdStr === '-1' ? createHash(authIdStr) : uuidv4();
    const payloadDataNew = Object.assign({}, payloadData, {
      [this.scope.config.payloadData.fields.token]: token,
    });
    await this.scope.service.redisToken.create(payloadDataNew, ttl);
    return payloadDataNew;
  }

  async retrieve(payloadData: IPayloadData): Promise<IPayloadData | undefined> {
    return await this.scope.service.redisToken.retrieve(payloadData);
  }

  async verify(payloadData: IPayloadData): Promise<boolean> {
    return await this.scope.service.redisToken.verify(payloadData);
  }

  async refresh(payloadData: IPayloadData, ttl?: number): Promise<void> {
    await this.scope.service.redisToken.refresh(payloadData, ttl);
  }

  async remove(payloadData: IPayloadData): Promise<void> {
    await this.scope.service.redisToken.remove(payloadData);
  }

  async removeAll(user: IUser): Promise<void> {
    await this.scope.service.redisToken.removeAll(user);
  }

  private _getAuthId(payloadData: IPayloadData) {
    return payloadData[this.scope.config.payloadData.fields.authId];
  }
}
