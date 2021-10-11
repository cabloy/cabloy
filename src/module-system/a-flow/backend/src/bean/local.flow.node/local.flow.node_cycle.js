const require3 = require('require3');
const extend = require3('extend2');

module.exports = ctx => {
  // const moduleInfo = ctx.app.meta.mockUtil.parseInfoFromPackage(__dirname);

  const __adapter = (context, chain) => {
    return {
      receiver: chain.behaviorBean,
      fn: chain.behaviorBean[context.methodName],
    };
  };

  class FlowNode {
    getNodeDefOptions() {
      // nodeDef
      const nodeDef = this.contextNode._nodeDef;
      // options
      let options = nodeDef.options || {};
      // default
      const optionsDefault = this.nodeBase.options.default;
      if (optionsDefault) {
        options = extend(true, {}, optionsDefault, options);
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
      if (!res) return false;
      // clear with done
      await this.clear({ flowNodeHandleStatus: 1 });
      // next
      return await this.flowInstance.nextEdges({ contextNode: this.contextNode });
    }

    async clear(options) {
      const res = await this._behaviorsInvokeAsync({
        methodName: 'clear',
        options,
      });
      if (!res) return false;
      return await this._clear(options);
    }

    _behaviorsInvoke(context) {
      return ctx.app.meta.util.compose(this.behaviors, __adapter)(context);
    }

    async _behaviorsInvokeAsync(context) {
      return await ctx.app.meta.util.composeAsync(this.behaviors, __adapter)(context);
    }
  }
  return FlowNode;
};
