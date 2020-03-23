<script>
export default {
  meta: {
    global: false,
  },
  render(c) {
    const children = [];
    if (this.providerInstance) {
      const componentName = this.__getComponentName();
      children.push(c(componentName, {
        props: {
          module: this.module,
          sceneName: this.sceneName,
          context: this.context,
          providerInstance: this.providerInstance,
        },
      }));
    }
    return c('div', {
      staticClass: 'captcha-container',
    }, children);
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
        this.moduleCaptcha = module;
        this.providerInstance = providerInstance;
        const componentName = this.__getComponentName();
        this.$options.components[componentName] = module.options.components[providerInstance.provider.name];
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
    __getComponentName() {
      return `${this.providerInstance.provider.module}:${this.providerInstance.provider.name}`;
    }
  },
};

</script>
<style scoped>
</style>
