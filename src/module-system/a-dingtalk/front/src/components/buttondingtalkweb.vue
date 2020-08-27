<template>
  <eb-button :onPerform="onPerformSignIn"><img src="../assets/img/dingtalk-40.png"></eb-button>
</template>
<script>
const urlLogin = '/api/a/dingtalk/passport/a-dingtalk/dingtalkweb';
export default {
  meta: {
    global: false,
    async disable({ ctx, state }) {
      // jwt
      if (ctx.$meta.config.base.jwt) return true;
      // only pc
      if (ctx.$device.iphone || ctx.$device.android || ctx.$device.dingtalk) {
        return true;
      }
      return false;
    },
    login({ ctx, state, hash }) {
      ctx.$meta.vueApp.toLogin({ url: urlLogin, state, hash });
    }
  },
  data() {
    return {};
  },
  methods: {
    onPerformSignIn() {
      this.$options.meta.login({ ctx: this });
    },
  },
};

</script>
<style scoped>
</style>
