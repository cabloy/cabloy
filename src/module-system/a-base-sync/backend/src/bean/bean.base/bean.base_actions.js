const _actions = {};

module.exports = ctx => {
  const moduleInfo = ctx.app.meta.mockUtil.parseInfoFromPackage(__dirname);
  class Base {
    actions() {
      if (!_actions[ctx.locale]) {
        _actions[ctx.locale] = this._prepareActions();
      }
      return _actions[ctx.locale];
    }

    actionsBase({ module, atomClassName }) {
      const _actions = this.actions();
      return _actions[module] && _actions[module][atomClassName];
    }

    action({ module, atomClassName, code, name }) {
      // prepare
      if (name && !isNaN(name)) {
        code = parseInt(name);
        name = null;
      } else if (code && isNaN(code)) {
        name = code;
        code = null;
      }
      // actions
      const actions = this.actionsBase({ module, atomClassName });
      if (name) return actions[name];
      const key = Object.keys(actions).find(key => actions[key].code === code);
      return actions[key];
    }

    _prepareActions() {
      const actions = {};
      for (const relativeName in ctx.app.meta.modules) {
        const module = ctx.app.meta.modules[relativeName];
        if (module.main.meta && module.main.meta.base && module.main.meta.base.atoms) {
          const res = {};
          for (const atomClassName in module.main.meta.base.atoms) {
            const res2 = this._prepareActionsAtomClass(module, module.main.meta.base.atoms[atomClassName]);
            if (Object.keys(res2).length > 0) {
              res[atomClassName] = res2;
            }
          }
          if (Object.keys(res).length > 0) {
            actions[relativeName] = res;
          }
        }
      }
      return actions;
    }

    _prepareActionsAtomClass(module, atomClass) {
      const actions = {};
      const _actions = atomClass.actions;
      const _actionsSystem = ctx.constant.module(moduleInfo.relativeName).atom.action;
      const _actionsSystemMeta = ctx.constant.module(moduleInfo.relativeName).atom.actionMeta;
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
  return Base;
};
