module.exports = class FlowDefFull extends module.meta.class.Model {
  constructor() {
    super({ table: 'aFlowDefViewFull', options: { disableDeleted: false } });
  }
};
