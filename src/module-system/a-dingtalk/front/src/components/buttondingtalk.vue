<template>
  <img src="../assets/img/dingtalk-40.png" @click="signIn">
</template>
<script>
function __signIn(ctx, cb) {
  const action = {
    actionModule: 'a-dingtalk',
    actionComponent: 'jssdk',
    name: 'config',
  };
  ctx.$meta.util.performAction({ ctx, action }).then(res => {
    const dd = res.dd;
    const config = res.config;
    dd.runtime.permission.requestAuthCode({
      corpId: config.corpId,
      onSuccess: function(info) {
        const code = info.code;
        ctx.$api.post('/a/dingtalk/auth/login', { scene: 'dingtalk', code }).then(() => {
          ctx.$meta.vueApp.reload({ echo: true });
          cb();
        }).catch(e => {
          cb();
        });
      }
    });
  });
};
export default {
  meta: {
    global: false,
    disable: ({ ctx, provider }) => {
      return new Promise((resolve, reject) => {
        if (ctx.$device.dingtalk) {
          const reload = ctx.$store.state.auth.reload;
          if (reload) return resolve(false);
          // login direct
          return __signIn(ctx, () => {
            return reject();
          });
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
