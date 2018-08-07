<template>
  <eb-page login-screen no-toolbar no-navbar no-swipeback>
    <f7-icon v-if="showClose" material="close" class="close" @click.native="close"></f7-icon>
    <f7-login-screen-title>{{$f7.params.name}}</f7-login-screen-title>
    <div v-if="loginSimple">
      <loginSimple></loginSimple>
    </div>
    <f7-block>
      <buttons :loginSimple="loginSimple"></buttons>
    </f7-block>
  </eb-page>
</template>
<script>
import buttons from '../components/buttons.vue';
export default {
  meta: {
    title: 'Sign in',
  },
  components: {
    buttons,
  },
  data() {
    return {
      loginSimple: false,
      showClose: false,
    };
  },
  methods: {
    close() {
      this.$f7router.back();
    },
  },
  mounted() {
    this.showClose = this.$meta.vueLayout.backLink(this);
  },
  created() {
    const provider = this.$config.provider;
    // simple
    if (provider.simple) {
      this.$meta.module.use(provider.simple.module, module => {
        this.$options.components.loginSimple = module.options.components[provider.simple.component];
        this.loginSimple = true;
      });
    }
  },
};

</script>
<style scoped>
.close {
  position: absolute;
  top: 16px;
  left: 16px;
  cursor: pointer;
}

</style>
