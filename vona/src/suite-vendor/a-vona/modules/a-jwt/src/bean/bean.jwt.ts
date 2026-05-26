import type { IAuthenticateStrategyState } from 'vona-module-a-auth';

import ms from 'ms';
import { BeanBase } from 'vona';
import { Bean } from 'vona-module-a-bean';

import type { IJwtClientRecord, IJwtSignOptions, IJwtToken, IPayloadData } from '../types/jwt.ts';

import { ServiceJwtClient } from '../service/jwtClient.ts';

@Bean()
export class BeanJwt extends BeanBase {
  get(clientName?: keyof IJwtClientRecord) {
    return this.app.bean._getBeanSelector(ServiceJwtClient, clientName);
  }

  async create(payloadData: IPayloadData, options?: IJwtSignOptions): Promise<IJwtToken> {
    // accessToken
    const accessToken = await this.get('access').sign(payloadData, options);
    // refreshToken
    const refreshToken = await this.get('refresh').sign(payloadData, options);
    // expiresIn
    let expiresIn = this.scope.config.clients.access.signOptions.expiresIn!;
    if (typeof expiresIn === 'string') expiresIn = Math.floor(ms(expiresIn) / 1000);
    // ok
    return {
      accessToken,
      refreshToken,
      expiresIn,
    };
  }

  async createTempAuthToken(payloadData: IPayloadData, options?: IJwtSignOptions) {
    return await this.get('access').sign(payloadData, Object.assign({}, options, { temp: true }));
  }

  async createOauthAuthToken(payloadData: IPayloadData, options?: IJwtSignOptions) {
    return await this.get('oauth').sign(payloadData, options);
  }

  async createOauthState(payloadData: IAuthenticateStrategyState, options?: IJwtSignOptions) {
    return await this.get('oauthstate').sign(payloadData as IPayloadData, options);
  }

  async createOauthCode(payloadData: IPayloadData, options?: IJwtSignOptions) {
    return await this.get('code').sign(payloadData, options);
  }

  extractAuthTokenFromAllWays() {
    return this.scope.service.jwtExtract.fromAllWays();
  }
}
