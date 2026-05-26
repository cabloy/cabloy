import { BeanRenderBase } from 'zova';
import { Render } from 'zova-module-a-bean';
import { ZForm, ZFormFieldBlank, ZFormFieldPreset } from 'zova-module-a-form';
import { ZIcon } from 'zova-module-a-icon';

@Render()
export class RenderPageLogin extends BeanRenderBase {
  public render() {
    return (
      <div class="min-h-screen bg-base-200 flex items-center">
        <div class="card mx-auto w-full max-w-5xl  shadow-xl">
          <div class="grid md:grid-cols-2 grid-cols-1 bg-base-100 rounded-xl">
            {this._renderLandingInfo()}
            <div class="py-24 px-10">
              <h2 class="text-2xl font-semibold mb-2 text-center">{this.scope.locale.Login()}</h2>
              <div class="mb-4">
                {this._renderForm()}
                <div class="divider">OR</div>
                {this._renderGithub()}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  _renderLandingInfo() {
    return (
      <div class="min-h-full rounded-l-xl bg-base-200">
        <div class="py-12">
          <h1 class="text-3xl text-center font-bold">Zova</h1>
          <h5 class="text-2xl text-center opacity-40">Less is more, while more is less</h5>
        </div>
      </div>
    );
  }

  _renderForm() {
    return (
      <ZForm
        data={this.user}
        schema={this.schema}
        formProvider={{ behaviors: { FormFieldLayout: 'home-login:formFieldLayoutLogin' } }}
        onSubmitData={data => {
          return this.submitLogin(data);
        }}
        onShowError={({ error }) => {
          // eslint-disable-next-line no-alert
          window.alert(error.message);
        }}
      >
        <ZFormFieldPreset
          name="username"
          render="basic-input:formFieldInput"
          options={{
            type: 'text',
            placeholder: this.scope.locale.YourUsername(),
          }}
          class="grow"
          layout={{ iconPrefix: ':daisy:person' }}
        ></ZFormFieldPreset>
        <ZFormFieldPreset
          name="password"
          class="grow"
          render="basic-input:formFieldInput"
          options={{ type: 'password', placeholder: this.scope.locale.YourPassword() }}
          layout={{ iconPrefix: ':daisy:lock' }}
        ></ZFormFieldPreset>
        <ZFormFieldPreset
          name="captcha"
          render={'basic-captcha:formFieldCaptcha'}
          layout={{ iconPrefix: ':editor:code-block' }}
        ></ZFormFieldPreset>
        <ZFormFieldBlank
          slotDefault={$$form => {
            return (
              <button
                disabled={$$form.formState.isSubmitting}
                type="submit"
                class="btn mt-2 w-full btn-primary"
              >
                {this.scope.locale.Login()}
              </button>
            );
          }}
        ></ZFormFieldBlank>
      </ZForm>
    );
  }

  _renderGithub() {
    return (
      <button
        class="btn mt-2 w-full btn-default"
        onClick={() => {
          this.loginGitHub();
        }}
      >
        <ZIcon name=":auth:github" width={24}></ZIcon>
        {this.scope.locale.LoginGitHub()}
      </button>
    );
  }
}
