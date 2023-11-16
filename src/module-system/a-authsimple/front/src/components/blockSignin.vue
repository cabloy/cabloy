<template>
  <div>
    <f7-card>
      <f7-card-content>
        <eb-validate ref="validate" :onPerform="onPerformValidate" :onPerformAfter="onPerformAfterValidate">
          <eb-list form no-hairlines-md @submit="onSubmit">
            <eb-list-input
              :label="$text('Your Username/Mobile/Email')"
              floating-label
              type="text"
              clear-button
              :placeholder="$text('Your Username/Mobile/Email')"
              v-model="data.auth"
              dataPath="auth"
            >
              <f7-icon f7=":login:person-outline" slot="media"></f7-icon>
            </eb-list-input>
            <eb-list-input
              :label="$text('Your Password')"
              floating-label
              type="password"
              clear-button
              :placeholder="$text('Your Password')"
              v-model="data.password"
              dataPath="password"
            >
              <f7-icon f7=":login:lock-outline" slot="media"></f7-icon>
            </eb-list-input>
            <eb-list-input
              :label="$text('Captcha Code')"
              floating-label
              type="text"
              clear-button
              :placeholder="$text('Captcha Code')"
              v-model="captcha.token"
              dataPath="captcha/token"
            >
              <f7-icon slot="media"></f7-icon>
              <div slot="content">
                <eb-component
                  module="a-captcha"
                  name="captchaContainer"
                  :options="captchaContainerOptions"
                  @componentReady="captchaContainerInstance = $event"
                ></eb-component>
              </div>
            </eb-list-input>
            <f7-list-item>
              <div slot="title" class="eb-cursor-pointer" @click="onClickRememberMe">{{ $text('Remember Me') }}</div>
              <f7-icon slot="media"></f7-icon>
              <eb-toggle slot="after" v-model="data.rememberMe" dataPath="rememberMe"></eb-toggle>
            </f7-list-item>
            <eb-list-button ref="buttonSubmit" :onPerform="signIn">{{ $text('Sign In') }}</eb-list-button>
          </eb-list>
        </eb-validate>
      </f7-card-content>
      <f7-card-footer>
        <eb-link eb-href="/a/authsimple/passwordForgot" eb-target="_self" class="text-smaller">{{
          $text('Forgot Password')
        }}</eb-link>
        <div></div>
        <eb-link eb-href="/a/authsimple/signup" eb-target="_self" class="text-smaller">{{ $text('Sign Up') }}</eb-link>
      </f7-card-footer>
      <div v-if="demoEnable" class="alert-info">
        <div class="data-table">
          <table>
            <thead>
              <tr>
                <th>{{ $text('Account Type') }}</th>
                <th>{{ $text('Username') }}</th>
                <th>{{ $text('Password') }}</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>{{ $text('Admin User') }}</td>
                <td>admin</td>
                <td>123456</td>
              </tr>
              <tr>
                <td>{{ $text('Normal User') }}</td>
                <td>tom</td>
                <td>123456</td>
              </tr>
              <tr>
                <td>{{ $text('Normal User') }}</td>
                <td>jane</td>
                <td>123456</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </f7-card>
  </div>
</template>
<script>
import Vue from 'vue';
const ebAuthLoginBase = Vue.prototype.$meta.module.get('a-base').options.mixins.ebAuthLoginBase;
const urlLogin = '/a/authsimple/signup';
export default {
  meta: {
    global: false,
  },
  mixins: [ebAuthLoginBase],
  data() {
    return {
      data: {
        auth: null,
        password: null,
        rememberMe: false,
      },
      captcha: {
        token: null,
      },
      captchaContainerOptions: {
        props: {
          module: 'a-authsimple',
          sceneName: 'signin',
        },
      },
      captchaContainerInstance: null,
    };
  },
  computed: {
    demoEnable() {
      return this.$store.getters['a/base/demoEnable'];
    },
  },
  created() {},
  methods: {
    async disable() {
      return false;
    },
    async login({ hash }) {
      // only support associate here
      if (this.state === 'associate') {
        await this.loginDefault({ url: urlLogin, hash });
      }
    },
    _getCaptchaContainerInstance() {
      return this.captchaContainerInstance;
    },
    async onPerformAfterValidate({ err }) {
      if (!err) return;
      const errMessage = err.message;
      // const errMessage = err.message ? JSON.parse(err.message) : null;
      if (err.code === 422 && errMessage && Array.isArray(errMessage)) {
        const message = this._findErrorMessage(errMessage, '/captcha/token');
        if (message) {
          this.captcha.token = null;
          return;
        }
      }
      // login error
      this.data.password = null;
      this.captcha.token = null;
      const captchaContainerInstance = this._getCaptchaContainerInstance();
      await captchaContainerInstance.refresh();
    },
    async onPerformValidate() {
      const captchaContainerInstance = this._getCaptchaContainerInstance();
      if (!captchaContainerInstance) return;
      await this.$api.post('auth/signin', {
        data: this.data,
        state: this.state,
        captcha: captchaContainerInstance.captchaData({ token: this.captcha.token }),
      });
      this.$meta.vueApp.reload({ echo: true });
    },
    signIn() {
      return this.$refs.validate.perform();
    },
    onSubmit() {
      this.$refs.buttonSubmit.onClick();
    },
    onClickRememberMe() {
      this.data.rememberMe = !this.data.rememberMe;
    },
    _findErrorMessage(messages, dataPath) {
      return messages.find(item => item.dataPath === dataPath);
    },
  },
};
</script>
<style lang="less" scoped>
.text-smaller {
  font-size: smaller !important;
}
</style>
