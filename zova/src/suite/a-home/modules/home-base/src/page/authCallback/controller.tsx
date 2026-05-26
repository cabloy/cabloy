import { z } from 'zod';
import { BeanControllerPageBase } from 'zova';
import { Controller } from 'zova-module-a-bean';

export const ControllerPageAuthCallbackSchemaQuery = z.object({
  'returnTo': z.string().optional(),
  'x-vona-oauth-code': z.string().optional(),
});

@Controller()
export class ControllerPageAuthCallback extends BeanControllerPageBase {
  protected async __init__() {
    if (process.env.CLIENT) {
      // should not use await
      this._handleAuth();
    }
  }

  private async _handleAuth() {
    const code = this.$query['x-vona-oauth-code']!;
    await this.$passport.loginByOauthCode().mutateAsync({ code });
  }

  protected render() {
    return null;
  }
}
