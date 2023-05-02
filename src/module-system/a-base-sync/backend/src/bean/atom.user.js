module.exports = app => {
  // const moduleInfo = app.meta.mockUtil.parseInfoFromPackage(__dirname);
  class Atom extends app.meta.AtomBase {
    get beanUser() {
      return this.ctx.bean.user;
    }

    async create({ atomClass, item, options, user }) {
      // only support atomStage=1
      if (item.atomStage !== 1) throw new Error('user only support atomStage=1');
      // fields
      const disabled = item.disabled || 0;
      const anonymous = item.anonymous || 0;
      // super
      const key = await super.create({ atomClass, item, options, user });
      const atomId = key.atomId;
      // add user
      //   item.itemId only be set from inner access
      let itemId = item.itemId;
      if (!itemId) {
        const _atomNew = await this.ctx.bean.atom.modelAtom.get({ id: atomId });
        const userName = _atomNew.atomName;
        const res = await this.ctx.model.user.insert({
          atomId: key.atomId,
          disabled,
          anonymous,
          userName,
        });
        itemId = res.insertId;
      } else {
        await this.ctx.model.user.update({
          id: itemId,
          disabled,
          anonymous,
          atomId,
        });
      }
      // ok
      return { atomId, itemId };
    }

    async read({ atomClass, options, key, user }) {
      // super
      const item = await super.read({ atomClass, options, key, user });
      if (!item) return null;
      // meta
      await this._getMeta(options, item);
      // ok
      return item;
    }

    async select({ atomClass, options, items, user }) {
      // super
      await super.select({ atomClass, options, items, user });
      // meta
      for (const item of items) {
        await this._getMeta(options, item);
      }
    }

    async write({ atomClass, target, key, item, options, user }) {
      // check demo
      this.ctx.bean.util.checkDemoForAtomWrite();
      // super
      await super.write({ atomClass, target, key, item, options, user });
      // update user
      const data = await this.ctx.model.user.prepareData(item);
      if (item.atomName) data.userName = item.atomName;
      await this.ctx.model.user.update(data);
    }

    async delete({ atomClass, key, options, user }) {
      const userId = key.itemId;
      // super
      await super.delete({ atomClass, key, options, user });

      await this.ctx.bean.role.deleteAllUserRoles({ userId });
      await this.ctx.bean.user.modelAuth.delete({ userId });

      // delete user
      await this.ctx.model.user.delete({ id: userId });
    }

    async enable({ atomClass, key, options, user }) {
      // check demo
      const ctxCaller = this.ctx.ctxCaller;
      if (ctxCaller && ctxCaller.path === '/api/a/base/atom/enable') {
        this.ctx.bean.util.checkDemo();
      }
      // super
      await super.enable({ atomClass, key, options, user });
      // enable
      await this.ctx.model.user.update({
        id: key.itemId,
        disabled: 0,
      });
    }

    async disable({ atomClass, key, options, user }) {
      // check demo
      const ctxCaller = this.ctx.ctxCaller;
      if (ctxCaller && ctxCaller.path === '/api/a/base/atom/disable') {
        this.ctx.bean.util.checkDemo();
      }
      // super
      await super.disable({ atomClass, key, options, user });
      // disable
      await this.ctx.model.user.update({
        id: key.itemId,
        disabled: 1,
      });
    }

    async checkRightAction({ atom, atomClass, action, options, user }) {
      // super
      const res = await super.checkRightAction({ atom, atomClass, action, options, user });
      if (!res) return res;
      if (atom.atomStage !== 1) return res;
      // write/enable/disable
      if (![3, 6, 7].includes(action)) return res;
      // item
      const item = await this.ctx.model.user.get({ id: atom.itemId });
      if (item.anonymous) return null;
      // default
      return res;
    }

    async _getMeta(options, item) {
      // meta
      const meta = this._ensureItemMeta(item);
      // meta.summary
      meta.summary = item.motto;
    }
  }

  return Atom;
};
