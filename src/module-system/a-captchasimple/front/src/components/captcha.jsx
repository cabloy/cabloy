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
    onRefresh: {
      type: Function,
    },
  },
  data() {
    return {
      src: null,
    };
  },
  created() {
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
      this.src = this.$meta.util.combineQueries(url, query);
    },
    onClick() {
      this.onRefresh();
    },
  },
  render() {
    return <img src={this.src} onClick={this.onClick} class="captcha" crossorigin="use-credentials" />;
  },
};
