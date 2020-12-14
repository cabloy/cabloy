export default {
  meta: {
    global: true,
  },
  name: 'eb-stats',
  props: {
    module: {
      type: String,
    },
    name: {
      type: String,
    },
    nameSub: {
      type: String,
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
    if (this.subscribeId) {
      this.io.unsubscribe(this.subscribeId);
      this.subscribeId = null;
    }
  },
  methods: {
    async init() {
      await this.subscribe();
    },
    async loadValue() {
      const value = await this.$api.post('/a/stats/stats/get', {
        module: this.module,
        name: this.name,
        nameSub: this.nameSub,
      });
      if (value === undefined) {
        this.value = this.default;
      } else {
        this.value = value;
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
    onMessage({ message }) {
      const content = JSON.parse(message.content);
      this.value = content.value;
    },
    onSubscribed() {
      this.loadValue();
    },
    _getFullName() {
      return this.nameSub ? `${this.name}.${this.nameSub}` : this.name;
    },
    _getSubscribePath() {
      const fullName = this._getFullName();
      return `/a/stats/stats/${this.user.id}/${this.module}/${fullName}`;
    },
  },
  render() {
    const hidden = !this.value && this.hiddenOnEmpty;
    return (
      <f7-badge color={this.color} class={hidden ? 'display-none' : ''}>{this.value}</f7-badge>
    );
  },
};
