<template>
  <eb-page>
    <eb-navbar :title="$text('Sign up')" eb-back-link="Back"></eb-navbar>
    <f7-block>
      <eb-validate ref="validate" :auto="false" :data="data" :params="{validator: 'signup'}" :onPerform="onPerformValidate" @schema:ready="onSchemaReady">
        <eb-list form no-hairlines-md @submit.prevent="onSubmit">
          <eb-list-item-validate dataKey="userName"></eb-list-item-validate>
          <eb-list-item-validate dataKey="realName"></eb-list-item-validate>
          <eb-list-item-validate dataKey="email"></eb-list-item-validate>
          <eb-list-item-validate dataKey="password"></eb-list-item-validate>
          <eb-list-item-validate dataKey="passwordAgain"></eb-list-item-validate>
          <f7-list-item>
            <template v-if="moduleCaptcha">
              <captchaContainer></captchaContainer>
            </template>
          </f7-list-item>
          <f7-list-item>
            <f7-label floating>{{$text('Captcha code')}}</f7-label>
            <eb-input type="text" :placeholder="$text('Captcha code')" clear-button v-model="captcha.code" dataPath="captcha/code"></eb-input>
          </f7-list-item>
          <f7-list-item divider>
            <span class="eb-list-divider-normal">
              <eb-button ref="buttonSubmit" :onPerform="signUp">{{$text('Sign up')}}</eb-button>
            </span>
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
        code: null,
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
        captcha: this.captcha,
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
