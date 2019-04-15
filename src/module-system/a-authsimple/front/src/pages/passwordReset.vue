<template>
  <eb-page>
    <eb-navbar :title="$text('Reset password')" eb-back-link="Back"></eb-navbar>
    <f7-block>
      <eb-validate ref="validate" :auto="false" :data="data" :params="{validator: 'passwordReset'}" :onPerform="onPerformValidate">
        <f7-list form no-hairlines-md>
          <eb-list-item-validate dataKey="passwordNew"></eb-list-item-validate>
          <eb-list-item-validate dataKey="passwordNewAgain"></eb-list-item-validate>
          <f7-list-item divider>
            <span class="eb-list-divider-normal">
              <eb-button :onPerform="onPerformOk">{{$text('OK')}}</eb-button>
            </span>
          </f7-list-item>
        </f7-list>
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
  },
};

</script>
<style scoped>
</style>
