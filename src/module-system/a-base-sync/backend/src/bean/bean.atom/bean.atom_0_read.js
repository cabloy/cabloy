const require3 = require('require3');
const debug = require3('debug')('sql');
const mparse = require3('egg-born-mparse').default;

module.exports = ctx => {
  // const moduleInfo = ctx.app.meta.mockUtil.parseInfoFromPackage(__dirname);
  class Atom {
    // read
    async read({ key: keyOuter, atomClass: atomClassOuter, options: optionsOuter, user }) {
      // atomClass
      const res = await this._prepareKeyAndAtomAndAtomClass({
        key: keyOuter,
        atomClass: atomClassOuter,
        options: optionsOuter,
        throwWhenEmpty: false,
      });
      if (!res) return null;
      const { key, atomClass, atomClassBase, options } = res;
      // atom bean
      const _moduleInfo = mparse.parseInfo(atomClass.module);
      const beanFullName = `${_moduleInfo.relativeName}.atom.${atomClassBase.bean}`;
      const item = await ctx.meta.util.executeBean({
        beanModule: _moduleInfo.relativeName,
        beanFullName,
        context: { atomClass, options, key, user },
        fn: 'read',
      });
      // ok
      return item;
    }

    // readByStaticKey
    async readByStaticKey({ atomClass, atomStaticKey, atomRevision, atomStage }) {
      const options = {
        mode: 'full',
        stage: atomStage,
        where: {
          'a.atomStaticKey': atomStaticKey,
        },
      };
      if (atomRevision !== undefined) {
        options.where['a.atomRevision'] = atomRevision;
      }
      const list = await this.select({ atomClass, options });
      return list[0];
    }

    async _get({ atomClass, options, key, mode, user }) {
      if (!options) options = {};
      const resource = options.resource || 0;
      const resourceLocale = options.resourceLocale === false ? false : options.resourceLocale || ctx.locale;
      // atomClass
      const atomClassBase = await ctx.bean.atomClass.atomClass(atomClass);
      // tableName
      const tableName = await this.getTableName({
        atomClass,
        atomClassBase,
        options,
        mode,
        user,
        action: 'read',
        key,
      });
      // cms
      const cms = atomClassBase && atomClassBase.cms;
      // forAtomUser
      const forAtomUser = this._checkForAtomUser(atomClass);
      // options: maybe has another custom options
      options = Object.assign({}, options, {
        iid: ctx.instance.id,
        userIdWho: user ? user.id : 0,
        atomClass,
        atomClassBase,
        tableName,
        atomId: key.atomId,
        resource,
        resourceLocale,
        mode,
        cms,
        forAtomUser,
      });
      // readQuery
      const _moduleInfo = mparse.parseInfo(atomClass.module);
      const beanFullName = `${_moduleInfo.relativeName}.atom.${atomClassBase.bean}`;
      const sql = await ctx.meta.util.executeBean({
        beanModule: _moduleInfo.relativeName,
        beanFullName,
        context: { atomClass, options, user },
        fn: 'readQuery',
      });
      debug('===== getAtom =====\n%s', sql);
      // query
      const item = sql === false ? null : await ctx.model.queryOne(sql);
      // ok
      return item;
    }

    async _readQuery({ /* atomClass, */ options, user }) {
      return await this.sqlProcedure.getAtom(options);
    }
  }

  return Atom;
};
