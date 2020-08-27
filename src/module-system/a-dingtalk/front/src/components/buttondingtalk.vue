<template>
  <eb-button :onPerform="onPerformSignIn"><img src="../assets/img/dingtalk-40.png"></eb-button>
</template>
<script>
export default {
  meta: {
    global: false,
    async disable({ ctx, state }) {
      // in dingtalk
      if (!ctx.$device.dingtalk) return true;
      // associate
      if (state === 'associate') return false;
      // reload
      const reload = ctx.$store.state.auth.reload;
      if (reload) return false;
      // login direct for state=login
      try {
        await this.login({ ctx, state });
        // throw error
        throw new Error();
      } catch (err) {
        ctx.$view.toast.show({ text: err.message });
        return false;
      }
    },
    async login({ ctx, state, hash }) {
      // jssdk config
      const action = {
        actionModule: 'a-dingtalk',
        actionComponent: 'jssdk',
        name: 'config',
      };
      const res = await ctx.$meta.util.performAction({ ctx, action });
      const dd = res.dd;
      const config = res.config;
      // requestAuthCode
      return new Promise((resolve, reject) => {
        dd.runtime.permission.requestAuthCode({
          corpId: config.corpId,
          onSuccess: function(info) {
            const code = info.code;
            ctx.$api.post('/a/dingtalk/auth/login', { scene: 'dingtalk', code, state }).then(() => {
              ctx.$meta.vueApp.reload({ echo: true });
              resolve();
            }).catch(e => {
              reject(e);
            });
          },
          onFail: function(err) {
            reject(new Error(err.errorMessage || err.message));
          }
        });
      });
    },
  },
  data() {
    return {};
  },
  methods: {
    onPerformSignIn() {
      return this.$options.meta.login({ ctx: this });
    },
  },
};

</script>
<style scoped>
</style>
