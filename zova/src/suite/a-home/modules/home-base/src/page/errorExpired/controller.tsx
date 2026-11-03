import { z } from 'zod';
import { BeanControllerPageBase, Use } from 'zova';
import { Controller } from 'zova-module-a-bean';
import { ServiceJwtAdapter } from 'zova-module-home-api';

export const ControllerPageErrorExpiredSchemaQuery = z.object({
  returnTo: z.string().optional(),
});

@Controller()
export class ControllerPageErrorExpired extends BeanControllerPageBase {
  @Use()
  $$jwtAdapter: ServiceJwtAdapter;

  protected async __init__() {
    if (process.env.CLIENT) {
      // should not use await
      this._refreshToken().catch(error => this.$errorHandler(error));
    }
  }

  private async _refreshToken() {
    const returnTo = this.$query.returnTo;
    const jwtInfo = await this.$$jwtAdapter.getJwtInfo();
    const refreshToken = jwtInfo?.refreshToken;
    if (!refreshToken) {
      await this.$passport.requireRelogin(returnTo ?? false);
      return;
    }
    try {
      await this.$$jwtAdapter.refreshAuthToken(refreshToken);
    } catch (error: any) {
      if (error.code !== 401) throw error;
      await this.$passport.requireRelogin(returnTo ?? false);
      return;
    }
    await this.app.$gotoReturnTo(returnTo);
  }

  protected render() {
    return null;
  }
}
