import type { IJwtAdapter, IJwtInfo } from 'zova-module-a-interceptor';

import { BeanBase } from 'zova';
import { Service } from 'zova-module-a-bean';

@Service()
export class ServiceJwtAdapter extends BeanBase implements IJwtAdapter {
  protected async __init__() {}

  async getJwtInfo(): Promise<IJwtInfo | undefined> {
    return await this.$passport.getJwtInfo();
  }

  async refreshAuthToken(refreshToken: string): Promise<IJwtInfo> {
    return await this.$passport.refreshAuthToken(refreshToken);
  }
}
