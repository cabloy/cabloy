import Vue from 'vue';
const ebActionBase = Vue.prototype.$meta.module.get('a-base').options.mixins.ebActionBase;

export default {
  meta: {
    global: false,
  },
  mixins: [
    ebActionBase, //
  ],
  methods: {
    async onAction() {
      const action = this.action;
      const actionName = action.actionName || action.name;
      if (actionName === 'register') return this._register();
      if (actionName === 'lookup') return this._lookup();
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
