<template>
  <eb-page>
    <eb-navbar large largeTransparent :title="$text('Form / SMS Verification')" eb-back-link="Back"></eb-navbar>
    <template v-if="!smsInstalled">
      <f7-block>
        <div class="alert-info">{{$text('TipInstallAuthSMS')}}</div>
      </f7-block>
    </template>
    <template v-else>
      <f7-block-title>Form</f7-block-title>
      <f7-block>
        <eb-validate v-if="item" ref="validate" :auto="false" :data="item" :params="validateParams" :onPerform="onPerformValidate">
          <eb-list form no-hairlines-md @submit.prevent="onFormSubmit">
            <eb-list-item-validate dataKey="mobile"></eb-list-item-validate>
            <eb-list-input :label="$text('SMS Verification Code')" floating-label type="text" clear-button :placeholder="$text('SMS Verification Code')" v-model="captcha.token" dataPath="captcha/token">
              <div slot="content">
                <template v-if="moduleCaptcha">
                  <captchaContainer ref="captchaContainer" module="test-party" sceneName="formMobileVerifyTest" :context="captchaContext"></captchaContainer>
                </template>
              </div>
            </eb-list-input>
            <f7-list-item divider>
              <eb-button ref="buttonSubmit" :onPerform="onPerformSignUp">{{$text('Verify Now')}}</eb-button>
            </f7-list-item>
          </eb-list>
        </eb-validate>
      </f7-block>
      <f7-block-title>Form Value</f7-block-title>
      <pre class="form-data">{{form2}}</pre>
    </template>
  </eb-page>
</template>
<script>
import Vue from 'vue';
const ebModules = Vue.prototype.$meta.module.get('a-base').options.mixins.ebModules;
export default {
  mixins: [ebModules],
  data() {
    return {
      item: {
        mobile: null,
      },
      validateParams: {
        module: 'test-party',
        validator: 'formMobileVerifyTest',
      },
      captcha: {
        token: null,
      },
      moduleCaptcha: null,
    };
  },
  computed: {
    form2() {
      return JSON5.stringify(this.item, null, 2);
    },
    captchaContext() {
      return { mobile: this.item.mobile };
    },
    smsInstalled() {
      return !!this.getModule('a-authsms');
    },
  },
  created() {
    // captcha
    this.$meta.module.use('a-captcha', module => {
      this.$options.components.captchaContainer = module.options.components.captchaContainer;
      this.moduleCaptcha = module;
    });
  },
  methods: {
    onFormSubmit() {
      this.$refs.buttonSubmit.onClick();
    },
    onPerformSignUp() {
      return this.$refs.validate.perform();
    },
    onPerformValidate() {
      return this.$api.post('kitchen-sink/form-mobile-verify/mobileVerify', {
        data: this.item,
        captcha: this.$refs.captchaContainer.captchaData({ token: this.captcha.token }),
      }).then(() => {
        return true;
      });
    },
  },
};

</script>
<style lang="less" scoped>
.form-data {
  border: solid 1px #ccc;
  margin: 8px;
  padding: 8px;
}

</style>
