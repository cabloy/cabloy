module.exports = class FlowDefContent extends module.app.meta.Model {
  constructor() {
    super({ table: 'aFlowDefContent', options: { disableDeleted: false } });
  }
};
