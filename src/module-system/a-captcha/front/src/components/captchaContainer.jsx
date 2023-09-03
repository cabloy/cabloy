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
      providerInstance: null,
      captchaComponentInstance: null,
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
      const captchaInstance = this.captchaComponentInstance;
      if (captchaInstance) {
        if (!captchaInstance.refresh) {
          throw new Error('should provide refresh');
        }
        await captchaInstance.refresh();
      }
    },
    onContainerRefresh() {
      return this.refresh();
    },
    _renderCaptchaComponent() {
      if (!this.providerInstance) return null;
      const options = {
        props: {
          module: this.module,
          sceneName: this.sceneName,
          context: this.context,
          providerInstance: this.providerInstance,
          onContainerRefresh: () => {
            return this.onContainerRefresh();
          },
        },
      };
      return (
        <eb-component
          module={this.providerInstance.provider.module}
          name={this.providerInstance.provider.name}
          options={options}
          onComponentReady={componentInstance => {
            this.captchaComponentInstance = componentInstance;
          }}
        ></eb-component>
      );
    },
  },
  render() {
    return <div class="captcha-container">{this._renderCaptchaComponent()}</div>;
  },
};
