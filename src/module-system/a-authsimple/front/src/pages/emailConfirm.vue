<template>
  <eb-page>
    <eb-navbar :title="$text('Email confirmation')" eb-back-link="Back"></eb-navbar>
    <f7-block>
      <template v-if="sent">{{$text('The confirmation link has been sent to your email address')}}</template>
      <template v-else>
        <eb-validate ref="validate" :auto="false" :data="data" :params="{validator: 'emailConfirm'}" :onPerform="onPerformValidate">
          <f7-list form no-hairlines-md>
            <eb-list-item-validate dataKey="userName"></eb-list-item-validate>
            <eb-list-item-validate dataKey="email"></eb-list-item-validate>
            <f7-list-item divider>
              <span class="eb-list-divider-normal">
                <eb-button :onPerform="onPerformOk">{{$text('Send confirmation email')}}</eb-button>
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
      userName: userAgent.userName,
      email: userAgent.email,
    };
  },
  methods: {
    onPerformValidate() {
      return this.$api.post('auth/emailConfirm', {
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
