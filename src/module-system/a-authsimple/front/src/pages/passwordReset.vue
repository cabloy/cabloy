<template>
  <eb-page>
    <eb-navbar large largeTransparent :title="$text('Reset password')" eb-back-link="Back"></eb-navbar>
    <f7-block>
      <eb-validate ref="validate" :auto="false" :data="data" :params="{validator: 'passwordReset'}" :onPerform="onPerformValidate">
        <eb-list form no-hairlines-md @submit.prevent="onSubmit">
          <eb-list-item-validate dataKey="passwordNew"></eb-list-item-validate>
          <eb-list-item-validate dataKey="passwordNewAgain"></eb-list-item-validate>
          <f7-list-item divider>
            <eb-button ref="buttonSubmit" :onPerform="onPerformOk">{{$text('OK')}}</eb-button>
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
      token: this.$f7route.query.token,
      data: {
        passwordNew: null,
        passwordNewAgain: null,
      },
    };
  },
  methods: {
    onPerformValidate() {
      return this.$api.post('auth/passwordReset', {
        data: this.data,
        token: this.token,
      }).then(() => {
        this.$meta.vueApp.reload({ echo: true });
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
