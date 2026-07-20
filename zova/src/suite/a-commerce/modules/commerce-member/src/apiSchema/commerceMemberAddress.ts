import type { IApiSchemaOptions } from 'zova-module-a-api';

import { BeanBase } from 'zova';
import { ApiSchema } from 'zova-module-a-api';

import {
  ApiApiCommerceMemberAddressselectPath,
  ApiApiCommerceMemberAddresscreatePath,
  ApiApiCommerceMemberAddressviewPath,
  ApiApiCommerceMemberAddressdeletePath,
  ApiApiCommerceMemberAddressupdatePath,
} from '../api/commerceMemberAddress.js';

@ApiSchema()
export class ApiSchemaCommerceMemberAddress extends BeanBase {
  select(options?: IApiSchemaOptions) {
    return this.$sdk.createApiSchemas(ApiApiCommerceMemberAddressselectPath, 'get', options);
  }

  create(options?: IApiSchemaOptions) {
    return this.$sdk.createApiSchemas(ApiApiCommerceMemberAddresscreatePath, 'post', options);
  }

  view(options?: IApiSchemaOptions) {
    return this.$sdk.createApiSchemas(ApiApiCommerceMemberAddressviewPath, 'get', options);
  }

  delete(options?: IApiSchemaOptions) {
    return this.$sdk.createApiSchemas(ApiApiCommerceMemberAddressdeletePath, 'delete', options);
  }

  update(options?: IApiSchemaOptions) {
    return this.$sdk.createApiSchemas(ApiApiCommerceMemberAddressupdatePath, 'patch', options);
  }
}
