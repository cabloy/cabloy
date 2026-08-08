import type { IApiSchemaOptions } from 'zova-module-a-api';

import { BeanBase } from 'zova';
import { ApiSchema } from 'zova-module-a-api';

import {
  ApiApiCommerceTradeOrderminePath,
  ApiApiCommerceTradeOrderviewMinePath,
  ApiApiCommerceTradeOrderrequestRefundPath,
  ApiApiCommerceTradeOrderapproveRefundPath,
  ApiApiCommerceTradeOrderrejectRefundPath,
  ApiApiCommerceTradeOrderexecuteRefundPath,
  ApiApiCommerceTradeOrderrefundRecoveryPath,
  ApiApiCommerceTradeOrderreconcileRefundPath,
  ApiApiCommerceTradeOrderretryRefundPath,
  ApiApiCommerceTradeOrdershipPath,
  ApiApiCommerceTradeOrderselectPath,
  ApiApiCommerceTradeOrderviewPath,
} from '../api/commerceTradeOrder.js';

@ApiSchema()
export class ApiSchemaCommerceTradeOrder extends BeanBase {
  mine(options?: IApiSchemaOptions) {
    return this.$sdk.createApiSchemas(ApiApiCommerceTradeOrderminePath, 'get', options);
  }

  viewMine(options?: IApiSchemaOptions) {
    return this.$sdk.createApiSchemas(ApiApiCommerceTradeOrderviewMinePath, 'get', options);
  }

  requestRefund(options?: IApiSchemaOptions) {
    return this.$sdk.createApiSchemas(ApiApiCommerceTradeOrderrequestRefundPath, 'post', options);
  }

  approveRefund(options?: IApiSchemaOptions) {
    return this.$sdk.createApiSchemas(ApiApiCommerceTradeOrderapproveRefundPath, 'post', options);
  }

  rejectRefund(options?: IApiSchemaOptions) {
    return this.$sdk.createApiSchemas(ApiApiCommerceTradeOrderrejectRefundPath, 'post', options);
  }

  executeRefund(options?: IApiSchemaOptions) {
    return this.$sdk.createApiSchemas(ApiApiCommerceTradeOrderexecuteRefundPath, 'post', options);
  }

  refundRecovery(options?: IApiSchemaOptions) {
    return this.$sdk.createApiSchemas(ApiApiCommerceTradeOrderrefundRecoveryPath, 'get', options);
  }

  reconcileRefund(options?: IApiSchemaOptions) {
    return this.$sdk.createApiSchemas(ApiApiCommerceTradeOrderreconcileRefundPath, 'post', options);
  }

  retryRefund(options?: IApiSchemaOptions) {
    return this.$sdk.createApiSchemas(ApiApiCommerceTradeOrderretryRefundPath, 'post', options);
  }

  ship(options?: IApiSchemaOptions) {
    return this.$sdk.createApiSchemas(ApiApiCommerceTradeOrdershipPath, 'post', options);
  }

  select(options?: IApiSchemaOptions) {
    return this.$sdk.createApiSchemas(ApiApiCommerceTradeOrderselectPath, 'get', options);
  }

  view(options?: IApiSchemaOptions) {
    return this.$sdk.createApiSchemas(ApiApiCommerceTradeOrderviewPath, 'get', options);
  }
}
