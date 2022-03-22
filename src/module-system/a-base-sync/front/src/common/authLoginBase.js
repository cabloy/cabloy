export default {
  props: {
    ctxCaller: {
      type: Object,
    },
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
  computed: {
    ctx() {
      return this.ctxCaller || this;
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
      this.ctx.$meta.vueApp.toLogin({ url, state: this.state, hash });
    },
    combineLoginUrl() {
      return this.ctx.$meta.util.combineLoginUrl({
        providerModule: this.providerModule,
        providerName: this.providerName,
        providerScene: this.providerScene,
      });
    },
  },
};
