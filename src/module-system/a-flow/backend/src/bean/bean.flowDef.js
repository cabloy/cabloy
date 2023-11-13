const __flowBehaviorBases = {};
const __flowNodeBases = {};
const __flowEdgeBases = {};
const __flowServiceBases = {};

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

    async deploy({ flowDefId, undeploy, deleting }) {
      // start event
      const res = await this._deploy_startEvent({ flowDefId, undeploy, deleting });
      const atomClass = res?.atomClass;
      // atom state
      if (atomClass) {
        await this._deploy_atomState({ atomClass });
      }
    }

    async _deploy_startEvent({ flowDefId, undeploy, deleting }) {
      // flowDef
      const flowDef = await this._getById({ flowDefId });
      if (!flowDef) return;
      // content
      const content = flowDef.content ? JSON.parse(flowDef.content) : null;
      if (!content || !content.process) return;
      // all startEvents
      let atomClass;
      for (const node of content.process.nodes) {
        const nodeType = node.type;
        if (nodeType.indexOf('startEvent') === -1) continue;
        const _nodeBase = this._getFlowNodeBase(nodeType);
        const _nodeBaseBean = ctx.bean._newBean(_nodeBase.beanFullName);
        if (_nodeBaseBean.deploy) {
          const res = await _nodeBaseBean.deploy({
            deploy: !undeploy && flowDef.atomDisabled === 0,
            flowDefId,
            node,
            deleting,
            flowDef,
            content,
          });
          if (res?.atomClass) {
            atomClass = res?.atomClass;
          }
        }
      }
      // return
      return { atomClass };
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

    behaviorBases() {
      return this._getFlowBehaviorBases();
    }

    nodeBases() {
      return this._getFlowNodeBases();
    }

    edgeBases() {
      return this._getFlowEdgeBases();
    }

    flowServiceBases() {
      return this._getFlowServiceBases();
    }

    _getFlowServiceBases() {
      if (!__flowServiceBases[ctx.locale]) {
        __flowServiceBases[ctx.locale] = this._prepareFlowServiceBases();
      }
      return __flowServiceBases[ctx.locale];
    }

    _getFlowBehaviorBases() {
      if (!__flowBehaviorBases[ctx.locale]) {
        __flowBehaviorBases[ctx.locale] = this._prepareFlowBehaviorBases();
      }
      return __flowBehaviorBases[ctx.locale];
    }

    _getFlowBehaviorBase(behaviorType) {
      return this._getFlowBehaviorBases()[behaviorType];
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

    _prepareFlowServiceBases() {
      const flowServiceBases = {};
      for (const module of ctx.app.meta.modulesArray) {
        const relativeName = module.info.relativeName;
        const beans = module.main.beans;
        if (!beans) continue;
        const res = this._prepareFlowServiceBasesModule(relativeName, beans);
        if (Object.keys(res).length > 0) {
          flowServiceBases[relativeName] = res;
        }
      }
      return flowServiceBases;
    }

    _prepareFlowServiceBasesModule(relativeName, beans) {
      const flowServiceBases = {};
      for (const beanName in beans) {
        if (beanName.indexOf('flow.service.') !== 0) continue;
        // info
        const bean = beans[beanName];
        const serviceBase = {
          title: bean.title,
        };
        if (bean.title) {
          serviceBase.titleLocale = ctx.text(bean.title);
        } else {
          // prompt
          ctx.logger.info('title of flow service bean should not be empty: ', `${relativeName}:${beanName}`);
        }
        // ok
        const beanNameShort = beanName.substr('flow.service.'.length);
        flowServiceBases[beanNameShort] = serviceBase;
      }
      return flowServiceBases;
    }

    _prepareFlowBehaviorBases() {
      const flowBehaviorBases = {};
      for (const module of ctx.app.meta.modulesArray) {
        const behaviors = module.main.meta && module.main.meta.flow && module.main.meta.flow.behaviors;
        if (!behaviors) continue;
        for (const key in behaviors) {
          const behavior = behaviors[key];
          const beanName = behavior.bean;
          let beanFullName;
          if (typeof beanName === 'string') {
            beanFullName = `${module.info.relativeName}.flow.behavior.${beanName}`;
          } else {
            beanFullName = `${beanName.module || module.info.relativeName}.flow.behavior.${beanName.name}`;
          }
          // support fullKey and key
          const fullKey = `${module.info.relativeName}:${key}`;
          flowBehaviorBases[fullKey] = flowBehaviorBases[key] = {
            ...behavior,
            beanFullName,
            titleLocale: ctx.text(behavior.title),
          };
        }
      }
      return flowBehaviorBases;
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
          // support fullKey and key
          const fullKey = `${module.info.relativeName}:${key}`;
          flowNodeBases[fullKey] = flowNodeBases[key] = {
            ...node,
            beanFullName,
            titleLocale: ctx.text(node.title),
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
          // support fullKey and key
          const fullKey = `${module.info.relativeName}:${key}`;
          flowEdgeBases[fullKey] = flowEdgeBases[key] = {
            ...edge,
            beanFullName,
            titleLocale: ctx.text(edge.title),
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
