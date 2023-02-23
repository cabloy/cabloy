module.exports = app => {
  // const moduleInfo = app.meta.mockUtil.parseInfoFromPackage(__dirname);
  class Atom extends app.meta.AtomBase {
    async create({ atomClass, item, options, user }) {
      // super
      const key = await super.create({ atomClass, item, options, user });
      // add dict
      const res = await this.ctx.model.dict.insert({
        atomId: key.atomId,
      });
      const itemId = res.insertId;
      // add content
      await this.ctx.model.dictContent.insert({
        atomId: key.atomId,
        itemId,
        dictItems: '[]',
        dictLocales: '{}',
      });
      // return key
      return { atomId: key.atomId, itemId };
    }

    async read({ atomClass, options, key, user }) {
      // super
      const item = await super.read({ atomClass, options, key, user });
      if (!item) return null;
      // meta
      this._getMeta(item);
      // ok
      return item;
    }

    async select({ atomClass, options, items, user }) {
      // super
      await super.select({ atomClass, options, items, user });
      // meta
      for (const item of items) {
        this._getMeta(item);
      }
    }

    async write({ atomClass, target, key, item, options, user }) {
      // check demo
      this.ctx.bean.util.checkDemoForAtomWrite();
      // info
      const atomStaticKey = item.atomStaticKey;
      const atomStage = item.atomStage;
      // super
      await super.write({ atomClass, target, key, item, options, user });
      // update dict
      const data = await this.ctx.model.dict.prepareData(item);
      await this.ctx.model.dict.update(data);
      // update content
      await this.ctx.model.dictContent.update(
        {
          dictItems: item.dictItems,
          dictLocales: item.dictLocales,
        },
        {
          where: {
            atomId: key.atomId,
          },
        }
      );
      // remove dict cache
      if (atomStage === 1) {
        this.ctx.tail(() => {
          this.ctx.bean.dict.dictCacheRemove({ dictKey: atomStaticKey });
        });
      }
    }

    async delete({ atomClass, key, options, user }) {
      const item = await this.ctx.bean.atom.modelAtom.get({ id: key.atomId });
      const atomStaticKey = item.atomStaticKey;
      const atomStage = item.atomStage;
      // super
      await super.delete({ atomClass, key, options, user });
      // delete dict
      await this.ctx.model.dict.delete({
        id: key.itemId,
      });
      // delete content
      await this.ctx.model.dictContent.delete({
        itemId: key.itemId,
      });
      // remove dict cache
      if (atomStage === 1) {
        this.ctx.tail(() => {
          this.ctx.bean.dict.dictCacheRemove({ dictKey: atomStaticKey });
        });
      }
    }

    _getMeta(item) {
      const meta = this._ensureItemMeta(item);
      // meta.flags
      // meta.summary
      meta.summary = item.description;
    }
  }

  return Atom;
};
