module.exports = class FlowNode extends module.meta.class.FlowNodeBase {
  async onNodeLeave() {
    await super.onNodeLeave();
    // end
    await this.flowInstance._endFlow({
      flowHandleStatus: 1,
      flowRemark: null,
      // should not handle atom
      // atom: {
      //   close: true,
      // },
    });
    // also true
    return true;
  }
};
