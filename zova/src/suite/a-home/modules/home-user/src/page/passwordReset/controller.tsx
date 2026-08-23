import type { ApiApiHomeUserAccountconsumePasswordResetRequestBody } from 'zova-module-home-api';

import { SchemaObject } from 'openapi3-ts/oas31';
import { z } from 'zod';
import { BeanControllerPageBase, Use } from 'zova';
import { Controller } from 'zova-module-a-bean';
import { TypeFormOnSubmitData, ZForm } from 'zova-module-a-form';
import { $QueryEnsureLoaded } from 'zova-module-a-model';
import { ZPage } from 'zova-module-home-base';

import { ModelAccount } from '../../model/account.js';

type PasswordResetFormData = Omit<ApiApiHomeUserAccountconsumePasswordResetRequestBody, 'token'>;

export const ControllerPagePasswordResetSchemaQuery = z.object({
  token: z.preprocess(
    value => (typeof value === 'string' ? value : undefined),
    z.string().optional(),
  ),
});

@Controller()
export class ControllerPagePasswordReset extends BeanControllerPageBase {
  @Use()
  $$modelAccount: ModelAccount;

  private token?: string;
  tokenReady = false;
  submitted = false;
  schemaPasswordReset?: SchemaObject;
  passwordReset: PasswordResetFormData = {
    newPassword: '',
    passwordConfirm: '',
  };

  get apiSchemasPasswordReset() {
    return this.$apiSchema.homeUserAccount.consumePasswordReset({ authToken: false });
  }

  protected async __init__() {
    await $QueryEnsureLoaded(() => this.apiSchemasPasswordReset.sdk);
    this.schemaPasswordReset = this.$computed(() => {
      return omitSchemaProperty(this.apiSchemasPasswordReset.requestBody, 'token');
    });

    this.ctx.meta.$ssr.handleDirectOrOnHydrated(async () => {
      await this._consumeQueryToken();
    });
  }

  async submitPasswordReset(data: TypeFormOnSubmitData<PasswordResetFormData>) {
    if (!this.token || this.submitted) return;
    const result = await this.$$modelAccount.consumePasswordReset().mutateAsync({
      token: this.token,
      ...data.value,
    });
    this.token = undefined;
    if (result.requiresRelogin) {
      this.submitted = true;
      await this.$passport.requireRelogin(false);
    }
  }

  private async _consumeQueryToken() {
    this.token = this.$query.token || undefined;
    try {
      const pagePath = this.$router.getPagePath('/home/user/password-reset');
      await this.$router.replace(pagePath);
    } finally {
      this.tokenReady = true;
    }
  }

  protected render() {
    return (
      <ZPage>
        <section class="mx-auto max-w-md p-6">
          <div class="card border border-base-300 bg-base-100 shadow-sm">
            <div class="card-body gap-4">
              <h1 class="card-title text-2xl">{this.scope.locale.AccountResetPassword()}</h1>
              {!this.tokenReady ? (
                <p class="text-sm text-base-content/70">
                  {this.scope.locale.AccountPasswordResetPreparing()}
                </p>
              ) : !this.token ? (
                <p role="alert" class="text-sm text-error">
                  {this.scope.locale.AccountPasswordResetInvalid()}
                </p>
              ) : this.submitted ? (
                <p class="text-sm text-base-content/70">
                  {this.scope.locale.AccountPasswordResetCompleted()}
                </p>
              ) : (
                <>
                  <p class="text-sm text-base-content/70">
                    {this.scope.locale.AccountResetPasswordPublicHelp()}
                  </p>
                  <ZForm
                    data={this.passwordReset}
                    schema={this.schemaPasswordReset}
                    onSubmitData={data => this.submitPasswordReset(data)}
                    onShowError={async ({ error }) => {
                      await this.$performCommand('basic-commands:alert', {
                        type: 'error',
                        text: error.message,
                      });
                    }}
                    slotFooter={$$form => {
                      return (
                        <button
                          class="btn btn-primary"
                          disabled={$$form.formState.isSubmitting}
                          type="submit"
                        >
                          {this.scope.locale.AccountResetPassword()}
                        </button>
                      );
                    }}
                  ></ZForm>
                </>
              )}
            </div>
          </div>
        </section>
      </ZPage>
    );
  }
}

function omitSchemaProperty(schema: SchemaObject | undefined, property: string) {
  if (!schema) return;
  const { [property]: _, ...properties } = schema.properties ?? {};
  return {
    ...schema,
    properties,
    required: schema.required?.filter(item => item !== property),
  };
}
