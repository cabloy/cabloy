import { BeanControllerPageBase } from 'zova';
import { Controller } from 'zova-module-a-bean';
import { TypeFormOnSubmitData } from 'zova-module-a-form';
import { $QueryAutoLoad } from 'zova-module-a-model';
import { ApiApiHomeUserPassportloginRequestBody } from 'zova-module-home-api';

@Controller()
export class ControllerPageLogin extends BeanControllerPageBase {
  user: ApiApiHomeUserPassportloginRequestBody = {
    username: '',
    password: '',
    captcha: {
      id: '',
      token: '',
    },
  };

  protected async __init__() {
    if (this.sys.env.META_MODE === 'development') {
      this.user.username = 'admin';
      this.user.password = '123456';
    }
    await $QueryAutoLoad(() => this.$passport.apiSchemasLogin.sdk);
  }

  get schema() {
    return this.$passport.schemaLogin;
  }

  async submitLogin(data: TypeFormOnSubmitData<ApiApiHomeUserPassportloginRequestBody>) {
    await this.$passport.login().mutateAsync(data.value);
  }

  async loginGitHub() {
    const apiUrl = this.$passport.getOauthLoginUrl('auth-oauth', 'oauth', 'github');
    window.location.assign(apiUrl);
  }
}
