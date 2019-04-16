<template>
  <img src="../asserts/img/github.png" @click="signIn">
</template>
<script>
export default {
  meta: {
    global: false,
    disable: () => {
      return new Promise((resolve, reject) => {
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
