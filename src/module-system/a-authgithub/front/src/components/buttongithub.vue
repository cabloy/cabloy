<template>
  <eb-button :onPerform="onPerformSignIn"><img src="../assets/img/github.png"></eb-button>
</template>
<script>
const urlLogin = '/api/a/authgithub/passport/a-authgithub/authgithub';
export default {
  meta: {
    global: false,
    async disable({ ctx, state }) {
      if (ctx.$meta.config.base.jwt) return true;
      return false;
    },
    login({ ctx, state, hash }) {
      ctx.$meta.vueApp.toLogin({ url: urlLogin, state, hash });
    },
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
