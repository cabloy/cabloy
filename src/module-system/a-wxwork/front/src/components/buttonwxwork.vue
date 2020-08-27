<template>
  <eb-button :onPerform="onPerformSignIn"><img src="../assets/img/wxwork-48.png"></eb-button>
</template>
<script>
const urlLogin = '/api/a/wxwork/passport/a-wxwork/wxwork';
export default {
  meta: {
    global: false,
    async disable({ ctx, state }) {
      // in wxwork
      if (!ctx.$device.wxwork) return true;
      // associate
      if (state === 'associate') return false;
      // reload
      const reload = ctx.$store.state.auth.reload;
      if (reload) return false;
      // login direct for state=login
      this.login({ ctx, state });
      // throw error
      throw new Error();
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
