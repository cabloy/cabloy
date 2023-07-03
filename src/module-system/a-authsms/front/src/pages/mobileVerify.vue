<template>
  <eb-page>
    <eb-navbar large largeTransparent :title="$text('Mobile Verification')" eb-back-link="Back"></eb-navbar>
    <f7-block>
      <eb-validate
        ref="validate"
        :auto="false"
        :data="data"
        :params="{ validator: 'mobileVerify' }"
        :onPerform="onPerformValidate"
      >
        <eb-list form inline-labels no-hairlines-md @submit="onSubmit">
          <eb-list-item-validate dataKey="userName"></eb-list-item-validate>
          <eb-list-item-validate dataKey="mobile"></eb-list-item-validate>
          <eb-list-input
            :label="$text('SMS Verification Code')"
            type="text"
            clear-button
            :placeholder="$text('SMS Verification Code')"
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
          <f7-list-item>
            <div slot="after">
              <eb-button ref="buttonSubmit" :outline="true" :onPerform="onPerformOk">{{
                $text('Verify Now')
              }}</eb-button>
            </div>
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
      returnTo: this.$f7route.query.returnTo || null,
    };
  },
  computed: {
    captchaContainerOptions() {
      return {
        props: {
          module: 'a-authsms',
          sceneName: 'mobileVerify',
          context: {
            mobile: this.data.mobile,
          },
        },
      };
    },
  },
  created() {
    // user
    const userAgent = this.$store.state.auth.user.agent;
    this.data = {
      userName: userAgent.userName,
      email: userAgent.email,
    };
  },
  methods: {
    onPerformValidate() {
      return this.$api
        .post('auth/mobileVerify', {
          data: this.data,
          captcha: this.$refs.captchaContainer.getComponentInstance().captchaData({ token: this.captcha.token }),
        })
        .then(() => {
          this.$meta.vueApp.reload({ echo: true, hash: this.returnTo });
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
<style scoped></style>
