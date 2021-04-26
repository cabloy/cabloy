export default {
  meta: {
    global: false,
  },
  methods: {
    async onAction({ ctx, action, item }) {
      if (action.name === 'register') return this._register({ item });
      if (action.name === 'lookup') return this._lookup({ item });
      if (action.name === 'invoke') return await this._invoke({ ctx, action, item });
    },
    _register({ item }) {
      this.$local.commit('register', item);
    },
    _lookup({ item }) {
      const { name } = item;
      const capability = this.$local.state.capabilities[name];
      return capability;
    },
    async _invoke({ ctx, item }) {
      const { name, options } = item;
      const capability = this._lookup({ item });
      if (!capability) throw new Error(`not found capability: ${name}`);
      // invoke
      const action = {
        actionModule: capability.action.module,
        actionComponent: capability.action.component,
        name,
      };
      await this.$meta.util.performAction({ ctx, action, item: options });
    },
  },
};
