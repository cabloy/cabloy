<script>
export default {
  meta: {
    global: false,
  },
  render(c) {
    const children = [];
    if (this.providerInstance) {
      children.push(
        c('eb-component', {
          ref: 'captcha',
          props: {
            module: this.providerInstance.provider.module,
            name: this.providerInstance.provider.name,
            options: {
              props: {
                module: this.module,
                sceneName: this.sceneName,
                context: this.context,
                providerInstance: this.providerInstance,
                onRefresh: () => {
                  return this.onRefresh();
                },
              },
            },
          },
        })
      );
    }
    return c(
      'div',
      {
        staticClass: 'captcha-container',
      },
      children
    );
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
      providerInstance: null,
    };
  },
  created() {
    this.init();
  },
  methods: {
    async init() {
      this.providerInstance = await this.$api.post('captcha/createProviderInstance', {
        module: this.module,
        sceneName: this.sceneName,
        context: this.context,
      });
    },
    captchaData({ token }) {
      return {
        providerInstanceId: this.providerInstance.providerInstanceId,
        data: { token },
      };
    },
    async refresh() {
      if (!this.providerInstance) return;
      // refresh
      this.providerInstance = await this.$api.post('captcha/refreshProviderInstance', {
        providerInstanceId: this.providerInstance.providerInstanceId,
        module: this.module,
        sceneName: this.sceneName,
        context: this.context,
      });
      // refresh
      const captchaInstance = this.$refs.captcha && this.$refs.captcha.getComponentInstance();
      if (captchaInstance) {
        if (!captchaInstance.refresh) {
          throw new Error('should provide refresh');
        }
        await captchaInstance.refresh();
      }
    },
    onRefresh() {
      return this.refresh();
    },
  },
};
</script>
<style scoped></style>
