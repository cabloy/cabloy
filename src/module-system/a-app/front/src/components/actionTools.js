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
      if (actionName === 'openApp') {
        return await this._onActionopenApp();
      }
    },
    async _onActionopenApp() {
      // params
      const { ctx, action } = this.$props;
      let { appKey, appLanguage, appIsolate, force, external, target } = action;
      // not external
      if (!external) {
        await ctx.$meta.vueLayout.app_openHome({
          view: ctx.$view,
          appKey,
          appLanguage,
          force,
        });
        return;
      }
      // external
      if (window.event && (window.event.metaKey || window.event.ctrlKey || window.event.button === 1)) {
        target = '_blank';
      }
      const queries = { appKey };
      if (appLanguage) queries.appLanguage = appLanguage;
      if (appIsolate) queries.appIsolate = !!appIsolate;
      const url = this.$meta.util.combineQueries('', queries);
      window.open(url, target);
    },
  },
};
