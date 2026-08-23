import { SchemaObject } from 'openapi3-ts/oas31';
import { BeanControllerPageBase } from 'zova';
import { Controller } from 'zova-module-a-bean';
import { TypeFormOnSubmitData, ZForm } from 'zova-module-a-form';
import { $QueryEnsureLoaded } from 'zova-module-a-model';
import { ApiApiHomeUserPassportregisterRequestBody } from 'zova-module-home-api';

@Controller()
export class ControllerPageRegister extends BeanControllerPageBase {
  submitted = false;
  schemaRegister?: SchemaObject;
  user: ApiApiHomeUserPassportregisterRequestBody = {
    username: '',
    email: '',
    password: '',
    passwordConfirm: '',
    captcha: {
      id: '',
      token: '',
    },
    consumerUrl: '',
  };

  get apiSchemasRegister() {
    return this.$apiSchema.homeUserPassport.register({ authToken: false });
  }

  protected async __init__() {
    await $QueryEnsureLoaded(() => this.apiSchemasRegister.sdk);
    this.schemaRegister = this.$computed(() => {
      return omitSchemaProperty(this.apiSchemasRegister.requestBody, 'consumerUrl');
    });
  }

  async submitRegister(data: TypeFormOnSubmitData<ApiApiHomeUserPassportregisterRequestBody>) {
    const consumerUrl = this.$router.getPagePath('/home/user/activation', undefined, true);
    if (!consumerUrl) throw new Error('activation consumer route is unavailable');
    const result = await this.$api.homeUserPassport.register(
      { ...data.value, consumerUrl },
      { authToken: false },
    );
    if (this.$passport.isPassportSiteAdmitted(result.passport)) {
      this.$passport.afterLogin(result);
      return;
    }
    this.submitted = true;
  }

  gotoLogin() {
    return this.app.$gotoPage('/home/login', {
      query: { [this.sys.env.ROUTER_KEY_RETURNTO]: this.app.$getReturnTo() },
    });
  }

  protected render() {
    return (
      <div class="min-h-screen bg-base-200 flex items-center p-6">
        <section class="card mx-auto w-full max-w-md bg-base-100 shadow-xl">
          <div class="card-body gap-4">
            <div>
              <h1 class="card-title text-2xl">{this.scope.locale.Register()}</h1>
              <p class="mt-1 text-sm text-base-content/70">{this.scope.locale.RegisterHelp()}</p>
            </div>
            {this.submitted ? (
              <>
                <p class="text-sm text-base-content/70">
                  {this.scope.locale.RegisterActivationPending()}
                </p>
                <button
                  class="btn btn-primary w-full"
                  type="button"
                  onClick={() => this.gotoLogin()}
                >
                  {this.scope.locale.BackToLogin()}
                </button>
              </>
            ) : (
              <>
                <ZForm
                  data={this.user}
                  schema={this.schemaRegister}
                  onSubmitData={data => this.submitRegister(data)}
                  onShowError={async ({ error }) => {
                    await this.$performCommand('basic-commands:alert', {
                      type: 'error',
                      text: error.message,
                    });
                  }}
                  slotFooter={$$form => {
                    return (
                      <button
                        disabled={$$form.formState.isSubmitting}
                        type="submit"
                        class="btn btn-primary w-full"
                      >
                        {this.scope.locale.Register()}
                      </button>
                    );
                  }}
                ></ZForm>
                <p class="text-center text-sm text-base-content/70">
                  {this.scope.locale.AlreadyHaveAccount()}{' '}
                  <button class="link link-primary" type="button" onClick={() => this.gotoLogin()}>
                    {this.scope.locale.Login()}
                  </button>
                </p>
              </>
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
