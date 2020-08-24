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
          <eb-list form inline-labels no-hairlines-md @submit.prevent="onFormSubmit">
            <eb-list-item-validate dataKey="mobile"></eb-list-item-validate>
            <eb-list-input :label="$text('SMSVerificationCode')" type="text" clear-button :placeholder="$text('SMS Verification Code')" v-model="captcha.token" dataPath="captcha/token">
              <div slot="content">
                <eb-component ref="captchaContainer" module="a-captcha" name="captchaContainer" :options="captchaContainerOptions"></eb-component>
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
    };
  },
  computed: {
    form2() {
      return JSON5.stringify(this.item, null, 2);
    },
    captchaContainerOptions() {
      return {
        props: {
          module: "test-party",
          sceneName: "formMobileVerifyTest",
          context: {
            mobile: this.item.mobile,
          },
        },
      };
    },
    smsInstalled() {
      return !!this.getModule('a-authsms');
    },
  },
  created() {},
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
        captcha: this.$refs.captchaContainer.getComponentInstance().captchaData({ token: this.captcha.token }),
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
