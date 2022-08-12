<template>
  <eb-page>
    <eb-navbar large largeTransparent :title="$text('ChangeUserName')" eb-back-link="Back"></eb-navbar>
    <f7-block>
      <eb-validate
        ref="validate"
        :auto="false"
        :data="data"
        :params="{ module: 'a-base', validator: 'userChangeUserName' }"
        :onPerform="onPerformValidate"
      >
        <eb-list form inline-labels no-hairlines-md @submit="onSubmit">
          <eb-list-item-validate dataKey="userNameOld"></eb-list-item-validate>
          <eb-list-item-validate dataKey="userName"></eb-list-item-validate>
          <f7-list-item divider>
            <eb-button ref="buttonSubmit" :onPerform="onPerformOk">{{ $text('Change Now') }}</eb-button>
          </f7-list-item>
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
      data: null,
      returnTo: this.$f7route.query.returnTo || null,
    };
  },
  created() {
    const userAgent = this.$store.state.auth.user.agent;
    this.data = {
      userNameOld: userAgent.userName,
      userName: '',
    };
  },
  methods: {
    async onPerformValidate() {
      await this.$api.post('/a/user/user/changeUserName', {
        data: this.data,
      });
      this.$meta.vueApp.reload({ echo: true, hash: this.returnTo });
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
