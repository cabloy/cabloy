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
      if (this.action.name === 'invoke') return await this._invoke();
    },
    _register() {
      this.$local.commit('registerCapability', this.item);
    },
    _lookup() {
      const { name } = this.item;
      const capability = this.$local.state.capabilities[name];
      return capability;
    },
    _lookupHost({ item }) {
      const { name } = item;
      const host = this.$local.state.hosts[name];
      return host;
    },
    async _invoke() {
      const { name, options } = this.item;
      // capability
      const capability = this._lookup();
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
      return await this.$meta.util.performAction({ ctx: this.ctx, action, item: options });
    },
  },
};
