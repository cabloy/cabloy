import type { IPayloadData } from 'vona-module-a-jwt';
import type { IUser } from 'vona-module-a-user';

import { BeanBase } from 'vona';
import { Service } from 'vona-module-a-bean';

@Service()
export class ServiceRedisToken extends BeanBase {
  async verify(payloadData: IPayloadData) {
    const payloadData2 = await this.retrieve(payloadData);
    if (!payloadData2) return false;
    if (this._getToken(payloadData2) !== this._getToken(payloadData)) return false;
    return true;
  }

  async retrieve(payloadData: IPayloadData): Promise<IPayloadData | undefined> {
    const key = this._getAuthRedisKey(payloadData);
    if (!key) return;
    const token = await this.scope.cacheRedis.authToken.get(key);
    if (!token) return;
    return { ...payloadData, [this.scope.config.payloadData.fields.token]: token };
  }

  async create(payloadData: IPayloadData, ttl?: number) {
    const key = this._getAuthRedisKey(payloadData);
    if (!key || !this._getToken(payloadData)) return this.app.throw(401);
    await this.scope.cacheRedis.authToken.set(this._getToken(payloadData), key, { ttl });
  }

  async refresh(payloadData: IPayloadData, ttl?: number) {
    const key = this._getAuthRedisKey(payloadData);
    if (!key) return this.app.throw(401);
    await this.scope.cacheRedis.authToken.expire(key, { ttl });
  }

  async remove(payloadData: IPayloadData) {
    const key = this._getAuthRedisKey(payloadData);
    if (!key) return;
    await this.scope.cacheRedis.authToken.del(key);
  }

  async removeAll(user: IUser) {
    const keyPrefix = this._getAuthRedisKeyPrefix(user);
    const keys = await this.scope.cacheRedis.authToken.lookupKeys(keyPrefix, true);
    await this.scope.cacheRedis.authToken.mdel(keys);
  }

  private _getAuthRedisKey(payloadData: IPayloadData) {
    if (!this.ctx.instance) return;
    return `${this._getUserId(payloadData)}:${this._getAuthId(payloadData)}`;
  }

  private _getAuthRedisKeyPrefix(user: IUser) {
    return `${user.id}`;
  }

  private _getToken(payloadData: IPayloadData) {
    return payloadData[this.scope.config.payloadData.fields.token];
  }

  private _getAuthId(payloadData: IPayloadData) {
    return payloadData[this.scope.config.payloadData.fields.authId];
  }

  private _getUserId(payloadData: IPayloadData) {
    return payloadData[this.scope.config.payloadData.fields.userId];
  }
}
