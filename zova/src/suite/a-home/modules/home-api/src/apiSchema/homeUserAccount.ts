import type { IApiSchemaOptions } from 'zova-module-a-api';

import { BeanBase } from 'zova';
import { ApiSchema } from 'zova-module-a-api';

import {
  ApiApiHomeUserAccountcurrentPath,
  ApiApiHomeUserAccountupdateProfilePath,
  ApiApiHomeUserAccountconsumeActivationPath,
  ApiApiHomeUserAccountchangePasswordPath,
  ApiApiHomeUserAccountissuePasswordSetLinkPath,
  ApiApiHomeUserAccountconsumePasswordSetPath,
  ApiApiHomeUserAccountrequestPasswordResetPath,
  ApiApiHomeUserAccountconsumePasswordResetPath,
} from '../api/homeUserAccount.js';

@ApiSchema()
export class ApiSchemaHomeUserAccount extends BeanBase {
  current(options?: IApiSchemaOptions) {
    return this.$sdk.createApiSchemas(ApiApiHomeUserAccountcurrentPath, 'get', options);
  }

  updateProfile(options?: IApiSchemaOptions) {
    return this.$sdk.createApiSchemas(ApiApiHomeUserAccountupdateProfilePath, 'patch', options);
  }

  consumeActivation(options?: IApiSchemaOptions) {
    return this.$sdk.createApiSchemas(ApiApiHomeUserAccountconsumeActivationPath, 'post', options);
  }

  changePassword(options?: IApiSchemaOptions) {
    return this.$sdk.createApiSchemas(ApiApiHomeUserAccountchangePasswordPath, 'post', options);
  }

  issuePasswordSetLink(options?: IApiSchemaOptions) {
    return this.$sdk.createApiSchemas(
      ApiApiHomeUserAccountissuePasswordSetLinkPath,
      'post',
      options,
    );
  }

  consumePasswordSet(options?: IApiSchemaOptions) {
    return this.$sdk.createApiSchemas(ApiApiHomeUserAccountconsumePasswordSetPath, 'post', options);
  }

  requestPasswordReset(options?: IApiSchemaOptions) {
    return this.$sdk.createApiSchemas(
      ApiApiHomeUserAccountrequestPasswordResetPath,
      'post',
      options,
    );
  }

  consumePasswordReset(options?: IApiSchemaOptions) {
    return this.$sdk.createApiSchemas(
      ApiApiHomeUserAccountconsumePasswordResetPath,
      'post',
      options,
    );
  }
}
