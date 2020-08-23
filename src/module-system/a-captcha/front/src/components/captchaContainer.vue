<script>
export default {
  meta: {
    global: false,
  },
  render(c) {
    const children = [];
    if (this.providerInstance) {
      children.push(c('eb-component', {
        props: {
          module: this.providerInstance.provider.module,
          name: this.providerInstance.provider.name,
          options: {
            props: {
              module: this.module,
              sceneName: this.sceneName,
              context: this.context,
              providerInstance: this.providerInstance,
            },
          },
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
      providerInstance: null,
    };
  },
  created() {
    this.$api.post('captcha/createProviderInstance', {
      module: this.module,
      sceneName: this.sceneName,
      context: this.context,
    }).then(providerInstance => {
      this.providerInstance = providerInstance;
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
