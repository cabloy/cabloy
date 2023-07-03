<template>
  <eb-page>
    <eb-navbar large largeTransparent :title="$text('Forgot Password')" eb-back-link="Back"></eb-navbar>
    <f7-block>
      <template v-if="sent">{{ $text('passwordResetEmailSentAlert') }}</template>
      <template v-else>
        <eb-validate
          ref="validate"
          :auto="false"
          :data="data"
          :params="{ validator: 'passwordForgot' }"
          :onPerform="onPerformValidate"
        >
          <eb-list form inline-labels no-hairlines-md @submit="onSubmit">
            <eb-list-item-validate dataKey="email"></eb-list-item-validate>
            <f7-list-item>
              <div slot="after">
                <eb-button ref="buttonSubmit" :outline="true" :onPerform="onPerformOk">{{
                  $text('Reset Password')
                }}</eb-button>
              </div>
            </f7-list-item>
          </eb-list>
        </eb-validate>
      </template>
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
      data: null,
      sent: false,
    };
  },
  created() {
    const userAgent = this.$store.state.auth.user.agent;
    this.data = {
      email: userAgent.email,
    };
  },
  methods: {
    onPerformValidate() {
      return this.$api
        .post('auth/passwordForgot', {
          data: this.data,
        })
        .then(() => {
          this.sent = true;
          return true;
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
