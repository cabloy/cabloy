import type { TableIdentity } from 'table-identity';

import { Client, OrdersController } from '@cabloy/paypal-server-sdk';
import {
  CheckoutPaymentIntent,
  Environment,
  LogLevel,
  OrderStatus,
} from '@cabloy/paypal-server-sdk';
import { combineQueries } from '@cabloy/utils';
import { BeanBase } from 'vona';
import { Bean } from 'vona-module-a-bean';

import type { IPaypalOrderRecordOptions, IPaypalOrderRecordPayload } from '../types/paypal.ts';

@Bean()
export class BeanPaypal extends BeanBase {
  createClient() {
    return new Client({
      clientCredentialsAuthCredentials: {
        oAuthClientId: this.scope.config.client.clientId,
        oAuthClientSecret: this.scope.config.client.clientSecret,
      },
      timeout: 0,
      environment: this.app.meta.isProd ? Environment.Production : Environment.Sandbox,
      logging: this.scope.config.client.logging
        ? {
            logLevel: LogLevel.Info,
            logRequest: {
              logBody: true,
            },
            logResponse: {
              logHeaders: true,
            },
          }
        : undefined,
    });
  }

  async createOrder(
    userId: TableIdentity,
    payload: IPaypalOrderRecordPayload,
    options: IPaypalOrderRecordOptions,
  ) {
    // create record
    const record = await this.scope.model.paypalRecord.insert({
      userId,
      status: 0,
      prepayId: undefined,
      payload,
      options,
    });
    const recordId = record.id;
    // test
    if (this.app.meta.isTest) {
      this.ctx.commit(async () => {
        await this.scope.service.paypal.captureOrder(userId, recordId);
      });
      return { recordId, approveUrl: undefined };
    }
    // url
    const returnUrl = combineQueries(options.returnUrl, { recordId });
    const cancelUrl = combineQueries(options.cancelUrl, { recordId });
    // create order
    const ordersController = new OrdersController(this.createClient());
    const res = await ordersController.createOrder({
      body: {
        intent: CheckoutPaymentIntent.Capture,
        applicationContext: {
          brandName: options.brandName,
          returnUrl,
          cancelUrl,
        },
        purchaseUnits: [
          {
            description: payload.remark,
            amount: {
              currencyCode: payload.currencyCode,
              value: payload.total,
            },
          },
        ],
      },
    });
    if (!res.result || res.result.status !== OrderStatus.Created) {
      this.scope.error.TransactionException.throw();
    }
    // prepayId
    const prepayId = res.result.id;
    const approveUrl = res.result.links?.find(item => item.rel === 'approve')?.href;
    // save prepayId
    await this.scope.model.paypalRecord.update({
      id: recordId,
      prepayId,
    });
    // ok
    return { recordId, approveUrl };
  }
}
