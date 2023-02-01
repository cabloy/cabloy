module.exports = app => {
  class Atom extends app.meta.AtomBase {
    async create({ atomClass, item, options, user }) {
      // super
      const key = await super.create({ atomClass, item, options, user });
      // add flowDef
      const res = await this.ctx.model.flowDef.insert({
        atomId: key.atomId,
      });
      const itemId = res.insertId;
      // add content
      await this.ctx.model.flowDefContent.insert({
        atomId: key.atomId,
        itemId,
        content: '{}',
      });
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
      // super
      await super.write({ atomClass, target, key, item, options, user });
      // update flowDef
      const data = await this.ctx.model.flowDef.prepareData(item);
      await this.ctx.model.flowDef.update(data);
      // update content
      await this.ctx.model.flowDefContent.update(
        {
          content: item.content,
        },
        {
          where: {
            atomId: key.atomId,
          },
        }
      );
      // deploy
      if (item.atomStage === 1) {
        await this.ctx.bean.flowDef.deploy({ flowDefId: key.atomId });
      }
    }

    async delete({ atomClass, key, options, user }) {
      // deploy
      const _atom = await this.ctx.bean.atom.modelAtom.get({ id: key.atomId });
      if (_atom.atomStage === 1) {
        await this.ctx.bean.flowDef.deploy({ flowDefId: key.atomId, undeploy: true, deleting: true });
      }
      // super
      await super.delete({ atomClass, key, options, user });
      // delete flowDef
      await this.ctx.model.flowDef.delete({
        id: key.itemId,
      });
      // delete content
      await this.ctx.model.flowDefContent.delete({
        itemId: key.itemId,
      });
    }

    async enable({ atomClass, key, user }) {
      // super
      await super.enable({ atomClass, key, user });
      // deploy
      await this.ctx.bean.flowDef.deploy({ flowDefId: key.atomId });
    }

    async disable({ atomClass, key, user }) {
      // super
      await super.disable({ atomClass, key, user });
      // deploy
      await this.ctx.bean.flowDef.deploy({ flowDefId: key.atomId, undeploy: true });
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
