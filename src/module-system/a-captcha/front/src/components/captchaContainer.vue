<template>
  <div>
    <template v-if="moduleCaptcha">
      <captcha></captcha>
    </template>
  </div>
</template>
<script>
export default {
  meta: {
    global: false,
  },
  data() {
    return {
      moduleCaptcha: null,
      provider: null,
    };
  },
  created() {
    this.$api.post('captcha/getProvider').then(data => {
      this.provider = data.provider;
      this.$meta.module.use(this.provider.module, module => {
        this.$options.components.captcha = module.options.components[this.provider.name];
        this.moduleCaptcha = module;
      });
    });
  },
  methods: {},
};

</script>
<style scoped>
</style>
