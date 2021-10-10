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
      return this.nodeBaseBean.getNodeDefOptions();
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
      // raise event: onNodeBegin
      const res = await this.nodeBaseBean.onNodeBegin();
      await this._saveVars();
      if (!res) return false;
      return await this.doing();
    }

    async doing() {
      // raise event: onNodeDoing
      const res = await this.nodeBaseBean.onNodeDoing();
      await this._saveVars();
      if (!res) return false;
      return await this.end();
    }

    async end() {
      // raise event: onNodeEnd
      const res = await this.nodeBaseBean.onNodeEnd();
      await this._saveVars();
      if (!res) return false;
      return await this.leave();
    }

    async leave() {
      // raise event: onNodeLeave
      const res = await this.nodeBaseBean.onNodeLeave();
      await this._saveVars();
      if (!res) return false;
      // clear with done
      await this.clear({ flowNodeHandleStatus: 1 });
      // next
      return await this.flowInstance.nextEdges({ contextNode: this.contextNode });
    }

    async clear(options) {
      await this.nodeBaseBean.onNodeClear(options);
      await this._clear(options);
    }
  }
  return FlowNode;
};
