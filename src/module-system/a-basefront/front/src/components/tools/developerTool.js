import Vue from 'vue';
const ebActionBase = Vue.prototype.$meta.module.get('a-base').options.mixins.ebActionBase;

let vConsoleInstance;

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
      if (actionName === 'initialize') {
        return await this._onActioninitialize();
      }
    },
    async _onActioninitialize() {
      if (vConsoleInstance) return;
      const { ctx } = this.$props;
      ctx.$meta.util.requirejs.require(['api/static/a/base/js/developerTool'], VConsole => {
        vConsoleInstance = new VConsole();
      });
    },
  },
};
