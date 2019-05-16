<template>
  <eb-page>
    <eb-navbar :title="$text('Change password')" eb-back-link="Back">
      <f7-nav-right>
        <eb-link iconMaterial="done" ref="buttonSubmit" :onPerform="onPerformOk"></eb-link>
      </f7-nav-right>
    </eb-navbar>
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
          <eb-list-input :label="$text('Captcha code')" floating-label type="text" clear-button :placeholder="$text('Captcha code')" v-model="captcha.code" dataPath="captcha/code">
          </eb-list-input>
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
