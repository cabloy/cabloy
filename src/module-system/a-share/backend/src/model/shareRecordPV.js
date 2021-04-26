module.exports = app => {
  class ShareRecordPV extends app.meta.Model {
    constructor(ctx) {
      super(ctx, { table: 'aShareRecordPV', options: { disableDeleted: false } });
    }
  }
  return ShareRecordPV;
};
