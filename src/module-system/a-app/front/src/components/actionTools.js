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
      if (this.action.name === 'openIsolateApp') {
        return await this._onActionopenIsolateApp();
      }
    },
    async _onActionopenIsolateApp() {
      window.location.assign('?appKey=test-party:appParty&appIsolate=true');
    },
  },
};
