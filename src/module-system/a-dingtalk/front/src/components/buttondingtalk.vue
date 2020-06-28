<template>
  <img src="../assets/img/dingtalk-40.png" @click="signIn">
</template>
<script>
export default {
  meta: {
    global: false,
    disable: ({ ctx, provider }) => {
      return new Promise((resolve, reject) => {
        if (ctx.$device.dingtalk) {
          const reload = ctx.$store.state.auth.reload;
          if (reload) return resolve(false);
          // login direct
          this.signIn();
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
      // login direct
    },
  },
};

</script>
<style scoped>
</style>
