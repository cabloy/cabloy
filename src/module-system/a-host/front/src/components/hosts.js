export default {
  meta: {
    global: false,
  },
  props: {
    ctx: {
      type: Object,
    },
    action: {
      type: Object,
    },
    item: {
      type: Object,
    },
  },
  methods: {
    async onAction() {
      if (this.action.name === 'register') return this._register();
      if (this.action.name === 'lookup') return this._lookup();
    },
    _register() {
      this.$local.commit('registerHost', this.item);
    },
    _lookup() {
      const { name } = this.item;
      const host = this.$local.state.hosts[name];
      return host;
    },
  },
};
