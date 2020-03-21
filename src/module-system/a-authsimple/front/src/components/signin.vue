<template>
  <div>
    <f7-card>
      <f7-card-content>
        <eb-validate ref="validate" :onPerform="onPerformValidate">
          <eb-list form no-hairlines-md @submit.prevent="onSubmit">
            <eb-list-input :label="$text('Your username/mobile/email')" floating-label type="text" clear-button :placeholder="$text('Your username/mobile/email')" v-model="data.auth" dataPath="auth">
              <f7-icon material="person_outline" slot="media"></f7-icon>
            </eb-list-input>
            <eb-list-input :label="$text('Your password')" floating-label type="password" clear-button :placeholder="$text('Your password')" v-model="data.password" dataPath="password">
              <f7-icon material="lock_outline" slot="media"></f7-icon>
            </eb-list-input>
            <f7-list-item>
              <f7-icon slot="media"></f7-icon>
              <template v-if="moduleCaptcha">
                <captchaContainer module="a-authsimple" sceneName="signin"></captchaContainer>
              </template>
            </f7-list-item>
            <eb-list-input :label="$text('Captcha code')" floating-label type="text" clear-button :placeholder="$text('Captcha code')" v-model="captcha.code" dataPath="captcha/code">
              <f7-icon slot="media"></f7-icon>
            </eb-list-input>
            <f7-list-item>
              <f7-icon slot="media"></f7-icon>
              <span class="text-color-gray">{{$text('Remember me')}}</span>
              <eb-toggle v-model="data.rememberMe" dataPath="rememberMe"></eb-toggle>
            </f7-list-item>
            <eb-list-button ref="buttonSubmit" :onPerform="signIn">{{$text('Sign in')}}</eb-list-button>
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
