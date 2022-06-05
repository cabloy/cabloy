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
      if (this.action.name === 'openApp') {
        return await this._onActionopenApp();
      }
    },
    async _onActionopenApp() {
      const { appKey, appLanguage, appIsolate } = this.$props.action;
      const queries = { appKey };
      if (appLanguage) queries.appLanguage = appLanguage;
      if (appIsolate) queries.appIsolate = appIsolate;
      const url = this.$meta.util.combineQueries('', queries);
      window.location.assign(url);
    },
  },
};
