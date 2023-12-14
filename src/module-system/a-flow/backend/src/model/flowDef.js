module.exports = class FlowDef extends module.app.meta.Model {
  constructor() {
    super({ table: 'aFlowDef', options: { disableDeleted: false } });
  }
};
