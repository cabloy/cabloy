const modelFn = require('../../../model/atomClass.js');

const Fn = module.exports = ctx => {
  const moduleInfo = ctx.app.meta.mockUtil.parseInfoFromPackage(__dirname);
  class AtomClass {

    constructor(moduleName) {
      this.moduleName = moduleName || ctx.module.info.relativeName;
      this._model = null;
    }

    // other module's atomClass
    module(moduleName) {
      return new (Fn(ctx))(moduleName);
    }

    get model() {
      if (!this._model) this._model = new (modelFn(ctx.app))(ctx);
      return this._model;
    }

    async atomClass(atomClass) {
      atomClass = await this.top(atomClass);
      return ctx.meta.base.atomClass({ module: atomClass.module, atomClassName: atomClass.atomClassName });
    }

    async top(atomClass) {
      while (true) {
        if (atomClass.atomClassIdParent === 0) break;
        atomClass = await this.get({ id: atomClass.atomClassIdParent });
      }
      return atomClass;
    }

    async get({ id, module, atomClassName, atomClassIdParent = 0 }) {
      module = module || this.moduleName;
      const data = id ? { id } : { module, atomClassName, atomClassIdParent };
      const res = await this.model.get(data);
      if (res) return res;
      if (!module || !atomClassName) throw new Error('Invalid arguments');
      // queue
      return await ctx.app.meta.queue.pushAsync({
        subdomain: ctx.subdomain,
        module: moduleInfo.relativeName,
        queueName: 'registerAtomClass',
        data: { module, atomClassName, atomClassIdParent },
      });
    }

    async register({ module, atomClassName, atomClassIdParent }) {
      // get
      const res = await this.model.get({ module, atomClassName, atomClassIdParent });
      if (res) return res;
      // data
      const atomClass = ctx.meta.base.atomClass({ module, atomClassName });
      if (!atomClass) throw new Error(`atomClass ${module}:${atomClassName} not found!`);
      const data = {
        module,
        atomClassName,
        atomClassIdParent,
        public: atomClass.public,
        flow: atomClass.flow,
      };
      // insert
      const res2 = await this.model.insert(data);
      data.id = res2.insertId;
      return data;
    }

    async getByAtomId({ atomId }) {
      const res = await this.model.query(`
        select a.* from aAtomClass a
          left join aAtom b on a.id=b.atomClassId
            where b.iid=? and b.id=?
        `, [ ctx.instance.id, atomId ]);
      return res[0];
    }

    async getTopByAtomId({ atomId }) {
      const atomClass = await this.getByAtomId({ atomId });
      return await this.top(atomClass);
    }

    validator({ module, atomClassName }) {
      const _module = ctx.app.meta.modules[module];
      const validator = _module.main.meta.base.atoms[atomClassName].validator;
      return validator ? {
        module,
        validator,
      } : null;
    }

    validatorSearch({ module, atomClassName }) {
      const _module = ctx.app.meta.modules[module];
      const validator = _module.main.meta.base.atoms[atomClassName].search.validator;
      return validator ? {
        module,
        validator,
      } : null;
    }

  }

  return AtomClass;
};
