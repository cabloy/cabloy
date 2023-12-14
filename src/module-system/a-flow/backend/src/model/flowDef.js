module.exports = class FlowDef extends module.meta.class.Model {
  constructor() {
    super({ table: 'aFlowDef', options: { disableDeleted: false } });
  }
};
