<template>
  <eb-page>
    <eb-navbar large largeTransparent :title="$text('Change Password')" eb-back-link="Back">
      <f7-nav-right>
        <eb-link v-if="ready" iconF7=":login:done" ref="buttonSubmit" :onPerform="onPerformOk"></eb-link>
      </f7-nav-right>
    </eb-navbar>
    <f7-block v-if="ready">
      <eb-validate
        ref="validate"
        :auto="false"
        :data="data"
        :params="{ validator: 'passwordChange' }"
        :onPerform="onPerformValidate"
      >
        <eb-list form inline-labels no-hairlines-md @submit="onSubmit">
          <eb-list-item-validate v-if="checkStatus.exists" dataKey="passwordOld"></eb-list-item-validate>
          <eb-list-item-validate dataKey="passwordNew"></eb-list-item-validate>
          <eb-list-item-validate dataKey="passwordNewAgain"></eb-list-item-validate>
          <eb-list-input
            :label="$text('Captcha Code')"
            type="text"
            clear-button
            :placeholder="$text('Captcha Code')"
            v-model="captcha.token"
            dataPath="captcha/token"
          >
            <div slot="content">
              <eb-component
                ref="captchaContainer"
                module="a-captcha"
                name="captchaContainer"
                :options="captchaContainerOptions"
              ></eb-component>
            </div>
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
      ready: false,
      checkStatus: null,
      data: {
        passwordOld: null,
        passwordNew: null,
        passwordNewAgain: null,
      },
      captcha: {
        token: null,
      },
      captchaContainerOptions: {
        props: {
          module: 'a-authsimple',
          sceneName: 'passwordChange',
        },
      },
    };
  },
  created() {
    this.init();
  },
  methods: {
    async init() {
      this.checkStatus = await this.$api.post('auth/checkStatus');
      this.ready = true;
    },
    async onPerformValidate() {
      const data = { ...this.data };
      if (!this.checkStatus.exists) {
        delete data.passwordOld;
      }
      const captcha = this.$refs.captchaContainer.getComponentInstance().captchaData({ token: this.captcha.token });
      await this.$api.post('auth/passwordChange', {
        data,
        captcha,
      });
      this.$f7router.back();
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
<style scoped></style>
