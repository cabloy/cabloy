const _actions = {};

module.exports = ctx => {
  const moduleInfo = ctx.app.meta.mockUtil.parseInfoFromPackage(__dirname);
  class DetailAction extends ctx.app.meta.BeanModuleBase {
    constructor(moduleName) {
      super(ctx, 'detailAction');
      this.moduleName = moduleName || ctx.module.info.relativeName;
    }

    actions() {
      if (!_actions[ctx.locale]) {
        _actions[ctx.locale] = this._prepareActions();
      }
      return _actions[ctx.locale];
    }

    action({ module, detailClassName, code, name }) {
      const _actions = this.actions();
      const actions = _actions[module][detailClassName];
      if (name) return actions[name];
      const key = Object.keys(actions).find(key => actions[key].code === code);
      return actions[key];
    }

    parseActionCode({ action, detailClass }) {
      // is number
      if (!isNaN(action)) return parseInt(action);
      // add role right
      const actionCode = ctx.constant.module('a-detail').detail.action[action];
      if (actionCode) return actionCode;
      // detailClass
      if (!detailClass) throw new Error(`should specify the detailClass of action: ${action}`);
      const actions = this.actions();
      const _action = actions[detailClass.module][detailClass.detailClassName][action];
      if (!_action) {
        throw new Error(`detail action not found: ${detailClass.module}:${detailClass.detailClassName}.${action}`);
      }
      return _action.code;
    }

    _prepareActions() {
      const actions = {};
      for (const relativeName in ctx.app.meta.modules) {
        const module = ctx.app.meta.modules[relativeName];
        const details = ctx.bean.util.getProperty(module, 'main.meta.detail.details');
        if (details) {
          const res = {};
          for (const detailClassName in details) {
            const res2 = this._prepareActionsDetailClass(module, details[detailClassName]);
            if (Object.keys(res2).length > 0) {
              res[detailClassName] = res2;
            }
          }
          if (Object.keys(res).length > 0) {
            actions[relativeName] = res;
          }
        }
      }
      return actions;
    }

    _prepareActionsDetailClass(module, detailClass) {
      const actions = {};
      const _actions = detailClass.actions;
      const _actionsSystem = ctx.constant.module(moduleInfo.relativeName).detail.action;
      const _actionsSystemMeta = ctx.constant.module(moduleInfo.relativeName).detail.actionMeta;
      const _actionsAll = ctx.bean.util.extend({}, _actionsSystemMeta, _actions);
      for (const key in _actionsAll) {
        if (key === 'custom') continue;
        const action = _actionsAll[key];
        if (!action.code) action.code = _actionsSystem[key];
        action.name = key;
        action.titleLocale = ctx.text(action.title);
        actions[key] = action;
      }
      return actions;
    }
  }

  return DetailAction;
};
