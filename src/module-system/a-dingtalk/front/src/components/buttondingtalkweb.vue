<template>
  <img src="../assets/img/dingtalk-40.png" @click="signIn">
</template>
<script>
const urlLogin = '/api/a/dingtalk/passport/a-dingtalk/dingtalkweb';
export default {
  meta: {
    global: false,
    disable: ({ ctx, provider }) => {
      return new Promise((resolve, reject) => {
        if (location.origin === 'file://') return resolve(true);
        if (ctx.$device.iphone || ctx.$device.android || ctx.$device.dingtalk) {
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
