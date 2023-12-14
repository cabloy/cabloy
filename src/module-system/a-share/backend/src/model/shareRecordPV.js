module.exports = class ShareRecordPV extends module.app.meta.Model {
  constructor() {
    super({ table: 'aShareRecordPV', options: { disableDeleted: false } });
  }
};
