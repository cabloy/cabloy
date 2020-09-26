
const __fieldNames = [ 'flowDefKey', 'version', 'description', 'dynamic' ];

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

    async write({ atomClass, key, item, user }) {
      // super
      await super.write({ atomClass, key, item, user });
      // update flowDef
      const data = {
        id: key.itemId,
      };
      for (const fieldName of __fieldNames) {
        if (item[fieldName] !== undefined) {
          data[fieldName] = item[fieldName];
        }
      }
      await this.ctx.model.flowDef.update(data);
      // update content
      await this.ctx.model.query('update aFlowDefContent a set a.content=? where a.iid=? and a.atomId=?',
        [ item.content, this.ctx.instance.id, key.atomId ]);
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

    async action({ action, atomClass, key, user }) {
      // super
      await super.action({ action, atomClass, key, user });
    }

    async enable({ atomClass, key, atom, user }) {
      // super
      await super.enable({ atomClass, key, atom, user });
      // deploy
      this.ctx.tail(async () => {
        await this.ctx.bean.flowDef.deploy({ flowDefId: key.atomId });
      });
    }

  }

  return Atom;
};
