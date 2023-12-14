module.exports = class ShareRecordPV extends module.meta.class.Model {
  constructor() {
    super({ table: 'aShareRecordPV', options: { disableDeleted: false } });
  }
};
