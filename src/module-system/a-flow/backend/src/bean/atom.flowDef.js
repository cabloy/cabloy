module.exports = ctx => {
  const moduleInfo = ctx.app.meta.mockUtil.parseInfoFromPackage(__dirname);
  class Atom extends ctx.app.meta.AtomBase {
    constructor() {
      super(ctx);
    }

    get model() {
      return ctx.model.module(moduleInfo.relativeName).flowDef;
    }

    get modelFlowDefContent() {
      return ctx.model.module(moduleInfo.relativeName).flowDefContent;
    }

    async default({ atomClass, item, options, user }) {
      // flowDef default
      const data = await this.model.default();
      data.content = '{}';
      // super
      return await super.default({ atomClass, data, item, options, user });
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

    async create({ atomClass, item, options, user }) {
      // super
      const data = await super.create({ atomClass, item, options, user });
      // add flowDef
      data.itemId = await this.model.create(data);
      // add content
      if (!data.content) {
        data.content = '{}';
      }
      await this.modelFlowDefContent.create(data);
      // data
      return data;
    }

    async write({ atomClass, target, key, item, options, user }) {
      // check demo
      ctx.bean.util.checkDemoForAtomWrite();
      // super
      const data = await super.write({ atomClass, target, key, item, options, user });
      // update flowDef
      if (key.atomId !== 0) {
        await this.model.write(data);
        // update content
        if (data.content !== undefined) {
          await this.modelFlowDefContent.update(
            {
              content: data.content,
            },
            {
              where: {
                atomId: key.atomId,
              },
            }
          );
        }
      }
      // deploy
      if (item.atomStage === 1) {
        await ctx.bean.flowDef.deploy({ flowDefId: data.atomId });
      }
      // data
      return data;
    }

    async delete({ atomClass, key, options, user }) {
      // deploy
      const _atom = await ctx.bean.atom.modelAtom.get({ id: key.atomId });
      if (_atom.atomStage === 1) {
        await ctx.bean.flowDef.deploy({ flowDefId: key.atomId, undeploy: true, deleting: true });
      }
      // super
      await super.delete({ atomClass, key, options, user });
      // delete flowDef
      await this.model.delete({
        id: key.itemId,
      });
      // delete content
      await this.modelFlowDefContent.delete({
        itemId: key.itemId,
      });
    }

    async enable({ atomClass, key, options, user }) {
      // super
      await super.enable({ atomClass, key, options, user });
      // deploy
      await ctx.bean.flowDef.deploy({ flowDefId: key.atomId });
    }

    async disable({ atomClass, key, options, user }) {
      // super
      await super.disable({ atomClass, key, options, user });
      // deploy
      await ctx.bean.flowDef.deploy({ flowDefId: key.atomId, undeploy: true });
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
