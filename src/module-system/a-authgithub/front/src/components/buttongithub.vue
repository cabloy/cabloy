<template>
  <eb-button :onPerform="onPerformSignIn"><img src="../assets/img/github.png" /></eb-button>
</template>
<script>
import Vue from 'vue';
const ebAuthLoginBase = Vue.prototype.$meta.module.get('a-base').options.mixins.ebAuthLoginBase;
export default {
  meta: {
    global: false,
    async disable({ ctx, state }) {
      return false;
    },
    login({ ctx, url, state, hash }) {
      ctx.$meta.vueApp.toLogin({ url, state, hash });
    },
  },
  mixins: [ebAuthLoginBase],
  data() {
    return {};
  },
  methods: {
    onPerformSignIn() {
      const url = this.combineLoginUrl();
      this.$options.meta.login({ ctx: this, url });
    },
  },
};
</script>
<style scoped></style>
