<template>
  <eb-page>
    <eb-navbar :title="$text('Reset password')" eb-back-link="Back"></eb-navbar>
    <f7-block>
      <eb-validate ref="validate" auto :data="data" :params="{validator: 'reset'}" :onPerform="onPerformValidate">
      </eb-validate>
      <eb-button :onPerform="onPerformOk">{{$text('OK')}}</eb-button>
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
    };
  },
  methods: {
    onPerformValidate() {
      return this.$api.post('auth/reset', {
        data: this.data,
      }).then(() => {
        this.$f7router.back();
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
