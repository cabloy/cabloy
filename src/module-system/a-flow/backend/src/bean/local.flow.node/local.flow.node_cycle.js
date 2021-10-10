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
      return await this._behaviorsInvokeAsync({
        methodName: 'enter',
      });
    }

    async begin() {
      return await this._behaviorsInvokeAsync({
        methodName: 'begin',
      });
    }

    async doing() {
      return await this._behaviorsInvokeAsync({
        methodName: 'doing',
      });
    }

    async end() {
      return await this._behaviorsInvokeAsync({
        methodName: 'end',
      });
    }

    async leave() {
      return await this._behaviorsInvokeAsync({
        methodName: 'leave',
      });
    }

    async clear(options) {
      return await this._behaviorsInvokeAsync({
        methodName: 'clear',
        options,
      });
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
