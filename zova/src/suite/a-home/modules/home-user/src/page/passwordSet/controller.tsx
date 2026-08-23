import type { ApiApiHomeUserAccountconsumePasswordSetRequestBody } from 'zova-module-home-api';

import { SchemaObject } from 'openapi3-ts/oas31';
import { z } from 'zod';
import { BeanControllerPageBase, Use } from 'zova';
import { Controller } from 'zova-module-a-bean';
import { TypeFormOnSubmitData, ZForm } from 'zova-module-a-form';
import { $QueryEnsureLoaded } from 'zova-module-a-model';
import { ZPage } from 'zova-module-home-base';

import { ModelAccount } from '../../model/account.js';

type PasswordSetFormData = Omit<ApiApiHomeUserAccountconsumePasswordSetRequestBody, 'token'>;

export const ControllerPagePasswordSetSchemaQuery = z.object({
  token: z.preprocess(
    value => (typeof value === 'string' ? value : undefined),
    z.string().optional(),
  ),
});

@Controller()
export class ControllerPagePasswordSet extends BeanControllerPageBase {
  @Use()
  $$modelAccount: ModelAccount;

  private token?: string;
  tokenReady = false;
  submitted = false;
  schemaPasswordSet?: SchemaObject;
  passwordSet: PasswordSetFormData = {
    newPassword: '',
    passwordConfirm: '',
  };

  get apiSchemasPasswordSet() {
    return this.$apiSchema.homeUserAccount.consumePasswordSet({ authToken: false });
  }

  protected async __init__() {
    await $QueryEnsureLoaded(() => this.apiSchemasPasswordSet.sdk);
    this.schemaPasswordSet = this.$computed(() => {
      return omitSchemaProperty(this.apiSchemasPasswordSet.requestBody, 'token');
    });

    this.ctx.meta.$ssr.handleDirectOrOnHydrated(async () => {
      await this._consumeQueryToken();
    });
  }

  async submitPasswordSet(data: TypeFormOnSubmitData<PasswordSetFormData>) {
    if (!this.token || this.submitted) return;
    const result = await this.$$modelAccount.consumePasswordSet().mutateAsync({
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
      const pagePath = this.$router.getPagePath('/home/user/password-set');
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
              <h1 class="card-title text-2xl">{this.scope.locale.AccountSetPassword()}</h1>
              {!this.tokenReady ? (
                <p class="text-sm text-base-content/70">
                  {this.scope.locale.AccountPasswordSetPreparing()}
                </p>
              ) : !this.token ? (
                <p role="alert" class="text-sm text-error">
                  {this.scope.locale.AccountPasswordSetInvalid()}
                </p>
              ) : this.submitted ? (
                <p class="text-sm text-base-content/70">
                  {this.scope.locale.AccountPasswordSetCompleted()}
                </p>
              ) : (
                <>
                  <p class="text-sm text-base-content/70">
                    {this.scope.locale.AccountSetPasswordPublicHelp()}
                  </p>
                  <ZForm
                    data={this.passwordSet}
                    schema={this.schemaPasswordSet}
                    onSubmitData={data => this.submitPasswordSet(data)}
                    onShowError={async () => {
                      await this.$performCommand('basic-commands:alert', {
                        type: 'error',
                        text: this.scope.locale.AccountPasswordSetInvalid(),
                      });
                    }}
                    slotFooter={$$form => {
                      return (
                        <button
                          class="btn btn-primary"
                          disabled={$$form.formState.isSubmitting}
                          type="submit"
                        >
                          {this.scope.locale.AccountSetPassword()}
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
