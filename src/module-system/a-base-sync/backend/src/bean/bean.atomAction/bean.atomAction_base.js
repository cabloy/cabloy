module.exports = ctx => {
  const moduleInfo = ctx.app.meta.mockUtil.parseInfoFromPackage(__dirname);
  class AtomAction extends ctx.app.meta.BeanModuleBase {
    constructor(moduleName) {
      super(ctx, 'atomAction');
      this.moduleName = moduleName || ctx.module.info.relativeName;
    }

    get model() {
      return ctx.model.module(moduleInfo.relativeName).atomAction;
    }

    async delete({ atomClassId, code }) {
      // delete roleRight
      await ctx.bean.role.deleteRoleRightByAction({
        atomClassId,
        action: code,
      });
      // delete
      await this.model.delete({ atomClassId, code });
    }

    async update(data) {
      await this.model.update(data);
    }

    async get({ id, atomClassId, code }) {
      const data = id ? { id } : { atomClassId, code };
      const res = await this.model.get(data);
      if (res) return res;
      // lock
      return await ctx.meta.util.lock({
        resource: `${moduleInfo.relativeName}.atomAction.register`,
        fn: async () => {
          return await ctx.meta.util.executeBeanIsolate({
            beanModule: moduleInfo.relativeName,
            beanFullName: 'atomAction',
            context: { atomClassId, code },
            fn: '_registerLock',
          });
        },
      });
    }

    parseActionCode({ action, atomClass }) {
      // is number
      if (!isNaN(action)) return parseInt(action);
      // add role right
      const actionCode = ctx.constant.module('a-base').atom.action[action];
      if (actionCode) return actionCode;
      // atomClass
      if (!atomClass) throw new Error(`should specify the atomClass of action: ${action}`);
      const actions = ctx.bean.base.actions();
      const _action = actions[atomClass.module][atomClass.atomClassName][action];
      if (!_action) throw new Error(`atom action not found: ${atomClass.module}:${atomClass.atomClassName}.${action}`);
      return _action.code;
    }

    async _registerLock({ atomClassId, code }) {
      return await this._registerLock_inner({ atomClassId, code });
    }

    async _registerLock_inner({ atomClassId, code }) {
      // get
      const res = await this.model.get({ atomClassId, code });
      if (res) return res;
      const atomClass = await ctx.bean.atomClass.get({ id: atomClassId });
      const action = ctx.bean.base.action({ module: atomClass.module, atomClassName: atomClass.atomClassName, code });
      const data = {
        atomClassId,
        code,
        name: action.name,
        bulk: action.bulk || 0,
      };
      // insert
      const res2 = await this.model.insert(data);
      data.id = res2.insertId;
      return data;
    }
  }

  return AtomAction;
};
