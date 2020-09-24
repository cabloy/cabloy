
let __flowDefs;
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
      // get
      const flowDef = await this._getByKey({ flowDefKey, atomStage: 'archive' });
      if (flowDef) {
        if (flowDef.dynamic) return flowDef;
        // check version
        const _flowDefBase = this._getFlowDefBase({ flowDefKey });
        if (!_flowDefBase) return flowDef;
        if (_flowDefBase.info.version === flowDef.version) return flowDef;
        await this._updateVersion({ flowDefKey });
        return await this.getByKey({ flowDefKey });
      }
      // dynamic
      const { dynamic } = this._combineFullKey({ flowDefKey });
      if (dynamic) return null;
      // register
      return await this._register({ flowDefKey });
    }

    async getByKeyAndVersion({ flowDefKey, version }) {
      // get from archive
      let flowDef = await this._getByKey({ flowDefKey, version, atomStage: 'archive' });
      if (flowDef) return flowDef;
      // get from history
      flowDef = await this._getByKey({ flowDefKey, version, atomStage: 'history' });
      if (flowDef) return flowDef;
      // not found
      return null;
    }

    async _getByKey({ flowDefKey, version, atomStage }) {
      // fullKey
      const { fullKey } = this._combineFullKey({ flowDefKey });
      // from db
      const options = {
        mode: 'Full',
        atomStage,
        where: {
          flowDefKey: fullKey,
        },
      };
      if (version) {
        options.where.version = version;
      }
      const list = await ctx.bean.atom.select({ atomClass: this.atomClass, options });
      return list[0];
    }

    async _updateVersion({ flowDefKey }) {
      // fullKey
      const { fullKey } = this._combineFullKey({ flowDefKey });
      return await ctx.app.meta.util.lock({
        subdomain: ctx.subdomain,
        resource: `${moduleInfo.relativeName}.flowDef.register.${fullKey}`,
        fn: async () => {
          return await ctx.app.meta.util.executeBean({
            subdomain: ctx.subdomain,
            beanModule: moduleInfo.relativeName,
            beanFullName: 'flowDef',
            context: { flowDefKey },
            fn: '_updateVersionLock',
          });
        },
      });
    }

    async _updateVersionLock({ flowDefKey }) {
      const { fullKey } = this._combineFullKey({ flowDefKey });
      // get
      const flowDef = await this._getByKey({ flowDefKey, atomStage: 'draft' });
      const atomKey = {
        atomId: flowDef.atomId, itemId: flowDef.itemId,
      };
      // get flowDefBase
      const _flowDefBase = this._getFlowDefBase({ flowDefKey });
      if (!_flowDefBase) ctx.throw.module(moduleInfo.relativeName, 1001, fullKey);
      await ctx.bean.atom.write({
        key: atomKey,
        item: {
          atomName: ctx.text(_flowDefBase.info.title),
          version: _flowDefBase.info.version,
          description: ctx.text(_flowDefBase.info.description),
          content: JSON.stringify(_flowDefBase),
        },
        user: { id: 0 },
      });
      await ctx.bean.atom.enable({
        key: atomKey,
        atom: {
          atomEnabled: 1,
        },
        user: { id: 0 },
      });
    }

    async _register({ flowDefKey }) {
      // fullKey
      const { fullKey } = this._combineFullKey({ flowDefKey });
      return await ctx.app.meta.util.lock({
        subdomain: ctx.subdomain,
        resource: `${moduleInfo.relativeName}.flowDef.register.${fullKey}`,
        fn: async () => {
          return await ctx.app.meta.util.executeBean({
            subdomain: ctx.subdomain,
            beanModule: moduleInfo.relativeName,
            beanFullName: 'flowDef',
            context: { flowDefKey },
            fn: '_registerLock',
          });
        },
      });
    }

    async _registerLock({ flowDefKey }) {
      const { fullKey } = this._combineFullKey({ flowDefKey });
      // get again
      const flowDef = await this._getByKey({ flowDefKey, atomStage: 'archive' });
      if (flowDef) return flowDef;
      // get flowDefBase
      const _flowDefBase = this._getFlowDefBase({ flowDefKey });
      if (!_flowDefBase) ctx.throw.module(moduleInfo.relativeName, 1001, fullKey);
      // add atom
      const roleSuperuser = await ctx.bean.role.getSystemRole({ roleName: 'superuser' });
      const atomKey = await ctx.bean.atom.create({
        atomClass: this.atomClass,
        roleIdOwner: roleSuperuser.id,
        user: { id: 0 },
      });
      await ctx.bean.atom.write({
        key: atomKey,
        item: {
          atomName: ctx.text(_flowDefBase.info.title),
          flowDefKey: fullKey,
          version: _flowDefBase.info.version,
          description: ctx.text(_flowDefBase.info.description),
          dynamic: 0,
          content: JSON.stringify(_flowDefBase),
        },
        user: { id: 0 },
      });
      await ctx.bean.atom.enable({
        key: atomKey,
        atom: {
          atomEnabled: 1,
        },
        user: { id: 0 },
      });
      return await this._registerLock({ flowDefKey });
    }

    _getFlowDefBase({ flowDefKey }) {
      const { fullKey } = this._combineFullKey({ flowDefKey });
      if (!__flowDefs) {
        __flowDefs = this._collectFlowDefs();
      }
      return __flowDefs[fullKey];
    }

    _collectFlowDefs() {
      const flowDefs = {};
      for (const module of ctx.app.meta.modulesArray) {
        const defs = module.main.meta && module.main.meta.flow && module.main.meta.flow.definitions;
        if (!defs) continue;
        for (const key in defs) {
          const def = defs[key];
          const fullKey = `${module.info.relativeName}:${key}`;
          flowDefs[fullKey] = def;
        }
      }
      return flowDefs;
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
