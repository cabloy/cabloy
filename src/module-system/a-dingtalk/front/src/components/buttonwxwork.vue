<template>
  <img src="../assets/img/wxwork-48.png" @click="signIn">
</template>
<script>
const urlLogin = '/api/a/wxwork/passport/a-wxwork/wxwork';
export default {
  meta: {
    global: false,
    disable: ({ ctx, provider }) => {
      return new Promise((resolve, reject) => {
        if (ctx.$device.wxwork) {
          const reload = ctx.$store.state.auth.reload;
          if (reload) return resolve(false);
          // auto redirect in wechat
          ctx.$meta.vueApp.toLogin({ url: urlLogin });
          return reject();
        }
        return resolve(true);
      });
    },
  },
  data() {
    return {};
  },
  methods: {
    signIn() {
      this.$meta.vueApp.toLogin({ url: urlLogin });
    },
  },
};

</script>
<style scoped>
</style>
