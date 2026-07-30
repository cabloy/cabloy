import type { IDecoratorControllerOptions } from 'vona-module-a-web';

import { BeanBase } from 'vona';
import { Api } from 'vona-module-a-openapiutils';
import { Passport } from 'vona-module-a-user';
import { Arg, Controller, Web } from 'vona-module-a-web';

import type { IPayWebhookEndpointOptions } from '../config/config.ts';

import { DtoWebhookReceipt } from '../dto/webhookReceipt.tsx';

export interface IControllerOptionsWebhook extends IDecoratorControllerOptions {}

@Controller<IControllerOptionsWebhook>('webhook')
export class ControllerWebhook extends BeanBase {
  @Web.post(':endpointKey')
  @Passport.public()
  @Api.body(DtoWebhookReceipt)
  async receive(
    @Arg.param('endpointKey') endpointKey: string,
    @Arg.body() body: unknown,
    @Arg.headers() headers: Record<string, string | string[] | undefined>,
  ): Promise<DtoWebhookReceipt> {
    const endpoint = this.scope.config.webhooks.endpoints[endpointKey] as
      | IPayWebhookEndpointOptions
      | undefined;
    if (!endpoint?.enabled || this.ctx.instanceName !== endpoint.instanceName) {
      this.app.throw(404, 'payment webhook endpoint not found');
    }
    const provider = this.bean.payProvider.get(endpoint.providerName as never);
    const verified = await provider.verifyWebhook({
      endpointKey,
      rawBody: this.ctx.request.rawBody,
      body,
      headers,
    });
    await this.scope.service.webhook.receive({
      ...endpoint,
      rawBody: this.ctx.request.rawBody,
      verified,
    });
    return { accepted: true };
  }
}
