<template>
  <img src="../assets/img/icon64_wx_logo.png" @click="signIn">
</template>
<script>
const urlLogin = '/api/a/wechat/passport/a-wechat/wechatweb';
export default {
  meta: {
    global: false,
    disable: ({ ctx, provider }) => {
      return new Promise((resolve, reject) => {
        if (location.origin === 'file://') return resolve(true);
        if (ctx.$device.iphone || ctx.$device.android || ctx.$device.wxwork || ctx.$device.wechat) {
          return resolve(true);
        }
        return resolve(false);
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
