<template>
  <eb-page>
    <eb-navbar large largeTransparent :title="$text('Sign Up')" eb-back-link="Back"></eb-navbar>
    <f7-block>
      <eb-validate ref="validate" :auto="false" :data="data" :params="{validator: 'signup'}" :onPerform="onPerformValidate" @schema:ready="onSchemaReady">
        <eb-list form no-hairlines-md @submit.prevent="onSubmit">
          <eb-list-item-validate dataKey="userName"></eb-list-item-validate>
          <eb-list-item-validate dataKey="realName"></eb-list-item-validate>
          <eb-list-item-validate dataKey="email"></eb-list-item-validate>
          <eb-list-item-validate dataKey="password"></eb-list-item-validate>
          <eb-list-item-validate dataKey="passwordAgain"></eb-list-item-validate>
          <eb-list-input :label="$text('Captcha Code')" floating-label type="text" clear-button :placeholder="$text('Captcha Code')" v-model="captcha.token" dataPath="captcha/token">
            <div slot="content">
              <template v-if="moduleCaptcha">
                <captchaContainer ref="captchaContainer" module="a-authsimple" sceneName="signup"></captchaContainer>
              </template>
            </div>
          </eb-list-input>
          <f7-list-item divider>
            <eb-button ref="buttonSubmit" :onPerform="signUp">{{$text('Sign Up')}}</eb-button>
          </f7-list-item>
        </eb-list>
      </eb-validate>
    </f7-block>
  </eb-page>
</template>
<script>
export default {
  meta: {
    global: false,
  },
  data() {
    return {
      state: this.$f7route.query.state || 'login',
      returnTo: this.$f7route.query.returnTo,
      data: {
        userName: null,
        realName: null,
        email: null,
        // mobile: null,
        password: null,
        passwordAgain: null,
      },
      captcha: {
        token: null,
      },
      moduleCaptcha: null,
      userNameReadOnly: false,
    };
  },
  created() {
    // init for associate
    if (this.state === 'associate') {
      const userAgent = this.$store.state.auth.user.agent;
      this.data.userName = userAgent.userName;
      this.data.realName = userAgent.realName;
      this.data.email = userAgent.email;
      // readOnly
      if (this.data.userName && this.data.userName.indexOf('__') === -1) {
        this.userNameReadOnly = true;
      }
    }
    // captcha
    this.$meta.module.use('a-captcha', module => {
      this.$options.components.captchaContainer = module.options.components.captchaContainer;
      this.moduleCaptcha = module;
    });
  },
  methods: {
    onSchemaReady(schema) {
      if (this.userNameReadOnly) {
        schema.properties.userName.ebReadOnly = true;
      }
    },
    onPerformValidate() {
      return this.$api.post('auth/signup', {
        state: this.state,
        data: this.data,
        captcha: this.$refs.captchaContainer.captchaData({ token: this.captcha.token }),
      }).then(() => {
        let hash;
        if (this.returnTo) {
          hash = this.$meta.util.parseHash(this.returnTo);
        }
        this.$meta.vueApp.reload({ echo: true, hash });
      });
    },
    signUp() {
      return this.$refs.validate.perform();
    },
    onSubmit() {
      this.$refs.buttonSubmit.onClick();
    },
  },
};

</script>
<style scoped>
</style>
