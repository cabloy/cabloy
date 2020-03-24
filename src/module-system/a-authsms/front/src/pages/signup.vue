<template>
  <eb-page>
    <eb-navbar large largeTransparent :title="getPageTitle()" eb-back-link="Back"></eb-navbar>
    <f7-block>
      <eb-validate ref="validate" :auto="false" :data="data" :params="{validator: 'signup'}" :onPerform="onPerformValidate" @schema:ready="onSchemaReady">
        <eb-list form no-hairlines-md @submit.prevent="onSubmit">
          <eb-list-item-validate dataKey="userName"></eb-list-item-validate>
          <eb-list-item-validate dataKey="realName"></eb-list-item-validate>
          <eb-list-item-validate dataKey="mobile"></eb-list-item-validate>
          <eb-list-input :label="$text('Captcha Code')" floating-label type="text" clear-button :placeholder="$text('Captcha Code')" v-model="captcha.tokenCode" dataPath="captcha/tokenCode">
            <div slot="content">
              <template v-if="moduleCaptcha">
                <captchaContainer ref="captchaContainerCode" module="a-authsms" sceneName="signupCode"></captchaContainer>
              </template>
            </div>
          </eb-list-input>
          <eb-list-input :label="$text('SMS Verification Code')" floating-label type="text" clear-button :placeholder="$text('SMS Verification Code')" v-model="captcha.token" dataPath="captcha/token">
            <div slot="content">
              <template v-if="moduleCaptcha">
                <captchaContainer ref="captchaContainer" module="a-authsms" sceneName="signup" :context="captchaContext"></captchaContainer>
              </template>
            </div>
          </eb-list-input>
          <f7-list-item divider>
            <eb-button ref="buttonSubmit" :onPerform="signUp">{{getButtonText()}}</eb-button>
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
        mobile: null,
      },
      captcha: {
        tokenCode: null,
        token: null,
      },
      moduleCaptcha: null,
      userNameReadOnly: false,
    };
  },
  computed: {
    captchaContext() {
      return { mobile: this.data.mobile };
    },
  },
  created() {
    // init for associate
    if (this.state === 'associate') {
      const userAgent = this.$store.state.auth.user.agent;
      this.data.userName = userAgent.userName;
      this.data.realName = userAgent.realName;
      this.data.mobile = userAgent.mobile;
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
    getPageTitle() {
      return this.state === 'associate' ? this.$text('Associate Account') : this.$text('Sign Up');
    },
    getButtonText() {
      return this.state === 'associate' ? this.$text('Associate Now') : this.$text('Sign Up');
    },
    onSchemaReady(schema) {
      if (this.userNameReadOnly) {
        schema.properties.userName.ebReadOnly = true;
      }
    },
    onPerformValidate() {
      return this.$api.post('auth/signup', {
        state: this.state,
        data: this.data,
        captchaCode: this.$refs.captchaContainerCode.captchaData({ token: this.captcha.tokenCode }),
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
