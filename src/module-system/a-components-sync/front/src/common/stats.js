export default {
  props: {
    stats_params: {
      type: Object,
    },
    stats_color: {
      type: String,
      default: 'gray',
    },
    stats_default: {},
  },
  data() {
    return {
      stats_io: null,
      stats_subscribeId: null,
    };
  },
  watch: {
    stats_params(valueNew, valueOld) {
      if (JSON.stringify(valueNew) === JSON.stringify(valueOld)) return;
      this.$nextTick(() => {
        this.stats_setValue(null);
        this.stats_init();
        this.stats_setDevInfo();
      });
    },
  },
  computed: {
    stats_user() {
      return this.$store.state.auth.user && this.$store.state.auth.user.op;
    },
  },
  created() {
    this.stats_init();
  },
  mounted() {
    this.stats_setDevInfo();
  },
  beforeDestroy() {
    // unsubscribe
    this.stats_unsubscribe();
  },
  methods: {
    stats_setDevInfo() {
      // el
      const $domEl = this.$$(this.$el);
      if (this.$meta.config.env === 'development') {
        const statsParams = this.stats_params;
        let devInfo;
        if (!statsParams) {
          devInfo = 'null';
        } else {
          devInfo = `${statsParams.module}:${statsParams.name}`;
          if (statsParams.nameSub) {
            devInfo = `${devInfo}.${statsParams.nameSub}`;
          }
        }
        $domEl.attr('data-dev-stats-params', devInfo);
      }
    },
    async stats_init() {
      this.stats_unsubscribe();
      if (this.stats_user && !this.stats_user.anonymous && this.stats_params) {
        await this.stats_subscribe();
      }
    },
    async stats_loadValue() {
      if (!this.stats_io) return;
      const value = await this.stats_io.performAction({
        method: 'post',
        url: '/a/stats/stats/get',
        body: {
          module: this.stats_params.module,
          name: this.stats_params.name,
          nameSub: this.stats_params.nameSub,
        },
      });
      // const value = await this.$api.post(
      //   '/a/stats/stats/get',
      //   {
      //     module: this.stats_params.module,
      //     name: this.stats_params.name,
      //     nameSub: this.stats_params.nameSub,
      //   },
      //   { debounce: true }
      // );
      if (value === undefined) {
        this.stats_setValue(this.stats_default);
      } else {
        this.stats_setValue(value);
      }
    },
    async stats_subscribe() {
      // io
      const useStoreSocketIO = await this.$store.use('a/socketio/socketio');
      this.stats_io = useStoreSocketIO.getInstance();
      // socket io
      const subscribePath = this.stats_getSubscribePath();
      this.stats_subscribeId = this.stats_io.subscribe(subscribePath, this.stats_onMessage, this.stats_onSubscribed);
    },
    stats_unsubscribe() {
      if (this.stats_subscribeId) {
        this.stats_io.unsubscribe(this.stats_subscribeId);
        this.stats_io = null;
        this.stats_subscribeId = null;
      }
    },
    stats_onMessage({ message }) {
      const content = JSON.parse(message.content);
      this.stats_setValue(content.value);
    },
    stats_onSubscribed() {
      this.stats_loadValue();
    },
    stats_setValue(value) {
      this.stats_onChange(value);
    },
    stats_getFullName() {
      return this.stats_params.nameSub
        ? `${this.stats_params.name}.${this.stats_params.nameSub}`
        : this.stats_params.name;
    },
    stats_getSubscribePath() {
      const fullName = this.stats_getFullName();
      return `/a/stats/stats/${this.stats_params.module}/${fullName}`;
    },
  },
};
