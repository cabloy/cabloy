<template>
  <img src="../assets/img/icon64_wx_logo.png" @click="signIn">
</template>
<script>
const urlLogin = '/api/a/wechat/passport/a-wechat/wechat';
export default {
  meta: {
    global: false,
    disable: ({ ctx, provider }) => {
      return new Promise((resolve, reject) => {
        if (ctx.$device.wechat) {
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
