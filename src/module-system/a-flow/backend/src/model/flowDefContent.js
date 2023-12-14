module.exports = class FlowDefContent extends module.meta.class.Model {
  constructor() {
    super({ table: 'aFlowDefContent', options: { disableDeleted: false } });
  }
};
