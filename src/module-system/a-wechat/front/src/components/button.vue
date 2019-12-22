<template>
  <div></div>
</template>
<script>
export default {
  meta: {
    global: false,
    disable: ({ ctx, provider }) => {
      return new Promise((resolve, reject) => {
        if (ctx.$device.wechat) {
          // auto redirect in wechat
          ctx.$meta.vueApp.toLogin({ url: `/api/a/wechat/passport/a-wechat/wechat` });
          return reject();
        }
        return resolve(true);
      });
    },
  },
  data() {
    return {};
  },
  methods: {},
};

</script>
<style scoped>
</style>
