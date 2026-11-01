import type { IAuthenticateStrategyState } from 'vona-module-a-auth';

import { BeanBase } from 'vona';
import { Bean } from 'vona-module-a-bean';

import type {
  IJwtClientRecord,
  IJwtCreateOptions,
  IJwtSignOptions,
  IJwtToken,
  IPayloadData,
} from '../types/jwt.ts';

import { ServiceJwtClient } from '../service/jwtClient.ts';

@Bean()
export class BeanJwt extends BeanBase {
  get(clientName?: keyof IJwtClientRecord) {
    return this.app.bean._getBeanSelector(ServiceJwtClient, clientName);
  }

  async create(payloadData: IPayloadData, options?: IJwtCreateOptions): Promise<IJwtToken> {
    const accessClient = this.get(options?.accessClient ?? 'access');
    const refreshClient = this.get(options?.refreshClient ?? 'refresh');
    const signOptions = { path: options?.path, dev: options?.dev, temp: options?.temp };
    // accessToken
    const accessOptions = { ...signOptions, expiresIn: options?.accessExpiresIn };
    const accessToken = await accessClient.sign(payloadData, accessOptions);
    // refreshToken
    const refreshToken = await refreshClient.sign(payloadData, {
      ...signOptions,
      expiresIn: options?.refreshExpiresIn,
    });
    // expiresIn
    const expiresIn = accessClient.getExpiresIn(accessOptions);
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
