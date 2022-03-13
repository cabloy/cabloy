<template>
  <eb-button :onPerform="onPerformSignIn"><img src="../assets/img/github.png" /></eb-button>
</template>
<script>
import Vue from 'vue';
const ebAuthLoginBase = Vue.prototype.$meta.module.get('a-base').options.mixins.ebAuthLoginBase;
const urlLogin = '/api/a/authgithub/passport/a-authgithub/authgithub';
export default {
  meta: {
    global: false,
    async disable({ ctx, state }) {
      return false;
    },
    login({ ctx, state, hash }) {
      ctx.$meta.vueApp.toLogin({ url: urlLogin, state, hash });
    },
  },
  mixins: [ebAuthLoginBase],
  data() {
    return {};
  },
  methods: {
    onPerformSignIn() {
      this.$options.meta.login({ ctx: this });
    },
  },
};
</script>
<style scoped></style>
