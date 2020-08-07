<template>
  <img src="../assets/img/github.png" @click="signIn">
</template>
<script>
export default {
  meta: {
    global: false,
    disable: ( /*{ ctx, provider }*/ ) => {
      return new Promise((resolve, reject) => {
        if (location.origin === 'file://') return resolve(true);
        resolve(false);
      });
    },
  },
  data() {
    return {};
  },
  methods: {
    signIn() {
      const info = this.$module.info;
      const url = `/api/${info.url}/passport/${info.relativeName}/authgithub`;
      this.$meta.vueApp.toLogin({ url });
    },
  },
};

</script>
<style scoped>
</style>
