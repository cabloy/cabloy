<template>
  <div>
    <template v-if="providerInstance">
      <captcha :module="module" :sceneName="sceneName" :context="context" :providerInstance="providerInstance"></captcha>
    </template>
  </div>
</template>
<script>
export default {
  meta: {
    global: false,
  },
  props: {
    module: {
      type: String,
    },
    sceneName: {
      type: String,
    },
    context: {},
  },
  data() {
    return {
      moduleCaptcha: null,
      providerInstance: null,
    };
  },
  created() {
    this.$api.post('captcha/createProviderInstance', {
      module: this.module,
      sceneName: this.sceneName,
      context: this.context,
    }).then(providerInstance => {
      this.$meta.module.use(providerInstance.provider.module, module => {
        this.$options.components.captcha = module.options.components[providerInstance.provider.name];
        this.moduleCaptcha = module;
        this.providerInstance = providerInstance;
      });
    });
  },
  methods: {
    captchaData({ token }) {
      return {
        providerInstanceId: this.providerInstance.providerInstanceId,
        data: { token },
      }
    },
  },
};

</script>
<style scoped>
</style>
