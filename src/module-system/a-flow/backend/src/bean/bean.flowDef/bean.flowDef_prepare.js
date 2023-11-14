const __flowBehaviorBases = {};
const __flowNodeBases = {};
const __flowEdgeBases = {};
const __flowServiceBases = {};

module.exports = ctx => {
  // const moduleInfo = ctx.app.meta.mockUtil.parseInfoFromPackage(__dirname);
  class FlowDef {
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
