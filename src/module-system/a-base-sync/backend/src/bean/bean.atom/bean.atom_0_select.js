const require3 = require('require3');
const debug = require3('debug')('sql');
const mparse = require3('egg-born-mparse').default;

module.exports = ctx => {
  const moduleInfo = ctx.app.meta.mockUtil.parseInfoFromPackage(__dirname);
  class Atom {
    // count
    async count({ atomClass, options, user }) {
      return await this.select({ atomClass, options, user, count: 1 });
    }

    // select
    async select({ atomClass, options, user, pageForce = true, count = 0 }) {
      if (!options) options = {};
      if (!options.where) options.where = {};
      if (!options.orders) options.orders = [];
      // atomClass
      let atomClassBase;
      let _moduleInfo;
      if (atomClass) {
        atomClass = await ctx.bean.atomClass.get(atomClass);
        atomClassBase = await ctx.bean.atomClass.atomClass(atomClass);
        _moduleInfo = mparse.parseInfo(atomClass.module);
      }
      // select
      const items = await this._list({
        atomClass,
        options,
        user,
        pageForce,
        count,
      });
      // select items
      if (!count) {
        if (atomClass) {
          const beanFullName = `${_moduleInfo.relativeName}.atom.${atomClassBase.bean}`;
          await ctx.meta.util.executeBean({
            beanModule: _moduleInfo.relativeName,
            beanFullName,
            context: { atomClass, options, items, user },
            fn: 'select',
          });
        } else {
          await ctx.bean.atomBase.select({ atomClass, options, items, user });
        }
      }
      // ok
      return items;
    }

    async _list({ atomClass, options, user, pageForce = true, count = 0 }) {
      let {
        where,
        orders,
        page,
        star = 0,
        label = 0,
        comment = 0,
        file = 0,
        stage = 'formal',
        language,
        category = 0,
        tag = 0,
        mine = 0,
        resource = 0,
        resourceLocale,
        role = 0,
        mode,
      } = options;
      // page
      page = ctx.bean.util.page(page, pageForce);
      // stage
      stage = typeof stage === 'number' ? stage : ctx.constant.module(moduleInfo.relativeName).atom.stage[stage];
      // tableName
      let atomClassBase;
      let tableName = '';
      if (atomClass) {
        atomClassBase = await ctx.bean.atomClass.atomClass(atomClass);
        if (!atomClassBase) throw new Error(`atomClass not found: ${atomClass.module}:${atomClass.atomClassName}`);
        tableName = await this.getTableName({
          atomClass,
          atomClassBase,
          options,
          mode: options.mode,
          user,
          action: 'select',
          count,
        });
        // need not, moved to local.procedure
        // // 'where' should append atomClassId, such as article/post using the same table
        // if (!atomClassBase.itemOnly) {
        //   options.where['a.atomClassId'] = atomClass.id;
        // }
      }
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
        where,
        orders,
        page,
        star,
        label,
        comment,
        file,
        count,
        stage,
        language,
        category,
        tag,
        mine,
        resource,
        resourceLocale,
        mode,
        cms,
        forAtomUser,
        role,
      });
      // selectQuery
      let sql;
      if (atomClass) {
        const _moduleInfo = mparse.parseInfo(atomClass.module);
        const beanFullName = `${_moduleInfo.relativeName}.atom.${atomClassBase.bean}`;
        sql = await ctx.meta.util.executeBean({
          beanModule: _moduleInfo.relativeName,
          beanFullName,
          context: { atomClass, options, user },
          fn: 'selectQuery',
        });
      } else {
        sql = await this._selectQuery({ atomClass, options, user });
      }
      debug('===== selectAtoms =====\n%s', sql);
      // query
      let items;
      if (Array.isArray(sql)) {
        items = sql;
      } else {
        items = sql === false ? [] : await ctx.model.query(sql);
      }
      // count
      if (count) {
        return items[0]._count;
      }
      // ok
      return items;
    }

    async _selectQuery({ /* atomClass, */ options, user }) {
      return await this.sqlProcedure.selectAtoms(options);
    }
  }

  return Atom;
};
