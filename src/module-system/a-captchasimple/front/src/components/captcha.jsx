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
    providerInstance: {
      type: Object,
    },
    onContainerRefresh: {
      type: Function,
    },
  },
  data() {
    return {
      // src: null,
    };
  },
  mounted() {
    this.changeSrc();
  },
  methods: {
    async refresh() {
      await this.changeSrc();
    },
    async changeSrc() {
      if (this.$meta.config.base.jwt) {
        const res = await this.$api.post('/a/base/jwt/create');
        this._setSrc(res.jwt);
      } else {
        this._setSrc(null);
      }
    },
    _setSrc(jwt) {
      const url = this.$meta.util.combineFetchPath('a-captchasimple', 'captcha/image');
      const query = {
        providerInstanceId: this.providerInstance.providerInstanceId,
        t: Math.random(),
      };
      if (jwt) {
        query['eb-jwt'] = jwt;
      }
      const src = this.$meta.util.combineQueries(url, query);
      this.$refs.img.setAttribute('src', src);
    },
    onClick() {
      this.onContainerRefresh();
    },
  },
  render() {
    return <img ref="img" onClick={this.onClick} class="captcha" crossorigin="use-credentials" />;
  },
};
