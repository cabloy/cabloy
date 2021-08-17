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
