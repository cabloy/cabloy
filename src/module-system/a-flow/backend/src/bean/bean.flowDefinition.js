
let __flowDefinitions;

module.exports = ctx => {
  const moduleInfo = ctx.app.meta.mockUtil.parseInfoFromPackage(__dirname);
  class FlowDefinition {

    get modelFlowDefinition() {
      return ctx.model.module(moduleInfo.relativeName).flowDefinition;
    }
    get modelFlowDefinitionContent() {
      return ctx.model.module(moduleInfo.relativeName).flowDefinitionContent;
    }
    get modelFlowDefinitionFull() {
      return ctx.model.module(moduleInfo.relativeName).flowDefinitionFull;
    }
    get atomClass() {
      return {
        module: moduleInfo.relativeName,
        atomClassName: 'flowDefinition',
      };
    }

    async getByKey({ flowDefinitionKey }) {
      // get
      const flowDefinition = await this._getByKey({ flowDefinitionKey, atomStage: 'archive' });
      if (flowDefinition) {
        if (flowDefinition.dynamic) return flowDefinition;
        // check version
        const _flowDefinitionBase = this._getFlowDefinitionBase({ flowDefinitionKey });
        if (!_flowDefinitionBase) return flowDefinition;
        if (_flowDefinitionBase.info.version === flowDefinition.version) return flowDefinition;
        await this._updateVersion({ flowDefinitionKey });
        return await this.getByKey({ flowDefinitionKey });
      }
      // dynamic
      const { dynamic } = this._combineFullKey({ flowDefinitionKey });
      if (dynamic) return null;
      // register
      return await this._register({ flowDefinitionKey });
    }

    async getByKeyAndVersion({ flowDefinitionKey, version }) {
      // get from archive
      let flowDefinition = await this._getByKey({ flowDefinitionKey, version, atomStage: 'archive' });
      if (flowDefinition) return flowDefinition;
      // get from history
      flowDefinition = await this._getByKey({ flowDefinitionKey, version, atomStage: 'history' });
      if (flowDefinition) return flowDefinition;
      // not found
      return null;
    }

    async _getByKey({ flowDefinitionKey, version, atomStage }) {
      // fullKey
      const { fullKey } = this._combineFullKey({ flowDefinitionKey });
      // from db
      const options = {
        atomStage,
        where: {
          flowDefinitionKey: fullKey,
        },
      };
      if (version) {
        options.where.version = version;
      }
      const list = await ctx.bean.atom.select({ atomClass: this.atomClass, options });
      return list[0];
    }

    async _updateVersion({ flowDefinitionKey }) {
      // fullKey
      const { fullKey } = this._combineFullKey({ flowDefinitionKey });
      return await ctx.app.meta.util.lock({
        subdomain: ctx.subdomain,
        resource: `${moduleInfo.relativeName}.flowDefinition.register.${fullKey}`,
        fn: async () => {
          return await ctx.app.meta.util.executeBean({
            subdomain: ctx.subdomain,
            beanModule: moduleInfo.relativeName,
            beanFullName: 'flowDefinition',
            context: { flowDefinitionKey },
            fn: '_updateVersionLock',
          });
        },
      });
    }

    async _updateVersionLock({ flowDefinitionKey }) {
      const { fullKey } = this._combineFullKey({ flowDefinitionKey });
      // get
      const flowDefinition = await this._getByKey({ flowDefinitionKey, atomStage: 'draft' });
      const atomKey = {
        atomId: flowDefinition.atomId, itemId: flowDefinition.itemId,
      };
      // get flowDefinitionBase
      const _flowDefinitionBase = this._getFlowDefinitionBase({ flowDefinitionKey });
      if (!_flowDefinitionBase) throw new Error(`flow definition not found: ${fullKey}`);
      await ctx.bean.atom.write({
        key: atomKey,
        item: {
          atomName: ctx.text(_flowDefinitionBase.info.title),
          // flowDefinitionKey: fullKey,
          version: _flowDefinitionBase.info.version,
          description: ctx.text(_flowDefinitionBase.info.description),
          dynamic: 0,
          // disabled: 0,
          content: JSON.stringify(_flowDefinitionBase),
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

    async _register({ flowDefinitionKey }) {
      // fullKey
      const { fullKey } = this._combineFullKey({ flowDefinitionKey });
      return await ctx.app.meta.util.lock({
        subdomain: ctx.subdomain,
        resource: `${moduleInfo.relativeName}.flowDefinition.register.${fullKey}`,
        fn: async () => {
          return await ctx.app.meta.util.executeBean({
            subdomain: ctx.subdomain,
            beanModule: moduleInfo.relativeName,
            beanFullName: 'flowDefinition',
            context: { flowDefinitionKey },
            fn: '_registerLock',
          });
        },
      });
    }

    async _registerLock({ flowDefinitionKey }) {
      const { fullKey } = this._combineFullKey({ flowDefinitionKey });
      // get again
      const flowDefinition = await this._getByKey({ flowDefinitionKey, atomStage: 'archive' });
      if (flowDefinition) return flowDefinition;
      // get flowDefinitionBase
      const _flowDefinitionBase = this._getFlowDefinitionBase({ flowDefinitionKey });
      if (!_flowDefinitionBase) throw new Error(`flow definition not found: ${fullKey}`);
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
          atomName: ctx.text(_flowDefinitionBase.info.title),
          flowDefinitionKey: fullKey,
          version: _flowDefinitionBase.info.version,
          description: ctx.text(_flowDefinitionBase.info.description),
          dynamic: 0,
          disabled: 0,
          content: JSON.stringify(_flowDefinitionBase),
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
      return await this._registerLock({ flowDefinitionKey });
    }

    _getFlowDefinitionBase({ flowDefinitionKey }) {
      const { fullKey } = this._combineFullKey({ flowDefinitionKey });
      if (!__flowDefinitions) {
        __flowDefinitions = this._collectFlowDefinitions();
      }
      return __flowDefinitions[fullKey];
    }

    _collectFlowDefinitions() {
      const flowDefinitions = {};
      for (const module of ctx.app.meta.modulesArray) {
        const definitions = module.main.meta && module.main.meta.flow && module.main.meta.flow.definitions;
        if (!definitions) continue;
        for (const key in definitions) {
          const definition = definitions[key];
          const fullKey = `${module.info.relativeName}:${key}`;
          flowDefinitions[fullKey] = definition;
        }
      }
      return flowDefinitions;
    }

    _combineFullKey({ flowDefinitionKey }) {
      let fullKey;
      let dynamic;
      if (typeof flowDefinitionKey === 'string') {
        dynamic = 1;
        fullKey = flowDefinitionKey;
      } else {
        dynamic = 0;
        fullKey = `${flowDefinitionKey.module}:${flowDefinitionKey.name}`;
      }
      return { fullKey, dynamic };
    }
  }

  return FlowDefinition;
};
