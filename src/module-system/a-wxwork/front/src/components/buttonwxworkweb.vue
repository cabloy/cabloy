<template>
  <img src="../assets/img/wxwork-48.png" @click="signIn">
</template>
<script>
const urlLogin = '/api/a/wxwork/passport/a-wxwork/wxworkweb';
export default {
  meta: {
    global: false,
    disable: ({ ctx, provider }) => {
      return new Promise((resolve, reject) => {
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
