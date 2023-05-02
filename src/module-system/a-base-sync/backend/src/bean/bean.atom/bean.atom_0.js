// const require3 = require('require3');
// const debug = require3('debug')('sql');
// const mparse = require3('egg-born-mparse').default;

module.exports = ctx => {
  const moduleInfo = ctx.app.meta.mockUtil.parseInfoFromPackage(__dirname);
  class Atom extends ctx.app.meta.BeanModuleBase {
    constructor(moduleName) {
      super(ctx, 'atom');
      this.moduleName = moduleName || ctx.module.info.relativeName;
    }

    get atomClass() {
      return ctx.bean.atomClass.module(this.moduleName);
    }

    get modelAtom() {
      return ctx.model.module(moduleInfo.relativeName).atom;
    }

    get modelAtomStar() {
      return ctx.model.module(moduleInfo.relativeName).atomStar;
    }

    get modelLabel() {
      return ctx.model.module(moduleInfo.relativeName).label;
    }

    get modelAtomLabel() {
      return ctx.model.module(moduleInfo.relativeName).atomLabel;
    }

    get modelAtomLabelRef() {
      return ctx.model.module(moduleInfo.relativeName).atomLabelRef;
    }
    get modelFile() {
      return ctx.model.module('a-file').file;
    }

    get sequence() {
      return ctx.bean.sequence.module(moduleInfo.relativeName);
    }

    get sqlProcedure() {
      return ctx.bean._getBean(moduleInfo.relativeName, 'local.procedure');
    }

    // atom other functions

    async get({ atomId }) {
      return await this.modelAtom.get({ id: atomId });
    }

    async flow({ key, atom: { atomFlowId } }) {
      const atomClass = await ctx.bean.atomClass.getByAtomId({ atomId: key.atomId });
      await this.modelAtom.update({
        id: key.atomId,
        atomFlowId,
      });
      // notify
      const item = await this.modelAtom.get({ id: key.atomId });
      const user = { id: item.userIdUpdated };
      this._notifyDraftsDrafting(user, atomClass);
      this._notifyDraftsFlowing(user, atomClass);
    }

    async atomState({ key, atom: { atomState } }) {
      await this.modelAtom.update({
        id: key.atomId,
        atomState,
      });
    }

    async readCount({ key, atom: { readCount = 1 }, user }) {
      await this.modelAtom.query('update aAtom set readCount = readCount + ? where iid=? and id=?', [
        readCount,
        ctx.instance.id,
        key.atomId,
      ]);
    }

    async comment({ key, atom: { comment = 1 }, user }) {
      await this.modelAtom.query('update aAtom set commentCount = commentCount + ? where iid=? and id=?', [
        comment,
        ctx.instance.id,
        key.atomId,
      ]);
    }

    async attachment({ key, atom: { attachment = 1 }, user }) {
      await this.modelAtom.query('update aAtom set attachmentCount = attachmentCount + ? where iid=? and id=?', [
        attachment,
        ctx.instance.id,
        key.atomId,
      ]);
    }

    async stats({ atomIds, user }) {
      const list = [];
      for (const atomId of atomIds) {
        const res = await this.checkRightRead({ atom: { id: atomId }, user, checkFlow: true });
        if (res) {
          list.push({
            id: atomId,
            atomId,
            readCount: res.readCount,
            commentCount: res.commentCount,
            starCount: res.starCount,
          });
        }
      }
      return list;
    }

    async schema({ atomClass, schema }) {
      const validator = await this.validator({ atomClass });
      if (!validator) return null;
      return ctx.bean.validation.getSchema({ module: validator.module, validator: validator.validator, schema });
    }

    async validator({ atomClass }) {
      atomClass = await this.atomClass.get(atomClass);
      return await this.atomClass.validator({ atomClass });
    }

    async getTableName({ atomClass, atomClassBase, options, mode, user, action, key, count }) {
      const tableNameModes = atomClassBase.tableNameModes || {};
      let tableName;
      if (mode === 'search') {
        tableName = tableNameModes.search || tableNameModes.full || tableNameModes.default || atomClassBase.tableName;
      } else {
        tableName = tableNameModes[mode] || tableNameModes.default || atomClassBase.tableName;
      }
      if (!tableName) return tableName;
      // if function
      if (typeof tableName !== 'string') {
        tableName = await tableName({ ctx, atomClass, atomClassBase, options, mode, user, action, key, count });
      } else {
        // // check if resource
        // if (atomClassBase.resource) {
        //   const optionsResource = options && options.resource;
        //   if (!optionsResource) {
        //     tableName = `(
        //           select ___a.*,
        //             ___c.atomNameLocale
        //             from ${tableName} ___a
        //             left join aResourceLocale ___c on ___a.atomId=___c.atomId and ___c.locale='${ctx.locale}'
        //         )`;
        //   }
        // }
      }
      // ok
      return tableName;
    }
  }

  return Atom;
};
