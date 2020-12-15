export default {
  meta: {
    global: true,
  },
  name: 'eb-stats',
  props: {
    params: {
      type: Object,
    },
    color: {
      type: String,
      default: 'gray',
    },
    hiddenOnEmpty: {
      type: Boolean,
      default: true,
    },
    default: {
    },
  },
  data() {
    return {
      value: null,
      io: null,
      subscribeId: null,
    };
  },
  watch: {
    params() {
      this.$nextTick(() => {
        this.setValue(null);
        this.init();
      });
    },
  },
  computed: {
    user() {
      return this.$store.state.auth.user.op;
    },
  },
  created() {
    this.init();
  },
  beforeDestroy() {
    // unsubscribe
    this.unsubscribe();
  },
  methods: {
    async init() {
      if (this.user.anonymous) return;
      this.unsubscribe();
      if (this.params) {
        await this.subscribe();
      }
    },
    async loadValue() {
      const value = await this.$api.post('/a/stats/stats/get', {
        module: this.params.module,
        name: this.params.name,
        nameSub: this.params.nameSub,
      });
      if (value === undefined) {
        this.setValue(this.default);
      } else {
        this.setValue(value);
      }
    },
    async subscribe() {
      // io
      const action = {
        actionModule: 'a-socketio',
        actionComponent: 'io',
        name: 'instance',
      };
      this.io = await this.$meta.util.performAction({ ctx: this, action });
      // socket io
      const subscribePath = this._getSubscribePath();
      this.subscribeId = this.io.subscribe(
        subscribePath, this.onMessage, this.onSubscribed
      );
    },
    unsubscribe() {
      if (this.subscribeId) {
        this.io.unsubscribe(this.subscribeId);
        this.io = null;
        this.subscribeId = null;
      }
    },
    onMessage({ message }) {
      const content = JSON.parse(message.content);
      this.setValue(content.value);
    },
    onSubscribed() {
      this.loadValue();
    },
    setValue(value) {
      this.value = value;
      this.$emit('change', value);
    },
    _getFullName() {
      return this.params.nameSub ? `${this.params.name}.${this.params.nameSub}` : this.params.name;
    },
    _getSubscribePath() {
      const fullName = this._getFullName();
      return `/a/stats/stats/${this.params.module}/${fullName}`;
    },
  },
  render() {
    const hidden = !this.value && this.hiddenOnEmpty;
    return (
      <f7-badge color={this.color} class={hidden ? 'display-none' : ''}>{this.value}</f7-badge>
    );
  },
};
