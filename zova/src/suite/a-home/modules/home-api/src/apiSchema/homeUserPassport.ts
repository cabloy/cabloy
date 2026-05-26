import { BeanBase } from 'zova';
import { ApiSchema, IApiSchemaOptions } from 'zova-module-a-api';

import {
  ApiApiHomeUserPassportcurrentPath,
  ApiApiHomeUserPassportlogoutPath,
  ApiApiHomeUserPassportregisterPath,
  ApiApiHomeUserPassportloginPath,
  ApiApiHomeUserPassportloginOauthPath,
  ApiApiHomeUserPassportassociatePath,
  ApiApiHomeUserPassportmigratePath,
  ApiApiHomeUserPassportrefreshAuthTokenPath,
  ApiApiHomeUserPassportcreatePassportJwtFromOauthCodePath,
  ApiApiHomeUserPassportcreateTempAuthTokenPath,
} from '../api/homeUserPassport.js';

@ApiSchema()
export class ApiSchemaHomeUserPassport extends BeanBase {
  current(options?: IApiSchemaOptions) {
    return this.$sdk.createApiSchemas(ApiApiHomeUserPassportcurrentPath, 'get', options);
  }

  logout(options?: IApiSchemaOptions) {
    return this.$sdk.createApiSchemas(ApiApiHomeUserPassportlogoutPath, 'post', options);
  }

  register(options?: IApiSchemaOptions) {
    return this.$sdk.createApiSchemas(ApiApiHomeUserPassportregisterPath, 'post', options);
  }

  login(options?: IApiSchemaOptions) {
    return this.$sdk.createApiSchemas(ApiApiHomeUserPassportloginPath, 'post', options);
  }

  loginOauth(options?: IApiSchemaOptions) {
    return this.$sdk.createApiSchemas(ApiApiHomeUserPassportloginOauthPath, 'get', options);
  }

  associate(options?: IApiSchemaOptions) {
    return this.$sdk.createApiSchemas(ApiApiHomeUserPassportassociatePath, 'get', options);
  }

  migrate(options?: IApiSchemaOptions) {
    return this.$sdk.createApiSchemas(ApiApiHomeUserPassportmigratePath, 'get', options);
  }

  refreshAuthToken(options?: IApiSchemaOptions) {
    return this.$sdk.createApiSchemas(ApiApiHomeUserPassportrefreshAuthTokenPath, 'post', options);
  }

  createPassportJwtFromOauthCode(options?: IApiSchemaOptions) {
    return this.$sdk.createApiSchemas(
      ApiApiHomeUserPassportcreatePassportJwtFromOauthCodePath,
      'post',
      options,
    );
  }

  createTempAuthToken(options?: IApiSchemaOptions) {
    return this.$sdk.createApiSchemas(
      ApiApiHomeUserPassportcreateTempAuthTokenPath,
      'post',
      options,
    );
  }
}
