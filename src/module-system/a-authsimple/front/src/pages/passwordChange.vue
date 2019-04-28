<template>
  <eb-page>
    <eb-navbar :title="$text('Change password')" eb-back-link="Back"></eb-navbar>
    <f7-block>
      <eb-validate ref="validate" :auto="false" :data="data" :params="{validator: 'passwordChange'}" :onPerform="onPerformValidate">
        <eb-list form no-hairlines-md @submit.prevent="onSubmit">
          <eb-list-item-validate dataKey="passwordOld"></eb-list-item-validate>
          <eb-list-item-validate dataKey="passwordNew"></eb-list-item-validate>
          <eb-list-item-validate dataKey="passwordNewAgain"></eb-list-item-validate>
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
              <eb-button ref="buttonSubmit" :onPerform="onPerformOk">{{$text('OK')}}</eb-button>
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
      data: {
        passwordOld: null,
        passwordNew: null,
        passwordNewAgain: null,
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
      return this.$api.post('auth/passwordChange', {
        data: this.data,
        captcha: this.captcha,
      }).then(() => {
        this.$f7router.back();
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
