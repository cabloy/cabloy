<template>
  <eb-page>
    <eb-navbar :title="$text('Forgot password')" eb-back-link="Back"></eb-navbar>
    <f7-block>
      <template v-if="sent">{{$text('passwordResetEmailSentAlert')}}</template>
      <template v-else>
        <eb-validate ref="validate" :auto="false" :data="data" :params="{validator: 'passwordForgot'}" :onPerform="onPerformValidate">
          <eb-list form no-hairlines-md @submit.prevent="onSubmit">
            <eb-list-item-validate dataKey="email"></eb-list-item-validate>
            <f7-list-item divider>
              <span class="eb-list-divider-normal">
                <eb-button ref="buttonSubmit" :onPerform="onPerformOk">{{$text('Reset password')}}</eb-button>
              </span>
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
      return this.$api.post('auth/passwordForgot', {
        data: this.data,
      }).then(() => {
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
<style scoped>
</style>
