<template>
  <eb-page>
    <eb-navbar large largeTransparent :title="$text('Form / Captcha')" eb-back-link="Back"></eb-navbar>
    <f7-block-title>Form</f7-block-title>
    <f7-block>
      <eb-validate v-if="item" ref="validate" :auto="false" :data="item" :params="validateParams" :onPerform="onPerformValidate">
        <eb-list form no-hairlines-md @submit.prevent="onFormSubmit">
          <eb-list-item-validate dataKey="userName"></eb-list-item-validate>
          <eb-list-item-validate dataKey="password"></eb-list-item-validate>
          <eb-list-input :label="$text('Captcha code')" floating-label type="text" clear-button :placeholder="$text('Captcha code')" v-model="captcha.token" dataPath="captcha/token">
            <div slot="content">
              <template v-if="moduleCaptcha">
                <captchaContainer ref="captchaContainer" class="captcha-container" module="test-party" sceneName="formCaptchaTest"></captchaContainer>
              </template>
            </div>
          </eb-list-input>
          <f7-list-item divider>
            <eb-button ref="buttonSubmit" :onPerform="onPerformSignUp">{{$text('Sign Up')}}</eb-button>
          </f7-list-item>
        </eb-list>
      </eb-validate>
    </f7-block>
    <f7-block-title>Form Value</f7-block-title>
    <pre class="form-data">{{form2}}</pre>
  </eb-page>
</template>
<script>
export default {
  data() {
    return {
      item: {
        userName: null,
        password: null,
      },
      validateParams: {
        module: 'test-party',
        validator: 'formCaptchaTest',
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
      return this.$api.post('kitchen-sink/form-captcha/signup', {
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
