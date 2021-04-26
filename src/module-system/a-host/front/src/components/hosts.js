export default {
  meta: {
    global: false,
  },
  methods: {
    async onAction({ ctx, action, item }) {
      if (action.name === 'register') return this._register({ item });
      if (action.name === 'lookup') return this._lookup({ item });
    },
    _register({ item }) {
      this.$local.commit('registerHost', item);
    },
    _lookup({ item }) {
      const { name } = item;
      const host = this.$local.state.hosts[name];
      return host;
    },
  },
};
