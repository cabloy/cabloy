module.exports = function SelfFactory(ctx) {
  // const moduleInfo = ctx.app.meta.mockUtil.parseInfoFromPackage(__dirname);
  class VersionUpdate {
    async run(options) {
      let sql;

      // alter table: aFlow
      sql = `
        ALTER TABLE aFlow
          ADD COLUMN flowAtomClassId int(11) DEFAULT '0'
                  `;
      await ctx.model.query(sql);

      // alter table: aFlowHistory
      sql = `
        ALTER TABLE aFlowHistory
          ADD COLUMN flowAtomClassId int(11) DEFAULT '0'
                  `;
      await ctx.model.query(sql);

      // adjust flows
      await this._adjustFlows();
    }

    async _adjustFlows() {
      // all instances
      const instances = await ctx.bean.instance.list({ where: {} });
      for (const instance of instances) {
        await ctx.meta.util.executeBean({
          subdomain: instance.name,
          fn: async ({ ctx }) => {
            const selfInstance = new (SelfFactory(ctx))();
            await selfInstance._adjustFlowsInstance();
          },
        });
      }
    }

    async _adjustFlowsInstance() {
      // flow
      let flows = await ctx.model.flow.select({
        where: {
          flowAtomId: {
            op: '>',
            val: 0,
          },
        },
      });
      for (const flow of flows) {
        const flowAtomId = flow.flowAtomId;
        const atom = await ctx.bean.atom.model.get({ id: flowAtomId });
        if (atom) {
          await ctx.model.flow.update({ id: flow.id, flowAtomClassId: atom.atomClassId });
        }
      }
      // flow history
      flows = await ctx.model.flowHistory.select({
        where: {
          flowAtomId: {
            op: '>',
            val: 0,
          },
        },
      });
      for (const flow of flows) {
        const flowAtomId = flow.flowAtomId;
        const atom = await ctx.bean.atom.model.get({ id: flowAtomId });
        if (atom) {
          await ctx.model.flowHistory.update({ id: flow.id, flowAtomClassId: atom.atomClassId });
        }
      }
    }
  }

  return VersionUpdate;
};
