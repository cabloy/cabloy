import type { ApiApiHomeUserAccountrequestPasswordResetRequestBody } from 'zova-module-home-api';

import { SchemaObject } from 'openapi3-ts/oas31';
import { BeanControllerPageBase, Use } from 'zova';
import { Controller } from 'zova-module-a-bean';
import { ZForm, ZFormFieldBlank, ZFormFieldPreset, TypeFormOnSubmitData } from 'zova-module-a-form';
import { $QueryEnsureLoaded } from 'zova-module-a-model';
import { ModelAccount } from 'zova-module-home-user';

@Controller()
export class ControllerPagePasswordResetRequest extends BeanControllerPageBase {
  @Use()
  $$modelAccount: ModelAccount;

  submitted = false;
  schema?: SchemaObject;
  request: Omit<ApiApiHomeUserAccountrequestPasswordResetRequestBody, 'consumerUrl'> = {
    email: '',
    captcha: {
      id: '',
      token: '',
    },
  };

  get apiSchemasPasswordResetRequest() {
    return this.$apiSchema.homeUserAccount.requestPasswordReset({ authToken: false });
  }

  protected async __init__() {
    await $QueryEnsureLoaded(() => this.apiSchemasPasswordResetRequest.sdk);
    this.schema = this.$computed(() => {
      return omitSchemaProperty(this.apiSchemasPasswordResetRequest.requestBody, 'consumerUrl');
    });
  }

  async submitPasswordResetRequest(
    data: TypeFormOnSubmitData<
      Omit<ApiApiHomeUserAccountrequestPasswordResetRequestBody, 'consumerUrl'>
    >,
  ) {
    const consumerUrl = this.$router.getPagePath('/home/user/password-reset', undefined, true);
    if (!consumerUrl) throw new Error('password-reset consumer route is unavailable');
    await this.$$modelAccount.requestPasswordReset().mutateAsync({ ...data.value, consumerUrl });
    this.submitted = true;
  }

  gotoLogin() {
    return this.app.$gotoPage('/home/login');
  }

  protected render() {
    return (
      <div class="min-h-screen bg-base-200 flex items-center p-6">
        <section class="card mx-auto w-full max-w-md bg-base-100 shadow-xl">
          <div class="card-body gap-4">
            <div>
              <h1 class="card-title text-2xl">{this.scope.locale.PasswordReset()}</h1>
              <p class="mt-1 text-sm text-base-content/70">
                {this.scope.locale.PasswordResetHelp()}
              </p>
            </div>
            {this.submitted ? (
              <>
                <p class="text-sm text-base-content/70">
                  {this.scope.locale.PasswordResetRequestAccepted()}
                </p>
                <button class="btn btn-primary" type="button" onClick={() => this.gotoLogin()}>
                  {this.scope.locale.BackToLogin()}
                </button>
              </>
            ) : (
              <ZForm
                data={this.request}
                schema={this.schema}
                formProvider={{ behaviors: { FormFieldLayout: 'home-login:formFieldLayoutLogin' } }}
                onSubmitData={data => this.submitPasswordResetRequest(data)}
                onShowError={async ({ error }) => {
                  await this.$performCommand('basic-commands:alert', {
                    type: 'error',
                    text: error.message,
                  });
                }}
              >
                <ZFormFieldPreset
                  name="email"
                  render="basic-input:formFieldInput"
                  options={{ type: 'email', placeholder: this.scope.locale.YourEmail() }}
                  layout={{ iconPrefix: ':daisy:person' }}
                ></ZFormFieldPreset>
                <ZFormFieldPreset
                  name="captcha"
                  render="basic-captcha:formFieldCaptcha"
                  layout={{ iconPrefix: ':editor:code-block' }}
                ></ZFormFieldPreset>
                <ZFormFieldBlank
                  slotDefault={$$form => {
                    return (
                      <button
                        disabled={$$form.formState.isSubmitting}
                        type="submit"
                        class="btn btn-primary w-full"
                      >
                        {this.scope.locale.PasswordReset()}
                      </button>
                    );
                  }}
                ></ZFormFieldBlank>
              </ZForm>
            )}
            {!this.submitted && (
              <button class="link text-sm" type="button" onClick={() => this.gotoLogin()}>
                {this.scope.locale.BackToLogin()}
              </button>
            )}
          </div>
        </section>
      </div>
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
