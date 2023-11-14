module.exports = ctx => {
  const moduleInfo = ctx.app.meta.mockUtil.parseInfoFromPackage(__dirname);
  class FlowDef {
    get modelFlowDef() {
      return ctx.model.module(moduleInfo.relativeName).flowDef;
    }
    get modelFlowDefContent() {
      return ctx.model.module(moduleInfo.relativeName).flowDefContent;
    }
    get modelFlowDefFull() {
      return ctx.model.module(moduleInfo.relativeName).flowDefFull;
    }
    get atomClass() {
      return {
        module: moduleInfo.relativeName,
        atomClassName: 'flowDef',
      };
    }

    async getByKey({ flowDefKey }) {
      return await this._getByKey({ flowDefKey, atomStage: 'formal' });
    }

    async getById({ flowDefId }) {
      // get
      return await this._getById({ flowDefId });
    }

    async getByKeyAndRevision({ flowDefKey, flowDefRevision }) {
      // get from formal
      let flowDef = await this._getByKey({ flowDefKey, flowDefRevision, atomStage: 'formal' });
      if (flowDef) return flowDef;
      // get from history
      flowDef = await this._getByKey({ flowDefKey, flowDefRevision, atomStage: 'history' });
      if (flowDef) return flowDef;
      // not found
      return null;
    }

    async _getById({ flowDefId }) {
      return await ctx.bean.atom.read({ key: { atomId: flowDefId } });
    }

    async _getByKey({ flowDefKey, flowDefRevision, atomStage }) {
      // fullKey
      const { fullKey } = this._combineFullKey({ flowDefKey });
      // from db
      return await ctx.bean.atom.readByStaticKey({
        atomClass: this.atomClass,
        atomStaticKey: fullKey,
        atomRevision: flowDefRevision,
        atomStage,
      });
    }
  }

  return FlowDef;
};
