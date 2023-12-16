const __adapter = (context, chain) => {
  return {
    receiver: chain.behaviorBean,
    fn: chain.behaviorBean[context.methodName],
  };
};

// const moduleInfo = module.info;
module.exports = class FlowNode {
  getBehaviorDefOptions({ behaviorDefId }) {
    // nodeDef
    const nodeDef = this.contextNode._nodeDef;
    // behaviorDef
    let behaviorDef;
    if (nodeDef.behaviors) {
      behaviorDef = nodeDef.behaviors.find(item => item.id === behaviorDefId);
    }
    // options
    let options = (behaviorDef && behaviorDef.options) || {};
    // default
    const behavior = this.behaviors.find(item => item.behaviorDef.id === behaviorDefId);
    const optionsDefault = behavior.behaviorBase.options.default;
    if (optionsDefault) {
      options = ctx.bean.util.extend({}, optionsDefault, options);
    }
    // invoke
    return this._behaviorsInvoke({
      methodName: 'getBehaviorDefOptions',
      behaviorDefId,
      options,
    });
  }

  getNodeDefOptions() {
    // nodeDef
    const nodeDef = this.contextNode._nodeDef;
    // options
    let options = nodeDef.options || {};
    // default
    const optionsDefault = this.nodeBase.options.default;
    if (optionsDefault) {
      options = ctx.bean.util.extend({}, optionsDefault, options);
    }
    // invoke
    return this._behaviorsInvoke({
      methodName: 'getNodeDefOptions',
      options,
    });
  }

  async enter() {
    // current
    await this._setCurrent();
    const res = await this._behaviorsInvokeAsync({
      methodName: 'enter',
    });
    await this._saveVars();
    if (!res) return false;
    return await this.begin();
  }

  async begin() {
    const res = await this._behaviorsInvokeAsync({
      methodName: 'begin',
    });
    await this._saveVars();
    if (!res) return false;
    return await this.doing();
  }

  async doing() {
    const res = await this._behaviorsInvokeAsync({
      methodName: 'doing',
    });
    await this._saveVars();
    if (!res) return false;
    return await this.end();
  }

  async end() {
    const res = await this._behaviorsInvokeAsync({
      methodName: 'end',
    });
    await this._saveVars();
    if (!res) return false;
    return await this.leave();
  }

  async leave() {
    const res = await this._behaviorsInvokeAsync({
      methodName: 'leave',
    });
    await this._saveVars();
    return res;
  }

  async clear(options) {
    const res = await this._behaviorsInvokeAsync({
      methodName: 'clear',
      options,
    });
    await this._saveVars();
    if (!res) return false;
    return await this._clear(options);
  }

  async change(options) {
    const res = await this._behaviorsInvokeAsync({
      methodName: 'change',
      options,
    });
    await this._saveVars();
    return res;
  }

  _behaviorsInvoke(context) {
    return ctx.app.meta.util.compose(this.behaviors, __adapter)(context);
  }

  async _behaviorsInvokeAsync(context) {
    return await ctx.app.meta.util.composeAsync(this.behaviors, __adapter)(context);
  }
};
