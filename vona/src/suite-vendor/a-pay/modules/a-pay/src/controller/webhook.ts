import type { IDecoratorControllerOptions } from 'vona-module-a-web';

import { BeanBase } from 'vona';
import { Api } from 'vona-module-a-openapiutils';
import { Passport } from 'vona-module-a-user';
import { Arg, Controller, Web } from 'vona-module-a-web';

import { DtoWebhookReceipt } from '../dto/webhookReceipt.tsx';

export interface IControllerOptionsWebhook extends IDecoratorControllerOptions {}

@Controller<IControllerOptionsWebhook>('webhook')
@Api.exclude()
export class ControllerWebhook extends BeanBase {
  @Web.post(':providerName/:clientName')
  @Passport.public()
  @Api.body(DtoWebhookReceipt)
  async receive(
    @Arg.param('providerName') providerName: string,
    @Arg.param('clientName') clientName: string,
    @Arg.body() body: unknown,
  ): Promise<DtoWebhookReceipt> {
    const { provider, clientOptions } = this.bean.payProvider.resolveByName(
      providerName,
      clientName,
    );
    if (!clientOptions.capabilities.webhooks) {
      this.app.throw(404, 'payment webhook endpoint not found');
    }
    const verified = await provider.verifyWebhook(
      {
        rawBody: this.ctx.request.rawBody,
        body,
        headers: this.ctx.request.headers as Record<string, string | string[] | undefined>,
      },
      clientOptions,
    );
    await this.scope.service.webhook.receive({
      providerName,
      clientName,
      environment: clientOptions.environment,
      rawBody: this.ctx.request.rawBody,
      verified,
    });
    return { accepted: true };
  }
}
