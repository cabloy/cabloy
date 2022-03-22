export default {
  props: {
    state: {
      type: String,
    },
    provider: {
      type: Object,
    },
    providerModule: {
      type: String,
    },
    providerName: {
      type: String,
    },
    providerScene: {
      type: String,
    },
  },
  methods: {
    async disable() {
      return false;
    },
    // {url,hash}
    async login(options) {
      await this.loginDefault(options);
    },
    // {url,hash}
    async loginDefault(options) {
      let { url, hash } = options || {};
      if (!url) {
        url = this.combineLoginUrl();
      }
      this.$meta.vueApp.toLogin({ url, state: this.state, hash });
    },
    combineLoginUrl() {
      return this.$meta.util.combineLoginUrl({
        providerModule: this.providerModule,
        providerName: this.providerName,
        providerScene: this.providerScene,
      });
    },
  },
};
