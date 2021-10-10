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
      // behavior
      // context
      const context = {
        methodName: 'getNodeDefOptions',
        options,
      };
      // invoke
      return ctx.app.meta.util.compose(this.behaviors, __adapter)(context);
    }

    async enter() {
      // context
      const context = {
        methodName: 'enter',
      };
      // invoke
      return await ctx.app.meta.util.composeAsync(this.behaviors, __adapter)(context);
    }

    async begin() {
      // context
      const context = {
        methodName: 'begin',
      };
      // invoke
      return await ctx.app.meta.util.composeAsync(this.behaviors, __adapter)(context);
    }

    async doing() {
      // context
      const context = {
        methodName: 'doing',
      };
      // invoke
      return await ctx.app.meta.util.composeAsync(this.behaviors, __adapter)(context);
    }

    async end() {
      // context
      const context = {
        methodName: 'end',
      };
      // invoke
      return await ctx.app.meta.util.composeAsync(this.behaviors, __adapter)(context);
    }

    async leave() {
      // context
      const context = {
        methodName: 'leave',
      };
      // invoke
      return await ctx.app.meta.util.composeAsync(this.behaviors, __adapter)(context);
    }

    async clear(options) {
      // context
      const context = {
        methodName: 'clear',
        options,
      };
      // invoke
      return await ctx.app.meta.util.composeAsync(this.behaviors, __adapter)(context);
    }
  }
  return FlowNode;
};
