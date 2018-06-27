<template>
  <f7-page>
    <eb-navbar :title="$text('Reset password')" eb-back-link="Back"></eb-navbar>
    <f7-block>
      <eb-validate ref="validate" auto :data="data" :params="{validator: 'reset'}" :onPerform="onPerformValidate">
      </eb-validate>
      <eb-button v-if="!$config.test" :onPerform="onPerformOk">{{$text('OK')}}</eb-button>
    </f7-block>
  </f7-page>
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
      }
    }
  },
  methods: {
    onPerformValidate() {
      return this.$api.post('auth/reset', {
        data: this.data
      }).then(() => {
        this.$f7Router.back();
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
