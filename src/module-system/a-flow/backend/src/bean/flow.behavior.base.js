module.exports = class FlowBehavior extends module.meta.class.FlowBehaviorBase {
  getBehaviorDefOptions({ behaviorDefId, options }) {
    return this.nodeInstance.nodeBaseBean.getBehaviorDefOptions({ behaviorDefId, options });
  }

  getNodeDefOptions({ options }) {
    return this.nodeInstance.nodeBaseBean.getNodeDefOptions({ options });
  }

  async enter() {
    return await this.nodeInstance.nodeBaseBean.onNodeEnter();
  }

  async begin() {
    return await this.nodeInstance.nodeBaseBean.onNodeBegin();
  }

  async doing() {
    return await this.nodeInstance.nodeBaseBean.onNodeDoing();
  }

  async end() {
    return await this.nodeInstance.nodeBaseBean.onNodeEnd();
  }

  async leave() {
    const res = await this.nodeInstance.nodeBaseBean.onNodeLeave();
    if (!res) return false;
    // clear with done
    await this.nodeInstance.clear({ flowNodeHandleStatus: 1 });
    // next
    await this.flowInstance.nextEdges({ nodeInstance: this.nodeInstance });
    // return false always, means the base(behavior) normal logic has done, shouldnot do anything else more
    return false;
  }

  async clear({ options }) {
    return await this.nodeInstance.nodeBaseBean.onNodeClear({ options });
  }

  async change({ options }) {
    return await this.nodeInstance.nodeBaseBean.onNodeChange({ options });
  }
};
