module.exports = ctx => {
  const moduleInfo = ctx.app.meta.mockUtil.parseInfoFromPackage(__dirname);
  class AtomClass extends ctx.app.meta.BeanModuleBase {
    constructor(moduleName) {
      super(ctx, 'atomClass');
      this.moduleName = moduleName || ctx.module.info.relativeName;
    }

    get model() {
      return ctx.model.module(moduleInfo.relativeName).atomClass;
    }

    async atomClass(atomClass) {
      atomClass = await this.top(atomClass);
      return ctx.bean.base.atomClass({ module: atomClass.module, atomClassName: atomClass.atomClassName });
    }

    async top(atomClass) {
      while (true) {
        if (!atomClass.atomClassIdParent) break;
        atomClass = await this.get({ id: atomClass.atomClassIdParent });
      }
      return atomClass;
    }

    async get({ id, module, atomClassName, atomClassIdParent = 0 }) {
      module = module || this.moduleName;
      const data = id ? { id } : { module, atomClassName, atomClassIdParent };
      const res = await this.model.get(data);
      if (res) return res;
      if (!module || !atomClassName) ctx.throw.module(moduleInfo.relativeName, 1011);
      // lock
      return await ctx.meta.util.lock({
        resource: `${moduleInfo.relativeName}.atomClass.register`,
        fn: async () => {
          return await ctx.meta.util.executeBeanIsolate({
            beanModule: moduleInfo.relativeName,
            beanFullName: 'atomClass',
            context: { module, atomClassName, atomClassIdParent },
            fn: '_registerLock',
          });
        },
      });
    }

    async _registerLock({ module, atomClassName, atomClassIdParent }) {
      // atom class
      const data = await this._registerLock_inner({ module, atomClassName, atomClassIdParent });
      // atom action: basics
      for (const code of [1, 2, 3, 4]) {
        await ctx.bean.atomAction._registerLock_inner({ atomClassId: data.id, code });
      }
      // ok
      return data;
    }

    async _registerLock_inner({ module, atomClassName, atomClassIdParent }) {
      // get
      const res = await this.model.get({ module, atomClassName, atomClassIdParent });
      if (res) return res;
      // data
      const atomClass = ctx.bean.base.atomClass({ module, atomClassName });
      if (!atomClass) throw new Error(`atomClass ${module}:${atomClassName} not found!`);
      const data = {
        module,
        atomClassName,
        atomClassIdParent,
        atomClassInner: atomClass.inner ? 1 : 0,
      };
      // insert
      const res2 = await this.model.insert(data);
      data.id = res2.insertId;
      return data;
    }

    async getAtomClassId(atomClass) {
      if (atomClass.id) return atomClass.id;
      const res = await this.get(atomClass);
      return res.id;
    }

    async getByAtomId({ atomId }) {
      const res = await this.model.query(
        `
        select a.*,b.id as atomId,b.itemId from aAtomClass a
          left join aAtom b on a.id=b.atomClassId
            where b.iid=? and b.id=?
        `,
        [ctx.instance.id, atomId]
      );
      return res[0];
    }

    async getTopByAtomId({ atomId }) {
      const atomClass = await this.getByAtomId({ atomId });
      return await this.top(atomClass);
    }

    async validator({ atomClass }) {
      // default
      const _module = ctx.app.meta.modules[atomClass.module];
      const validator = _module.main.meta.base.atoms[atomClass.atomClassName].validator;
      return validator ? { module: atomClass.module, validator } : null;
    }

    async validatorSearch({ atomClass }) {
      const _module = ctx.app.meta.modules[atomClass.module];
      const validator = _module.main.meta.base.atoms[atomClass.atomClassName].search.validator;
      return validator ? { module: atomClass.module, validator } : null;
    }

    async atomClassesUser({ user }) {
      // items
      const items = await ctx.model.query(
        `
        select distinct a.atomClassId,b.module,b.atomClassName from aViewUserRightAtomClass a
          inner join aAtomClass b on a.atomClassId=b.id
            where a.iid=? and a.userIdWho=?
      `,
        [ctx.instance.id, user.id]
      );
      const itemsMap = {};
      for (const item of items) {
        itemsMap[`${item.module}:${item.atomClassName}`] = item.atomClassId;
      }
      // atomClasses
      const _atomClasses = ctx.bean.base.atomClasses();
      // atomClassesNew
      const atomClassesNew = {};
      for (const _moduleName in _atomClasses) {
        const atomClassesModuleNew = {};
        const _atomClassesModule = _atomClasses[_moduleName];
        for (const _atomClassName in _atomClassesModule) {
          const _atomClass = _atomClassesModule[_atomClassName];
          const _atomClassId = itemsMap[`${_moduleName}:${_atomClassName}`];
          if (_atomClassId) {
            atomClassesModuleNew[_atomClassName] = {
              id: _atomClassId,
              ..._atomClass,
            };
          }
        }
        if (Object.keys(atomClassesModuleNew).length > 0) {
          atomClassesNew[_moduleName] = atomClassesModuleNew;
        }
      }
      // ok
      return atomClassesNew;
    }

    async actionsUser({ atomClass, user }) {
      const atomClassId = await this.getAtomClassId(atomClass);
      // items
      const items = await ctx.model.query(
        `
          select distinct a.atomClassId,a.action,b.id as actionId,b.name,b.bulk,b.actionMode,c.atomName as flowDefName from aViewUserRightAtomClass a
            inner join aAtomAction b on a.atomClassId=b.atomClassId and a.action=b.code
            left join aAtom c on b.flowKey=c.atomStaticKey and c.atomStage=1
              where a.iid=? and a.atomClassId=? and a.userIdWho=?
        `,
        [ctx.instance.id, atomClassId, user.id]
      );
      // locale
      await ctx.bean.role._adjustFlowActionsLocale({ items, actionNameKey: 'name' });
      // ok
      return items;
    }

    async checkRightAtomClassAction({ atomClassId, action, user }) {
      if (!user || user.id === 0) return true;
      const res = await ctx.model.queryOne(
        `
        select * from aViewUserRightAtomClass 
          where iid=? and atomClassId=? and action=? and userIdWho=?
      `,
        [ctx.instance.id, atomClassId, action, user.id]
      );
      return !!res;
    }
  }

  return AtomClass;
};
