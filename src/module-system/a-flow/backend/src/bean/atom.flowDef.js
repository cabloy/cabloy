module.exports = app => {

  class Atom extends app.meta.AtomBase {

    async create({ atomClass, item, user }) {
      // super
      const key = await super.create({ atomClass, item, user });
      // add flowDef
      const res = await this.ctx.model.flowDef.insert({
        atomId: key.atomId,
      });
      const itemId = res.insertId;
      // add content
      await this.ctx.model.flowDefContent.insert({
        atomId: key.atomId,
        itemId,
        content: null,
      });
      return { atomId: key.atomId, itemId };
    }

    async read({ atomClass, key, user }) {
      // super
      const item = await super.read({ atomClass, key, user });
      if (!item) return null;
      // ok
      return item;
    }

    async select({ atomClass, options, items, user }) {
      // super
      await super.select({ atomClass, options, items, user });
    }

    async write({ atomClass, key, item, options, user }) {
      // super
      await super.write({ atomClass, key, item, options, user });
      // update flowDef
      const data = await this.ctx.model.flowDef.prepareData(item);
      data.id = key.itemId;
      await this.ctx.model.flowDef.update(data);
      // update content
      await this.ctx.model.query('update aFlowDefContent a set a.content=? where a.iid=? and a.atomId=?',
        [ item.content, this.ctx.instance.id, key.atomId ]);

      // deploy
      if (item.atomStage === 1) {
        this.ctx.tail(async () => {
          await this.ctx.bean.flowDef.deploy({ flowDefId: key.atomId });
        });
      }
    }

    async delete({ atomClass, key, user }) {
      // delete flowDef
      await this.ctx.model.flowDef.delete({
        id: key.itemId,
      });
      // delete content
      await this.ctx.model.flowDefContent.delete({
        itemId: key.itemId,
      });
      // super
      await super.delete({ atomClass, key, user });
    }

    async checkRightAction({ atom, atomClass, action, stage, user, checkFlow }) {
      // super
      const res = await super.checkRightAction({ atom, atomClass, action, stage, user, checkFlow });
      if (!res) return res;
      // enable/disable
      if (atom.atomStage !== 1) return res;
      const flowDef = await this.ctx.model.flowDef.get({ id: atom.itemId });
      if (action === 101 && flowDef.disabled) return res;
      if (action === 102 && !flowDef.disabled) return res;
      return null;
    }

  }

  return Atom;
};
