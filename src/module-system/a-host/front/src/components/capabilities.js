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
      this.$local.commit('registerCapability', item);
    },
    _lookup({ item }) {
      const { name } = item;
      const capability = this.$local.state.capabilities[name];
      return capability;
    },
    _lookupHost({ item }) {
      const { name } = item;
      const host = this.$local.state.hosts[name];
      return host;
    },
    async _invoke({ ctx, item }) {
      const { name, options } = item;
      // capability
      const capability = this._lookup({ item });
      if (!capability) throw new Error(`not found capability: ${name}`);
      // host
      const host = this._lookupHost({ item: { name: capability.host } });
      if (!host) throw new Error(`not found host: ${capability.host}`);
      // invoke
      const action = {
        actionModule: host.action.module,
        actionComponent: host.action.component,
        name,
      };
      await this.$meta.util.performAction({ ctx, action, item: options });
    },
  },
};
