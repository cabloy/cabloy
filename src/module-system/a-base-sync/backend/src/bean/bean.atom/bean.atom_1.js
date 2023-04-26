const require3 = require('require3');
const debug = require3('debug')('sql');
const mparse = require3('egg-born-mparse').default;

module.exports = ctx => {
  const moduleInfo = ctx.app.meta.mockUtil.parseInfoFromPackage(__dirname);
  class Atom {
    async _deleteBulk_item({ atomClass, key, user }) {
      // check right
      const res = await ctx.bean.atom.checkRightAction({
        atom: { id: key.atomId },
        atomClass,
        action: 4,
        user,
      });
      if (!res) return false;
      // delete
      await this.delete({ atomClass, key, user });
      // ok
      return true;
    }

    // atom

    async _add({
      atomClass,
      atom: {
        atomStage = 0,
        itemId,
        atomName,
        roleIdOwner = 0,
        atomStatic = 0,
        atomStaticKey = null,
        atomRevision = 0,
        atomLanguage = null,
        atomCategoryId = 0,
        atomTags = null,
        allowComment = 1,
        atomSimple = 0,
      },
      user,
    }) {
      const atomClassId = atomClass.id;
      const res = await this.modelAtom.insert({
        atomStage,
        itemId,
        atomClassId,
        atomName,
        atomStatic,
        atomStaticKey,
        atomRevision,
        atomLanguage,
        atomCategoryId,
        atomTags,
        atomSimple,
        allowComment,
        userIdCreated: user.id,
        userIdUpdated: user.id,
        roleIdOwner,
      });
      return res.insertId;
    }

    async _update({ atom /* , user,*/ }) {
      await this.modelAtom.update(atom);
    }

    async _delete({ atomClass: atomClassOuter, atom, user }) {
      // atomClass
      const { atomClass } = await this._prepareAtomClassAndAtomClassBase({
        key: { atomId: atom.id },
        atomClass: atomClassOuter,
      });
      // stars
      await this._delete_stars({ atomId: atom.id });
      // labels
      await this._delete_labels({ atomId: atom.id });
      // aFile
      await this.modelFile.delete({ atomId: atom.id });
      // details
      await ctx.bean.detail._deleteDetails({ atomClass, atomKey: { atomId: atom.id }, user });
      // aAtom
      await this.modelAtom.delete(atom);
    }

    async _delete_stars({ atomId }) {
      const items = await this.modelAtomStar.select({
        where: { atomId, star: 1 },
      });
      for (const item of items) {
        this._notifyStars({ id: item.userId });
      }
      if (items.length > 0) {
        await this.modelAtomStar.delete({ atomId });
      }
    }

    async _delete_labels({ atomId }) {
      const items = await this.modelAtomLabel.select({
        where: { atomId },
      });
      for (const item of items) {
        this._notifyLabels({ id: item.userId });
      }
      if (items.length > 0) {
        await this.modelAtomLabel.delete({ atomId });
        await this.modelAtomLabelRef.delete({ atomId });
      }
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

    // forAtomUser
    _checkForAtomUser(atomClass) {
      return atomClass && atomClass.module === 'a-base' && atomClass.atomClassName === 'user';
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

    // right

    async __checkRightActionBulk({ atomClassBase, actionRes, stage /* user*/ }) {
      if (atomClassBase.itemOnly) return actionRes;
      // not care about stage
      if (!stage) return actionRes;
      // action base
      const actionBase = ctx.bean.base.action({
        module: actionRes.module,
        atomClassName: actionRes.atomClassName,
        code: actionRes.code,
      });
      if (!actionBase) {
        if (actionRes.code < 10000) {
          await ctx.bean.atomAction.delete({ atomClassId: actionRes.atomClassId, code: actionRes.code });
        }
        return null;
      }
      if (actionBase.stage) {
        const stages = actionBase.stage.split(',');
        if (!stages.some(item => item === stage)) return null;
      }
      return actionRes;
    }

    _notifyDraftsDrafting(user, atomClass) {
      ctx.bean.stats.notify({
        module: moduleInfo.relativeName,
        name: 'draftsDrafting',
        nameSub: `${atomClass.module}_${atomClass.atomClassName}`,
        user,
      });
    }

    _notifyDraftsFlowing(user, atomClass) {
      ctx.bean.stats.notify({
        module: moduleInfo.relativeName,
        name: 'draftsFlowing',
        nameSub: `${atomClass.module}_${atomClass.atomClassName}`,
        user,
      });
    }

    _notifyStars(user) {
      ctx.bean.stats.notify({
        module: moduleInfo.relativeName,
        name: 'stars',
        user,
      });
    }

    _notifyLabels(user) {
      ctx.bean.stats.notify({
        module: moduleInfo.relativeName,
        name: 'labels',
        user,
      });
    }
  }

  return Atom;
};
