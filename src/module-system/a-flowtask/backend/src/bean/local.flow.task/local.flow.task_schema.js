const require3 = require('require3');
const extend = require3('extend2');

module.exports = ctx => {
  const moduleInfo = ctx.app.meta.mockUtil.parseInfoFromPackage(__dirname);
  class FlowTask {
    async _viewAtom() {
      return await this._getAtomAndSchema({ mode: 'read' });
    }

    async _editAtom() {
      return await this._getAtomAndSchema({ mode: 'write' });
    }

    async _getAtomAndSchema({ mode }) {
      // user/atom
      const user = this.contextTask._user;
      const atom = this.context._atom;
      // flowTask
      const flowTask = this.contextTask._flowTaskHistory;
      const flowTaskId = flowTask.flowTaskId;
      // must be the same user
      if (user && user.id !== 0 && user.id !== flowTask.userIdAssignee) {
        ctx.throw.module(moduleInfo.relativeName, 1002, flowTaskId);
      }
      // must be the same flowId, means not outdated
      if (atom.atomFlowId !== this.context._flowId) ctx.throw.module('a-flow', 1009, this.context._flowId);
      // special for write
      if (mode === 'write') {
        // check handled
        if (flowTask.flowTaskStatus !== 0) ctx.throw.module(moduleInfo.relativeName, 1005, flowTaskId);
      }
      // schema
      let schema = await this._getSchema({ mode });
      if (!schema) return null;
      // item
      const item = extend(true, {}, atom);
      // validate
      await ctx.bean.validation._validate({
        data: item,
        options: { schema },
      });
      // get real schema
      schema = ctx.bean.validation.getSchema(schema);
      // basic fields
      const fields = await ctx.bean.atom.modelAtom.columns();
      fields.atomId = {};
      fields.module = {};
      fields.atomClassName = {};
      fields.atomNameLocale = {};
      fields.atomCategoryName = {};
      fields.atomCategoryNameLocale = {};
      fields.flowNodeNameCurrent = {};
      fields.flowNodeNameCurrentLocale = {};
      fields._meta = {};
      for (const field in fields) {
        if (item[field] === undefined && atom[field] !== undefined) {
          item[field] = atom[field];
        }
      }
      // ok
      return { schema, item };
    }

    async _getSchemaRead() {
      return await this._getSchema({ mode: 'read' });
    }

    async _getSchemaWrite() {
      return await this._getSchema({ mode: 'write' });
    }

    // mode: read/write
    async _getSchema({ mode }) {
      const module = this.context._atom.module;
      // options
      const options = ctx.bean.flowTask._getNodeDefOptionsTask({ nodeInstance: this.nodeInstance });
      const fields = options.schema && options.schema[mode];
      if (!fields) return null;
      // { module, validator, schema }
      if (fields && !Array.isArray(fields) && typeof fields === 'object') {
        return {
          module: fields.module,
          validator: fields.validator,
          schema: fields.schema,
        };
      }
      // base
      let schemaBase = await this._getSchemaBase();
      // full read/write
      if (fields === true && schemaBase) {
        return {
          module: schemaBase.module,
          validator: schemaBase.validator,
        };
      }
      if (!schemaBase) {
        schemaBase = {
          module,
          schema: { type: 'object', properties: {} },
        };
      }
      // some fields
      const propertiesBase = schemaBase.schema.properties;
      // properties
      const properties = {};
      for (const field of fields) {
        if (typeof field === 'string') {
          if (propertiesBase[field]) {
            properties[field] = propertiesBase[field];
          }
        } else {
          // { name, property }
          properties[field.name] = field.property;
        }
      }
      // schema
      let schema = {
        module,
        schema: { type: 'object', properties },
      };
      // listener
      const methodName = `getSchema${mode.replace(mode[0], mode[0].toUpperCase())}`;
      const res = await this.flowInstance._flowListener[methodName](this.contextTask, this.contextNode, {
        schemaBase,
        schema,
      });
      if (res) {
        schema = res;
      }
      // ok
      return schema;
    }

    async _getSchemaBase() {
      const atomClassId = this.context._atom.atomClassId;
      const schema = await ctx.bean.atom.schema({
        atomClass: { id: atomClassId },
      });
      return schema;
    }
  }
  return FlowTask;
};
