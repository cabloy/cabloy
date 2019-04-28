<template>
  <div>
    <f7-card>
      <f7-card-content>
        <eb-validate ref="validate" :onPerform="onPerformValidate">
          <eb-list form no-hairlines-md @submit.prevent="onSubmit">
            <f7-list-item>
              <f7-icon material="person_outline" slot="media"></f7-icon>
              <f7-label floating>{{$text('Your username/mobile/email')}}</f7-label>
              <eb-input type="text" :placeholder="$text('Your username/mobile/email')" clear-button v-model="data.auth" dataPath="auth"></eb-input>
            </f7-list-item>
            <f7-list-item>
              <f7-icon material="lock_outline" slot="media"></f7-icon>
              <f7-label floating>{{$text('Your password')}}</f7-label>
              <eb-input type="password" :placeholder="$text('Your password')" clear-button v-model="data.password" dataPath="password"></eb-input>
            </f7-list-item>
            <f7-list-item>
              <f7-icon slot="media"></f7-icon>
              <template v-if="moduleCaptcha">
                <captchaContainer></captchaContainer>
              </template>
            </f7-list-item>
            <f7-list-item>
              <f7-icon slot="media"></f7-icon>
              <f7-label floating>{{$text('Captcha code')}}</f7-label>
              <eb-input type="text" :placeholder="$text('Captcha code')" clear-button v-model="captcha.code" dataPath="captcha/code"></eb-input>
            </f7-list-item>
            <f7-list-item>
              <f7-icon slot="media"></f7-icon>
              <span class="text-color-gray">{{$text('Remember me')}}</span>
              <eb-toggle v-model="data.rememberMe" dataPath="rememberMe"></eb-toggle>
            </f7-list-item>
            <f7-list-item divider>
              <span class="eb-list-divider-normal">
                <eb-button ref="buttonSubmit" :onPerform="signIn">{{$text('Sign in')}}</eb-button>
              </span>
            </f7-list-item>
            <f7-list-item>
            </f7-list-item>
          </eb-list>
        </eb-validate>
      </f7-card-content>
      <f7-card-footer>
        <eb-link eb-href="/a/authsimple/passwordForgot" eb-target="_self" class="text-smaller">{{$text('Forgot password')}}</eb-link>
        <div></div>
        <eb-link eb-href="/a/authsimple/signup" eb-target="_self" class="text-smaller">{{$text('Sign up')}}</eb-link>
      </f7-card-footer>
    </f7-card>
  </div>
</template>
<script>
export default {
  meta: {
    global: false,
  },
  data() {
    return {
      data: {
        auth: null,
        password: null,
        rememberMe: false,
      },
      captcha: {
        code: null,
      },
      moduleCaptcha: null,
    };
  },
  created() {
    this.$meta.module.use('a-captcha', module => {
      this.$options.components.captchaContainer = module.options.components.captchaContainer;
      this.moduleCaptcha = module;
    });
  },
  methods: {
    onPerformValidate() {
      return this.$api.post('auth/signin', {
        data: this.data,
        captcha: this.captcha,
      }).then(() => {
        this.$meta.vueApp.reload({ echo: true });
      });
    },
    signIn() {
      return this.$refs.validate.perform();
    },
    onSubmit() {
      this.$refs.buttonSubmit.onClick();
    },
  },
};

</script>
<style lang="less" scoped>
.text-smaller {
  font-size: smaller !important;
}

</style>
