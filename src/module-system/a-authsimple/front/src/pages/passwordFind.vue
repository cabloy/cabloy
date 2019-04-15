<template>
  <eb-page>
    <eb-navbar :title="$text('Forgot password')" eb-back-link="Back"></eb-navbar>
    <f7-block>
      <template v-if="sent">{{$text('passwordResetEmailSentAlert')}}</template>
      <template v-else>
        <eb-validate ref="validate" :auto="false" :data="data" :params="{validator: 'passwordFind'}" :onPerform="onPerformValidate">
          <f7-list form no-hairlines-md>
            <eb-list-item-validate dataKey="email"></eb-list-item-validate>
            <f7-list-item divider>
              <span class="eb-list-divider-normal">
                <eb-button :onPerform="onPerformOk">{{$text('Reset password')}}</eb-button>
              </span>
            </f7-list-item>
          </f7-list>
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
      return this.$api.post('auth/passwordFind', {
        data: this.data,
      }).then(() => {
        this.sent = true;
        return true;
      });
    },
    onPerformOk() {
      return this.$refs.validate.perform();
    },
  },
};

</script>
<style scoped>
</style>
