<template>
  <eb-page>
    <eb-navbar large largeTransparent :title="$text('Mobile Verification')" eb-back-link="Back"></eb-navbar>
    <f7-block>
      <eb-validate ref="validate" :auto="false" :data="data" :params="{validator: 'mobileVerify'}" :onPerform="onPerformValidate">
        <eb-list form no-hairlines-md @submit.prevent="onSubmit">
          <eb-list-item-validate dataKey="userName"></eb-list-item-validate>
          <eb-list-item-validate dataKey="mobile"></eb-list-item-validate>
          <eb-list-input :label="$text('SMS Verification Code')" floating-label type="text" clear-button :placeholder="$text('SMS Verification Code')" v-model="captcha.token" dataPath="captcha/token">
            <div slot="content">
              <template v-if="moduleCaptcha">
                <captchaContainer ref="captchaContainer" module="a-authsms" sceneName="mobileVerify" :context="captchaContext"></captchaContainer>
              </template>
            </div>
          </eb-list-input>
          <f7-list-item divider>
            <eb-button ref="buttonSubmit" :onPerform="onPerformOk">{{$text('Verify Now')}}</eb-button>
          </f7-list-item>
        </eb-list>
      </eb-validate>
    </f7-block>
  </eb-page>
</template>
<script>
export default {
  data() {
    return {
      data: null,
      captcha: {
        token: null,
      },
      moduleCaptcha: null,
    };
  },
  computed: {
    captchaContext() {
      return { mobile: this.data.mobile };
    },
  },
  created() {
    // user
    const userAgent = this.$store.state.auth.user.agent;
    this.data = {
      userName: userAgent.userName,
      email: userAgent.email,
    };
    // captcha
    this.$meta.module.use('a-captcha', module => {
      this.$options.components.captchaContainer = module.options.components.captchaContainer;
      this.moduleCaptcha = module;
    });
  },
  methods: {
    onPerformValidate() {
      return this.$api.post('auth/mobileVerify', {
        data: this.data,
        captcha: this.$refs.captchaContainer.captchaData({ token: this.captcha.token }),
      }).then(() => {
        this.$meta.vueApp.reload({ echo: true });
      });
    },
    onPerformOk() {
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
