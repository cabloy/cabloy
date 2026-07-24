import type { IApiSchemaOptions } from 'zova-module-a-api';

import { BeanBase } from 'zova';
import { ApiSchema } from 'zova-module-a-api';

import {
  ApiApiCommerceMemberAddressminePath,
  ApiApiCommerceMemberAddressviewMinePath,
  ApiApiCommerceMemberAddresscreateMinePath,
  ApiApiCommerceMemberAddressupdateMinePath,
  ApiApiCommerceMemberAddressdeleteMinePath,
  ApiApiCommerceMemberAddressselectPath,
  ApiApiCommerceMemberAddressviewPath,
} from '../api/commerceMemberAddress.js';

@ApiSchema()
export class ApiSchemaCommerceMemberAddress extends BeanBase {
  mine(options?: IApiSchemaOptions) {
    return this.$sdk.createApiSchemas(ApiApiCommerceMemberAddressminePath, 'get', options);
  }

  viewMine(options?: IApiSchemaOptions) {
    return this.$sdk.createApiSchemas(ApiApiCommerceMemberAddressviewMinePath, 'get', options);
  }

  createMine(options?: IApiSchemaOptions) {
    return this.$sdk.createApiSchemas(ApiApiCommerceMemberAddresscreateMinePath, 'post', options);
  }

  updateMine(options?: IApiSchemaOptions) {
    return this.$sdk.createApiSchemas(ApiApiCommerceMemberAddressupdateMinePath, 'patch', options);
  }

  deleteMine(options?: IApiSchemaOptions) {
    return this.$sdk.createApiSchemas(ApiApiCommerceMemberAddressdeleteMinePath, 'delete', options);
  }

  select(options?: IApiSchemaOptions) {
    return this.$sdk.createApiSchemas(ApiApiCommerceMemberAddressselectPath, 'get', options);
  }

  view(options?: IApiSchemaOptions) {
    return this.$sdk.createApiSchemas(ApiApiCommerceMemberAddressviewPath, 'get', options);
  }
}
