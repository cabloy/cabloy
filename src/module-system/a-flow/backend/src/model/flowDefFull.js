module.exports = class FlowDefFull extends module.app.meta.Model {
  constructor() {
    super({ table: 'aFlowDefViewFull', options: { disableDeleted: false } });
  }
};
