
const __flowNodeBases = {};
const __flowEdgeBases = {};

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

    async deploy({ flowDefId }) {
      // queue
      await ctx.app.meta.queue.pushAsync({
        subdomain: ctx.subdomain,
        module: moduleInfo.relativeName,
        queueName: 'deploy',
        queueNameSub: flowDefId,
        data: { flowDefId },
      });
    }

    async _deployQueue({ flowDefId }) {
      // flowDef
      const flowDef = await this._getById({ flowDefId });
      if (!flowDef) return;
      // content
      const content = flowDef.content ? JSON.parse(flowDef.content) : null;
      if (!content) return;
      // all startEvents
      for (const node of content.process.nodes) {
        const nodeType = node.type;
        if (nodeType.indexOf('startEvent') !== 0) continue;
        const _nodeBase = this._getFlowNodeBase(nodeType);
        const _nodeBaseBean = ctx.bean._newBean(_nodeBase.beanFullName);
        if (_nodeBaseBean.deploy) {
          await _nodeBaseBean.deploy({
            deploy: flowDef.atomDisabled === 0,
            flowDefId,
            node,
          });
        }
      }
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

    _getFlowNodeBases() {
      if (!__flowNodeBases[ctx.locale]) {
        __flowNodeBases[ctx.locale] = this._prepareFlowNodeBases();
      }
      return __flowNodeBases[ctx.locale];
    }

    _getFlowNodeBase(nodeType) {
      return this._getFlowNodeBases()[nodeType];
    }

    _prepareFlowNodeBases() {
      const flowNodeBases = {};
      for (const module of ctx.app.meta.modulesArray) {
        const nodes = module.main.meta && module.main.meta.flow && module.main.meta.flow.nodes;
        if (!nodes) continue;
        for (const key in nodes) {
          const node = nodes[key];
          const beanName = node.bean;
          let beanFullName;
          if (typeof beanName === 'string') {
            beanFullName = `${module.info.relativeName}.flow.node.${beanName}`;
          } else {
            beanFullName = `${beanName.module || module.info.relativeName}.flow.node.${beanName.name}`;
          }
          // const fullKey = `${module.info.relativeName}:${key}`;
          const fullKey = key;
          flowNodeBases[fullKey] = {
            ...node,
            beanFullName,
            title: ctx.text(node.title),
          };
        }
      }
      return flowNodeBases;
    }

    _getFlowEdgeBases() {
      if (!__flowEdgeBases[ctx.locale]) {
        __flowEdgeBases[ctx.locale] = this._prepareFlowEdgeBases();
      }
      return __flowEdgeBases[ctx.locale];
    }

    _getFlowEdgeBase(edgeType = 'sequence') {
      return this._getFlowEdgeBases()[edgeType];
    }

    _prepareFlowEdgeBases() {
      const flowEdgeBases = {};
      for (const module of ctx.app.meta.modulesArray) {
        const edges = module.main.meta && module.main.meta.flow && module.main.meta.flow.edges;
        if (!edges) continue;
        for (const key in edges) {
          const edge = edges[key];
          const beanName = edge.bean;
          let beanFullName;
          if (typeof beanName === 'string') {
            beanFullName = `${module.info.relativeName}.flow.edge.${beanName}`;
          } else {
            beanFullName = `${beanName.module || module.info.relativeName}.flow.edge.${beanName.name}`;
          }
          // const fullKey = `${module.info.relativeName}:${key}`;
          const fullKey = key;
          flowEdgeBases[fullKey] = {
            ...edge,
            beanFullName,
            title: ctx.text(edge.title),
          };
        }
      }
      return flowEdgeBases;
    }

    _combineFullKey({ flowDefKey }) {
      let fullKey;
      let dynamic;
      if (typeof flowDefKey === 'string') {
        dynamic = 1;
        fullKey = flowDefKey;
      } else {
        dynamic = 0;
        fullKey = `${flowDefKey.module}:${flowDefKey.name}`;
      }
      return { fullKey, dynamic };
    }
  }

  return FlowDef;
};
